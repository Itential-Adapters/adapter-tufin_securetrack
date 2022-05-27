/* @copyright Itential, LLC 2019 (pre-modifications) */

// Set globals
/* global describe it log pronghornProps */
/* eslint no-unused-vars: warn */
/* eslint no-underscore-dangle: warn  */
/* eslint import/no-dynamic-require:warn */

// include required items for testing & logging
const assert = require('assert');
const fs = require('fs');
const mocha = require('mocha');
const path = require('path');
const winston = require('winston');
const { expect } = require('chai');
const { use } = require('chai');
const td = require('testdouble');
const util = require('util');

const anything = td.matchers.anything();

// stub and attemptTimeout are used throughout the code so set them here
let logLevel = 'none';
const isRapidFail = false;
const isSaveMockData = false;

// read in the properties from the sampleProperties files
let adaptdir = __dirname;
if (adaptdir.endsWith('/test/integration')) {
  adaptdir = adaptdir.substring(0, adaptdir.length - 17);
} else if (adaptdir.endsWith('/test/unit')) {
  adaptdir = adaptdir.substring(0, adaptdir.length - 10);
}
const samProps = require(`${adaptdir}/sampleProperties.json`).properties;

// these variables can be changed to run in integrated mode so easier to set them here
// always check these in with bogus data!!!
samProps.stub = true;
samProps.host = 'replace.hostorip.here';
samProps.authentication.username = 'username';
samProps.authentication.password = 'password';
samProps.protocol = 'http';
samProps.port = 80;
samProps.ssl.enabled = false;
samProps.ssl.accept_invalid_cert = false;
if (samProps.request.attempt_timeout < 30000) {
  samProps.request.attempt_timeout = 30000;
}
const attemptTimeout = samProps.request.attempt_timeout;
const { stub } = samProps;

// these are the adapter properties. You generally should not need to alter
// any of these after they are initially set up
global.pronghornProps = {
  pathProps: {
    encrypted: false
  },
  adapterProps: {
    adapters: [{
      id: 'Test-tufin_securetrack',
      type: 'TufinSecuretrack',
      properties: samProps
    }]
  }
};

global.$HOME = `${__dirname}/../..`;

// set the log levels that Pronghorn uses, spam and trace are not defaulted in so without
// this you may error on log.trace calls.
const myCustomLevels = {
  levels: {
    spam: 6,
    trace: 5,
    debug: 4,
    info: 3,
    warn: 2,
    error: 1,
    none: 0
  }
};

// need to see if there is a log level passed in
process.argv.forEach((val) => {
  // is there a log level defined to be passed in?
  if (val.indexOf('--LOG') === 0) {
    // get the desired log level
    const inputVal = val.split('=')[1];

    // validate the log level is supported, if so set it
    if (Object.hasOwnProperty.call(myCustomLevels.levels, inputVal)) {
      logLevel = inputVal;
    }
  }
});

// need to set global logging
global.log = winston.createLogger({
  level: logLevel,
  levels: myCustomLevels.levels,
  transports: [
    new winston.transports.Console()
  ]
});

/**
 * Runs the common asserts for test
 */
function runCommonAsserts(data, error) {
  assert.equal(undefined, error);
  assert.notEqual(undefined, data);
  assert.notEqual(null, data);
  assert.notEqual(undefined, data.response);
  assert.notEqual(null, data.response);
}

/**
 * Runs the error asserts for the test
 */
function runErrorAsserts(data, error, code, origin, displayStr) {
  assert.equal(null, data);
  assert.notEqual(undefined, error);
  assert.notEqual(null, error);
  assert.notEqual(undefined, error.IAPerror);
  assert.notEqual(null, error.IAPerror);
  assert.notEqual(undefined, error.IAPerror.displayString);
  assert.notEqual(null, error.IAPerror.displayString);
  assert.equal(code, error.icode);
  assert.equal(origin, error.IAPerror.origin);
  assert.equal(displayStr, error.IAPerror.displayString);
}

/**
 * @function saveMockData
 * Attempts to take data from responses and place them in MockDataFiles to help create Mockdata.
 * Note, this was built based on entity file structure for Adapter-Engine 1.6.x
 * @param {string} entityName - Name of the entity saving mock data for
 * @param {string} actionName -  Name of the action saving mock data for
 * @param {string} descriptor -  Something to describe this test (used as a type)
 * @param {string or object} responseData - The data to put in the mock file.
 */
function saveMockData(entityName, actionName, descriptor, responseData) {
  // do not need to save mockdata if we are running in stub mode (already has mock data) or if told not to save
  if (stub || !isSaveMockData) {
    return false;
  }

  // must have a response in order to store the response
  if (responseData && responseData.response) {
    let data = responseData.response;

    // if there was a raw response that one is better as it is untranslated
    if (responseData.raw) {
      data = responseData.raw;

      try {
        const temp = JSON.parse(data);
        data = temp;
      } catch (pex) {
        // do not care if it did not parse as we will just use data
      }
    }

    try {
      const base = path.join(__dirname, `../../entities/${entityName}/`);
      const mockdatafolder = 'mockdatafiles';
      const filename = `mockdatafiles/${actionName}-${descriptor}.json`;

      if (!fs.existsSync(base + mockdatafolder)) {
        fs.mkdirSync(base + mockdatafolder);
      }

      // write the data we retrieved
      fs.writeFile(base + filename, JSON.stringify(data, null, 2), 'utf8', (errWritingMock) => {
        if (errWritingMock) throw errWritingMock;

        // update the action file to reflect the changes. Note: We're replacing the default object for now!
        fs.readFile(`${base}action.json`, (errRead, content) => {
          if (errRead) throw errRead;

          // parse the action file into JSON
          const parsedJson = JSON.parse(content);

          // The object update we'll write in.
          const responseObj = {
            type: descriptor,
            key: '',
            mockFile: filename
          };

          // get the object for method we're trying to change.
          const currentMethodAction = parsedJson.actions.find((obj) => obj.name === actionName);

          // if the method was not found - should never happen but...
          if (!currentMethodAction) {
            throw Error('Can\'t find an action for this method in the provided entity.');
          }

          // if there is a response object, we want to replace the Response object. Otherwise we'll create one.
          const actionResponseObj = currentMethodAction.responseObjects.find((obj) => obj.type === descriptor);

          // Add the action responseObj back into the array of response objects.
          if (!actionResponseObj) {
            // if there is a default response object, we want to get the key.
            const defaultResponseObj = currentMethodAction.responseObjects.find((obj) => obj.type === 'default');

            // save the default key into the new response object
            if (defaultResponseObj) {
              responseObj.key = defaultResponseObj.key;
            }

            // save the new response object
            currentMethodAction.responseObjects = [responseObj];
          } else {
            // update the location of the mock data file
            actionResponseObj.mockFile = responseObj.mockFile;
          }

          // Save results
          fs.writeFile(`${base}action.json`, JSON.stringify(parsedJson, null, 2), (err) => {
            if (err) throw err;
          });
        });
      });
    } catch (e) {
      log.debug(`Failed to save mock data for ${actionName}. ${e.message}`);
      return false;
    }
  }

  // no response to save
  log.debug(`No data passed to save into mockdata for ${actionName}`);
  return false;
}

