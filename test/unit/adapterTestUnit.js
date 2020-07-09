/* @copyright Itential, LLC 2019 (pre-modifications) */

// Set globals
/* global describe it log pronghornProps */
/* eslint global-require: warn */
/* eslint no-unused-vars: warn */

// include required items for testing & logging
const assert = require('assert');
const fs = require('fs-extra');
const mocha = require('mocha');
const path = require('path');
const util = require('util');
const winston = require('winston');
const execute = require('child_process').execSync;
const { expect } = require('chai');
const { use } = require('chai');
const td = require('testdouble');

const anything = td.matchers.anything();

// stub and attemptTimeout are used throughout the code so set them here
let logLevel = 'none';
const stub = true;
const isRapidFail = false;
const attemptTimeout = 120000;

// these variables can be changed to run in integrated mode so easier to set them here
// always check these in with bogus data!!!
const host = 'replace.hostorip.here';
const username = 'username';
const password = 'password';
const protocol = 'http';
const port = 80;
const sslenable = false;
const sslinvalid = false;

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
      properties: {
        host,
        port,
        base_path: '/',
        version: '',
        cache_location: 'none',
        encode_pathvars: true,
        save_metric: false,
        protocol,
        stub,
        authentication: {
          auth_method: 'no_authentication',
          username,
          password,
          token: '',
          token_timeout: -1,
          token_cache: 'local',
          invalid_token_error: 401,
          auth_field: 'header.headers.Authorization',
          auth_field_format: 'Basic {b64}{username}:{password}{/b64}'
        },
        healthcheck: {
          type: 'none',
          frequency: 60000
        },
        throttle: {
          throttle_enabled: false,
          number_pronghorns: 1,
          sync_async: 'sync',
          max_in_queue: 1000,
          concurrent_max: 1,
          expire_timeout: 0,
          avg_runtime: 200,
          priorities: [
            {
              value: 0,
              percent: 100
            }
          ]
        },
        request: {
          number_redirects: 0,
          number_retries: 3,
          limit_retry_error: 0,
          failover_codes: [],
          attempt_timeout: attemptTimeout,
          global_request: {
            payload: {},
            uriOptions: {},
            addlHeaders: {},
            authData: {}
          },
          healthcheck_on_timeout: true,
          return_raw: true,
          archiving: false
        },
        proxy: {
          enabled: false,
          host: '',
          port: 1,
          protocol: 'http'
        },
        ssl: {
          ecdhCurve: '',
          enabled: sslenable,
          accept_invalid_cert: sslinvalid,
          ca_file: '',
          key_file: '',
          cert_file: '',
          secure_protocol: '',
          ciphers: ''
        },
        mongo: {
          host: '',
          port: 0,
          database: '',
          username: '',
          password: '',
          replSet: '',
          db_ssl: {
            enabled: false,
            accept_invalid_cert: false,
            ca_file: '',
            key_file: '',
            cert_file: ''
          }
        }
      }
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

// require the adapter that we are going to be using
const TufinSecuretrack = require('../../adapter.js');

// delete the .DS_Store directory in entities -- otherwise this will cause errors
const dirPath = path.join(__dirname, '../../entities/.DS_Store');
if (fs.existsSync(dirPath)) {
  try {
    fs.removeSync(dirPath);
    console.log('.DS_Store deleted');
  } catch (e) {
    console.log('Error when deleting .DS_Store:', e);
  }
}