// require the adapter that we are going to be using
const TufinSecuretrack = require('../../adapter');

// begin the testing - these should be pretty well defined between the describe and the it!
describe('[integration] Tufin_securetrack Adapter Test', () => {
  describe('TufinSecuretrack Class Tests', () => {
    const a = new TufinSecuretrack(
      pronghornProps.adapterProps.adapters[0].id,
      pronghornProps.adapterProps.adapters[0].properties
    );

    if (isRapidFail) {
      const state = {};
      state.passed = true;

      mocha.afterEach(function x() {
        state.passed = state.passed
        && (this.currentTest.state === 'passed');
      });
      mocha.beforeEach(function x() {
        if (!state.passed) {
          return this.currentTest.skip();
        }
        return true;
      });
    }

    describe('#class instance created', () => {
      it('should be a class with properties', (done) => {
        try {
          assert.notEqual(null, a);
          assert.notEqual(undefined, a);
          const checkId = global.pronghornProps.adapterProps.adapters[0].id;
          assert.equal(checkId, a.id);
          assert.notEqual(null, a.allProps);
          const check = global.pronghornProps.adapterProps.adapters[0].properties.healthcheck.type;
          assert.equal(check, a.healthcheckType);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#connect', () => {
      it('should get connected - no healthcheck', (done) => {
        try {
          a.healthcheckType = 'none';
          a.connect();

          try {
            assert.equal(true, a.alive);
            done();
          } catch (error) {
            log.error(`Test Failure: ${error}`);
            done(error);
          }
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      });
      it('should get connected - startup healthcheck', (done) => {
        try {
          a.healthcheckType = 'startup';
          a.connect();

          try {
            assert.equal(true, a.alive);
            done();
          } catch (error) {
            log.error(`Test Failure: ${error}`);
            done(error);
          }
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      });
    });

    describe('#healthCheck', () => {
      it('should be healthy', (done) => {
        try {
          a.healthCheck(null, (data) => {
            try {
              assert.equal(true, a.healthy);
              saveMockData('system', 'healthcheck', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    /*
    -----------------------------------------------------------------------
    -----------------------------------------------------------------------
    *** All code above this comment will be replaced during a migration ***
    ******************* DO NOT REMOVE THIS COMMENT BLOCK ******************
    -----------------------------------------------------------------------
    -----------------------------------------------------------------------
    */

    const additionalPolicyFieldsRevisionId = 'fakedata';

    describe('#getAdditionalParametersIdentitiesByRevision - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getAdditionalParametersIdentitiesByRevision(additionalPolicyFieldsRevisionId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('AdditionalPolicyFields', 'getAdditionalParametersIdentitiesByRevision', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const additionalPolicyFieldsIds = 'fakedata';

    describe('#getSpecificAdditionalParameterIdentity - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getSpecificAdditionalParameterIdentity(additionalPolicyFieldsRevisionId, additionalPolicyFieldsIds, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('AdditionalPolicyFields', 'getSpecificAdditionalParameterIdentity', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getAURLCategory - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getAURLCategory(additionalPolicyFieldsRevisionId, additionalPolicyFieldsIds, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('AdditionalPolicyFields', 'getAURLCategory', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const applicationIDsId = 'fakedata';

    describe('#getApplicationIdentitiesByDevice - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getApplicationIdentitiesByDevice(applicationIDsId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ApplicationIDs', 'getApplicationIdentitiesByDevice', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const applicationIDsIds = 'fakedata';

    describe('#getSpecificApplicationIdentity - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getSpecificApplicationIdentity(applicationIDsId, applicationIDsIds, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ApplicationIDs', 'getSpecificApplicationIdentity', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getApplicationsIdentitiesByRevision - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getApplicationsIdentitiesByRevision(applicationIDsId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ApplicationIDs', 'getApplicationsIdentitiesByRevision', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const applicationIDsRevisionId = 'fakedata';

    describe('#getRevisionsRevisionIdApplicationsIds - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getRevisionsRevisionIdApplicationsIds(applicationIDsRevisionId, applicationIDsIds, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ApplicationIDs', 'getRevisionsRevisionIdApplicationsIds', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const changeAuthorizationCompareRevisionsOnTwoDifferentDevicesInTermsOfTrafficBodyParam = {};

    describe('#compareRevisionsOnTwoDifferentDevicesInTermsOfTraffic - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.compareRevisionsOnTwoDifferentDevicesInTermsOfTraffic(changeAuthorizationCompareRevisionsOnTwoDifferentDevicesInTermsOfTrafficBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ChangeAuthorization', 'compareRevisionsOnTwoDifferentDevicesInTermsOfTraffic', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#determineIfChangesBetweenTwoRevisionsAreAuthorized - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.determineIfChangesBetweenTwoRevisionsAreAuthorized((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ChangeAuthorization', 'determineIfChangesBetweenTwoRevisionsAreAuthorized', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getNameAndStatusForAllChangeWindows - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getNameAndStatusForAllChangeWindows((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ChangeWindows', 'getNameAndStatusForAllChangeWindows', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const changeWindowsUid = 'fakedata';

    describe('#getAListOfCompletedPolicyChangesForASpecificChangeWindow - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getAListOfCompletedPolicyChangesForASpecificChangeWindow(changeWindowsUid, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ChangeWindows', 'getAListOfCompletedPolicyChangesForASpecificChangeWindow', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const changeWindowsTaskId = 'fakedata';

    describe('#getSchedulingAndDeviceDetailsForASpecificChangeWindow - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getSchedulingAndDeviceDetailsForASpecificChangeWindow(changeWindowsUid, changeWindowsTaskId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ChangeWindows', 'getSchedulingAndDeviceDetailsForASpecificChangeWindow', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const deviceInterfacesAndZonesId = 'fakedata';

    describe('#getZonesAndNetworkInterfacesThatParticipateInSubPolicies - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getZonesAndNetworkInterfacesThatParticipateInSubPolicies(deviceInterfacesAndZonesId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('DeviceInterfacesAndZones', 'getZonesAndNetworkInterfacesThatParticipateInSubPolicies', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getNetworkInterfacesByDevice - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getNetworkInterfacesByDevice(deviceInterfacesAndZonesId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('DeviceInterfacesAndZones', 'getNetworkInterfacesByDevice', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getDeviceZonesByDevice - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getDeviceZonesByDevice(deviceInterfacesAndZonesId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('DeviceInterfacesAndZones', 'getDeviceZonesByDevice', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getNetworkInterfacesByRevision - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getNetworkInterfacesByRevision(deviceInterfacesAndZonesId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('DeviceInterfacesAndZones', 'getNetworkInterfacesByRevision', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getDeviceZonesByRevision - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getDeviceZonesByRevision(deviceInterfacesAndZonesId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('DeviceInterfacesAndZones', 'getDeviceZonesByRevision', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const domainsAddADomainBodyParam = {};

    describe('#addADomain - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.addADomain(domainsAddADomainBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('Domains', 'addADomain', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getAllDomains - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getAllDomains((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('Domains', 'getAllDomains', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const domainsId = 'fakedata';
    const domainsUpdateADomainBodyParam = {};

    describe('#updateADomain - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.updateADomain(domainsUpdateADomainBodyParam, domainsId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('Domains', 'updateADomain', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getDomain - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getDomain(domainsId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('Domains', 'getDomain', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getGeneralProperties - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getGeneralProperties((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('GeneralProperties', 'getGeneralProperties', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const iPsecVPNDeviceId = 'fakedata';

    describe('#getCheckPointVPNIPSecCommunitiesAndGateways - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getCheckPointVPNIPSecCommunitiesAndGateways(iPsecVPNDeviceId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IPsecVPN', 'getCheckPointVPNIPSecCommunitiesAndGateways', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getCiscoIPsecPolicyAndPeers - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getCiscoIPsecPolicyAndPeers(iPsecVPNDeviceId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IPsecVPN', 'getCiscoIPsecPolicyAndPeers', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const iPsecVPNId = 'fakedata';

    describe('#getCiscoCryptographicMapsByDevice - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getCiscoCryptographicMapsByDevice(iPsecVPNId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IPsecVPN', 'getCiscoCryptographicMapsByDevice', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getCiscoCryptographicMapsByRevision - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getCiscoCryptographicMapsByRevision(iPsecVPNId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('IPsecVPN', 'getCiscoCryptographicMapsByRevision', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const internetObjectsCreateNewInternetRepresentationForADeviceBodyParam = {};

    describe('#createNewInternetRepresentationForADevice - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.createNewInternetRepresentationForADevice(internetObjectsCreateNewInternetRepresentationForADeviceBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('InternetObjects', 'createNewInternetRepresentationForADevice', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const internetObjectsDeviceId = 'fakedata';
    const internetObjectsUpdateInternetRepresentationForDeviceBodyParam = {};

    describe('#updateInternetRepresentationForDevice - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.updateInternetRepresentationForDevice(internetObjectsUpdateInternetRepresentationForDeviceBodyParam, internetObjectsDeviceId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('InternetObjects', 'updateInternetRepresentationForDevice', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getInternetRepresentationForDevice - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getInternetRepresentationForDevice(internetObjectsDeviceId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('InternetObjects', 'getInternetRepresentationForDevice', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getResolvedInternetRepresentationForDevice - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getResolvedInternetRepresentationForDevice(internetObjectsDeviceId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('InternetObjects', 'getResolvedInternetRepresentationForDevice', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const lDAPReturnEntriesThatExactlyMatchOneOfTheGivenStringsBodyParam = {};

    describe('#returnEntriesThatExactlyMatchOneOfTheGivenStrings - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.returnEntriesThatExactlyMatchOneOfTheGivenStrings(lDAPReturnEntriesThatExactlyMatchOneOfTheGivenStringsBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('LDAP', 'returnEntriesThatExactlyMatchOneOfTheGivenStrings', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const lDAPReturnLDAPEntriesWhichMatchTheGivenSearchCriteriaBodyParam = {};

    describe('#returnLDAPEntriesWhichMatchTheGivenSearchCriteria - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.returnLDAPEntriesWhichMatchTheGivenSearchCriteria(lDAPReturnLDAPEntriesWhichMatchTheGivenSearchCriteriaBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('LDAP', 'returnLDAPEntriesWhichMatchTheGivenSearchCriteria', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getTheBaseDNEntryDetails - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getTheBaseDNEntryDetails((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('LDAP', 'getTheBaseDNEntryDetails', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getLDAPEntryDetailsByDN - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getLDAPEntryDetailsByDN((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('LDAP', 'getLDAPEntryDetailsByDN', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const monitoredDevicesAddOfflineDeviceBodyParam = {};

    describe('#addOfflineDevice - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.addOfflineDevice(monitoredDevicesAddOfflineDeviceBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('MonitoredDevices', 'addOfflineDevice', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const monitoredDevicesAddDevicesToSecureTrackBodyParam = {};

    describe('#addDevicesToSecureTrack - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.addDevicesToSecureTrack(monitoredDevicesAddDevicesToSecureTrackBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('MonitoredDevices', 'addDevicesToSecureTrack', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const monitoredDevicesImportManagedDevicesBodyParam = {};

    describe('#importManagedDevices - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.importManagedDevices(monitoredDevicesImportManagedDevicesBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('MonitoredDevices', 'importManagedDevices', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const monitoredDevicesAddConfigurationForOfflineDeviceBodyParam = {};

    describe('#addConfigurationForOfflineDevice - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.addConfigurationForOfflineDevice(monitoredDevicesAddConfigurationForOfflineDeviceBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('MonitoredDevices', 'addConfigurationForOfflineDevice', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getDevices - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getDevices((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('MonitoredDevices', 'getDevices', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#editSecuretrackDevice - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.editSecuretrackDevice((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('MonitoredDevices', 'editSecuretrackDevice', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const monitoredDevicesTaskUid = 'fakedata';

    describe('#getSpecificTaskResultsOfBulkOperationsOnDevices - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getSpecificTaskResultsOfBulkOperationsOnDevices(monitoredDevicesTaskUid, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('MonitoredDevices', 'getSpecificTaskResultsOfBulkOperationsOnDevices', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const monitoredDevicesDeviceId = 'fakedata';
    const monitoredDevicesUpdateOfflineDeviceBodyParam = {};

    describe('#updateOfflineDevice - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.updateOfflineDevice(monitoredDevicesUpdateOfflineDeviceBodyParam, monitoredDevicesDeviceId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('MonitoredDevices', 'updateOfflineDevice', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const monitoredDevicesId = 'fakedata';

    describe('#getSpecificDevice - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getSpecificDevice(monitoredDevicesId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('MonitoredDevices', 'getSpecificDevice', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getTextualConfigurationByDevice - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getTextualConfigurationByDevice(monitoredDevicesId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('MonitoredDevices', 'getTextualConfigurationByDevice', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getTextualConfigurationByRevision - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getTextualConfigurationByRevision(monitoredDevicesId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('MonitoredDevices', 'getTextualConfigurationByRevision', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const nATPoliciesId = 'fakedata';

    describe('#getNATObjectsByDevice - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getNATObjectsByDevice(nATPoliciesId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NATPolicies', 'getNATObjectsByDevice', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getNATRulesByDevice - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getNATRulesByDevice(nATPoliciesId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NATPolicies', 'getNATRulesByDevice', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getNATObjectsByRevision - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getNATObjectsByRevision(nATPoliciesId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NATPolicies', 'getNATObjectsByRevision', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const networkObjectsDeviceId = 'fakedata';
    const networkObjectsIds = 'fakedata';

    describe('#getSpecificNetworkObject - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getSpecificNetworkObject(networkObjectsDeviceId, networkObjectsIds, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkObjects', 'getSpecificNetworkObject', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const networkObjectsId = 'fakedata';

    describe('#getNetworkObjectsByDevice - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getNetworkObjectsByDevice(networkObjectsId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkObjects', 'getNetworkObjectsByDevice', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getNetworkObjectsMatchingSpecifiedCriteria - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getNetworkObjectsMatchingSpecifiedCriteria((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkObjects', 'getNetworkObjectsMatchingSpecifiedCriteria', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getNetworkGroupsContainingSpecifiedNetworkObject - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getNetworkGroupsContainingSpecifiedNetworkObject(networkObjectsId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkObjects', 'getNetworkGroupsContainingSpecifiedNetworkObject', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getRulesContainingSpecifiedNetworkObject - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getRulesContainingSpecifiedNetworkObject(networkObjectsId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkObjects', 'getRulesContainingSpecifiedNetworkObject', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getNetworkObjectsByRevision - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getNetworkObjectsByRevision(networkObjectsId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkObjects', 'getNetworkObjectsByRevision', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const networkObjectsRevisionId = 'fakedata';

    describe('#getSpecificNetworkObjectsByRevision - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getSpecificNetworkObjectsByRevision(networkObjectsRevisionId, networkObjectsIds, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkObjects', 'getSpecificNetworkObjectsByRevision', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const networkTopologyAddGenericDeviceToTopologyModelBodyParam = {};

    describe('#addGenericDeviceToTopologyModel - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.addGenericDeviceToTopologyModel(networkTopologyAddGenericDeviceToTopologyModelBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkTopology', 'addGenericDeviceToTopologyModel', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const networkTopologyCreateAJoinedTopologyCloudBodyParam = {};

    describe('#createAJoinedTopologyCloud - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.createAJoinedTopologyCloud(networkTopologyCreateAJoinedTopologyCloudBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkTopology', 'createAJoinedTopologyCloud', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const networkTopologySynchronizeTheTopologyModelBodyParam = {};

    describe('#synchronizeTheTopologyModel - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.synchronizeTheTopologyModel(networkTopologySynchronizeTheTopologyModelBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkTopology', 'synchronizeTheTopologyModel', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getMostSpecificNetworkInterfacesFromWhichAHostIPIsAccessible - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getMostSpecificNetworkInterfacesFromWhichAHostIPIsAccessible((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkTopology', 'getMostSpecificNetworkInterfacesFromWhichAHostIPIsAccessible', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getTopologyNetworkInterfacesByDevice - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getTopologyNetworkInterfacesByDevice((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkTopology', 'getTopologyNetworkInterfacesByDevice', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getTopologyRoutingTablesForAGivenDevice - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getTopologyRoutingTablesForAGivenDevice((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkTopology', 'getTopologyRoutingTablesForAGivenDevice', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getGenericDevicesThatAreConfiguredInST - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getGenericDevicesThatAreConfiguredInST((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkTopology', 'getGenericDevicesThatAreConfiguredInST', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const networkTopologyId = 'fakedata';
    const networkTopologyUpdateAnExistingGenericDeviceInTheTopologyModelBodyParam = {};

    describe('#updateAnExistingGenericDeviceInTheTopologyModel - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.updateAnExistingGenericDeviceInTheTopologyModel(networkTopologyUpdateAnExistingGenericDeviceInTheTopologyModelBodyParam, networkTopologyId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkTopology', 'updateAnExistingGenericDeviceInTheTopologyModel', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getCloudInternalNetworks - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getCloudInternalNetworks(networkTopologyId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkTopology', 'getCloudInternalNetworks', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getTopologyCloudSuggestions - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getTopologyCloudSuggestions((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkTopology', 'getTopologyCloudSuggestions', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const networkTopologyCloudId = 'fakedata';

    describe('#getCloudInformation - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getCloudInformation(networkTopologyCloudId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkTopology', 'getCloudInformation', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getTopologyClouds - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getTopologyClouds((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkTopology', 'getTopologyClouds', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const networkTopologyUpdateACloudBodyParam = {};

    describe('#updateACloud - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.updateACloud(networkTopologyUpdateACloudBodyParam, networkTopologyId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkTopology', 'updateACloud', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSpecificTopologyCloud - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getSpecificTopologyCloud(networkTopologyId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkTopology', 'getSpecificTopologyCloud', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getTopologyGenericVPNConnections - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getTopologyGenericVPNConnections((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkTopology', 'getTopologyGenericVPNConnections', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getPathForSpecifiedTraffic - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getPathForSpecifiedTraffic((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkTopology', 'getPathForSpecifiedTraffic', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getPathImageForSpecifiedTraffic - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getPathImageForSpecifiedTraffic((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkTopology', 'getPathImageForSpecifiedTraffic', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getTopologySubnets - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getTopologySubnets((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkTopology', 'getTopologySubnets', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSpecificTopologySubnet - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getSpecificTopologySubnet(networkTopologyId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkTopology', 'getSpecificTopologySubnet', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getTopologySynchronizationStatus - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getTopologySynchronizationStatus((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkTopology', 'getTopologySynchronizationStatus', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const networkZoneManagerPatternsZoneId = 'fakedata';
    const networkZoneManagerPatternsCreateAZonePatternEntryInASpecificZoneBodyParam = {};

    describe('#createAZonePatternEntryInASpecificZone - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.createAZonePatternEntryInASpecificZone(networkZoneManagerPatternsCreateAZonePatternEntryInASpecificZoneBodyParam, networkZoneManagerPatternsZoneId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkZoneManagerPatterns', 'createAZonePatternEntryInASpecificZone', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const networkZoneManagerPatternsIds = 'fakedata';

    describe('#getAllPatternEntriesForSpecificZones - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getAllPatternEntriesForSpecificZones(networkZoneManagerPatternsIds, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkZoneManagerPatterns', 'getAllPatternEntriesForSpecificZones', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const networkZoneManagerPatternsId = 'fakedata';

    describe('#getASpecificZonePatternEntryForASpecificZone - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getASpecificZonePatternEntryForASpecificZone(networkZoneManagerPatternsZoneId, networkZoneManagerPatternsId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkZoneManagerPatterns', 'getASpecificZonePatternEntryForASpecificZone', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const networkZoneManagerSubnetsZoneId = 'fakedata';
    const networkZoneManagerSubnetsCreateAZoneEntryBodyParam = {};

    describe('#createAZoneEntry - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.createAZoneEntry(networkZoneManagerSubnetsCreateAZoneEntryBodyParam, networkZoneManagerSubnetsZoneId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkZoneManagerSubnets', 'createAZoneEntry', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const networkZoneManagerSubnetsIds = 'fakedata';

    describe('#getEntriesForAZone - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getEntriesForAZone(networkZoneManagerSubnetsIds, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkZoneManagerSubnets', 'getEntriesForAZone', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const networkZoneManagerSubnetsZoneIds = 'fakedata';
    const networkZoneManagerSubnetsModifyMultipleExistingZoneEntriesBodyParam = {};

    describe('#modifyMultipleExistingZoneEntries - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.modifyMultipleExistingZoneEntries(networkZoneManagerSubnetsModifyMultipleExistingZoneEntriesBodyParam, networkZoneManagerSubnetsZoneIds, networkZoneManagerSubnetsIds, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkZoneManagerSubnets', 'modifyMultipleExistingZoneEntries', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const networkZoneManagerSubnetsId = 'fakedata';
    const networkZoneManagerSubnetsModifyAZoneEntryBodyParam = {};

    describe('#modifyAZoneEntry - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.modifyAZoneEntry(networkZoneManagerSubnetsModifyAZoneEntryBodyParam, networkZoneManagerSubnetsZoneId, networkZoneManagerSubnetsId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkZoneManagerSubnets', 'modifyAZoneEntry', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getASpecificZoneEntry - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getASpecificZoneEntry(networkZoneManagerSubnetsZoneId, networkZoneManagerSubnetsId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkZoneManagerSubnets', 'getASpecificZoneEntry', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const networkZoneManagerZonesMapNetworkElementsToSecurityZonesBodyParam = {};

    describe('#mapNetworkElementsToSecurityZones - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.mapNetworkElementsToSecurityZones(networkZoneManagerZonesMapNetworkElementsToSecurityZonesBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkZoneManagerZones', 'mapNetworkElementsToSecurityZones', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const networkZoneManagerZonesCreateAZoneBodyParam = {};

    describe('#createAZone - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.createAZone(networkZoneManagerZonesCreateAZoneBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkZoneManagerZones', 'createAZone', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const networkZoneManagerZonesIds = 'fakedata';
    const networkZoneManagerZonesImportAZoneBodyParam = {};

    describe('#importAZone - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.importAZone(networkZoneManagerZonesImportAZoneBodyParam, networkZoneManagerZonesIds, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkZoneManagerZones', 'importAZone', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getAllZones - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getAllZones((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkZoneManagerZones', 'getAllZones', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSharedZones - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getSharedZones((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkZoneManagerZones', 'getSharedZones', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const networkZoneManagerZonesChildId = 'fakedata';
    const networkZoneManagerZonesParentIds = 'fakedata';
    const networkZoneManagerZonesAddAZoneAsAnAncestorToAZoneBodyParam = {};

    describe('#addAZoneAsAnAncestorToAZone - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.addAZoneAsAnAncestorToAZone(networkZoneManagerZonesAddAZoneAsAnAncestorToAZoneBodyParam, networkZoneManagerZonesChildId, networkZoneManagerZonesParentIds, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkZoneManagerZones', 'addAZoneAsAnAncestorToAZone', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getAncestorZonesForAZone - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getAncestorZonesForAZone(networkZoneManagerZonesIds, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkZoneManagerZones', 'getAncestorZonesForAZone', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getConfigurationUsagesForAZone - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getConfigurationUsagesForAZone(networkZoneManagerZonesIds, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkZoneManagerZones', 'getConfigurationUsagesForAZone', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getDescendantZonesForAZone - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getDescendantZonesForAZone(networkZoneManagerZonesIds, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkZoneManagerZones', 'getDescendantZonesForAZone', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const networkZoneManagerZonesId = 'fakedata';
    const networkZoneManagerZonesModifyAZoneBodyParam = {};

    describe('#modifyAZone - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.modifyAZone(networkZoneManagerZonesModifyAZoneBodyParam, networkZoneManagerZonesId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkZoneManagerZones', 'modifyAZone', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getASpecificZone - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getASpecificZone(networkZoneManagerZonesId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkZoneManagerZones', 'getASpecificZone', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const networkZoneManagerZonesParentId = 'fakedata';
    const networkZoneManagerZonesChildIds = 'fakedata';
    const networkZoneManagerZonesAddAZoneAsADescendantToAZoneBodyParam = {};

    describe('#addAZoneAsADescendantToAZone - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.addAZoneAsADescendantToAZone(networkZoneManagerZonesAddAZoneAsADescendantToAZoneBodyParam, networkZoneManagerZonesParentId, networkZoneManagerZonesChildIds, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkZoneManagerZones', 'addAZoneAsADescendantToAZone', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const policiesAndSubPoliciesDeviceId = 'fakedata';

    describe('#getListOfSubPoliciesBindingsWithInputAndOrOutputInterfaces - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getListOfSubPoliciesBindingsWithInputAndOrOutputInterfaces(policiesAndSubPoliciesDeviceId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('PoliciesAndSubPolicies', 'getListOfSubPoliciesBindingsWithInputAndOrOutputInterfaces', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getRulesByInputAndOutputInterfaces - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getRulesByInputAndOutputInterfaces(policiesAndSubPoliciesDeviceId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('PoliciesAndSubPolicies', 'getRulesByInputAndOutputInterfaces', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const policiesAndSubPoliciesId = 'fakedata';

    describe('#getSubPoliciesBindingsByDevice - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getSubPoliciesBindingsByDevice(policiesAndSubPoliciesId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('PoliciesAndSubPolicies', 'getSubPoliciesBindingsByDevice', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getPoliciesByDevice - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getPoliciesByDevice(policiesAndSubPoliciesId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('PoliciesAndSubPolicies', 'getPoliciesByDevice', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSubPoliciesBindingsByRevision - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getSubPoliciesBindingsByRevision(policiesAndSubPoliciesId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('PoliciesAndSubPolicies', 'getSubPoliciesBindingsByRevision', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getPoliciesByRevision - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getPoliciesByRevision(policiesAndSubPoliciesId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('PoliciesAndSubPolicies', 'getPoliciesByRevision', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#runPolicyAnalysisQuery - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.runPolicyAnalysisQuery((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('PolicyAnalysis', 'runPolicyAnalysisQuery', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const policyBrowserFormerlyRuleDocumentationId = 'fakedata';
    const policyBrowserFormerlyRuleDocumentationRuleId = 'fakedata';
    const policyBrowserFormerlyRuleDocumentationModifySpecificRuleDocumentationBodyParam = {};

    describe('#modifySpecificRuleDocumentation - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.modifySpecificRuleDocumentation(policyBrowserFormerlyRuleDocumentationModifySpecificRuleDocumentationBodyParam, policyBrowserFormerlyRuleDocumentationId, policyBrowserFormerlyRuleDocumentationRuleId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('PolicyBrowserFormerlyRuleDocumentation', 'modifySpecificRuleDocumentation', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSpecificRuleDocumentation - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getSpecificRuleDocumentation(policyBrowserFormerlyRuleDocumentationId, policyBrowserFormerlyRuleDocumentationRuleId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('PolicyBrowserFormerlyRuleDocumentation', 'getSpecificRuleDocumentation', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const policyBrowserFormerlyRuleDocumentationPutRevisionsIdRulesRuleIdDocumentationBodyParam = {};

    describe('#putRevisionsIdRulesRuleIdDocumentation - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.putRevisionsIdRulesRuleIdDocumentation(policyBrowserFormerlyRuleDocumentationPutRevisionsIdRulesRuleIdDocumentationBodyParam, policyBrowserFormerlyRuleDocumentationId, policyBrowserFormerlyRuleDocumentationRuleId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('PolicyBrowserFormerlyRuleDocumentation', 'putRevisionsIdRulesRuleIdDocumentation', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getRevisionsIdRulesRuleIdDocumentation - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getRevisionsIdRulesRuleIdDocumentation(policyBrowserFormerlyRuleDocumentationId, policyBrowserFormerlyRuleDocumentationRuleId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('PolicyBrowserFormerlyRuleDocumentation', 'getRevisionsIdRulesRuleIdDocumentation', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getCleanupsResults - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getCleanupsResults((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('PolicyOptimization', 'getCleanupsResults', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const policyOptimizationCleanupId = 'fakedata';

    describe('#getDevicesInCleanupResults - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getDevicesInCleanupResults(policyOptimizationCleanupId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('PolicyOptimization', 'getDevicesInCleanupResults', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getTheSpecificObjectsOrRulesIdentifiedForTheCleanupResults - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getTheSpecificObjectsOrRulesIdentifiedForTheCleanupResults(policyOptimizationCleanupId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('PolicyOptimization', 'getTheSpecificObjectsOrRulesIdentifiedForTheCleanupResults', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const policyOptimizationDeviceId = 'fakedata';

    describe('#getCleanupsByDevice - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getCleanupsByDevice(policyOptimizationDeviceId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('PolicyOptimization', 'getCleanupsByDevice', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getShadowingRulesByDevice - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getShadowingRulesByDevice(policyOptimizationDeviceId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('PolicyOptimization', 'getShadowingRulesByDevice', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getRisksResults - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getRisksResults((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('PolicyOptimization', 'getRisksResults', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const policyOptimizationRiskId = 'fakedata';

    describe('#getDevicesInRiskResults - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getDevicesInRiskResults(policyOptimizationRiskId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('PolicyOptimization', 'getDevicesInRiskResults', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getTheSpecificObjectsOrRulesIdentifiedForTheRiskResults - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getTheSpecificObjectsOrRulesIdentifiedForTheRiskResults(policyOptimizationRiskId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('PolicyOptimization', 'getTheSpecificObjectsOrRulesIdentifiedForTheRiskResults', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const revisionsId = 'fakedata';

    describe('#getLatestRevisionByDevice - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getLatestRevisionByDevice(revisionsId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('Revisions', 'getLatestRevisionByDevice', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getRevisionsByDevice - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getRevisionsByDevice(revisionsId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('Revisions', 'getRevisionsByDevice', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const revisionsRevId = 'fakedata';

    describe('#getSpecificRevision - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getSpecificRevision(revisionsRevId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('Revisions', 'getSpecificRevision', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const ruleUsageDeviceId = 'fakedata';
    const ruleUsageRuleUid = 'fakedata';

    describe('#getLastHitForASpecificRule - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getLastHitForASpecificRule(ruleUsageDeviceId, ruleUsageRuleUid, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('RuleUsage', 'getLastHitForASpecificRule', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getLastHitsForAllRulesByDevice - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getLastHitsForAllRulesByDevice(ruleUsageDeviceId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('RuleUsage', 'getLastHitsForAllRulesByDevice', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const securityRulesDeviceId = 'fakedata';
    const securityRulesIds = 'fakedata';

    describe('#getSpecificRule - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getSpecificRule(securityRulesDeviceId, securityRulesIds, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('SecurityRules', 'getSpecificRule', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const securityRulesId = 'fakedata';

    describe('#getRulesByDevice - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getRulesByDevice(securityRulesId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('SecurityRules', 'getRulesByDevice', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getRulesByRevision - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getRulesByRevision(securityRulesId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('SecurityRules', 'getRulesByRevision', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const securityRulesRevisionId = 'fakedata';

    describe('#getRevisionsRevisionIdRulesIds - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getRevisionsRevisionIdRulesIds(securityRulesRevisionId, securityRulesIds, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('SecurityRules', 'getRevisionsRevisionIdRulesIds', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getRuleCountPerDevice - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getRuleCountPerDevice((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('SecurityRules', 'getRuleCountPerDevice', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#findRules - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.findRules(securityRulesDeviceId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('SecurityRules', 'findRules', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const securityRulesRuleId = 'fakedata';

    describe('#getASpecificRule - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getASpecificRule(securityRulesRuleId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('SecurityRules', 'getASpecificRule', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const servicesAndPortsDeviceId = 'fakedata';
    const servicesAndPortsIds = 'fakedata';

    describe('#getDevicesDeviceIdServicesIds - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getDevicesDeviceIdServicesIds(servicesAndPortsDeviceId, servicesAndPortsIds, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ServicesAndPorts', 'getDevicesDeviceIdServicesIds', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const servicesAndPortsId = 'fakedata';

    describe('#getServicesByDevice - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getServicesByDevice(servicesAndPortsId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ServicesAndPorts', 'getServicesByDevice', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getServicesByRevision - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getServicesByRevision(servicesAndPortsId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ServicesAndPorts', 'getServicesByRevision', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const servicesAndPortsRevisionId = 'fakedata';

    describe('#getSpecificService - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getSpecificService(servicesAndPortsRevisionId, servicesAndPortsIds, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ServicesAndPorts', 'getSpecificService', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getServicesObjectsMatchingSpecifiedCriteria - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getServicesObjectsMatchingSpecifiedCriteria((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ServicesAndPorts', 'getServicesObjectsMatchingSpecifiedCriteria', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getServiceGroupsContainingSpecifiedServiceObjects - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getServiceGroupsContainingSpecifiedServiceObjects(servicesAndPortsId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ServicesAndPorts', 'getServiceGroupsContainingSpecifiedServiceObjects', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getRulesContainingSpecifiedServiceObject - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getRulesContainingSpecifiedServiceObject(servicesAndPortsId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('ServicesAndPorts', 'getRulesContainingSpecifiedServiceObject', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const timeObjectsId = 'fakedata';

    describe('#getTimeObjectsByDevice - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getTimeObjectsByDevice(timeObjectsId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('TimeObjects', 'getTimeObjectsByDevice', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getTimeObjectsByRevision - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getTimeObjectsByRevision(timeObjectsId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('TimeObjects', 'getTimeObjectsByRevision', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const timeObjectsRevisionId = 'fakedata';
    const timeObjectsIds = 'fakedata';

    describe('#getSpecificTimeObject - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getSpecificTimeObject(timeObjectsRevisionId, timeObjectsIds, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('TimeObjects', 'getSpecificTimeObject', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const trafficPolicyMatcherGetPolicyRelevanceMetricsForTrafficBodyParam = {};

    describe('#getPolicyRelevanceMetricsForTraffic - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getPolicyRelevanceMetricsForTraffic(trafficPolicyMatcherGetPolicyRelevanceMetricsForTrafficBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('TrafficPolicyMatcher', 'getPolicyRelevanceMetricsForTraffic', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const unifiedSecurityPolicyAccessRequestViolationsGetViolationsForAnAccessRequestBodyParam = {};

    describe('#getViolationsForAnAccessRequest - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getViolationsForAnAccessRequest(unifiedSecurityPolicyAccessRequestViolationsGetViolationsForAnAccessRequestBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UnifiedSecurityPolicyAccessRequestViolations', 'getViolationsForAnAccessRequest', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const unifiedSecurityPolicyAccessRequestViolationsStartATaskToCalculateViolationsForAnAccessRequestBodyParam = {};

    describe('#startATaskToCalculateViolationsForAnAccessRequest - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.startATaskToCalculateViolationsForAnAccessRequest(unifiedSecurityPolicyAccessRequestViolationsStartATaskToCalculateViolationsForAnAccessRequestBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UnifiedSecurityPolicyAccessRequestViolations', 'startATaskToCalculateViolationsForAnAccessRequest', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const unifiedSecurityPolicyAccessRequestViolationsTaskId = 'fakedata';

    describe('#getViolationTaskResults - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getViolationTaskResults(unifiedSecurityPolicyAccessRequestViolationsTaskId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UnifiedSecurityPolicyAccessRequestViolations', 'getViolationTaskResults', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getViolationTaskStatus - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getViolationTaskStatus(unifiedSecurityPolicyAccessRequestViolationsTaskId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UnifiedSecurityPolicyAccessRequestViolations', 'getViolationTaskStatus', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const unifiedSecurityPolicyAlertsCreateAnAlertBodyParam = {};

    describe('#createAnAlert - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.createAnAlert(unifiedSecurityPolicyAlertsCreateAnAlertBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UnifiedSecurityPolicyAlerts', 'createAnAlert', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getAlerts - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getAlerts((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UnifiedSecurityPolicyAlerts', 'getAlerts', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const unifiedSecurityPolicyAlertsId = 'fakedata';
    const unifiedSecurityPolicyAlertsUpdateAnAlertBodyParam = {};

    describe('#updateAnAlert - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.updateAnAlert(unifiedSecurityPolicyAlertsUpdateAnAlertBodyParam, unifiedSecurityPolicyAlertsId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UnifiedSecurityPolicyAlerts', 'updateAnAlert', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getASpecificAlert - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getASpecificAlert(unifiedSecurityPolicyAlertsId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UnifiedSecurityPolicyAlerts', 'getASpecificAlert', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const unifiedSecurityPolicyCloudTagPolicyCreateACloudTagPolicyBodyParam = {};

    describe('#createACloudTagPolicy - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.createACloudTagPolicy(unifiedSecurityPolicyCloudTagPolicyCreateACloudTagPolicyBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UnifiedSecurityPolicyCloudTagPolicy', 'createACloudTagPolicy', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const unifiedSecurityPolicyCloudTagPolicyCheckIfTagsAreCompliantWithCloudTagPoliciesBodyParam = {};

    describe('#checkIfTagsAreCompliantWithCloudTagPolicies - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.checkIfTagsAreCompliantWithCloudTagPolicies(unifiedSecurityPolicyCloudTagPolicyCheckIfTagsAreCompliantWithCloudTagPoliciesBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UnifiedSecurityPolicyCloudTagPolicy', 'checkIfTagsAreCompliantWithCloudTagPolicies', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getAllCloudTagPolicies - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getAllCloudTagPolicies((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UnifiedSecurityPolicyCloudTagPolicy', 'getAllCloudTagPolicies', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const unifiedSecurityPolicyCloudTagPolicyPolicyId = 'fakedata';
    const unifiedSecurityPolicyCloudTagPolicyReplaceACloudTagPolicyBodyParam = {};

    describe('#replaceACloudTagPolicy - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.replaceACloudTagPolicy(unifiedSecurityPolicyCloudTagPolicyReplaceACloudTagPolicyBodyParam, unifiedSecurityPolicyCloudTagPolicyPolicyId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UnifiedSecurityPolicyCloudTagPolicy', 'replaceACloudTagPolicy', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#modifyACloudTagPolicy - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.modifyACloudTagPolicy(unifiedSecurityPolicyCloudTagPolicyPolicyId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UnifiedSecurityPolicyCloudTagPolicy', 'modifyACloudTagPolicy', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getCloudTagPolicy - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getCloudTagPolicy(unifiedSecurityPolicyCloudTagPolicyPolicyId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UnifiedSecurityPolicyCloudTagPolicy', 'getCloudTagPolicy', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getAllCloudTagPolicyViolationsForAVPC - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getAllCloudTagPolicyViolationsForAVPC((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UnifiedSecurityPolicyCloudTagPolicy', 'getAllCloudTagPolicyViolationsForAVPC', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const unifiedSecurityPolicyExceptionsCreateAnExceptionBodyParam = {};

    describe('#createAnException - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.createAnException(unifiedSecurityPolicyExceptionsCreateAnExceptionBodyParam, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UnifiedSecurityPolicyExceptions', 'createAnException', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const unifiedSecurityPolicyExceptionsExceptionId = 'fakedata';
    const unifiedSecurityPolicyExceptionsStartATaskToCalculateMatchingRulesForAnExceptionBodyParam = {};

    describe('#startATaskToCalculateMatchingRulesForAnException - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.startATaskToCalculateMatchingRulesForAnException(unifiedSecurityPolicyExceptionsStartATaskToCalculateMatchingRulesForAnExceptionBodyParam, unifiedSecurityPolicyExceptionsExceptionId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UnifiedSecurityPolicyExceptions', 'startATaskToCalculateMatchingRulesForAnException', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getAllExceptions - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getAllExceptions((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UnifiedSecurityPolicyExceptions', 'getAllExceptions', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const unifiedSecurityPolicyExceptionsTaskId = 'fakedata';

    describe('#getMatchingRulesTaskResults - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getMatchingRulesTaskResults(unifiedSecurityPolicyExceptionsTaskId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UnifiedSecurityPolicyExceptions', 'getMatchingRulesTaskResults', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getMatchingRulesTaskStatus - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getMatchingRulesTaskStatus(unifiedSecurityPolicyExceptionsTaskId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UnifiedSecurityPolicyExceptions', 'getMatchingRulesTaskStatus', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getASpecificException - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getASpecificException(unifiedSecurityPolicyExceptionsExceptionId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UnifiedSecurityPolicyExceptions', 'getASpecificException', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const unifiedSecurityPolicySecurityZoneMatrixDeviceId = 'fakedata';
    const unifiedSecurityPolicySecurityZoneMatrixSetManualDeviceMappingBodyParam = {};

    describe('#setManualDeviceMapping - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.setManualDeviceMapping(unifiedSecurityPolicySecurityZoneMatrixSetManualDeviceMappingBodyParam, unifiedSecurityPolicySecurityZoneMatrixDeviceId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UnifiedSecurityPolicySecurityZoneMatrix', 'setManualDeviceMapping', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getUnifiedSecurityPolicies - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getUnifiedSecurityPolicies((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UnifiedSecurityPolicySecurityZoneMatrix', 'getUnifiedSecurityPolicies', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getGlobalUnifiedSecurityPolicies - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getGlobalUnifiedSecurityPolicies((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UnifiedSecurityPolicySecurityZoneMatrix', 'getGlobalUnifiedSecurityPolicies', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const unifiedSecurityPolicySecurityZoneMatrixId = 'fakedata';

    describe('#getUnifiedSecurityPolicyAsCSV - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getUnifiedSecurityPolicyAsCSV(unifiedSecurityPolicySecurityZoneMatrixId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UnifiedSecurityPolicySecurityZoneMatrix', 'getUnifiedSecurityPolicyAsCSV', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const unifiedSecurityPolicyViolationsDeviceId = 'fakedata';

    describe('#getTheAmountOfViolatingRulesForTheSpecifiedDevice - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getTheAmountOfViolatingRulesForTheSpecifiedDevice(unifiedSecurityPolicyViolationsDeviceId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UnifiedSecurityPolicyViolations', 'getTheAmountOfViolatingRulesForTheSpecifiedDevice', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getTheViolatingRulesForTheSpecifiedDevice - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.getTheViolatingRulesForTheSpecifiedDevice(unifiedSecurityPolicyViolationsDeviceId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UnifiedSecurityPolicyViolations', 'getTheViolatingRulesForTheSpecifiedDevice', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteInternetRepresentationForDevice - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteInternetRepresentationForDevice(internetObjectsDeviceId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('InternetObjects', 'deleteInternetRepresentationForDevice', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteGenericDeviceFromTopologyModel - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteGenericDeviceFromTopologyModel(networkTopologyId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkTopology', 'deleteGenericDeviceFromTopologyModel', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteZonesZoneIdsEntriesIds - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteZonesZoneIdsEntriesIds(networkZoneManagerSubnetsZoneIds, networkZoneManagerSubnetsIds, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkZoneManagerSubnets', 'deleteZonesZoneIdsEntriesIds', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteZoneEntries - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteZoneEntries(networkZoneManagerSubnetsZoneId, networkZoneManagerSubnetsId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkZoneManagerSubnets', 'deleteZoneEntries', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteAllZones - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteAllZones((data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkZoneManagerZones', 'deleteAllZones', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#removeAZoneAsAnAncestorToAZone - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.removeAZoneAsAnAncestorToAZone(networkZoneManagerZonesChildId, networkZoneManagerZonesParentIds, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkZoneManagerZones', 'removeAZoneAsAnAncestorToAZone', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteAZone - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteAZone(networkZoneManagerZonesIds, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkZoneManagerZones', 'deleteAZone', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#removeAZoneAsAnDescendantsToAZone - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.removeAZoneAsAnDescendantsToAZone(networkZoneManagerZonesParentId, networkZoneManagerZonesChildIds, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('NetworkZoneManagerZones', 'removeAZoneAsAnDescendantsToAZone', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteSpecificRuleDocumentation - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteSpecificRuleDocumentation(policyBrowserFormerlyRuleDocumentationId, policyBrowserFormerlyRuleDocumentationRuleId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('PolicyBrowserFormerlyRuleDocumentation', 'deleteSpecificRuleDocumentation', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteRevisionsIdRulesRuleIdDocumentation - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteRevisionsIdRulesRuleIdDocumentation(policyBrowserFormerlyRuleDocumentationId, policyBrowserFormerlyRuleDocumentationRuleId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('PolicyBrowserFormerlyRuleDocumentation', 'deleteRevisionsIdRulesRuleIdDocumentation', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#cancelViolationTask - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.cancelViolationTask(unifiedSecurityPolicyAccessRequestViolationsTaskId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UnifiedSecurityPolicyAccessRequestViolations', 'cancelViolationTask', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    const unifiedSecurityPolicyAlertsIds = 'fakedata';

    describe('#deleteAlertsByIds - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteAlertsByIds(unifiedSecurityPolicyAlertsIds, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UnifiedSecurityPolicyAlerts', 'deleteAlertsByIds', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteCloudTagPolicy - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteCloudTagPolicy(unifiedSecurityPolicyCloudTagPolicyPolicyId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UnifiedSecurityPolicyCloudTagPolicy', 'deleteCloudTagPolicy', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#cancelMatchingRulesTask - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.cancelMatchingRulesTask(unifiedSecurityPolicyExceptionsTaskId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UnifiedSecurityPolicyExceptions', 'cancelMatchingRulesTask', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteAnException - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteAnException(unifiedSecurityPolicyExceptionsExceptionId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UnifiedSecurityPolicyExceptions', 'deleteAnException', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteUnifiedSecurityPolicy - errors', () => {
      it('should work if integrated but since no mockdata should error when run standalone', (done) => {
        try {
          a.deleteUnifiedSecurityPolicy(unifiedSecurityPolicySecurityZoneMatrixId, (data, error) => {
            try {
              if (stub) {
                const displayE = 'Error 400 received on request';
                runErrorAsserts(data, error, 'AD.500', 'Test-tufin_securetrack-connectorRest-handleEndResponse', displayE);
              } else {
                runCommonAsserts(data, error);
              }
              saveMockData('UnifiedSecurityPolicySecurityZoneMatrix', 'deleteUnifiedSecurityPolicy', 'default', data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });
  });
});