// begin the testing - these should be pretty well defined between the describe and the it!
describe('[unit] Tufin_securetrack Adapter Test', () => {
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

    describe('adapterBase.js', () => {
      it('should have an adapterBase.js', (done) => {
        try {
          fs.exists('adapterBase.js', (val) => {
            assert.equal(true, val);
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    let wffunctions = [];
    describe('#getWorkflowFunctions', () => {
      it('should retrieve workflow functions', (done) => {
        try {
          wffunctions = a.getWorkflowFunctions();

          try {
            assert.notEqual(0, wffunctions.length);
            done();
          } catch (err) {
            log.error(`Test Failure: ${err}`);
            done(err);
          }
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('package.json', () => {
      it('should have a package.json', (done) => {
        try {
          fs.exists('package.json', (val) => {
            assert.equal(true, val);
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('package.json should be validated', (done) => {
        try {
          const packageDotJson = require('../../package.json');
          const { PJV } = require('package-json-validator');
          const options = {
            warnings: true, // show warnings
            recommendations: true // show recommendations
          };
          const results = PJV.validate(JSON.stringify(packageDotJson), 'npm', options);

          if (results.valid === false) {
            log.error('The package.json contains the following errors: ');
            log.error(util.inspect(results));
            assert.equal(true, results.valid);
          } else {
            assert.equal(true, results.valid);
          }

          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('package.json should be customized', (done) => {
        try {
          const packageDotJson = require('../../package.json');
          assert.notEqual(-1, packageDotJson.name.indexOf('tufin_securetrack'));
          assert.notEqual(undefined, packageDotJson.version);
          assert.notEqual(null, packageDotJson.version);
          assert.notEqual('', packageDotJson.version);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('pronghorn.json', () => {
      it('should have a pronghorn.json', (done) => {
        try {
          fs.exists('pronghorn.json', (val) => {
            assert.equal(true, val);
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('pronghorn.json should be customized', (done) => {
        try {
          const pronghornDotJson = require('../../pronghorn.json');
          assert.notEqual(-1, pronghornDotJson.id.indexOf('tufin_securetrack'));
          assert.equal('TufinSecuretrack', pronghornDotJson.export);
          assert.equal('Tufin_securetrack', pronghornDotJson.title);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('pronghorn.json should only expose workflow functions', (done) => {
        try {
          const pronghornDotJson = require('../../pronghorn.json');

          for (let m = 0; m < pronghornDotJson.methods.length; m += 1) {
            let found = false;
            let paramissue = false;

            for (let w = 0; w < wffunctions.length; w += 1) {
              if (pronghornDotJson.methods[m].name === wffunctions[w]) {
                found = true;
                const methLine = execute(`grep "  ${wffunctions[w]}(" adapter.js | grep "callback) {"`).toString();
                let wfparams = [];

                if (methLine && methLine.indexOf('(') >= 0 && methLine.indexOf(')') >= 0) {
                  const temp = methLine.substring(methLine.indexOf('(') + 1, methLine.indexOf(')'));
                  wfparams = temp.split(',');

                  for (let t = 0; t < wfparams.length; t += 1) {
                    // remove default value from the parameter name
                    wfparams[t] = wfparams[t].substring(0, wfparams[t].search(/=/) > 0 ? wfparams[t].search(/#|\?|=/) : wfparams[t].length);
                    // remove spaces
                    wfparams[t] = wfparams[t].trim();

                    if (wfparams[t] === 'callback') {
                      wfparams.splice(t, 1);
                    }
                  }
                }

                // if there are inputs defined but not on the method line
                if (wfparams.length === 0 && (pronghornDotJson.methods[m].input
                    && pronghornDotJson.methods[m].input.length > 0)) {
                  paramissue = true;
                } else if (wfparams.length > 0 && (!pronghornDotJson.methods[m].input
                    || pronghornDotJson.methods[m].input.length === 0)) {
                  // if there are no inputs defined but there are on the method line
                  paramissue = true;
                } else {
                  for (let p = 0; p < pronghornDotJson.methods[m].input.length; p += 1) {
                    let pfound = false;
                    for (let wfp = 0; wfp < wfparams.length; wfp += 1) {
                      if (pronghornDotJson.methods[m].input[p].name.toUpperCase() === wfparams[wfp].toUpperCase()) {
                        pfound = true;
                      }
                    }

                    if (!pfound) {
                      paramissue = true;
                    }
                  }
                  for (let wfp = 0; wfp < wfparams.length; wfp += 1) {
                    let pfound = false;
                    for (let p = 0; p < pronghornDotJson.methods[m].input.length; p += 1) {
                      if (pronghornDotJson.methods[m].input[p].name.toUpperCase() === wfparams[wfp].toUpperCase()) {
                        pfound = true;
                      }
                    }

                    if (!pfound) {
                      paramissue = true;
                    }
                  }
                }

                break;
              }
            }

            if (!found) {
              // this is the reason to go through both loops - log which ones are not found so
              // they can be worked
              log.error(`${pronghornDotJson.methods[m].name} not found in workflow functions`);
            }
            if (paramissue) {
              // this is the reason to go through both loops - log which ones are not found so
              // they can be worked
              log.error(`${pronghornDotJson.methods[m].name} has a parameter mismatch`);
            }
            assert.equal(true, found);
            assert.equal(false, paramissue);
          }
          done();
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('pronghorn.json should expose all workflow functions', (done) => {
        try {
          const pronghornDotJson = require('../../pronghorn.json');
          for (let w = 0; w < wffunctions.length; w += 1) {
            let found = false;

            for (let m = 0; m < pronghornDotJson.methods.length; m += 1) {
              if (pronghornDotJson.methods[m].name === wffunctions[w]) {
                found = true;
                break;
              }
            }

            if (!found) {
              // this is the reason to go through both loops - log which ones are not found so
              // they can be worked
              log.error(`${wffunctions[w]} not found in pronghorn.json`);
            }
            assert.equal(true, found);
          }
          done();
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      });
    });

    describe('propertiesSchema.json', () => {
      it('should have a propertiesSchema.json', (done) => {
        try {
          fs.exists('propertiesSchema.json', (val) => {
            assert.equal(true, val);
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('propertiesSchema.json should be customized', (done) => {
        try {
          const propertiesDotJson = require('../../propertiesSchema.json');
          assert.equal('adapter-tufin_securetrack', propertiesDotJson.$id);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('error.json', () => {
      it('should have an error.json', (done) => {
        try {
          fs.exists('error.json', (val) => {
            assert.equal(true, val);
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('sampleProperties.json', () => {
      it('should have a sampleProperties.json', (done) => {
        try {
          fs.exists('sampleProperties.json', (val) => {
            assert.equal(true, val);
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#checkProperties', () => {
      it('should have a checkProperties function', (done) => {
        try {
          assert.equal(true, typeof a.checkProperties === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('the sample properties should be good - if failure change the log level', (done) => {
        try {
          const samplePropsJson = require('../../sampleProperties.json');
          const clean = a.checkProperties(samplePropsJson.properties);

          try {
            assert.notEqual(0, Object.keys(clean));
            assert.equal(undefined, clean.exception);
            assert.notEqual(undefined, clean.host);
            assert.notEqual(null, clean.host);
            assert.notEqual('', clean.host);
            done();
          } catch (err) {
            log.error(`Test Failure: ${err}`);
            done(err);
          }
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('README.md', () => {
      it('should have a README', (done) => {
        try {
          fs.exists('README.md', (val) => {
            assert.equal(true, val);
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('README.md should be customized', (done) => {
        try {
          fs.readFile('README.md', 'utf8', (err, data) => {
            assert.equal(-1, data.indexOf('[System]'));
            assert.equal(-1, data.indexOf('[system]'));
            assert.equal(-1, data.indexOf('[version]'));
            assert.equal(-1, data.indexOf('[namespace]'));
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#connect', () => {
      it('should have a connect function', (done) => {
        try {
          assert.equal(true, typeof a.connect === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#healthCheck', () => {
      it('should have a healthCheck function', (done) => {
        try {
          assert.equal(true, typeof a.healthCheck === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#checkActionFiles', () => {
      it('should have a checkActionFiles function', (done) => {
        try {
          assert.equal(true, typeof a.checkActionFiles === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('the action files should be good - if failure change the log level as most issues are warnings', (done) => {
        try {
          const clean = a.checkActionFiles();

          try {
            for (let c = 0; c < clean.length; c += 1) {
              log.error(clean[c]);
            }
            assert.equal(0, clean.length);
            done();
          } catch (err) {
            log.error(`Test Failure: ${err}`);
            done(err);
          }
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#encryptProperty', () => {
      it('should have a encryptProperty function', (done) => {
        try {
          assert.equal(true, typeof a.encryptProperty === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('should get base64 encoded property', (done) => {
        try {
          a.encryptProperty('testing', 'base64', (data, error) => {
            try {
              assert.equal(undefined, error);
              assert.notEqual(undefined, data);
              assert.notEqual(null, data);
              assert.notEqual(undefined, data.response);
              assert.notEqual(null, data.response);
              assert.equal(0, data.response.indexOf('{code}'));
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
      it('should get encrypted property', (done) => {
        try {
          a.encryptProperty('testing', 'encrypt', (data, error) => {
            try {
              assert.equal(undefined, error);
              assert.notEqual(undefined, data);
              assert.notEqual(null, data);
              assert.notEqual(undefined, data.response);
              assert.notEqual(null, data.response);
              assert.equal(0, data.response.indexOf('{crypt}'));
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

    // describe('#hasEntity', () => {
    //   it('should have a hasEntity function', (done) => {
    //     try {
    //       assert.equal(true, typeof a.hasEntity === 'function');
    //       done();
    //     } catch (error) {
    //       log.error(`Test Failure: ${error}`);
    //       done(error);
    //     }
    //   });
    //   it('should find entity', (done) => {
    //     try {
    //       a.hasEntity('template_entity', // 'a9e9c33dc61122760072455df62663d2', (data) => {
    //         try {
    //           assert.equal(true, data[0]);
    //           done();
    //         } catch (err) {
    //           log.error(`Test Failure: ${err}`);
    //           done(err);
    //         }
    //       });
    //     } catch (error) {
    //       log.error(`Adapter Exception: ${error}`);
    //       done(error);
    //     }
    //   }).timeout(attemptTimeout);
    //   it('should not find entity', (done) => {
    //     try {
    //       a.hasEntity('template_entity', 'blah', (data) => {
    //         try {
    //           assert.equal(false, data[0]);
    //           done();
    //         } catch (err) {
    //           log.error(`Test Failure: ${err}`);
    //           done(err);
    //         }
    //       });
    //     } catch (error) {
    //       log.error(`Adapter Exception: ${error}`);
    //       done(error);
    //     }
    //   }).timeout(attemptTimeout);
    // });

    /*
    -----------------------------------------------------------------------
    -----------------------------------------------------------------------
    *** All code above this comment will be replaced during a migration ***
    ******************* DO NOT REMOVE THIS COMMENT BLOCK ******************
    -----------------------------------------------------------------------
    -----------------------------------------------------------------------
    */

    describe('#getAdditionalParametersIdentitiesByRevision - errors', () => {
      it('should have a getAdditionalParametersIdentitiesByRevision function', (done) => {
        try {
          assert.equal(true, typeof a.getAdditionalParametersIdentitiesByRevision === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing revisionId', (done) => {
        try {
          a.getAdditionalParametersIdentitiesByRevision(null, (data, error) => {
            try {
              const displayE = 'revisionId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getAdditionalParametersIdentitiesByRevision', displayE);
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

    describe('#getSpecificAdditionalParameterIdentity - errors', () => {
      it('should have a getSpecificAdditionalParameterIdentity function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificAdditionalParameterIdentity === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing revisionId', (done) => {
        try {
          a.getSpecificAdditionalParameterIdentity(null, null, (data, error) => {
            try {
              const displayE = 'revisionId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificAdditionalParameterIdentity', displayE);
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
      it('should error if - missing ids', (done) => {
        try {
          a.getSpecificAdditionalParameterIdentity('fakeparam', null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificAdditionalParameterIdentity', displayE);
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
      it('should have a getAURLCategory function', (done) => {
        try {
          assert.equal(true, typeof a.getAURLCategory === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing revisionId', (done) => {
        try {
          a.getAURLCategory(null, null, (data, error) => {
            try {
              const displayE = 'revisionId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getAURLCategory', displayE);
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
      it('should error if - missing ids', (done) => {
        try {
          a.getAURLCategory('fakeparam', null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getAURLCategory', displayE);
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

    describe('#getApplicationIdentitiesByDevice - errors', () => {
      it('should have a getApplicationIdentitiesByDevice function', (done) => {
        try {
          assert.equal(true, typeof a.getApplicationIdentitiesByDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getApplicationIdentitiesByDevice(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getApplicationIdentitiesByDevice', displayE);
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

    describe('#getSpecificApplicationIdentity - errors', () => {
      it('should have a getSpecificApplicationIdentity function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificApplicationIdentity === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getSpecificApplicationIdentity(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificApplicationIdentity', displayE);
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
      it('should error if - missing ids', (done) => {
        try {
          a.getSpecificApplicationIdentity('fakeparam', null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificApplicationIdentity', displayE);
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
      it('should have a getApplicationsIdentitiesByRevision function', (done) => {
        try {
          assert.equal(true, typeof a.getApplicationsIdentitiesByRevision === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getApplicationsIdentitiesByRevision(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getApplicationsIdentitiesByRevision', displayE);
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

    describe('#getRevisionsRevisionIdApplicationsIds - errors', () => {
      it('should have a getRevisionsRevisionIdApplicationsIds function', (done) => {
        try {
          assert.equal(true, typeof a.getRevisionsRevisionIdApplicationsIds === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing revisionId', (done) => {
        try {
          a.getRevisionsRevisionIdApplicationsIds(null, null, (data, error) => {
            try {
              const displayE = 'revisionId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getRevisionsRevisionIdApplicationsIds', displayE);
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
      it('should error if - missing ids', (done) => {
        try {
          a.getRevisionsRevisionIdApplicationsIds('fakeparam', null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getRevisionsRevisionIdApplicationsIds', displayE);
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
      it('should have a determineIfChangesBetweenTwoRevisionsAreAuthorized function', (done) => {
        try {
          assert.equal(true, typeof a.determineIfChangesBetweenTwoRevisionsAreAuthorized === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#compareRevisionsOnTwoDifferentDevicesInTermsOfTraffic - errors', () => {
      it('should have a compareRevisionsOnTwoDifferentDevicesInTermsOfTraffic function', (done) => {
        try {
          assert.equal(true, typeof a.compareRevisionsOnTwoDifferentDevicesInTermsOfTraffic === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.compareRevisionsOnTwoDifferentDevicesInTermsOfTraffic(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-compareRevisionsOnTwoDifferentDevicesInTermsOfTraffic', displayE);
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
      it('should have a getNameAndStatusForAllChangeWindows function', (done) => {
        try {
          assert.equal(true, typeof a.getNameAndStatusForAllChangeWindows === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSchedulingAndDeviceDetailsForASpecificChangeWindow - errors', () => {
      it('should have a getSchedulingAndDeviceDetailsForASpecificChangeWindow function', (done) => {
        try {
          assert.equal(true, typeof a.getSchedulingAndDeviceDetailsForASpecificChangeWindow === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing uid', (done) => {
        try {
          a.getSchedulingAndDeviceDetailsForASpecificChangeWindow(null, null, (data, error) => {
            try {
              const displayE = 'uid is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSchedulingAndDeviceDetailsForASpecificChangeWindow', displayE);
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
      it('should error if - missing taskId', (done) => {
        try {
          a.getSchedulingAndDeviceDetailsForASpecificChangeWindow('fakeparam', null, (data, error) => {
            try {
              const displayE = 'taskId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSchedulingAndDeviceDetailsForASpecificChangeWindow', displayE);
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

    describe('#getAListOfCompletedPolicyChangesForASpecificChangeWindow - errors', () => {
      it('should have a getAListOfCompletedPolicyChangesForASpecificChangeWindow function', (done) => {
        try {
          assert.equal(true, typeof a.getAListOfCompletedPolicyChangesForASpecificChangeWindow === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing uid', (done) => {
        try {
          a.getAListOfCompletedPolicyChangesForASpecificChangeWindow(null, (data, error) => {
            try {
              const displayE = 'uid is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getAListOfCompletedPolicyChangesForASpecificChangeWindow', displayE);
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
      it('should have a getNetworkInterfacesByDevice function', (done) => {
        try {
          assert.equal(true, typeof a.getNetworkInterfacesByDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getNetworkInterfacesByDevice(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getNetworkInterfacesByDevice', displayE);
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
      it('should have a getNetworkInterfacesByRevision function', (done) => {
        try {
          assert.equal(true, typeof a.getNetworkInterfacesByRevision === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getNetworkInterfacesByRevision(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getNetworkInterfacesByRevision', displayE);
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
      it('should have a getDeviceZonesByRevision function', (done) => {
        try {
          assert.equal(true, typeof a.getDeviceZonesByRevision === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getDeviceZonesByRevision(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getDeviceZonesByRevision', displayE);
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
      it('should have a getDeviceZonesByDevice function', (done) => {
        try {
          assert.equal(true, typeof a.getDeviceZonesByDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getDeviceZonesByDevice(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getDeviceZonesByDevice', displayE);
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

    describe('#getZonesAndNetworkInterfacesThatParticipateInSubPolicies - errors', () => {
      it('should have a getZonesAndNetworkInterfacesThatParticipateInSubPolicies function', (done) => {
        try {
          assert.equal(true, typeof a.getZonesAndNetworkInterfacesThatParticipateInSubPolicies === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getZonesAndNetworkInterfacesThatParticipateInSubPolicies(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getZonesAndNetworkInterfacesThatParticipateInSubPolicies', displayE);
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
      it('should have a getDomain function', (done) => {
        try {
          assert.equal(true, typeof a.getDomain === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getDomain(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getDomain', displayE);
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

    describe('#updateADomain - errors', () => {
      it('should have a updateADomain function', (done) => {
        try {
          assert.equal(true, typeof a.updateADomain === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.updateADomain(null, null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-updateADomain', displayE);
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
      it('should error if - missing id', (done) => {
        try {
          a.updateADomain('fakeparam', null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-updateADomain', displayE);
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

    describe('#addADomain - errors', () => {
      it('should have a addADomain function', (done) => {
        try {
          assert.equal(true, typeof a.addADomain === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.addADomain(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-addADomain', displayE);
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
      it('should have a getAllDomains function', (done) => {
        try {
          assert.equal(true, typeof a.getAllDomains === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getGeneralProperties - errors', () => {
      it('should have a getGeneralProperties function', (done) => {
        try {
          assert.equal(true, typeof a.getGeneralProperties === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getCiscoCryptographicMapsByRevision - errors', () => {
      it('should have a getCiscoCryptographicMapsByRevision function', (done) => {
        try {
          assert.equal(true, typeof a.getCiscoCryptographicMapsByRevision === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getCiscoCryptographicMapsByRevision(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getCiscoCryptographicMapsByRevision', displayE);
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
      it('should have a getCiscoIPsecPolicyAndPeers function', (done) => {
        try {
          assert.equal(true, typeof a.getCiscoIPsecPolicyAndPeers === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getCiscoIPsecPolicyAndPeers(null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getCiscoIPsecPolicyAndPeers', displayE);
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

    describe('#getCheckPointVPNIPSecCommunitiesAndGateways - errors', () => {
      it('should have a getCheckPointVPNIPSecCommunitiesAndGateways function', (done) => {
        try {
          assert.equal(true, typeof a.getCheckPointVPNIPSecCommunitiesAndGateways === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getCheckPointVPNIPSecCommunitiesAndGateways(null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getCheckPointVPNIPSecCommunitiesAndGateways', displayE);
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

    describe('#getCiscoCryptographicMapsByDevice - errors', () => {
      it('should have a getCiscoCryptographicMapsByDevice function', (done) => {
        try {
          assert.equal(true, typeof a.getCiscoCryptographicMapsByDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getCiscoCryptographicMapsByDevice(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getCiscoCryptographicMapsByDevice', displayE);
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
      it('should have a getResolvedInternetRepresentationForDevice function', (done) => {
        try {
          assert.equal(true, typeof a.getResolvedInternetRepresentationForDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getResolvedInternetRepresentationForDevice(null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getResolvedInternetRepresentationForDevice', displayE);
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

    describe('#createNewInternetRepresentationForADevice - errors', () => {
      it('should have a createNewInternetRepresentationForADevice function', (done) => {
        try {
          assert.equal(true, typeof a.createNewInternetRepresentationForADevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.createNewInternetRepresentationForADevice(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-createNewInternetRepresentationForADevice', displayE);
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
      it('should have a deleteInternetRepresentationForDevice function', (done) => {
        try {
          assert.equal(true, typeof a.deleteInternetRepresentationForDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.deleteInternetRepresentationForDevice(null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteInternetRepresentationForDevice', displayE);
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

    describe('#updateInternetRepresentationForDevice - errors', () => {
      it('should have a updateInternetRepresentationForDevice function', (done) => {
        try {
          assert.equal(true, typeof a.updateInternetRepresentationForDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.updateInternetRepresentationForDevice(null, null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-updateInternetRepresentationForDevice', displayE);
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
      it('should error if - missing deviceId', (done) => {
        try {
          a.updateInternetRepresentationForDevice('fakeparam', null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-updateInternetRepresentationForDevice', displayE);
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
      it('should have a getInternetRepresentationForDevice function', (done) => {
        try {
          assert.equal(true, typeof a.getInternetRepresentationForDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getInternetRepresentationForDevice(null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getInternetRepresentationForDevice', displayE);
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
      it('should have a getLDAPEntryDetailsByDN function', (done) => {
        try {
          assert.equal(true, typeof a.getLDAPEntryDetailsByDN === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#returnEntriesThatExactlyMatchOneOfTheGivenStrings - errors', () => {
      it('should have a returnEntriesThatExactlyMatchOneOfTheGivenStrings function', (done) => {
        try {
          assert.equal(true, typeof a.returnEntriesThatExactlyMatchOneOfTheGivenStrings === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.returnEntriesThatExactlyMatchOneOfTheGivenStrings(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-returnEntriesThatExactlyMatchOneOfTheGivenStrings', displayE);
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
      it('should have a getTheBaseDNEntryDetails function', (done) => {
        try {
          assert.equal(true, typeof a.getTheBaseDNEntryDetails === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#returnLDAPEntriesWhichMatchTheGivenSearchCriteria - errors', () => {
      it('should have a returnLDAPEntriesWhichMatchTheGivenSearchCriteria function', (done) => {
        try {
          assert.equal(true, typeof a.returnLDAPEntriesWhichMatchTheGivenSearchCriteria === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.returnLDAPEntriesWhichMatchTheGivenSearchCriteria(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-returnLDAPEntriesWhichMatchTheGivenSearchCriteria', displayE);
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
      it('should have a getTextualConfigurationByRevision function', (done) => {
        try {
          assert.equal(true, typeof a.getTextualConfigurationByRevision === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getTextualConfigurationByRevision(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getTextualConfigurationByRevision', displayE);
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

    describe('#importManagedDevices - errors', () => {
      it('should have a importManagedDevices function', (done) => {
        try {
          assert.equal(true, typeof a.importManagedDevices === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.importManagedDevices(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-importManagedDevices', displayE);
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
      it('should have a editSecuretrackDevice function', (done) => {
        try {
          assert.equal(true, typeof a.editSecuretrackDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#addDevicesToSecureTrack - errors', () => {
      it('should have a addDevicesToSecureTrack function', (done) => {
        try {
          assert.equal(true, typeof a.addDevicesToSecureTrack === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.addDevicesToSecureTrack(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-addDevicesToSecureTrack', displayE);
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

    describe('#getSpecificTaskResultsOfBulkOperationsOnDevices - errors', () => {
      it('should have a getSpecificTaskResultsOfBulkOperationsOnDevices function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificTaskResultsOfBulkOperationsOnDevices === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing taskUid', (done) => {
        try {
          a.getSpecificTaskResultsOfBulkOperationsOnDevices(null, (data, error) => {
            try {
              const displayE = 'taskUid is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificTaskResultsOfBulkOperationsOnDevices', displayE);
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

    describe('#addConfigurationForOfflineDevice - errors', () => {
      it('should have a addConfigurationForOfflineDevice function', (done) => {
        try {
          assert.equal(true, typeof a.addConfigurationForOfflineDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.addConfigurationForOfflineDevice(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-addConfigurationForOfflineDevice', displayE);
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

    describe('#getSpecificDevice - errors', () => {
      it('should have a getSpecificDevice function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getSpecificDevice(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificDevice', displayE);
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

    describe('#updateOfflineDevice - errors', () => {
      it('should have a updateOfflineDevice function', (done) => {
        try {
          assert.equal(true, typeof a.updateOfflineDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.updateOfflineDevice(null, null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-updateOfflineDevice', displayE);
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
      it('should error if - missing deviceId', (done) => {
        try {
          a.updateOfflineDevice('fakeparam', null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-updateOfflineDevice', displayE);
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
      it('should have a getDevices function', (done) => {
        try {
          assert.equal(true, typeof a.getDevices === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#addOfflineDevice - errors', () => {
      it('should have a addOfflineDevice function', (done) => {
        try {
          assert.equal(true, typeof a.addOfflineDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.addOfflineDevice(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-addOfflineDevice', displayE);
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
      it('should have a getTextualConfigurationByDevice function', (done) => {
        try {
          assert.equal(true, typeof a.getTextualConfigurationByDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getTextualConfigurationByDevice(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getTextualConfigurationByDevice', displayE);
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

    describe('#getNATObjectsByDevice - errors', () => {
      it('should have a getNATObjectsByDevice function', (done) => {
        try {
          assert.equal(true, typeof a.getNATObjectsByDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getNATObjectsByDevice(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getNATObjectsByDevice', displayE);
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
      it('should have a getNATObjectsByRevision function', (done) => {
        try {
          assert.equal(true, typeof a.getNATObjectsByRevision === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getNATObjectsByRevision(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getNATObjectsByRevision', displayE);
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
      it('should have a getNATRulesByDevice function', (done) => {
        try {
          assert.equal(true, typeof a.getNATRulesByDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getNATRulesByDevice(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getNATRulesByDevice', displayE);
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
      it('should have a getNetworkGroupsContainingSpecifiedNetworkObject function', (done) => {
        try {
          assert.equal(true, typeof a.getNetworkGroupsContainingSpecifiedNetworkObject === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getNetworkGroupsContainingSpecifiedNetworkObject(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getNetworkGroupsContainingSpecifiedNetworkObject', displayE);
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

    describe('#getSpecificNetworkObjectsByRevision - errors', () => {
      it('should have a getSpecificNetworkObjectsByRevision function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificNetworkObjectsByRevision === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing revisionId', (done) => {
        try {
          a.getSpecificNetworkObjectsByRevision(null, null, (data, error) => {
            try {
              const displayE = 'revisionId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificNetworkObjectsByRevision', displayE);
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
      it('should error if - missing ids', (done) => {
        try {
          a.getSpecificNetworkObjectsByRevision('fakeparam', null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificNetworkObjectsByRevision', displayE);
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

    describe('#getSpecificNetworkObject - errors', () => {
      it('should have a getSpecificNetworkObject function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificNetworkObject === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getSpecificNetworkObject(null, null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificNetworkObject', displayE);
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
      it('should error if - missing ids', (done) => {
        try {
          a.getSpecificNetworkObject('fakeparam', null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificNetworkObject', displayE);
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
      it('should have a getNetworkObjectsByRevision function', (done) => {
        try {
          assert.equal(true, typeof a.getNetworkObjectsByRevision === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getNetworkObjectsByRevision(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getNetworkObjectsByRevision', displayE);
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
      it('should have a getNetworkObjectsMatchingSpecifiedCriteria function', (done) => {
        try {
          assert.equal(true, typeof a.getNetworkObjectsMatchingSpecifiedCriteria === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getRulesContainingSpecifiedNetworkObject - errors', () => {
      it('should have a getRulesContainingSpecifiedNetworkObject function', (done) => {
        try {
          assert.equal(true, typeof a.getRulesContainingSpecifiedNetworkObject === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getRulesContainingSpecifiedNetworkObject(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getRulesContainingSpecifiedNetworkObject', displayE);
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

    describe('#getNetworkObjectsByDevice - errors', () => {
      it('should have a getNetworkObjectsByDevice function', (done) => {
        try {
          assert.equal(true, typeof a.getNetworkObjectsByDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getNetworkObjectsByDevice(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getNetworkObjectsByDevice', displayE);
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
      it('should have a getSpecificTopologyCloud function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificTopologyCloud === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getSpecificTopologyCloud(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificTopologyCloud', displayE);
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

    describe('#updateACloud - errors', () => {
      it('should have a updateACloud function', (done) => {
        try {
          assert.equal(true, typeof a.updateACloud === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.updateACloud(null, null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-updateACloud', displayE);
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
      it('should error if - missing id', (done) => {
        try {
          a.updateACloud('fakeparam', null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-updateACloud', displayE);
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
      it('should have a getTopologySubnets function', (done) => {
        try {
          assert.equal(true, typeof a.getTopologySubnets === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getTopologyNetworkInterfacesByDevice - errors', () => {
      it('should have a getTopologyNetworkInterfacesByDevice function', (done) => {
        try {
          assert.equal(true, typeof a.getTopologyNetworkInterfacesByDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getMostSpecificNetworkInterfacesFromWhichAHostIPIsAccessible - errors', () => {
      it('should have a getMostSpecificNetworkInterfacesFromWhichAHostIPIsAccessible function', (done) => {
        try {
          assert.equal(true, typeof a.getMostSpecificNetworkInterfacesFromWhichAHostIPIsAccessible === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSpecificTopologySubnet - errors', () => {
      it('should have a getSpecificTopologySubnet function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificTopologySubnet === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getSpecificTopologySubnet(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificTopologySubnet', displayE);
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
      it('should have a getTopologySynchronizationStatus function', (done) => {
        try {
          assert.equal(true, typeof a.getTopologySynchronizationStatus === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteGenericDeviceFromTopologyModel - errors', () => {
      it('should have a deleteGenericDeviceFromTopologyModel function', (done) => {
        try {
          assert.equal(true, typeof a.deleteGenericDeviceFromTopologyModel === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.deleteGenericDeviceFromTopologyModel(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteGenericDeviceFromTopologyModel', displayE);
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

    describe('#updateAnExistingGenericDeviceInTheTopologyModel - errors', () => {
      it('should have a updateAnExistingGenericDeviceInTheTopologyModel function', (done) => {
        try {
          assert.equal(true, typeof a.updateAnExistingGenericDeviceInTheTopologyModel === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.updateAnExistingGenericDeviceInTheTopologyModel(null, null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-updateAnExistingGenericDeviceInTheTopologyModel', displayE);
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
      it('should error if - missing id', (done) => {
        try {
          a.updateAnExistingGenericDeviceInTheTopologyModel('fakeparam', null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-updateAnExistingGenericDeviceInTheTopologyModel', displayE);
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
      it('should have a getCloudInternalNetworks function', (done) => {
        try {
          assert.equal(true, typeof a.getCloudInternalNetworks === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getCloudInternalNetworks(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getCloudInternalNetworks', displayE);
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

    describe('#getCloudInformation - errors', () => {
      it('should have a getCloudInformation function', (done) => {
        try {
          assert.equal(true, typeof a.getCloudInformation === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing cloudId', (done) => {
        try {
          a.getCloudInformation(null, (data, error) => {
            try {
              const displayE = 'cloudId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getCloudInformation', displayE);
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

    describe('#synchronizeTheTopologyModel - errors', () => {
      it('should have a synchronizeTheTopologyModel function', (done) => {
        try {
          assert.equal(true, typeof a.synchronizeTheTopologyModel === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.synchronizeTheTopologyModel(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-synchronizeTheTopologyModel', displayE);
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
      it('should have a getTopologyGenericVPNConnections function', (done) => {
        try {
          assert.equal(true, typeof a.getTopologyGenericVPNConnections === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getTopologyRoutingTablesForAGivenDevice - errors', () => {
      it('should have a getTopologyRoutingTablesForAGivenDevice function', (done) => {
        try {
          assert.equal(true, typeof a.getTopologyRoutingTablesForAGivenDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getTopologyCloudSuggestions - errors', () => {
      it('should have a getTopologyCloudSuggestions function', (done) => {
        try {
          assert.equal(true, typeof a.getTopologyCloudSuggestions === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#addGenericDeviceToTopologyModel - errors', () => {
      it('should have a addGenericDeviceToTopologyModel function', (done) => {
        try {
          assert.equal(true, typeof a.addGenericDeviceToTopologyModel === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.addGenericDeviceToTopologyModel(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-addGenericDeviceToTopologyModel', displayE);
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
      it('should have a getGenericDevicesThatAreConfiguredInST function', (done) => {
        try {
          assert.equal(true, typeof a.getGenericDevicesThatAreConfiguredInST === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getPathImageForSpecifiedTraffic - errors', () => {
      it('should have a getPathImageForSpecifiedTraffic function', (done) => {
        try {
          assert.equal(true, typeof a.getPathImageForSpecifiedTraffic === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getPathForSpecifiedTraffic - errors', () => {
      it('should have a getPathForSpecifiedTraffic function', (done) => {
        try {
          assert.equal(true, typeof a.getPathForSpecifiedTraffic === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createAJoinedTopologyCloud - errors', () => {
      it('should have a createAJoinedTopologyCloud function', (done) => {
        try {
          assert.equal(true, typeof a.createAJoinedTopologyCloud === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.createAJoinedTopologyCloud(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-createAJoinedTopologyCloud', displayE);
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
      it('should have a getTopologyClouds function', (done) => {
        try {
          assert.equal(true, typeof a.getTopologyClouds === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getASpecificZonePatternEntryForASpecificZone - errors', () => {
      it('should have a getASpecificZonePatternEntryForASpecificZone function', (done) => {
        try {
          assert.equal(true, typeof a.getASpecificZonePatternEntryForASpecificZone === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing zoneId', (done) => {
        try {
          a.getASpecificZonePatternEntryForASpecificZone(null, null, (data, error) => {
            try {
              const displayE = 'zoneId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getASpecificZonePatternEntryForASpecificZone', displayE);
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
      it('should error if - missing id', (done) => {
        try {
          a.getASpecificZonePatternEntryForASpecificZone('fakeparam', null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getASpecificZonePatternEntryForASpecificZone', displayE);
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

    describe('#createAZonePatternEntryInASpecificZone - errors', () => {
      it('should have a createAZonePatternEntryInASpecificZone function', (done) => {
        try {
          assert.equal(true, typeof a.createAZonePatternEntryInASpecificZone === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.createAZonePatternEntryInASpecificZone(null, null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-createAZonePatternEntryInASpecificZone', displayE);
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
      it('should error if - missing zoneId', (done) => {
        try {
          a.createAZonePatternEntryInASpecificZone('fakeparam', null, (data, error) => {
            try {
              const displayE = 'zoneId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-createAZonePatternEntryInASpecificZone', displayE);
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

    describe('#getAllPatternEntriesForSpecificZones - errors', () => {
      it('should have a getAllPatternEntriesForSpecificZones function', (done) => {
        try {
          assert.equal(true, typeof a.getAllPatternEntriesForSpecificZones === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing ids', (done) => {
        try {
          a.getAllPatternEntriesForSpecificZones(null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getAllPatternEntriesForSpecificZones', displayE);
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
      it('should have a getASpecificZoneEntry function', (done) => {
        try {
          assert.equal(true, typeof a.getASpecificZoneEntry === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing zoneId', (done) => {
        try {
          a.getASpecificZoneEntry(null, null, (data, error) => {
            try {
              const displayE = 'zoneId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getASpecificZoneEntry', displayE);
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
      it('should error if - missing id', (done) => {
        try {
          a.getASpecificZoneEntry('fakeparam', null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getASpecificZoneEntry', displayE);
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
      it('should have a deleteZoneEntries function', (done) => {
        try {
          assert.equal(true, typeof a.deleteZoneEntries === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing zoneId', (done) => {
        try {
          a.deleteZoneEntries(null, null, (data, error) => {
            try {
              const displayE = 'zoneId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteZoneEntries', displayE);
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
      it('should error if - missing id', (done) => {
        try {
          a.deleteZoneEntries('fakeparam', null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteZoneEntries', displayE);
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

    describe('#modifyAZoneEntry - errors', () => {
      it('should have a modifyAZoneEntry function', (done) => {
        try {
          assert.equal(true, typeof a.modifyAZoneEntry === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.modifyAZoneEntry(null, null, null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-modifyAZoneEntry', displayE);
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
      it('should error if - missing zoneId', (done) => {
        try {
          a.modifyAZoneEntry('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'zoneId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-modifyAZoneEntry', displayE);
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
      it('should error if - missing id', (done) => {
        try {
          a.modifyAZoneEntry('fakeparam', 'fakeparam', null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-modifyAZoneEntry', displayE);
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

    describe('#modifyMultipleExistingZoneEntries - errors', () => {
      it('should have a modifyMultipleExistingZoneEntries function', (done) => {
        try {
          assert.equal(true, typeof a.modifyMultipleExistingZoneEntries === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.modifyMultipleExistingZoneEntries(null, null, null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-modifyMultipleExistingZoneEntries', displayE);
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
      it('should error if - missing zoneIds', (done) => {
        try {
          a.modifyMultipleExistingZoneEntries('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'zoneIds is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-modifyMultipleExistingZoneEntries', displayE);
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
      it('should error if - missing ids', (done) => {
        try {
          a.modifyMultipleExistingZoneEntries('fakeparam', 'fakeparam', null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-modifyMultipleExistingZoneEntries', displayE);
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
      it('should have a deleteZonesZoneIdsEntriesIds function', (done) => {
        try {
          assert.equal(true, typeof a.deleteZonesZoneIdsEntriesIds === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing zoneIds', (done) => {
        try {
          a.deleteZonesZoneIdsEntriesIds(null, null, (data, error) => {
            try {
              const displayE = 'zoneIds is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteZonesZoneIdsEntriesIds', displayE);
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
      it('should error if - missing ids', (done) => {
        try {
          a.deleteZonesZoneIdsEntriesIds('fakeparam', null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteZonesZoneIdsEntriesIds', displayE);
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

    describe('#createAZoneEntry - errors', () => {
      it('should have a createAZoneEntry function', (done) => {
        try {
          assert.equal(true, typeof a.createAZoneEntry === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.createAZoneEntry(null, null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-createAZoneEntry', displayE);
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
      it('should error if - missing zoneId', (done) => {
        try {
          a.createAZoneEntry('fakeparam', null, (data, error) => {
            try {
              const displayE = 'zoneId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-createAZoneEntry', displayE);
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

    describe('#getEntriesForAZone - errors', () => {
      it('should have a getEntriesForAZone function', (done) => {
        try {
          assert.equal(true, typeof a.getEntriesForAZone === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing ids', (done) => {
        try {
          a.getEntriesForAZone(null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getEntriesForAZone', displayE);
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

    describe('#importAZone - errors', () => {
      it('should have a importAZone function', (done) => {
        try {
          assert.equal(true, typeof a.importAZone === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.importAZone(null, null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-importAZone', displayE);
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
      it('should error if - missing ids', (done) => {
        try {
          a.importAZone('fakeparam', null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-importAZone', displayE);
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
      it('should have a getConfigurationUsagesForAZone function', (done) => {
        try {
          assert.equal(true, typeof a.getConfigurationUsagesForAZone === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing ids', (done) => {
        try {
          a.getConfigurationUsagesForAZone(null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getConfigurationUsagesForAZone', displayE);
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
      it('should have a removeAZoneAsAnDescendantsToAZone function', (done) => {
        try {
          assert.equal(true, typeof a.removeAZoneAsAnDescendantsToAZone === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing parentId', (done) => {
        try {
          a.removeAZoneAsAnDescendantsToAZone(null, null, (data, error) => {
            try {
              const displayE = 'parentId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-removeAZoneAsAnDescendantsToAZone', displayE);
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
      it('should error if - missing childIds', (done) => {
        try {
          a.removeAZoneAsAnDescendantsToAZone('fakeparam', null, (data, error) => {
            try {
              const displayE = 'childIds is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-removeAZoneAsAnDescendantsToAZone', displayE);
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

    describe('#addAZoneAsADescendantToAZone - errors', () => {
      it('should have a addAZoneAsADescendantToAZone function', (done) => {
        try {
          assert.equal(true, typeof a.addAZoneAsADescendantToAZone === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.addAZoneAsADescendantToAZone(null, null, null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-addAZoneAsADescendantToAZone', displayE);
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
      it('should error if - missing parentId', (done) => {
        try {
          a.addAZoneAsADescendantToAZone('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'parentId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-addAZoneAsADescendantToAZone', displayE);
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
      it('should error if - missing childIds', (done) => {
        try {
          a.addAZoneAsADescendantToAZone('fakeparam', 'fakeparam', null, (data, error) => {
            try {
              const displayE = 'childIds is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-addAZoneAsADescendantToAZone', displayE);
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

    describe('#createAZone - errors', () => {
      it('should have a createAZone function', (done) => {
        try {
          assert.equal(true, typeof a.createAZone === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.createAZone(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-createAZone', displayE);
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
      it('should have a getAllZones function', (done) => {
        try {
          assert.equal(true, typeof a.getAllZones === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteAllZones - errors', () => {
      it('should have a deleteAllZones function', (done) => {
        try {
          assert.equal(true, typeof a.deleteAllZones === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSharedZones - errors', () => {
      it('should have a getSharedZones function', (done) => {
        try {
          assert.equal(true, typeof a.getSharedZones === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteAZone - errors', () => {
      it('should have a deleteAZone function', (done) => {
        try {
          assert.equal(true, typeof a.deleteAZone === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing ids', (done) => {
        try {
          a.deleteAZone(null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteAZone', displayE);
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

    describe('#addAZoneAsAnAncestorToAZone - errors', () => {
      it('should have a addAZoneAsAnAncestorToAZone function', (done) => {
        try {
          assert.equal(true, typeof a.addAZoneAsAnAncestorToAZone === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.addAZoneAsAnAncestorToAZone(null, null, null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-addAZoneAsAnAncestorToAZone', displayE);
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
      it('should error if - missing childId', (done) => {
        try {
          a.addAZoneAsAnAncestorToAZone('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'childId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-addAZoneAsAnAncestorToAZone', displayE);
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
      it('should error if - missing parentIds', (done) => {
        try {
          a.addAZoneAsAnAncestorToAZone('fakeparam', 'fakeparam', null, (data, error) => {
            try {
              const displayE = 'parentIds is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-addAZoneAsAnAncestorToAZone', displayE);
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
      it('should have a removeAZoneAsAnAncestorToAZone function', (done) => {
        try {
          assert.equal(true, typeof a.removeAZoneAsAnAncestorToAZone === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing childId', (done) => {
        try {
          a.removeAZoneAsAnAncestorToAZone(null, null, (data, error) => {
            try {
              const displayE = 'childId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-removeAZoneAsAnAncestorToAZone', displayE);
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
      it('should error if - missing parentIds', (done) => {
        try {
          a.removeAZoneAsAnAncestorToAZone('fakeparam', null, (data, error) => {
            try {
              const displayE = 'parentIds is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-removeAZoneAsAnAncestorToAZone', displayE);
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

    describe('#modifyAZone - errors', () => {
      it('should have a modifyAZone function', (done) => {
        try {
          assert.equal(true, typeof a.modifyAZone === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.modifyAZone(null, null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-modifyAZone', displayE);
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
      it('should error if - missing id', (done) => {
        try {
          a.modifyAZone('fakeparam', null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-modifyAZone', displayE);
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
      it('should have a getASpecificZone function', (done) => {
        try {
          assert.equal(true, typeof a.getASpecificZone === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getASpecificZone(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getASpecificZone', displayE);
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
      it('should have a getAncestorZonesForAZone function', (done) => {
        try {
          assert.equal(true, typeof a.getAncestorZonesForAZone === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing ids', (done) => {
        try {
          a.getAncestorZonesForAZone(null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getAncestorZonesForAZone', displayE);
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
      it('should have a getDescendantZonesForAZone function', (done) => {
        try {
          assert.equal(true, typeof a.getDescendantZonesForAZone === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing ids', (done) => {
        try {
          a.getDescendantZonesForAZone(null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getDescendantZonesForAZone', displayE);
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

    describe('#mapNetworkElementsToSecurityZones - errors', () => {
      it('should have a mapNetworkElementsToSecurityZones function', (done) => {
        try {
          assert.equal(true, typeof a.mapNetworkElementsToSecurityZones === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.mapNetworkElementsToSecurityZones(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-mapNetworkElementsToSecurityZones', displayE);
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

    describe('#getListOfSubPoliciesBindingsWithInputAndOrOutputInterfaces - errors', () => {
      it('should have a getListOfSubPoliciesBindingsWithInputAndOrOutputInterfaces function', (done) => {
        try {
          assert.equal(true, typeof a.getListOfSubPoliciesBindingsWithInputAndOrOutputInterfaces === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getListOfSubPoliciesBindingsWithInputAndOrOutputInterfaces(null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getListOfSubPoliciesBindingsWithInputAndOrOutputInterfaces', displayE);
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
      it('should have a getPoliciesByRevision function', (done) => {
        try {
          assert.equal(true, typeof a.getPoliciesByRevision === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getPoliciesByRevision(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getPoliciesByRevision', displayE);
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

    describe('#getSubPoliciesBindingsByDevice - errors', () => {
      it('should have a getSubPoliciesBindingsByDevice function', (done) => {
        try {
          assert.equal(true, typeof a.getSubPoliciesBindingsByDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getSubPoliciesBindingsByDevice(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSubPoliciesBindingsByDevice', displayE);
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
      it('should have a getRulesByInputAndOutputInterfaces function', (done) => {
        try {
          assert.equal(true, typeof a.getRulesByInputAndOutputInterfaces === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getRulesByInputAndOutputInterfaces(null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getRulesByInputAndOutputInterfaces', displayE);
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
      it('should have a getSubPoliciesBindingsByRevision function', (done) => {
        try {
          assert.equal(true, typeof a.getSubPoliciesBindingsByRevision === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getSubPoliciesBindingsByRevision(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSubPoliciesBindingsByRevision', displayE);
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
      it('should have a getPoliciesByDevice function', (done) => {
        try {
          assert.equal(true, typeof a.getPoliciesByDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getPoliciesByDevice(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getPoliciesByDevice', displayE);
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
      it('should have a runPolicyAnalysisQuery function', (done) => {
        try {
          assert.equal(true, typeof a.runPolicyAnalysisQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteSpecificRuleDocumentation - errors', () => {
      it('should have a deleteSpecificRuleDocumentation function', (done) => {
        try {
          assert.equal(true, typeof a.deleteSpecificRuleDocumentation === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.deleteSpecificRuleDocumentation(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteSpecificRuleDocumentation', displayE);
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
      it('should error if - missing ruleId', (done) => {
        try {
          a.deleteSpecificRuleDocumentation('fakeparam', null, (data, error) => {
            try {
              const displayE = 'ruleId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteSpecificRuleDocumentation', displayE);
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
      it('should have a getSpecificRuleDocumentation function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificRuleDocumentation === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getSpecificRuleDocumentation(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificRuleDocumentation', displayE);
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
      it('should error if - missing ruleId', (done) => {
        try {
          a.getSpecificRuleDocumentation('fakeparam', null, (data, error) => {
            try {
              const displayE = 'ruleId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificRuleDocumentation', displayE);
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

    describe('#modifySpecificRuleDocumentation - errors', () => {
      it('should have a modifySpecificRuleDocumentation function', (done) => {
        try {
          assert.equal(true, typeof a.modifySpecificRuleDocumentation === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.modifySpecificRuleDocumentation(null, null, null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-modifySpecificRuleDocumentation', displayE);
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
      it('should error if - missing id', (done) => {
        try {
          a.modifySpecificRuleDocumentation('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-modifySpecificRuleDocumentation', displayE);
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
      it('should error if - missing ruleId', (done) => {
        try {
          a.modifySpecificRuleDocumentation('fakeparam', 'fakeparam', null, (data, error) => {
            try {
              const displayE = 'ruleId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-modifySpecificRuleDocumentation', displayE);
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

    describe('#putRevisionsIdRulesRuleIdDocumentation - errors', () => {
      it('should have a putRevisionsIdRulesRuleIdDocumentation function', (done) => {
        try {
          assert.equal(true, typeof a.putRevisionsIdRulesRuleIdDocumentation === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.putRevisionsIdRulesRuleIdDocumentation(null, null, null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-putRevisionsIdRulesRuleIdDocumentation', displayE);
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
      it('should error if - missing id', (done) => {
        try {
          a.putRevisionsIdRulesRuleIdDocumentation('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-putRevisionsIdRulesRuleIdDocumentation', displayE);
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
      it('should error if - missing ruleId', (done) => {
        try {
          a.putRevisionsIdRulesRuleIdDocumentation('fakeparam', 'fakeparam', null, (data, error) => {
            try {
              const displayE = 'ruleId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-putRevisionsIdRulesRuleIdDocumentation', displayE);
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
      it('should have a deleteRevisionsIdRulesRuleIdDocumentation function', (done) => {
        try {
          assert.equal(true, typeof a.deleteRevisionsIdRulesRuleIdDocumentation === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.deleteRevisionsIdRulesRuleIdDocumentation(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteRevisionsIdRulesRuleIdDocumentation', displayE);
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
      it('should error if - missing ruleId', (done) => {
        try {
          a.deleteRevisionsIdRulesRuleIdDocumentation('fakeparam', null, (data, error) => {
            try {
              const displayE = 'ruleId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteRevisionsIdRulesRuleIdDocumentation', displayE);
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
      it('should have a getRevisionsIdRulesRuleIdDocumentation function', (done) => {
        try {
          assert.equal(true, typeof a.getRevisionsIdRulesRuleIdDocumentation === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getRevisionsIdRulesRuleIdDocumentation(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getRevisionsIdRulesRuleIdDocumentation', displayE);
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
      it('should error if - missing ruleId', (done) => {
        try {
          a.getRevisionsIdRulesRuleIdDocumentation('fakeparam', null, (data, error) => {
            try {
              const displayE = 'ruleId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getRevisionsIdRulesRuleIdDocumentation', displayE);
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
      it('should have a getCleanupsResults function', (done) => {
        try {
          assert.equal(true, typeof a.getCleanupsResults === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getTheSpecificObjectsOrRulesIdentifiedForTheCleanupResults - errors', () => {
      it('should have a getTheSpecificObjectsOrRulesIdentifiedForTheCleanupResults function', (done) => {
        try {
          assert.equal(true, typeof a.getTheSpecificObjectsOrRulesIdentifiedForTheCleanupResults === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing cleanupId', (done) => {
        try {
          a.getTheSpecificObjectsOrRulesIdentifiedForTheCleanupResults(null, (data, error) => {
            try {
              const displayE = 'cleanupId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getTheSpecificObjectsOrRulesIdentifiedForTheCleanupResults', displayE);
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
      it('should have a getTheSpecificObjectsOrRulesIdentifiedForTheRiskResults function', (done) => {
        try {
          assert.equal(true, typeof a.getTheSpecificObjectsOrRulesIdentifiedForTheRiskResults === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing riskId', (done) => {
        try {
          a.getTheSpecificObjectsOrRulesIdentifiedForTheRiskResults(null, (data, error) => {
            try {
              const displayE = 'riskId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getTheSpecificObjectsOrRulesIdentifiedForTheRiskResults', displayE);
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

    describe('#getCleanupsByDevice - errors', () => {
      it('should have a getCleanupsByDevice function', (done) => {
        try {
          assert.equal(true, typeof a.getCleanupsByDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getCleanupsByDevice(null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getCleanupsByDevice', displayE);
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

    describe('#getDevicesInRiskResults - errors', () => {
      it('should have a getDevicesInRiskResults function', (done) => {
        try {
          assert.equal(true, typeof a.getDevicesInRiskResults === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing riskId', (done) => {
        try {
          a.getDevicesInRiskResults(null, (data, error) => {
            try {
              const displayE = 'riskId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getDevicesInRiskResults', displayE);
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
      it('should have a getRisksResults function', (done) => {
        try {
          assert.equal(true, typeof a.getRisksResults === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getShadowingRulesByDevice - errors', () => {
      it('should have a getShadowingRulesByDevice function', (done) => {
        try {
          assert.equal(true, typeof a.getShadowingRulesByDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getShadowingRulesByDevice(null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getShadowingRulesByDevice', displayE);
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

    describe('#getDevicesInCleanupResults - errors', () => {
      it('should have a getDevicesInCleanupResults function', (done) => {
        try {
          assert.equal(true, typeof a.getDevicesInCleanupResults === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing cleanupId', (done) => {
        try {
          a.getDevicesInCleanupResults(null, (data, error) => {
            try {
              const displayE = 'cleanupId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getDevicesInCleanupResults', displayE);
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
      it('should have a getRevisionsByDevice function', (done) => {
        try {
          assert.equal(true, typeof a.getRevisionsByDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getRevisionsByDevice(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getRevisionsByDevice', displayE);
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

    describe('#getSpecificRevision - errors', () => {
      it('should have a getSpecificRevision function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificRevision === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing revId', (done) => {
        try {
          a.getSpecificRevision(null, (data, error) => {
            try {
              const displayE = 'revId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificRevision', displayE);
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

    describe('#getLatestRevisionByDevice - errors', () => {
      it('should have a getLatestRevisionByDevice function', (done) => {
        try {
          assert.equal(true, typeof a.getLatestRevisionByDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getLatestRevisionByDevice(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getLatestRevisionByDevice', displayE);
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
      it('should have a getLastHitsForAllRulesByDevice function', (done) => {
        try {
          assert.equal(true, typeof a.getLastHitsForAllRulesByDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getLastHitsForAllRulesByDevice(null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getLastHitsForAllRulesByDevice', displayE);
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

    describe('#getLastHitForASpecificRule - errors', () => {
      it('should have a getLastHitForASpecificRule function', (done) => {
        try {
          assert.equal(true, typeof a.getLastHitForASpecificRule === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getLastHitForASpecificRule(null, null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getLastHitForASpecificRule', displayE);
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
      it('should error if - missing ruleUid', (done) => {
        try {
          a.getLastHitForASpecificRule('fakeparam', null, (data, error) => {
            try {
              const displayE = 'ruleUid is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getLastHitForASpecificRule', displayE);
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

    describe('#getASpecificRule - errors', () => {
      it('should have a getASpecificRule function', (done) => {
        try {
          assert.equal(true, typeof a.getASpecificRule === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing ruleId', (done) => {
        try {
          a.getASpecificRule(null, (data, error) => {
            try {
              const displayE = 'ruleId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getASpecificRule', displayE);
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

    describe('#getSpecificRule - errors', () => {
      it('should have a getSpecificRule function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificRule === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getSpecificRule(null, null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificRule', displayE);
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
      it('should error if - missing ids', (done) => {
        try {
          a.getSpecificRule('fakeparam', null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificRule', displayE);
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
      it('should have a getRuleCountPerDevice function', (done) => {
        try {
          assert.equal(true, typeof a.getRuleCountPerDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getRevisionsRevisionIdRulesIds - errors', () => {
      it('should have a getRevisionsRevisionIdRulesIds function', (done) => {
        try {
          assert.equal(true, typeof a.getRevisionsRevisionIdRulesIds === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing revisionId', (done) => {
        try {
          a.getRevisionsRevisionIdRulesIds(null, null, (data, error) => {
            try {
              const displayE = 'revisionId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getRevisionsRevisionIdRulesIds', displayE);
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
      it('should error if - missing ids', (done) => {
        try {
          a.getRevisionsRevisionIdRulesIds('fakeparam', null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getRevisionsRevisionIdRulesIds', displayE);
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
      it('should have a getRulesByRevision function', (done) => {
        try {
          assert.equal(true, typeof a.getRulesByRevision === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getRulesByRevision(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getRulesByRevision', displayE);
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
      it('should have a findRules function', (done) => {
        try {
          assert.equal(true, typeof a.findRules === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.findRules(null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-findRules', displayE);
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

    describe('#getRulesByDevice - errors', () => {
      it('should have a getRulesByDevice function', (done) => {
        try {
          assert.equal(true, typeof a.getRulesByDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getRulesByDevice(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getRulesByDevice', displayE);
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
      it('should have a getServiceGroupsContainingSpecifiedServiceObjects function', (done) => {
        try {
          assert.equal(true, typeof a.getServiceGroupsContainingSpecifiedServiceObjects === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getServiceGroupsContainingSpecifiedServiceObjects(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getServiceGroupsContainingSpecifiedServiceObjects', displayE);
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

    describe('#getSpecificService - errors', () => {
      it('should have a getSpecificService function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificService === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing revisionId', (done) => {
        try {
          a.getSpecificService(null, null, (data, error) => {
            try {
              const displayE = 'revisionId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificService', displayE);
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
      it('should error if - missing ids', (done) => {
        try {
          a.getSpecificService('fakeparam', null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificService', displayE);
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

    describe('#getDevicesDeviceIdServicesIds - errors', () => {
      it('should have a getDevicesDeviceIdServicesIds function', (done) => {
        try {
          assert.equal(true, typeof a.getDevicesDeviceIdServicesIds === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getDevicesDeviceIdServicesIds(null, null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getDevicesDeviceIdServicesIds', displayE);
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
      it('should error if - missing ids', (done) => {
        try {
          a.getDevicesDeviceIdServicesIds('fakeparam', null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getDevicesDeviceIdServicesIds', displayE);
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
      it('should have a getRulesContainingSpecifiedServiceObject function', (done) => {
        try {
          assert.equal(true, typeof a.getRulesContainingSpecifiedServiceObject === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getRulesContainingSpecifiedServiceObject(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getRulesContainingSpecifiedServiceObject', displayE);
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
      it('should have a getServicesByRevision function', (done) => {
        try {
          assert.equal(true, typeof a.getServicesByRevision === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getServicesByRevision(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getServicesByRevision', displayE);
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
      it('should have a getServicesObjectsMatchingSpecifiedCriteria function', (done) => {
        try {
          assert.equal(true, typeof a.getServicesObjectsMatchingSpecifiedCriteria === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getServicesByDevice - errors', () => {
      it('should have a getServicesByDevice function', (done) => {
        try {
          assert.equal(true, typeof a.getServicesByDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getServicesByDevice(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getServicesByDevice', displayE);
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
      it('should have a getTimeObjectsByRevision function', (done) => {
        try {
          assert.equal(true, typeof a.getTimeObjectsByRevision === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getTimeObjectsByRevision(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getTimeObjectsByRevision', displayE);
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

    describe('#getTimeObjectsByDevice - errors', () => {
      it('should have a getTimeObjectsByDevice function', (done) => {
        try {
          assert.equal(true, typeof a.getTimeObjectsByDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getTimeObjectsByDevice(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getTimeObjectsByDevice', displayE);
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

    describe('#getSpecificTimeObject - errors', () => {
      it('should have a getSpecificTimeObject function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificTimeObject === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing revisionId', (done) => {
        try {
          a.getSpecificTimeObject(null, null, (data, error) => {
            try {
              const displayE = 'revisionId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificTimeObject', displayE);
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
      it('should error if - missing ids', (done) => {
        try {
          a.getSpecificTimeObject('fakeparam', null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificTimeObject', displayE);
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

    describe('#getPolicyRelevanceMetricsForTraffic - errors', () => {
      it('should have a getPolicyRelevanceMetricsForTraffic function', (done) => {
        try {
          assert.equal(true, typeof a.getPolicyRelevanceMetricsForTraffic === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.getPolicyRelevanceMetricsForTraffic(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getPolicyRelevanceMetricsForTraffic', displayE);
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

    describe('#startATaskToCalculateViolationsForAnAccessRequest - errors', () => {
      it('should have a startATaskToCalculateViolationsForAnAccessRequest function', (done) => {
        try {
          assert.equal(true, typeof a.startATaskToCalculateViolationsForAnAccessRequest === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.startATaskToCalculateViolationsForAnAccessRequest(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-startATaskToCalculateViolationsForAnAccessRequest', displayE);
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

    describe('#getViolationTaskResults - errors', () => {
      it('should have a getViolationTaskResults function', (done) => {
        try {
          assert.equal(true, typeof a.getViolationTaskResults === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing taskId', (done) => {
        try {
          a.getViolationTaskResults(null, (data, error) => {
            try {
              const displayE = 'taskId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getViolationTaskResults', displayE);
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
      it('should have a getViolationTaskStatus function', (done) => {
        try {
          assert.equal(true, typeof a.getViolationTaskStatus === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing taskId', (done) => {
        try {
          a.getViolationTaskStatus(null, (data, error) => {
            try {
              const displayE = 'taskId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getViolationTaskStatus', displayE);
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
      it('should have a cancelViolationTask function', (done) => {
        try {
          assert.equal(true, typeof a.cancelViolationTask === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing taskId', (done) => {
        try {
          a.cancelViolationTask(null, (data, error) => {
            try {
              const displayE = 'taskId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-cancelViolationTask', displayE);
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

    describe('#getViolationsForAnAccessRequest - errors', () => {
      it('should have a getViolationsForAnAccessRequest function', (done) => {
        try {
          assert.equal(true, typeof a.getViolationsForAnAccessRequest === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.getViolationsForAnAccessRequest(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getViolationsForAnAccessRequest', displayE);
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

    describe('#deleteAlertsByIds - errors', () => {
      it('should have a deleteAlertsByIds function', (done) => {
        try {
          assert.equal(true, typeof a.deleteAlertsByIds === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing ids', (done) => {
        try {
          a.deleteAlertsByIds(null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteAlertsByIds', displayE);
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
      it('should have a getASpecificAlert function', (done) => {
        try {
          assert.equal(true, typeof a.getASpecificAlert === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getASpecificAlert(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getASpecificAlert', displayE);
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

    describe('#updateAnAlert - errors', () => {
      it('should have a updateAnAlert function', (done) => {
        try {
          assert.equal(true, typeof a.updateAnAlert === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.updateAnAlert(null, null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-updateAnAlert', displayE);
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
      it('should error if - missing id', (done) => {
        try {
          a.updateAnAlert('fakeparam', null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-updateAnAlert', displayE);
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

    describe('#createAnAlert - errors', () => {
      it('should have a createAnAlert function', (done) => {
        try {
          assert.equal(true, typeof a.createAnAlert === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.createAnAlert(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-createAnAlert', displayE);
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
      it('should have a getAlerts function', (done) => {
        try {
          assert.equal(true, typeof a.getAlerts === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteCloudTagPolicy - errors', () => {
      it('should have a deleteCloudTagPolicy function', (done) => {
        try {
          assert.equal(true, typeof a.deleteCloudTagPolicy === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing policyId', (done) => {
        try {
          a.deleteCloudTagPolicy(null, (data, error) => {
            try {
              const displayE = 'policyId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteCloudTagPolicy', displayE);
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

    describe('#replaceACloudTagPolicy - errors', () => {
      it('should have a replaceACloudTagPolicy function', (done) => {
        try {
          assert.equal(true, typeof a.replaceACloudTagPolicy === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.replaceACloudTagPolicy(null, null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-replaceACloudTagPolicy', displayE);
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
      it('should error if - missing policyId', (done) => {
        try {
          a.replaceACloudTagPolicy('fakeparam', null, (data, error) => {
            try {
              const displayE = 'policyId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-replaceACloudTagPolicy', displayE);
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
      it('should have a modifyACloudTagPolicy function', (done) => {
        try {
          assert.equal(true, typeof a.modifyACloudTagPolicy === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing policyId', (done) => {
        try {
          a.modifyACloudTagPolicy(null, (data, error) => {
            try {
              const displayE = 'policyId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-modifyACloudTagPolicy', displayE);
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
      it('should have a getCloudTagPolicy function', (done) => {
        try {
          assert.equal(true, typeof a.getCloudTagPolicy === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing policyId', (done) => {
        try {
          a.getCloudTagPolicy(null, (data, error) => {
            try {
              const displayE = 'policyId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getCloudTagPolicy', displayE);
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

    describe('#checkIfTagsAreCompliantWithCloudTagPolicies - errors', () => {
      it('should have a checkIfTagsAreCompliantWithCloudTagPolicies function', (done) => {
        try {
          assert.equal(true, typeof a.checkIfTagsAreCompliantWithCloudTagPolicies === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.checkIfTagsAreCompliantWithCloudTagPolicies(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-checkIfTagsAreCompliantWithCloudTagPolicies', displayE);
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
      it('should have a getAllCloudTagPolicies function', (done) => {
        try {
          assert.equal(true, typeof a.getAllCloudTagPolicies === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createACloudTagPolicy - errors', () => {
      it('should have a createACloudTagPolicy function', (done) => {
        try {
          assert.equal(true, typeof a.createACloudTagPolicy === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.createACloudTagPolicy(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-createACloudTagPolicy', displayE);
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
      it('should have a getAllCloudTagPolicyViolationsForAVPC function', (done) => {
        try {
          assert.equal(true, typeof a.getAllCloudTagPolicyViolationsForAVPC === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#startATaskToCalculateMatchingRulesForAnException - errors', () => {
      it('should have a startATaskToCalculateMatchingRulesForAnException function', (done) => {
        try {
          assert.equal(true, typeof a.startATaskToCalculateMatchingRulesForAnException === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.startATaskToCalculateMatchingRulesForAnException(null, null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-startATaskToCalculateMatchingRulesForAnException', displayE);
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
      it('should error if - missing exceptionId', (done) => {
        try {
          a.startATaskToCalculateMatchingRulesForAnException('fakeparam', null, (data, error) => {
            try {
              const displayE = 'exceptionId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-startATaskToCalculateMatchingRulesForAnException', displayE);
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
      it('should have a getMatchingRulesTaskStatus function', (done) => {
        try {
          assert.equal(true, typeof a.getMatchingRulesTaskStatus === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing taskId', (done) => {
        try {
          a.getMatchingRulesTaskStatus(null, (data, error) => {
            try {
              const displayE = 'taskId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getMatchingRulesTaskStatus', displayE);
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
      it('should have a deleteAnException function', (done) => {
        try {
          assert.equal(true, typeof a.deleteAnException === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing exceptionId', (done) => {
        try {
          a.deleteAnException(null, (data, error) => {
            try {
              const displayE = 'exceptionId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteAnException', displayE);
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
      it('should have a getASpecificException function', (done) => {
        try {
          assert.equal(true, typeof a.getASpecificException === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing exceptionId', (done) => {
        try {
          a.getASpecificException(null, (data, error) => {
            try {
              const displayE = 'exceptionId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getASpecificException', displayE);
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
      it('should have a cancelMatchingRulesTask function', (done) => {
        try {
          assert.equal(true, typeof a.cancelMatchingRulesTask === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing taskId', (done) => {
        try {
          a.cancelMatchingRulesTask(null, (data, error) => {
            try {
              const displayE = 'taskId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-cancelMatchingRulesTask', displayE);
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
      it('should have a getAllExceptions function', (done) => {
        try {
          assert.equal(true, typeof a.getAllExceptions === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createAnException - errors', () => {
      it('should have a createAnException function', (done) => {
        try {
          assert.equal(true, typeof a.createAnException === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.createAnException(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-createAnException', displayE);
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

    describe('#getMatchingRulesTaskResults - errors', () => {
      it('should have a getMatchingRulesTaskResults function', (done) => {
        try {
          assert.equal(true, typeof a.getMatchingRulesTaskResults === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing taskId', (done) => {
        try {
          a.getMatchingRulesTaskResults(null, (data, error) => {
            try {
              const displayE = 'taskId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getMatchingRulesTaskResults', displayE);
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
      it('should have a getGlobalUnifiedSecurityPolicies function', (done) => {
        try {
          assert.equal(true, typeof a.getGlobalUnifiedSecurityPolicies === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getUnifiedSecurityPolicies - errors', () => {
      it('should have a getUnifiedSecurityPolicies function', (done) => {
        try {
          assert.equal(true, typeof a.getUnifiedSecurityPolicies === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getUnifiedSecurityPolicyAsCSV - errors', () => {
      it('should have a getUnifiedSecurityPolicyAsCSV function', (done) => {
        try {
          assert.equal(true, typeof a.getUnifiedSecurityPolicyAsCSV === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getUnifiedSecurityPolicyAsCSV(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getUnifiedSecurityPolicyAsCSV', displayE);
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
      it('should have a deleteUnifiedSecurityPolicy function', (done) => {
        try {
          assert.equal(true, typeof a.deleteUnifiedSecurityPolicy === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.deleteUnifiedSecurityPolicy(null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteUnifiedSecurityPolicy', displayE);
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

    describe('#setManualDeviceMapping - errors', () => {
      it('should have a setManualDeviceMapping function', (done) => {
        try {
          assert.equal(true, typeof a.setManualDeviceMapping === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.setManualDeviceMapping(null, null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-setManualDeviceMapping', displayE);
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
      it('should error if - missing deviceId', (done) => {
        try {
          a.setManualDeviceMapping('fakeparam', null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-setManualDeviceMapping', displayE);
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

    describe('#getTheAmountOfViolatingRulesForTheSpecifiedDevice - errors', () => {
      it('should have a getTheAmountOfViolatingRulesForTheSpecifiedDevice function', (done) => {
        try {
          assert.equal(true, typeof a.getTheAmountOfViolatingRulesForTheSpecifiedDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getTheAmountOfViolatingRulesForTheSpecifiedDevice(null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getTheAmountOfViolatingRulesForTheSpecifiedDevice', displayE);
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
      it('should have a getTheViolatingRulesForTheSpecifiedDevice function', (done) => {
        try {
          assert.equal(true, typeof a.getTheViolatingRulesForTheSpecifiedDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getTheViolatingRulesForTheSpecifiedDevice(null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getTheViolatingRulesForTheSpecifiedDevice', displayE);
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
