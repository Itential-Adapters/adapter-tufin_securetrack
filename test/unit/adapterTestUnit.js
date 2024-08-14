/* @copyright Itential, LLC 2019 (pre-modifications) */

// Set globals
/* global describe it log pronghornProps */
/* eslint global-require: warn */
/* eslint no-unused-vars: warn */
/* eslint import/no-dynamic-require:warn */

// include required items for testing & logging
const assert = require('assert');
const path = require('path');
const util = require('util');
const execute = require('child_process').execSync;
const fs = require('fs-extra');
const mocha = require('mocha');
const winston = require('winston');
const { expect } = require('chai');
const { use } = require('chai');
const td = require('testdouble');
const Ajv = require('ajv');

const ajv = new Ajv({ strictSchema: false, allErrors: true, allowUnionTypes: true });
const anything = td.matchers.anything();
let logLevel = 'none';
const isRapidFail = false;

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
samProps.request.attempt_timeout = 1200000;
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
const TufinSecuretrack = require('../../adapter');

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
    describe('#iapGetAdapterWorkflowFunctions', () => {
      it('should retrieve workflow functions', (done) => {
        try {
          wffunctions = a.iapGetAdapterWorkflowFunctions([]);

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
          // Define the JSON schema for package.json
          const packageJsonSchema = {
            type: 'object',
            properties: {
              name: { type: 'string' },
              version: { type: 'string' }
              // May need to add more properties as needed
            },
            required: ['name', 'version']
          };
          const validate = ajv.compile(packageJsonSchema);
          const isValid = validate(packageDotJson);

          if (isValid === false) {
            log.error('The package.json contains errors');
            assert.equal(true, isValid);
          } else {
            assert.equal(true, isValid);
          }

          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('package.json standard fields should be customized', (done) => {
        try {
          const packageDotJson = require('../../package.json');
          assert.notEqual(-1, packageDotJson.name.indexOf('tufin_securetrack'));
          assert.notEqual(undefined, packageDotJson.version);
          assert.notEqual(null, packageDotJson.version);
          assert.notEqual('', packageDotJson.version);
          assert.notEqual(undefined, packageDotJson.description);
          assert.notEqual(null, packageDotJson.description);
          assert.notEqual('', packageDotJson.description);
          assert.equal('adapter.js', packageDotJson.main);
          assert.notEqual(undefined, packageDotJson.wizardVersion);
          assert.notEqual(null, packageDotJson.wizardVersion);
          assert.notEqual('', packageDotJson.wizardVersion);
          assert.notEqual(undefined, packageDotJson.engineVersion);
          assert.notEqual(null, packageDotJson.engineVersion);
          assert.notEqual('', packageDotJson.engineVersion);
          assert.equal('http', packageDotJson.adapterType);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('package.json proper scripts should be provided', (done) => {
        try {
          const packageDotJson = require('../../package.json');
          assert.notEqual(undefined, packageDotJson.scripts);
          assert.notEqual(null, packageDotJson.scripts);
          assert.notEqual('', packageDotJson.scripts);
          assert.equal('node utils/setup.js', packageDotJson.scripts.preinstall);
          assert.equal('node --max_old_space_size=4096 ./node_modules/eslint/bin/eslint.js . --ext .json --ext .js', packageDotJson.scripts.lint);
          assert.equal('node --max_old_space_size=4096 ./node_modules/eslint/bin/eslint.js . --ext .json --ext .js --quiet', packageDotJson.scripts['lint:errors']);
          assert.equal('mocha test/unit/adapterBaseTestUnit.js --LOG=error', packageDotJson.scripts['test:baseunit']);
          assert.equal('mocha test/unit/adapterTestUnit.js --LOG=error', packageDotJson.scripts['test:unit']);
          assert.equal('mocha test/integration/adapterTestIntegration.js --LOG=error', packageDotJson.scripts['test:integration']);
          assert.equal('npm run test:baseunit && npm run test:unit && npm run test:integration', packageDotJson.scripts.test);
          assert.equal('npm publish --registry=https://registry.npmjs.org --access=public', packageDotJson.scripts.deploy);
          assert.equal('npm run deploy', packageDotJson.scripts.build);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('package.json proper directories should be provided', (done) => {
        try {
          const packageDotJson = require('../../package.json');
          assert.notEqual(undefined, packageDotJson.repository);
          assert.notEqual(null, packageDotJson.repository);
          assert.notEqual('', packageDotJson.repository);
          assert.equal('git', packageDotJson.repository.type);
          assert.equal('git@gitlab.com:itentialopensource/adapters/', packageDotJson.repository.url.substring(0, 43));
          assert.equal('https://gitlab.com/itentialopensource/adapters/', packageDotJson.homepage.substring(0, 47));
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('package.json proper dependencies should be provided', (done) => {
        try {
          const packageDotJson = require('../../package.json');
          assert.notEqual(undefined, packageDotJson.dependencies);
          assert.notEqual(null, packageDotJson.dependencies);
          assert.notEqual('', packageDotJson.dependencies);
          assert.equal('^8.17.1', packageDotJson.dependencies.ajv);
          assert.equal('^1.7.4', packageDotJson.dependencies.axios);
          assert.equal('^11.0.0', packageDotJson.dependencies.commander);
          assert.equal('^11.2.0', packageDotJson.dependencies['fs-extra']);
          assert.equal('^10.7.3', packageDotJson.dependencies.mocha);
          assert.equal('^2.0.1', packageDotJson.dependencies['mocha-param']);
          assert.equal('^0.4.4', packageDotJson.dependencies.ping);
          assert.equal('^1.4.10', packageDotJson.dependencies['readline-sync']);
          assert.equal('^7.6.3', packageDotJson.dependencies.semver);
          assert.equal('^3.13.1', packageDotJson.dependencies.winston);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('package.json proper dev dependencies should be provided', (done) => {
        try {
          const packageDotJson = require('../../package.json');
          assert.notEqual(undefined, packageDotJson.devDependencies);
          assert.notEqual(null, packageDotJson.devDependencies);
          assert.notEqual('', packageDotJson.devDependencies);
          assert.equal('^4.3.7', packageDotJson.devDependencies.chai);
          assert.equal('^8.44.0', packageDotJson.devDependencies.eslint);
          assert.equal('^15.0.0', packageDotJson.devDependencies['eslint-config-airbnb-base']);
          assert.equal('^2.27.5', packageDotJson.devDependencies['eslint-plugin-import']);
          assert.equal('^3.1.0', packageDotJson.devDependencies['eslint-plugin-json']);
          assert.equal('^3.18.0', packageDotJson.devDependencies.testdouble);
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
          assert.equal('Adapter', pronghornDotJson.type);
          assert.equal('TufinSecuretrack', pronghornDotJson.export);
          assert.equal('Tufin_securetrack', pronghornDotJson.title);
          assert.equal('adapter.js', pronghornDotJson.src);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('pronghorn.json should contain generic adapter methods', (done) => {
        try {
          const pronghornDotJson = require('../../pronghorn.json');
          assert.notEqual(undefined, pronghornDotJson.methods);
          assert.notEqual(null, pronghornDotJson.methods);
          assert.notEqual('', pronghornDotJson.methods);
          assert.equal(true, Array.isArray(pronghornDotJson.methods));
          assert.notEqual(0, pronghornDotJson.methods.length);
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapUpdateAdapterConfiguration'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapSuspendAdapter'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapUnsuspendAdapter'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapGetAdapterQueue'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapFindAdapterPath'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapTroubleshootAdapter'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapRunAdapterHealthcheck'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapRunAdapterConnectivity'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapRunAdapterBasicGet'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapMoveAdapterEntitiesToDB'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapDeactivateTasks'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapActivateTasks'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapPopulateEntityCache'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapRetrieveEntitiesCache'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'getDevice'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'getDevicesFiltered'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'isAlive'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'getConfig'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapGetDeviceCount'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapExpandedGenericAdapterRequest'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'genericAdapterRequest'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'genericAdapterRequestNoBasePath'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapRunAdapterLint'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapRunAdapterTests'));
          assert.notEqual(undefined, pronghornDotJson.methods.find((e) => e.name === 'iapGetAdapterInventory'));
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
                  const temp = methLine.substring(methLine.indexOf('(') + 1, methLine.lastIndexOf(')'));
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
      it('pronghorn.json verify input/output schema objects', (done) => {
        const verifySchema = (methodName, schema) => {
          try {
            ajv.compile(schema);
          } catch (error) {
            const errorMessage = `Invalid schema found in '${methodName}' method.
          Schema => ${JSON.stringify(schema)}.
          Details => ${error.message}`;
            throw new Error(errorMessage);
          }
        };

        try {
          const pronghornDotJson = require('../../pronghorn.json');
          const { methods } = pronghornDotJson;
          for (let i = 0; i < methods.length; i += 1) {
            for (let j = 0; j < methods[i].input.length; j += 1) {
              const inputSchema = methods[i].input[j].schema;
              if (inputSchema) {
                verifySchema(methods[i].name, inputSchema);
              }
            }
            const outputSchema = methods[i].output.schema;
            if (outputSchema) {
              verifySchema(methods[i].name, outputSchema);
            }
          }
          done();
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
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
          assert.equal('object', propertiesDotJson.type);
          assert.equal('http://json-schema.org/draft-07/schema#', propertiesDotJson.$schema);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('propertiesSchema.json should contain generic adapter properties', (done) => {
        try {
          const propertiesDotJson = require('../../propertiesSchema.json');
          assert.notEqual(undefined, propertiesDotJson.properties);
          assert.notEqual(null, propertiesDotJson.properties);
          assert.notEqual('', propertiesDotJson.properties);
          assert.equal('string', propertiesDotJson.properties.host.type);
          assert.equal('integer', propertiesDotJson.properties.port.type);
          assert.equal('boolean', propertiesDotJson.properties.stub.type);
          assert.equal('string', propertiesDotJson.properties.protocol.type);
          assert.notEqual(undefined, propertiesDotJson.definitions.authentication);
          assert.notEqual(null, propertiesDotJson.definitions.authentication);
          assert.notEqual('', propertiesDotJson.definitions.authentication);
          assert.equal('string', propertiesDotJson.definitions.authentication.properties.auth_method.type);
          assert.equal('string', propertiesDotJson.definitions.authentication.properties.username.type);
          assert.equal('string', propertiesDotJson.definitions.authentication.properties.password.type);
          assert.equal('string', propertiesDotJson.definitions.authentication.properties.token.type);
          assert.equal('integer', propertiesDotJson.definitions.authentication.properties.invalid_token_error.type);
          assert.equal('integer', propertiesDotJson.definitions.authentication.properties.token_timeout.type);
          assert.equal('string', propertiesDotJson.definitions.authentication.properties.token_cache.type);
          assert.equal(true, Array.isArray(propertiesDotJson.definitions.authentication.properties.auth_field.type));
          assert.equal(true, Array.isArray(propertiesDotJson.definitions.authentication.properties.auth_field_format.type));
          assert.equal('boolean', propertiesDotJson.definitions.authentication.properties.auth_logging.type);
          assert.equal('string', propertiesDotJson.definitions.authentication.properties.client_id.type);
          assert.equal('string', propertiesDotJson.definitions.authentication.properties.client_secret.type);
          assert.equal('string', propertiesDotJson.definitions.authentication.properties.grant_type.type);
          assert.notEqual(undefined, propertiesDotJson.definitions.ssl);
          assert.notEqual(null, propertiesDotJson.definitions.ssl);
          assert.notEqual('', propertiesDotJson.definitions.ssl);
          assert.equal('string', propertiesDotJson.definitions.ssl.properties.ecdhCurve.type);
          assert.equal('boolean', propertiesDotJson.definitions.ssl.properties.enabled.type);
          assert.equal('boolean', propertiesDotJson.definitions.ssl.properties.accept_invalid_cert.type);
          assert.equal('string', propertiesDotJson.definitions.ssl.properties.ca_file.type);
          assert.equal('string', propertiesDotJson.definitions.ssl.properties.key_file.type);
          assert.equal('string', propertiesDotJson.definitions.ssl.properties.cert_file.type);
          assert.equal('string', propertiesDotJson.definitions.ssl.properties.secure_protocol.type);
          assert.equal('string', propertiesDotJson.definitions.ssl.properties.ciphers.type);
          assert.equal('string', propertiesDotJson.properties.base_path.type);
          assert.equal('string', propertiesDotJson.properties.version.type);
          assert.equal('string', propertiesDotJson.properties.cache_location.type);
          assert.equal('boolean', propertiesDotJson.properties.encode_pathvars.type);
          assert.equal('boolean', propertiesDotJson.properties.encode_queryvars.type);
          assert.equal(true, Array.isArray(propertiesDotJson.properties.save_metric.type));
          assert.notEqual(undefined, propertiesDotJson.definitions);
          assert.notEqual(null, propertiesDotJson.definitions);
          assert.notEqual('', propertiesDotJson.definitions);
          assert.notEqual(undefined, propertiesDotJson.definitions.healthcheck);
          assert.notEqual(null, propertiesDotJson.definitions.healthcheck);
          assert.notEqual('', propertiesDotJson.definitions.healthcheck);
          assert.equal('string', propertiesDotJson.definitions.healthcheck.properties.type.type);
          assert.equal('integer', propertiesDotJson.definitions.healthcheck.properties.frequency.type);
          assert.equal('object', propertiesDotJson.definitions.healthcheck.properties.query_object.type);
          assert.notEqual(undefined, propertiesDotJson.definitions.throttle);
          assert.notEqual(null, propertiesDotJson.definitions.throttle);
          assert.notEqual('', propertiesDotJson.definitions.throttle);
          assert.equal('boolean', propertiesDotJson.definitions.throttle.properties.throttle_enabled.type);
          assert.equal('integer', propertiesDotJson.definitions.throttle.properties.number_pronghorns.type);
          assert.equal('string', propertiesDotJson.definitions.throttle.properties.sync_async.type);
          assert.equal('integer', propertiesDotJson.definitions.throttle.properties.max_in_queue.type);
          assert.equal('integer', propertiesDotJson.definitions.throttle.properties.concurrent_max.type);
          assert.equal('integer', propertiesDotJson.definitions.throttle.properties.expire_timeout.type);
          assert.equal('integer', propertiesDotJson.definitions.throttle.properties.avg_runtime.type);
          assert.equal('array', propertiesDotJson.definitions.throttle.properties.priorities.type);
          assert.notEqual(undefined, propertiesDotJson.definitions.request);
          assert.notEqual(null, propertiesDotJson.definitions.request);
          assert.notEqual('', propertiesDotJson.definitions.request);
          assert.equal('integer', propertiesDotJson.definitions.request.properties.number_redirects.type);
          assert.equal('integer', propertiesDotJson.definitions.request.properties.number_retries.type);
          assert.equal(true, Array.isArray(propertiesDotJson.definitions.request.properties.limit_retry_error.type));
          assert.equal('array', propertiesDotJson.definitions.request.properties.failover_codes.type);
          assert.equal('integer', propertiesDotJson.definitions.request.properties.attempt_timeout.type);
          assert.equal('object', propertiesDotJson.definitions.request.properties.global_request.type);
          assert.equal('object', propertiesDotJson.definitions.request.properties.global_request.properties.payload.type);
          assert.equal('object', propertiesDotJson.definitions.request.properties.global_request.properties.uriOptions.type);
          assert.equal('object', propertiesDotJson.definitions.request.properties.global_request.properties.addlHeaders.type);
          assert.equal('object', propertiesDotJson.definitions.request.properties.global_request.properties.authData.type);
          assert.equal('boolean', propertiesDotJson.definitions.request.properties.healthcheck_on_timeout.type);
          assert.equal('boolean', propertiesDotJson.definitions.request.properties.return_raw.type);
          assert.equal('boolean', propertiesDotJson.definitions.request.properties.archiving.type);
          assert.equal('boolean', propertiesDotJson.definitions.request.properties.return_request.type);
          assert.notEqual(undefined, propertiesDotJson.definitions.proxy);
          assert.notEqual(null, propertiesDotJson.definitions.proxy);
          assert.notEqual('', propertiesDotJson.definitions.proxy);
          assert.equal('boolean', propertiesDotJson.definitions.proxy.properties.enabled.type);
          assert.equal('string', propertiesDotJson.definitions.proxy.properties.host.type);
          assert.equal('integer', propertiesDotJson.definitions.proxy.properties.port.type);
          assert.equal('string', propertiesDotJson.definitions.proxy.properties.protocol.type);
          assert.equal('string', propertiesDotJson.definitions.proxy.properties.username.type);
          assert.equal('string', propertiesDotJson.definitions.proxy.properties.password.type);
          assert.notEqual(undefined, propertiesDotJson.definitions.mongo);
          assert.notEqual(null, propertiesDotJson.definitions.mongo);
          assert.notEqual('', propertiesDotJson.definitions.mongo);
          assert.equal('string', propertiesDotJson.definitions.mongo.properties.host.type);
          assert.equal('integer', propertiesDotJson.definitions.mongo.properties.port.type);
          assert.equal('string', propertiesDotJson.definitions.mongo.properties.database.type);
          assert.equal('string', propertiesDotJson.definitions.mongo.properties.username.type);
          assert.equal('string', propertiesDotJson.definitions.mongo.properties.password.type);
          assert.equal('string', propertiesDotJson.definitions.mongo.properties.replSet.type);
          assert.equal('object', propertiesDotJson.definitions.mongo.properties.db_ssl.type);
          assert.equal('boolean', propertiesDotJson.definitions.mongo.properties.db_ssl.properties.enabled.type);
          assert.equal('boolean', propertiesDotJson.definitions.mongo.properties.db_ssl.properties.accept_invalid_cert.type);
          assert.equal('string', propertiesDotJson.definitions.mongo.properties.db_ssl.properties.ca_file.type);
          assert.equal('string', propertiesDotJson.definitions.mongo.properties.db_ssl.properties.key_file.type);
          assert.equal('string', propertiesDotJson.definitions.mongo.properties.db_ssl.properties.cert_file.type);
          assert.notEqual('', propertiesDotJson.definitions.devicebroker);
          assert.equal('array', propertiesDotJson.definitions.devicebroker.properties.getDevice.type);
          assert.equal('array', propertiesDotJson.definitions.devicebroker.properties.getDevicesFiltered.type);
          assert.equal('array', propertiesDotJson.definitions.devicebroker.properties.isAlive.type);
          assert.equal('array', propertiesDotJson.definitions.devicebroker.properties.getConfig.type);
          assert.equal('array', propertiesDotJson.definitions.devicebroker.properties.getCount.type);
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
      it('error.json should have standard adapter errors', (done) => {
        try {
          const errorDotJson = require('../../error.json');
          assert.notEqual(undefined, errorDotJson.errors);
          assert.notEqual(null, errorDotJson.errors);
          assert.notEqual('', errorDotJson.errors);
          assert.equal(true, Array.isArray(errorDotJson.errors));
          assert.notEqual(0, errorDotJson.errors.length);
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.100'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.101'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.102'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.110'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.111'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.112'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.113'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.114'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.115'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.116'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.300'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.301'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.302'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.303'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.304'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.305'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.310'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.311'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.312'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.320'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.321'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.400'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.401'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.402'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.500'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.501'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.502'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.503'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.600'));
          assert.notEqual(undefined, errorDotJson.errors.find((e) => e.icode === 'AD.900'));
          done();
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
      it('sampleProperties.json should contain generic adapter properties', (done) => {
        try {
          const sampleDotJson = require('../../sampleProperties.json');
          assert.notEqual(-1, sampleDotJson.id.indexOf('tufin_securetrack'));
          assert.equal('TufinSecuretrack', sampleDotJson.type);
          assert.notEqual(undefined, sampleDotJson.properties);
          assert.notEqual(null, sampleDotJson.properties);
          assert.notEqual('', sampleDotJson.properties);
          assert.notEqual(undefined, sampleDotJson.properties.host);
          assert.notEqual(undefined, sampleDotJson.properties.port);
          assert.notEqual(undefined, sampleDotJson.properties.stub);
          assert.notEqual(undefined, sampleDotJson.properties.protocol);
          assert.notEqual(undefined, sampleDotJson.properties.authentication);
          assert.notEqual(null, sampleDotJson.properties.authentication);
          assert.notEqual('', sampleDotJson.properties.authentication);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.auth_method);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.username);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.password);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.token);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.invalid_token_error);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.token_timeout);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.token_cache);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.auth_field);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.auth_field_format);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.auth_logging);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.client_id);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.client_secret);
          assert.notEqual(undefined, sampleDotJson.properties.authentication.grant_type);
          assert.notEqual(undefined, sampleDotJson.properties.ssl);
          assert.notEqual(null, sampleDotJson.properties.ssl);
          assert.notEqual('', sampleDotJson.properties.ssl);
          assert.notEqual(undefined, sampleDotJson.properties.ssl.ecdhCurve);
          assert.notEqual(undefined, sampleDotJson.properties.ssl.enabled);
          assert.notEqual(undefined, sampleDotJson.properties.ssl.accept_invalid_cert);
          assert.notEqual(undefined, sampleDotJson.properties.ssl.ca_file);
          assert.notEqual(undefined, sampleDotJson.properties.ssl.key_file);
          assert.notEqual(undefined, sampleDotJson.properties.ssl.cert_file);
          assert.notEqual(undefined, sampleDotJson.properties.ssl.secure_protocol);
          assert.notEqual(undefined, sampleDotJson.properties.ssl.ciphers);
          assert.notEqual(undefined, sampleDotJson.properties.base_path);
          assert.notEqual(undefined, sampleDotJson.properties.version);
          assert.notEqual(undefined, sampleDotJson.properties.cache_location);
          assert.notEqual(undefined, sampleDotJson.properties.encode_pathvars);
          assert.notEqual(undefined, sampleDotJson.properties.encode_queryvars);
          assert.notEqual(undefined, sampleDotJson.properties.save_metric);
          assert.notEqual(undefined, sampleDotJson.properties.healthcheck);
          assert.notEqual(null, sampleDotJson.properties.healthcheck);
          assert.notEqual('', sampleDotJson.properties.healthcheck);
          assert.notEqual(undefined, sampleDotJson.properties.healthcheck.type);
          assert.notEqual(undefined, sampleDotJson.properties.healthcheck.frequency);
          assert.notEqual(undefined, sampleDotJson.properties.healthcheck.query_object);
          assert.notEqual(undefined, sampleDotJson.properties.throttle);
          assert.notEqual(null, sampleDotJson.properties.throttle);
          assert.notEqual('', sampleDotJson.properties.throttle);
          assert.notEqual(undefined, sampleDotJson.properties.throttle.throttle_enabled);
          assert.notEqual(undefined, sampleDotJson.properties.throttle.number_pronghorns);
          assert.notEqual(undefined, sampleDotJson.properties.throttle.sync_async);
          assert.notEqual(undefined, sampleDotJson.properties.throttle.max_in_queue);
          assert.notEqual(undefined, sampleDotJson.properties.throttle.concurrent_max);
          assert.notEqual(undefined, sampleDotJson.properties.throttle.expire_timeout);
          assert.notEqual(undefined, sampleDotJson.properties.throttle.avg_runtime);
          assert.notEqual(undefined, sampleDotJson.properties.throttle.priorities);
          assert.notEqual(undefined, sampleDotJson.properties.request);
          assert.notEqual(null, sampleDotJson.properties.request);
          assert.notEqual('', sampleDotJson.properties.request);
          assert.notEqual(undefined, sampleDotJson.properties.request.number_redirects);
          assert.notEqual(undefined, sampleDotJson.properties.request.number_retries);
          assert.notEqual(undefined, sampleDotJson.properties.request.limit_retry_error);
          assert.notEqual(undefined, sampleDotJson.properties.request.failover_codes);
          assert.notEqual(undefined, sampleDotJson.properties.request.attempt_timeout);
          assert.notEqual(undefined, sampleDotJson.properties.request.global_request);
          assert.notEqual(undefined, sampleDotJson.properties.request.global_request.payload);
          assert.notEqual(undefined, sampleDotJson.properties.request.global_request.uriOptions);
          assert.notEqual(undefined, sampleDotJson.properties.request.global_request.addlHeaders);
          assert.notEqual(undefined, sampleDotJson.properties.request.global_request.authData);
          assert.notEqual(undefined, sampleDotJson.properties.request.healthcheck_on_timeout);
          assert.notEqual(undefined, sampleDotJson.properties.request.return_raw);
          assert.notEqual(undefined, sampleDotJson.properties.request.archiving);
          assert.notEqual(undefined, sampleDotJson.properties.request.return_request);
          assert.notEqual(undefined, sampleDotJson.properties.proxy);
          assert.notEqual(null, sampleDotJson.properties.proxy);
          assert.notEqual('', sampleDotJson.properties.proxy);
          assert.notEqual(undefined, sampleDotJson.properties.proxy.enabled);
          assert.notEqual(undefined, sampleDotJson.properties.proxy.host);
          assert.notEqual(undefined, sampleDotJson.properties.proxy.port);
          assert.notEqual(undefined, sampleDotJson.properties.proxy.protocol);
          assert.notEqual(undefined, sampleDotJson.properties.proxy.username);
          assert.notEqual(undefined, sampleDotJson.properties.proxy.password);
          assert.notEqual(undefined, sampleDotJson.properties.mongo);
          assert.notEqual(null, sampleDotJson.properties.mongo);
          assert.notEqual('', sampleDotJson.properties.mongo);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.host);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.port);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.database);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.username);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.password);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.replSet);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.db_ssl);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.db_ssl.enabled);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.db_ssl.accept_invalid_cert);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.db_ssl.ca_file);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.db_ssl.key_file);
          assert.notEqual(undefined, sampleDotJson.properties.mongo.db_ssl.cert_file);
          assert.notEqual(undefined, sampleDotJson.properties.devicebroker);
          assert.notEqual(undefined, sampleDotJson.properties.devicebroker.getDevice);
          assert.notEqual(undefined, sampleDotJson.properties.devicebroker.getDevicesFiltered);
          assert.notEqual(undefined, sampleDotJson.properties.devicebroker.isAlive);
          assert.notEqual(undefined, sampleDotJson.properties.devicebroker.getConfig);
          assert.notEqual(undefined, sampleDotJson.properties.devicebroker.getCount);
          assert.notEqual(undefined, sampleDotJson.properties.cache);
          assert.notEqual(undefined, sampleDotJson.properties.cache.entities);
          done();
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

    describe('#iapUpdateAdapterConfiguration', () => {
      it('should have a iapUpdateAdapterConfiguration function', (done) => {
        try {
          assert.equal(true, typeof a.iapUpdateAdapterConfiguration === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapSuspendAdapter', () => {
      it('should have a iapSuspendAdapter function', (done) => {
        try {
          assert.equal(true, typeof a.iapSuspendAdapter === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapUnsuspendAdapter', () => {
      it('should have a iapUnsuspendAdapter function', (done) => {
        try {
          assert.equal(true, typeof a.iapUnsuspendAdapter === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapGetAdapterQueue', () => {
      it('should have a iapGetAdapterQueue function', (done) => {
        try {
          assert.equal(true, typeof a.iapGetAdapterQueue === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapFindAdapterPath', () => {
      it('should have a iapFindAdapterPath function', (done) => {
        try {
          assert.equal(true, typeof a.iapFindAdapterPath === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('iapFindAdapterPath should find atleast one path that matches', (done) => {
        try {
          a.iapFindAdapterPath('{base_path}/{version}', (data, error) => {
            try {
              assert.equal(undefined, error);
              assert.notEqual(undefined, data);
              assert.notEqual(null, data);
              assert.equal(true, data.found);
              assert.notEqual(undefined, data.foundIn);
              assert.notEqual(null, data.foundIn);
              assert.notEqual(0, data.foundIn.length);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#iapTroubleshootAdapter', () => {
      it('should have a iapTroubleshootAdapter function', (done) => {
        try {
          assert.equal(true, typeof a.iapTroubleshootAdapter === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapRunAdapterHealthcheck', () => {
      it('should have a iapRunAdapterHealthcheck function', (done) => {
        try {
          assert.equal(true, typeof a.iapRunAdapterHealthcheck === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapRunAdapterConnectivity', () => {
      it('should have a iapRunAdapterConnectivity function', (done) => {
        try {
          assert.equal(true, typeof a.iapRunAdapterConnectivity === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapRunAdapterBasicGet', () => {
      it('should have a iapRunAdapterBasicGet function', (done) => {
        try {
          assert.equal(true, typeof a.iapRunAdapterBasicGet === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapMoveAdapterEntitiesToDB', () => {
      it('should have a iapMoveAdapterEntitiesToDB function', (done) => {
        try {
          assert.equal(true, typeof a.iapMoveAdapterEntitiesToDB === 'function');
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

    describe('#iapDeactivateTasks', () => {
      it('should have a iapDeactivateTasks function', (done) => {
        try {
          assert.equal(true, typeof a.iapDeactivateTasks === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapActivateTasks', () => {
      it('should have a iapActivateTasks function', (done) => {
        try {
          assert.equal(true, typeof a.iapActivateTasks === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapPopulateEntityCache', () => {
      it('should have a iapPopulateEntityCache function', (done) => {
        try {
          assert.equal(true, typeof a.iapPopulateEntityCache === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapRetrieveEntitiesCache', () => {
      it('should have a iapRetrieveEntitiesCache function', (done) => {
        try {
          assert.equal(true, typeof a.iapRetrieveEntitiesCache === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#hasEntities', () => {
      it('should have a hasEntities function', (done) => {
        try {
          assert.equal(true, typeof a.hasEntities === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#getDevice', () => {
      it('should have a getDevice function', (done) => {
        try {
          assert.equal(true, typeof a.getDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#getDevicesFiltered', () => {
      it('should have a getDevicesFiltered function', (done) => {
        try {
          assert.equal(true, typeof a.getDevicesFiltered === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#isAlive', () => {
      it('should have a isAlive function', (done) => {
        try {
          assert.equal(true, typeof a.isAlive === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#getConfig', () => {
      it('should have a getConfig function', (done) => {
        try {
          assert.equal(true, typeof a.getConfig === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapGetDeviceCount', () => {
      it('should have a iapGetDeviceCount function', (done) => {
        try {
          assert.equal(true, typeof a.iapGetDeviceCount === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapExpandedGenericAdapterRequest', () => {
      it('should have a iapExpandedGenericAdapterRequest function', (done) => {
        try {
          assert.equal(true, typeof a.iapExpandedGenericAdapterRequest === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#genericAdapterRequest', () => {
      it('should have a genericAdapterRequest function', (done) => {
        try {
          assert.equal(true, typeof a.genericAdapterRequest === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#genericAdapterRequestNoBasePath', () => {
      it('should have a genericAdapterRequestNoBasePath function', (done) => {
        try {
          assert.equal(true, typeof a.genericAdapterRequestNoBasePath === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapRunAdapterLint', () => {
      it('should have a iapRunAdapterLint function', (done) => {
        try {
          assert.equal(true, typeof a.iapRunAdapterLint === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('retrieve the lint results', (done) => {
        try {
          a.iapRunAdapterLint((data, error) => {
            try {
              assert.equal(undefined, error);
              assert.notEqual(undefined, data);
              assert.notEqual(null, data);
              assert.notEqual(undefined, data.status);
              assert.notEqual(null, data.status);
              assert.equal('SUCCESS', data.status);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#iapRunAdapterTests', () => {
      it('should have a iapRunAdapterTests function', (done) => {
        try {
          assert.equal(true, typeof a.iapRunAdapterTests === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });

    describe('#iapGetAdapterInventory', () => {
      it('should have a iapGetAdapterInventory function', (done) => {
        try {
          assert.equal(true, typeof a.iapGetAdapterInventory === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('retrieve the inventory', (done) => {
        try {
          a.iapGetAdapterInventory((data, error) => {
            try {
              assert.equal(undefined, error);
              assert.notEqual(undefined, data);
              assert.notEqual(null, data);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });
    describe('metadata.json', () => {
      it('should have a metadata.json', (done) => {
        try {
          fs.exists('metadata.json', (val) => {
            assert.equal(true, val);
            done();
          });
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('metadata.json is customized', (done) => {
        try {
          const metadataDotJson = require('../../metadata.json');
          assert.equal('adapter-tufin_securetrack', metadataDotJson.name);
          assert.notEqual(undefined, metadataDotJson.webName);
          assert.notEqual(null, metadataDotJson.webName);
          assert.notEqual('', metadataDotJson.webName);
          assert.equal('Adapter', metadataDotJson.type);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('metadata.json contains accurate documentation', (done) => {
        try {
          const metadataDotJson = require('../../metadata.json');
          assert.notEqual(undefined, metadataDotJson.documentation);
          assert.equal('https://www.npmjs.com/package/@itentialopensource/adapter-tufin_securetrack', metadataDotJson.documentation.npmLink);
          assert.equal('https://docs.itential.com/opensource/docs/troubleshooting-an-adapter', metadataDotJson.documentation.faqLink);
          assert.equal('https://gitlab.com/itentialopensource/adapters/contributing-guide', metadataDotJson.documentation.contributeLink);
          assert.equal('https://itential.atlassian.net/servicedesk/customer/portals', metadataDotJson.documentation.issueLink);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
      it('metadata.json has related items', (done) => {
        try {
          const metadataDotJson = require('../../metadata.json');
          assert.notEqual(undefined, metadataDotJson.relatedItems);
          assert.notEqual(undefined, metadataDotJson.relatedItems.adapters);
          assert.notEqual(undefined, metadataDotJson.relatedItems.integrations);
          assert.notEqual(undefined, metadataDotJson.relatedItems.ecosystemApplications);
          assert.notEqual(undefined, metadataDotJson.relatedItems.workflowProjects);
          assert.notEqual(undefined, metadataDotJson.relatedItems.transformationProjects);
          assert.notEqual(undefined, metadataDotJson.relatedItems.exampleProjects);
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      });
    });
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

    describe('#getSpecificAdditionalParameterIdentityQuery - errors', () => {
      it('should have a getSpecificAdditionalParameterIdentityQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificAdditionalParameterIdentityQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing revisionId', (done) => {
        try {
          a.getSpecificAdditionalParameterIdentityQuery(null, null, null, (data, error) => {
            try {
              const displayE = 'revisionId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificAdditionalParameterIdentityQuery', displayE);
              done();
            } catch (err) {
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
          a.getSpecificAdditionalParameterIdentityQuery('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificAdditionalParameterIdentityQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getAURLCategoryQuery - errors', () => {
      it('should have a getAURLCategoryQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getAURLCategoryQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing revisionId', (done) => {
        try {
          a.getAURLCategoryQuery(null, null, null, (data, error) => {
            try {
              const displayE = 'revisionId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getAURLCategoryQuery', displayE);
              done();
            } catch (err) {
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
          a.getAURLCategoryQuery('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getAURLCategoryQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getAdditionalParametersIdentitiesByRevisionQuery - errors', () => {
      it('should have a getAdditionalParametersIdentitiesByRevisionQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getAdditionalParametersIdentitiesByRevisionQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing revisionId', (done) => {
        try {
          a.getAdditionalParametersIdentitiesByRevisionQuery(null, null, (data, error) => {
            try {
              const displayE = 'revisionId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getAdditionalParametersIdentitiesByRevisionQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getApplicationsIdentitiesByRevisionQuery - errors', () => {
      it('should have a getApplicationsIdentitiesByRevisionQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getApplicationsIdentitiesByRevisionQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getApplicationsIdentitiesByRevisionQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getApplicationsIdentitiesByRevisionQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getRevisionsRevisionIdApplicationsIdsQuery - errors', () => {
      it('should have a getRevisionsRevisionIdApplicationsIdsQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getRevisionsRevisionIdApplicationsIdsQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing revisionId', (done) => {
        try {
          a.getRevisionsRevisionIdApplicationsIdsQuery(null, null, null, (data, error) => {
            try {
              const displayE = 'revisionId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getRevisionsRevisionIdApplicationsIdsQuery', displayE);
              done();
            } catch (err) {
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
          a.getRevisionsRevisionIdApplicationsIdsQuery('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getRevisionsRevisionIdApplicationsIdsQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getApplicationIdentitiesByDeviceQuery - errors', () => {
      it('should have a getApplicationIdentitiesByDeviceQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getApplicationIdentitiesByDeviceQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getApplicationIdentitiesByDeviceQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getApplicationIdentitiesByDeviceQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSpecificApplicationIdentityQuery - errors', () => {
      it('should have a getSpecificApplicationIdentityQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificApplicationIdentityQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getSpecificApplicationIdentityQuery(null, null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificApplicationIdentityQuery', displayE);
              done();
            } catch (err) {
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
          a.getSpecificApplicationIdentityQuery('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificApplicationIdentityQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#determineIfChangesBetweenTwoRevisionsAreAuthorizedQuery - errors', () => {
      it('should have a determineIfChangesBetweenTwoRevisionsAreAuthorizedQuery function', (done) => {
        try {
          assert.equal(true, typeof a.determineIfChangesBetweenTwoRevisionsAreAuthorizedQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getNameAndStatusForAllChangeWindowsQuery - errors', () => {
      it('should have a getNameAndStatusForAllChangeWindowsQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getNameAndStatusForAllChangeWindowsQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSchedulingAndDeviceDetailsForASpecificChangeWindowQuery - errors', () => {
      it('should have a getSchedulingAndDeviceDetailsForASpecificChangeWindowQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getSchedulingAndDeviceDetailsForASpecificChangeWindowQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing uid', (done) => {
        try {
          a.getSchedulingAndDeviceDetailsForASpecificChangeWindowQuery(null, null, null, (data, error) => {
            try {
              const displayE = 'uid is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSchedulingAndDeviceDetailsForASpecificChangeWindowQuery', displayE);
              done();
            } catch (err) {
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
          a.getSchedulingAndDeviceDetailsForASpecificChangeWindowQuery('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'taskId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSchedulingAndDeviceDetailsForASpecificChangeWindowQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getAListOfCompletedPolicyChangesForASpecificChangeWindowQuery - errors', () => {
      it('should have a getAListOfCompletedPolicyChangesForASpecificChangeWindowQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getAListOfCompletedPolicyChangesForASpecificChangeWindowQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing uid', (done) => {
        try {
          a.getAListOfCompletedPolicyChangesForASpecificChangeWindowQuery(null, null, (data, error) => {
            try {
              const displayE = 'uid is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getAListOfCompletedPolicyChangesForASpecificChangeWindowQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getDeviceZonesByRevisionQuery - errors', () => {
      it('should have a getDeviceZonesByRevisionQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getDeviceZonesByRevisionQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getDeviceZonesByRevisionQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getDeviceZonesByRevisionQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getNetworkInterfacesByRevisionQuery - errors', () => {
      it('should have a getNetworkInterfacesByRevisionQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getNetworkInterfacesByRevisionQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getNetworkInterfacesByRevisionQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getNetworkInterfacesByRevisionQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getDeviceZonesByDeviceQuery - errors', () => {
      it('should have a getDeviceZonesByDeviceQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getDeviceZonesByDeviceQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getDeviceZonesByDeviceQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getDeviceZonesByDeviceQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getZonesAndNetworkInterfacesThatParticipateInSubPoliciesQuery - errors', () => {
      it('should have a getZonesAndNetworkInterfacesThatParticipateInSubPoliciesQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getZonesAndNetworkInterfacesThatParticipateInSubPoliciesQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getZonesAndNetworkInterfacesThatParticipateInSubPoliciesQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getZonesAndNetworkInterfacesThatParticipateInSubPoliciesQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getNetworkInterfacesByDeviceQuery - errors', () => {
      it('should have a getNetworkInterfacesByDeviceQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getNetworkInterfacesByDeviceQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getNetworkInterfacesByDeviceQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getNetworkInterfacesByDeviceQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getDomainQuery - errors', () => {
      it('should have a getDomainQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getDomainQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getDomainQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getDomainQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getCiscoCryptographicMapsByRevisionQuery - errors', () => {
      it('should have a getCiscoCryptographicMapsByRevisionQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getCiscoCryptographicMapsByRevisionQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getCiscoCryptographicMapsByRevisionQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getCiscoCryptographicMapsByRevisionQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getCiscoCryptographicMapsByDeviceQuery - errors', () => {
      it('should have a getCiscoCryptographicMapsByDeviceQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getCiscoCryptographicMapsByDeviceQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getCiscoCryptographicMapsByDeviceQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getCiscoCryptographicMapsByDeviceQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getCiscoIPsecPolicyAndPeersQuery - errors', () => {
      it('should have a getCiscoIPsecPolicyAndPeersQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getCiscoIPsecPolicyAndPeersQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getCiscoIPsecPolicyAndPeersQuery(null, null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getCiscoIPsecPolicyAndPeersQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getCheckPointVPNIPSecCommunitiesAndGatewaysQuery - errors', () => {
      it('should have a getCheckPointVPNIPSecCommunitiesAndGatewaysQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getCheckPointVPNIPSecCommunitiesAndGatewaysQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getCheckPointVPNIPSecCommunitiesAndGatewaysQuery(null, null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getCheckPointVPNIPSecCommunitiesAndGatewaysQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getLDAPEntryDetailsByDNQuery - errors', () => {
      it('should have a getLDAPEntryDetailsByDNQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getLDAPEntryDetailsByDNQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getLicense - errors', () => {
      it('should have a getLicense function', (done) => {
        try {
          assert.equal(true, typeof a.getLicense === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getLicense(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getLicense', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getLicenses - errors', () => {
      it('should have a getLicenses function', (done) => {
        try {
          assert.equal(true, typeof a.getLicenses === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getQueueSizeConfig - errors', () => {
      it('should have a getQueueSizeConfig function', (done) => {
        try {
          assert.equal(true, typeof a.getQueueSizeConfig === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#updateQueueMaxSize - errors', () => {
      it('should have a updateQueueMaxSize function', (done) => {
        try {
          assert.equal(true, typeof a.updateQueueMaxSize === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.updateQueueMaxSize(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-updateQueueMaxSize', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getTextualConfigurationByRevisionQuery - errors', () => {
      it('should have a getTextualConfigurationByRevisionQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getTextualConfigurationByRevisionQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getTextualConfigurationByRevisionQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getTextualConfigurationByRevisionQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getDevicesQuery - errors', () => {
      it('should have a getDevicesQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getDevicesQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSpecificDeviceQuery - errors', () => {
      it('should have a getSpecificDeviceQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificDeviceQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getSpecificDeviceQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificDeviceQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getTextualConfigurationByDeviceQuery - errors', () => {
      it('should have a getTextualConfigurationByDeviceQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getTextualConfigurationByDeviceQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getTextualConfigurationByDeviceQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getTextualConfigurationByDeviceQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#abortTask - errors', () => {
      it('should have a abortTask function', (done) => {
        try {
          assert.equal(true, typeof a.abortTask === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#abortAllTasks - errors', () => {
      it('should have a abortAllTasks function', (done) => {
        try {
          assert.equal(true, typeof a.abortAllTasks === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getWaitingTasks - errors', () => {
      it('should have a getWaitingTasks function', (done) => {
        try {
          assert.equal(true, typeof a.getWaitingTasks === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getWaitingTasksForDevice - errors', () => {
      it('should have a getWaitingTasksForDevice function', (done) => {
        try {
          assert.equal(true, typeof a.getWaitingTasksForDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getWaitingTasksForDevice(null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getWaitingTasksForDevice', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#updateOfflineDeviceQuery - errors', () => {
      it('should have a updateOfflineDeviceQuery function', (done) => {
        try {
          assert.equal(true, typeof a.updateOfflineDeviceQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.updateOfflineDeviceQuery(null, null, null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-updateOfflineDeviceQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.updateOfflineDeviceQuery('fakeparam', 'fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-updateOfflineDeviceQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getNATObjectsByRevisionQuery - errors', () => {
      it('should have a getNATObjectsByRevisionQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getNATObjectsByRevisionQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getNATObjectsByRevisionQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getNATObjectsByRevisionQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getNATObjectsByDeviceQuery - errors', () => {
      it('should have a getNATObjectsByDeviceQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getNATObjectsByDeviceQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getNATObjectsByDeviceQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getNATObjectsByDeviceQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getNATRulesByDeviceQuery - errors', () => {
      it('should have a getNATRulesByDeviceQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getNATRulesByDeviceQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getNATRulesByDeviceQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getNATRulesByDeviceQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getNetworkObjectsByRevisionQuery - errors', () => {
      it('should have a getNetworkObjectsByRevisionQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getNetworkObjectsByRevisionQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getNetworkObjectsByRevisionQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getNetworkObjectsByRevisionQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSpecificNetworkObjectsByRevisionQuery - errors', () => {
      it('should have a getSpecificNetworkObjectsByRevisionQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificNetworkObjectsByRevisionQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing revisionId', (done) => {
        try {
          a.getSpecificNetworkObjectsByRevisionQuery(null, null, null, (data, error) => {
            try {
              const displayE = 'revisionId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificNetworkObjectsByRevisionQuery', displayE);
              done();
            } catch (err) {
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
          a.getSpecificNetworkObjectsByRevisionQuery('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificNetworkObjectsByRevisionQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getNetworkObjectsByDeviceQuery - errors', () => {
      it('should have a getNetworkObjectsByDeviceQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getNetworkObjectsByDeviceQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getNetworkObjectsByDeviceQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getNetworkObjectsByDeviceQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSpecificNetworkObjectQuery - errors', () => {
      it('should have a getSpecificNetworkObjectQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificNetworkObjectQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getSpecificNetworkObjectQuery(null, null, null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificNetworkObjectQuery', displayE);
              done();
            } catch (err) {
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
          a.getSpecificNetworkObjectQuery('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificNetworkObjectQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getNetworkObjectsMatchingSpecifiedCriteriaQuery - errors', () => {
      it('should have a getNetworkObjectsMatchingSpecifiedCriteriaQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getNetworkObjectsMatchingSpecifiedCriteriaQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getNetworkGroupsContainingSpecifiedNetworkObjectQuery - errors', () => {
      it('should have a getNetworkGroupsContainingSpecifiedNetworkObjectQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getNetworkGroupsContainingSpecifiedNetworkObjectQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getNetworkGroupsContainingSpecifiedNetworkObjectQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getNetworkGroupsContainingSpecifiedNetworkObjectQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getRulesContainingSpecifiedNetworkObjectQuery - errors', () => {
      it('should have a getRulesContainingSpecifiedNetworkObjectQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getRulesContainingSpecifiedNetworkObjectQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getRulesContainingSpecifiedNetworkObjectQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getRulesContainingSpecifiedNetworkObjectQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getTopologyGenericVPNConnectionsQuery - errors', () => {
      it('should have a getTopologyGenericVPNConnectionsQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getTopologyGenericVPNConnectionsQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#updateACloudQuery - errors', () => {
      it('should have a updateACloudQuery function', (done) => {
        try {
          assert.equal(true, typeof a.updateACloudQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.updateACloudQuery(null, null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-updateACloudQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.updateACloudQuery('fakeparam', 'fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-updateACloudQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#synchronizeTheTopologyModelQuery - errors', () => {
      it('should have a synchronizeTheTopologyModelQuery function', (done) => {
        try {
          assert.equal(true, typeof a.synchronizeTheTopologyModelQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSynchronizerCronTabDetails - errors', () => {
      it('should have a getSynchronizerCronTabDetails function', (done) => {
        try {
          assert.equal(true, typeof a.getSynchronizerCronTabDetails === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getPathPdf - errors', () => {
      it('should have a getPathPdf function', (done) => {
        try {
          assert.equal(true, typeof a.getPathPdf === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getPathDomains - errors', () => {
      it('should have a getPathDomains function', (done) => {
        try {
          assert.equal(true, typeof a.getPathDomains === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getPathObjectTraffic - errors', () => {
      it('should have a getPathObjectTraffic function', (done) => {
        try {
          assert.equal(true, typeof a.getPathObjectTraffic === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getPathImageForSpecifiedTrafficQuery - errors', () => {
      it('should have a getPathImageForSpecifiedTrafficQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getPathImageForSpecifiedTrafficQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getPathForSpecifiedTrafficQuery - errors', () => {
      it('should have a getPathForSpecifiedTrafficQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getPathForSpecifiedTrafficQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getTopologyCloudsQuery - errors', () => {
      it('should have a getTopologyCloudsQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getTopologyCloudsQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createAJoinedTopologyCloudQuery - errors', () => {
      it('should have a createAJoinedTopologyCloudQuery function', (done) => {
        try {
          assert.equal(true, typeof a.createAJoinedTopologyCloudQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.createAJoinedTopologyCloudQuery('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-createAJoinedTopologyCloudQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getTopologySubnetsQuery - errors', () => {
      it('should have a getTopologySubnetsQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getTopologySubnetsQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getget - errors', () => {
      it('should have a getget function', (done) => {
        try {
          assert.equal(true, typeof a.getget === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing cloudId', (done) => {
        try {
          a.getget(null, (data, error) => {
            try {
              const displayE = 'cloudId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getget', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deletedelete - errors', () => {
      it('should have a deletedelete function', (done) => {
        try {
          assert.equal(true, typeof a.deletedelete === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing cloudId', (done) => {
        try {
          a.deletedelete(null, null, (data, error) => {
            try {
              const displayE = 'cloudId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deletedelete', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createJoinCloud - errors', () => {
      it('should have a createJoinCloud function', (done) => {
        try {
          assert.equal(true, typeof a.createJoinCloud === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#updateJoinClouds - errors', () => {
      it('should have a updateJoinClouds function', (done) => {
        try {
          assert.equal(true, typeof a.updateJoinClouds === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getVpn - errors', () => {
      it('should have a getVpn function', (done) => {
        try {
          assert.equal(true, typeof a.getVpn === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vpnId', (done) => {
        try {
          a.getVpn(null, (data, error) => {
            try {
              const displayE = 'vpnId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getVpn', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteVpn - errors', () => {
      it('should have a deleteVpn function', (done) => {
        try {
          assert.equal(true, typeof a.deleteVpn === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing vpnId', (done) => {
        try {
          a.deleteVpn(null, (data, error) => {
            try {
              const displayE = 'vpnId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteVpn', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getInterface - errors', () => {
      it('should have a getInterface function', (done) => {
        try {
          assert.equal(true, typeof a.getInterface === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing inId', (done) => {
        try {
          a.getInterface(null, (data, error) => {
            try {
              const displayE = 'inId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getInterface', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteInterface - errors', () => {
      it('should have a deleteInterface function', (done) => {
        try {
          assert.equal(true, typeof a.deleteInterface === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing inId', (done) => {
        try {
          a.deleteInterface(null, (data, error) => {
            try {
              const displayE = 'inId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteInterface', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getRoute - errors', () => {
      it('should have a getRoute function', (done) => {
        try {
          assert.equal(true, typeof a.getRoute === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing routeId', (done) => {
        try {
          a.getRoute(null, (data, error) => {
            try {
              const displayE = 'routeId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getRoute', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteRoute - errors', () => {
      it('should have a deleteRoute function', (done) => {
        try {
          assert.equal(true, typeof a.deleteRoute === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing routeId', (done) => {
        try {
          a.deleteRoute(null, (data, error) => {
            try {
              const displayE = 'routeId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteRoute', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createRoutes - errors', () => {
      it('should have a createRoutes function', (done) => {
        try {
          assert.equal(true, typeof a.createRoutes === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#updateRoutes - errors', () => {
      it('should have a updateRoutes function', (done) => {
        try {
          assert.equal(true, typeof a.updateRoutes === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getRoutes - errors', () => {
      it('should have a getRoutes function', (done) => {
        try {
          assert.equal(true, typeof a.getRoutes === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing mgmtId', (done) => {
        try {
          a.getRoutes(null, (data, error) => {
            try {
              const displayE = 'mgmtId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getRoutes', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteRoutes - errors', () => {
      it('should have a deleteRoutes function', (done) => {
        try {
          assert.equal(true, typeof a.deleteRoutes === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing mgmtId', (done) => {
        try {
          a.deleteRoutes(null, (data, error) => {
            try {
              const displayE = 'mgmtId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteRoutes', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getInterfaceCustomer - errors', () => {
      it('should have a getInterfaceCustomer function', (done) => {
        try {
          assert.equal(true, typeof a.getInterfaceCustomer === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing interfaceCustomerId', (done) => {
        try {
          a.getInterfaceCustomer(null, (data, error) => {
            try {
              const displayE = 'interfaceCustomerId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getInterfaceCustomer', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteInterfaceCustomer - errors', () => {
      it('should have a deleteInterfaceCustomer function', (done) => {
        try {
          assert.equal(true, typeof a.deleteInterfaceCustomer === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing interfaceCustomerId', (done) => {
        try {
          a.deleteInterfaceCustomer(null, (data, error) => {
            try {
              const displayE = 'interfaceCustomerId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteInterfaceCustomer', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getInterfaceCustomers - errors', () => {
      it('should have a getInterfaceCustomers function', (done) => {
        try {
          assert.equal(true, typeof a.getInterfaceCustomers === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getInterfaceCustomers(null, null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getInterfaceCustomers', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteInterfaceCustomers - errors', () => {
      it('should have a deleteInterfaceCustomers function', (done) => {
        try {
          assert.equal(true, typeof a.deleteInterfaceCustomers === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.deleteInterfaceCustomers(null, null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteInterfaceCustomers', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createInterfaceCustomers - errors', () => {
      it('should have a createInterfaceCustomers function', (done) => {
        try {
          assert.equal(true, typeof a.createInterfaceCustomers === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#updateInterfaceCustomers - errors', () => {
      it('should have a updateInterfaceCustomers function', (done) => {
        try {
          assert.equal(true, typeof a.updateInterfaceCustomers === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getgetInterfaces - errors', () => {
      it('should have a getgetInterfaces function', (done) => {
        try {
          assert.equal(true, typeof a.getgetInterfaces === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing mgmtId', (done) => {
        try {
          a.getgetInterfaces(null, (data, error) => {
            try {
              const displayE = 'mgmtId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getgetInterfaces', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteInterfaces - errors', () => {
      it('should have a deleteInterfaces function', (done) => {
        try {
          assert.equal(true, typeof a.deleteInterfaces === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing mgmtId', (done) => {
        try {
          a.deleteInterfaces(null, (data, error) => {
            try {
              const displayE = 'mgmtId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteInterfaces', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createInterfaces - errors', () => {
      it('should have a createInterfaces function', (done) => {
        try {
          assert.equal(true, typeof a.createInterfaces === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#updateInterfaces - errors', () => {
      it('should have a updateInterfaces function', (done) => {
        try {
          assert.equal(true, typeof a.updateInterfaces === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getVpns - errors', () => {
      it('should have a getVpns function', (done) => {
        try {
          assert.equal(true, typeof a.getVpns === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getVpns(null, null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getVpns', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteVpns - errors', () => {
      it('should have a deleteVpns function', (done) => {
        try {
          assert.equal(true, typeof a.deleteVpns === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.deleteVpns(null, null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteVpns', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createVpns - errors', () => {
      it('should have a createVpns function', (done) => {
        try {
          assert.equal(true, typeof a.createVpns === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#updateVpns - errors', () => {
      it('should have a updateVpns function', (done) => {
        try {
          assert.equal(true, typeof a.updateVpns === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getTransparentFirewalls - errors', () => {
      it('should have a getTransparentFirewalls function', (done) => {
        try {
          assert.equal(true, typeof a.getTransparentFirewalls === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getTransparentFirewalls(null, null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getTransparentFirewalls', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteTransparentFirewalls - errors', () => {
      it('should have a deleteTransparentFirewalls function', (done) => {
        try {
          assert.equal(true, typeof a.deleteTransparentFirewalls === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.deleteTransparentFirewalls(null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteTransparentFirewalls', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteTransparentFirewall - errors', () => {
      it('should have a deleteTransparentFirewall function', (done) => {
        try {
          assert.equal(true, typeof a.deleteTransparentFirewall === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing layer2DataId', (done) => {
        try {
          a.deleteTransparentFirewall(null, (data, error) => {
            try {
              const displayE = 'layer2DataId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteTransparentFirewall', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createTransparentFirewalls - errors', () => {
      it('should have a createTransparentFirewalls function', (done) => {
        try {
          assert.equal(true, typeof a.createTransparentFirewalls === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#updateTransparentFirewalls - errors', () => {
      it('should have a updateTransparentFirewalls function', (done) => {
        try {
          assert.equal(true, typeof a.updateTransparentFirewalls === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getIgnoredInterfaces - errors', () => {
      it('should have a getIgnoredInterfaces function', (done) => {
        try {
          assert.equal(true, typeof a.getIgnoredInterfaces === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing mgmtId', (done) => {
        try {
          a.getIgnoredInterfaces(null, (data, error) => {
            try {
              const displayE = 'mgmtId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getIgnoredInterfaces', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteIgnoredInterfaces - errors', () => {
      it('should have a deleteIgnoredInterfaces function', (done) => {
        try {
          assert.equal(true, typeof a.deleteIgnoredInterfaces === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing mgmtId', (done) => {
        try {
          a.deleteIgnoredInterfaces(null, (data, error) => {
            try {
              const displayE = 'mgmtId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteIgnoredInterfaces', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createIgnoredInterfaces - errors', () => {
      it('should have a createIgnoredInterfaces function', (done) => {
        try {
          assert.equal(true, typeof a.createIgnoredInterfaces === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteGenericDeviceFromTopologyModelQuery - errors', () => {
      it('should have a deleteGenericDeviceFromTopologyModelQuery function', (done) => {
        try {
          assert.equal(true, typeof a.deleteGenericDeviceFromTopologyModelQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.deleteGenericDeviceFromTopologyModelQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteGenericDeviceFromTopologyModelQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getGenericDevicesThatAreConfiguredInSTQuery - errors', () => {
      it('should have a getGenericDevicesThatAreConfiguredInSTQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getGenericDevicesThatAreConfiguredInSTQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getTopologyRoutingTablesForAGivenDeviceQuery - errors', () => {
      it('should have a getTopologyRoutingTablesForAGivenDeviceQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getTopologyRoutingTablesForAGivenDeviceQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getTopologyNetworkInterfacesByDeviceQuery - errors', () => {
      it('should have a getTopologyNetworkInterfacesByDeviceQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getTopologyNetworkInterfacesByDeviceQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getMostSpecificNetworkInterfacesFromWhichAHostIPIsAccessibleQuery - errors', () => {
      it('should have a getMostSpecificNetworkInterfacesFromWhichAHostIPIsAccessibleQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getMostSpecificNetworkInterfacesFromWhichAHostIPIsAccessibleQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#joinOrSplitSubnet - errors', () => {
      it('should have a joinOrSplitSubnet function', (done) => {
        try {
          assert.equal(true, typeof a.joinOrSplitSubnet === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#modifyAZoneEntryQuery - errors', () => {
      it('should have a modifyAZoneEntryQuery function', (done) => {
        try {
          assert.equal(true, typeof a.modifyAZoneEntryQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing zoneId', (done) => {
        try {
          a.modifyAZoneEntryQuery(null, null, null, null, (data, error) => {
            try {
              const displayE = 'zoneId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-modifyAZoneEntryQuery', displayE);
              done();
            } catch (err) {
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
          a.modifyAZoneEntryQuery('fakeparam', null, null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-modifyAZoneEntryQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.modifyAZoneEntryQuery('fakeparam', 'fakeparam', 'fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-modifyAZoneEntryQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getASpecificZoneEntryQuery - errors', () => {
      it('should have a getASpecificZoneEntryQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getASpecificZoneEntryQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getASpecificZoneEntryQuery(null, null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getASpecificZoneEntryQuery', displayE);
              done();
            } catch (err) {
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
          a.getASpecificZoneEntryQuery('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'zoneId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getASpecificZoneEntryQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteZoneEntriesQuery - errors', () => {
      it('should have a deleteZoneEntriesQuery function', (done) => {
        try {
          assert.equal(true, typeof a.deleteZoneEntriesQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.deleteZoneEntriesQuery(null, null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteZoneEntriesQuery', displayE);
              done();
            } catch (err) {
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
          a.deleteZoneEntriesQuery('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'zoneId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteZoneEntriesQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createAZoneEntryQuery - errors', () => {
      it('should have a createAZoneEntryQuery function', (done) => {
        try {
          assert.equal(true, typeof a.createAZoneEntryQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing zoneId', (done) => {
        try {
          a.createAZoneEntryQuery(null, null, null, (data, error) => {
            try {
              const displayE = 'zoneId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-createAZoneEntryQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.createAZoneEntryQuery('fakeparam', 'fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-createAZoneEntryQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteZonesZoneIdsEntriesIdsQuery - errors', () => {
      it('should have a deleteZonesZoneIdsEntriesIdsQuery function', (done) => {
        try {
          assert.equal(true, typeof a.deleteZonesZoneIdsEntriesIdsQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing zoneIds', (done) => {
        try {
          a.deleteZonesZoneIdsEntriesIdsQuery(null, null, null, (data, error) => {
            try {
              const displayE = 'zoneIds is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteZonesZoneIdsEntriesIdsQuery', displayE);
              done();
            } catch (err) {
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
          a.deleteZonesZoneIdsEntriesIdsQuery('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteZonesZoneIdsEntriesIdsQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#modifyMultipleExistingZoneEntriesQuery - errors', () => {
      it('should have a modifyMultipleExistingZoneEntriesQuery function', (done) => {
        try {
          assert.equal(true, typeof a.modifyMultipleExistingZoneEntriesQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing zoneIds', (done) => {
        try {
          a.modifyMultipleExistingZoneEntriesQuery(null, null, null, null, (data, error) => {
            try {
              const displayE = 'zoneIds is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-modifyMultipleExistingZoneEntriesQuery', displayE);
              done();
            } catch (err) {
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
          a.modifyMultipleExistingZoneEntriesQuery('fakeparam', null, null, null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-modifyMultipleExistingZoneEntriesQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getEntriesForAZoneQuery - errors', () => {
      it('should have a getEntriesForAZoneQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getEntriesForAZoneQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing ids', (done) => {
        try {
          a.getEntriesForAZoneQuery(null, null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getEntriesForAZoneQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getASpecificZoneQuery - errors', () => {
      it('should have a getASpecificZoneQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getASpecificZoneQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getASpecificZoneQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getASpecificZoneQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#modifyAZoneQuery - errors', () => {
      it('should have a modifyAZoneQuery function', (done) => {
        try {
          assert.equal(true, typeof a.modifyAZoneQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.modifyAZoneQuery(null, null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-modifyAZoneQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getAllZonesQuery - errors', () => {
      it('should have a getAllZonesQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getAllZonesQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createAZoneQuery - errors', () => {
      it('should have a createAZoneQuery function', (done) => {
        try {
          assert.equal(true, typeof a.createAZoneQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.createAZoneQuery('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-createAZoneQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteAllZonesQuery - errors', () => {
      it('should have a deleteAllZonesQuery function', (done) => {
        try {
          assert.equal(true, typeof a.deleteAllZonesQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSharedZonesQuery - errors', () => {
      it('should have a getSharedZonesQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getSharedZonesQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getConfigurationUsagesForAZoneQuery - errors', () => {
      it('should have a getConfigurationUsagesForAZoneQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getConfigurationUsagesForAZoneQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing ids', (done) => {
        try {
          a.getConfigurationUsagesForAZoneQuery(null, null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getConfigurationUsagesForAZoneQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getDescendantZonesForAZoneQuery - errors', () => {
      it('should have a getDescendantZonesForAZoneQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getDescendantZonesForAZoneQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing ids', (done) => {
        try {
          a.getDescendantZonesForAZoneQuery(null, null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getDescendantZonesForAZoneQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getAncestorZonesForAZoneQuery - errors', () => {
      it('should have a getAncestorZonesForAZoneQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getAncestorZonesForAZoneQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing ids', (done) => {
        try {
          a.getAncestorZonesForAZoneQuery(null, null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getAncestorZonesForAZoneQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#addAZoneAsADescendantToAZoneQuery - errors', () => {
      it('should have a addAZoneAsADescendantToAZoneQuery function', (done) => {
        try {
          assert.equal(true, typeof a.addAZoneAsADescendantToAZoneQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing parentId', (done) => {
        try {
          a.addAZoneAsADescendantToAZoneQuery(null, null, null, (data, error) => {
            try {
              const displayE = 'parentId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-addAZoneAsADescendantToAZoneQuery', displayE);
              done();
            } catch (err) {
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
          a.addAZoneAsADescendantToAZoneQuery('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'childIds is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-addAZoneAsADescendantToAZoneQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#removeAZoneAsAnDescendantsToAZoneQuery - errors', () => {
      it('should have a removeAZoneAsAnDescendantsToAZoneQuery function', (done) => {
        try {
          assert.equal(true, typeof a.removeAZoneAsAnDescendantsToAZoneQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing parentId', (done) => {
        try {
          a.removeAZoneAsAnDescendantsToAZoneQuery(null, null, null, (data, error) => {
            try {
              const displayE = 'parentId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-removeAZoneAsAnDescendantsToAZoneQuery', displayE);
              done();
            } catch (err) {
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
          a.removeAZoneAsAnDescendantsToAZoneQuery('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'childIds is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-removeAZoneAsAnDescendantsToAZoneQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#addAZoneAsAnAncestorToAZoneQuery - errors', () => {
      it('should have a addAZoneAsAnAncestorToAZoneQuery function', (done) => {
        try {
          assert.equal(true, typeof a.addAZoneAsAnAncestorToAZoneQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing childId', (done) => {
        try {
          a.addAZoneAsAnAncestorToAZoneQuery(null, null, null, (data, error) => {
            try {
              const displayE = 'childId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-addAZoneAsAnAncestorToAZoneQuery', displayE);
              done();
            } catch (err) {
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
          a.addAZoneAsAnAncestorToAZoneQuery('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'parentIds is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-addAZoneAsAnAncestorToAZoneQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#removeAZoneAsAnAncestorToAZoneQuery - errors', () => {
      it('should have a removeAZoneAsAnAncestorToAZoneQuery function', (done) => {
        try {
          assert.equal(true, typeof a.removeAZoneAsAnAncestorToAZoneQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing childId', (done) => {
        try {
          a.removeAZoneAsAnAncestorToAZoneQuery(null, null, null, (data, error) => {
            try {
              const displayE = 'childId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-removeAZoneAsAnAncestorToAZoneQuery', displayE);
              done();
            } catch (err) {
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
          a.removeAZoneAsAnAncestorToAZoneQuery('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'parentIds is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-removeAZoneAsAnAncestorToAZoneQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteAZoneQuery - errors', () => {
      it('should have a deleteAZoneQuery function', (done) => {
        try {
          assert.equal(true, typeof a.deleteAZoneQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing ids', (done) => {
        try {
          a.deleteAZoneQuery(null, null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteAZoneQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#importAZoneQuery - errors', () => {
      it('should have a importAZoneQuery function', (done) => {
        try {
          assert.equal(true, typeof a.importAZoneQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing ids', (done) => {
        try {
          a.importAZoneQuery(null, null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-importAZoneQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getPoliciesByRevisionQuery - errors', () => {
      it('should have a getPoliciesByRevisionQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getPoliciesByRevisionQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getPoliciesByRevisionQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getPoliciesByRevisionQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSubPoliciesBindingsByRevisionQuery - errors', () => {
      it('should have a getSubPoliciesBindingsByRevisionQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getSubPoliciesBindingsByRevisionQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getSubPoliciesBindingsByRevisionQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSubPoliciesBindingsByRevisionQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getPoliciesByDeviceQuery - errors', () => {
      it('should have a getPoliciesByDeviceQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getPoliciesByDeviceQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getPoliciesByDeviceQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getPoliciesByDeviceQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSubPoliciesBindingsByDeviceQuery - errors', () => {
      it('should have a getSubPoliciesBindingsByDeviceQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getSubPoliciesBindingsByDeviceQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getSubPoliciesBindingsByDeviceQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSubPoliciesBindingsByDeviceQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getRulesByInputAndOutputInterfacesQuery - errors', () => {
      it('should have a getRulesByInputAndOutputInterfacesQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getRulesByInputAndOutputInterfacesQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getRulesByInputAndOutputInterfacesQuery(null, null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getRulesByInputAndOutputInterfacesQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getListOfSubPoliciesBindingsWithInputAndOrOutputInterfacesQuery - errors', () => {
      it('should have a getListOfSubPoliciesBindingsWithInputAndOrOutputInterfacesQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getListOfSubPoliciesBindingsWithInputAndOrOutputInterfacesQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getListOfSubPoliciesBindingsWithInputAndOrOutputInterfacesQuery(null, null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getListOfSubPoliciesBindingsWithInputAndOrOutputInterfacesQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#runPolicyAnalysisQueryQuery - errors', () => {
      it('should have a runPolicyAnalysisQueryQuery function', (done) => {
        try {
          assert.equal(true, typeof a.runPolicyAnalysisQueryQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getRisksResultsQuery - errors', () => {
      it('should have a getRisksResultsQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getRisksResultsQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getCleanupsResultsQuery - errors', () => {
      it('should have a getCleanupsResultsQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getCleanupsResultsQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getTheSpecificObjectsOrRulesIdentifiedForTheRiskResultsQuery - errors', () => {
      it('should have a getTheSpecificObjectsOrRulesIdentifiedForTheRiskResultsQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getTheSpecificObjectsOrRulesIdentifiedForTheRiskResultsQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing riskId', (done) => {
        try {
          a.getTheSpecificObjectsOrRulesIdentifiedForTheRiskResultsQuery(null, null, (data, error) => {
            try {
              const displayE = 'riskId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getTheSpecificObjectsOrRulesIdentifiedForTheRiskResultsQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getDevicesInRiskResultsQuery - errors', () => {
      it('should have a getDevicesInRiskResultsQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getDevicesInRiskResultsQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing riskId', (done) => {
        try {
          a.getDevicesInRiskResultsQuery(null, null, (data, error) => {
            try {
              const displayE = 'riskId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getDevicesInRiskResultsQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getTheSpecificObjectsOrRulesIdentifiedForTheCleanupResultsQuery - errors', () => {
      it('should have a getTheSpecificObjectsOrRulesIdentifiedForTheCleanupResultsQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getTheSpecificObjectsOrRulesIdentifiedForTheCleanupResultsQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing cleanupId', (done) => {
        try {
          a.getTheSpecificObjectsOrRulesIdentifiedForTheCleanupResultsQuery(null, null, (data, error) => {
            try {
              const displayE = 'cleanupId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getTheSpecificObjectsOrRulesIdentifiedForTheCleanupResultsQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getDevicesInCleanupResultsQuery - errors', () => {
      it('should have a getDevicesInCleanupResultsQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getDevicesInCleanupResultsQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing cleanupId', (done) => {
        try {
          a.getDevicesInCleanupResultsQuery(null, null, (data, error) => {
            try {
              const displayE = 'cleanupId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getDevicesInCleanupResultsQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getCleanupsByDeviceQuery - errors', () => {
      it('should have a getCleanupsByDeviceQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getCleanupsByDeviceQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getCleanupsByDeviceQuery(null, null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getCleanupsByDeviceQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getShadowingRulesByDeviceQuery - errors', () => {
      it('should have a getShadowingRulesByDeviceQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getShadowingRulesByDeviceQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getShadowingRulesByDeviceQuery(null, null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getShadowingRulesByDeviceQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getRevisionsByDeviceQuery - errors', () => {
      it('should have a getRevisionsByDeviceQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getRevisionsByDeviceQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getRevisionsByDeviceQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getRevisionsByDeviceQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getLatestRevisionByDeviceQuery - errors', () => {
      it('should have a getLatestRevisionByDeviceQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getLatestRevisionByDeviceQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getLatestRevisionByDeviceQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getLatestRevisionByDeviceQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSpecificRevisionQuery - errors', () => {
      it('should have a getSpecificRevisionQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificRevisionQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing revId', (done) => {
        try {
          a.getSpecificRevisionQuery(null, null, (data, error) => {
            try {
              const displayE = 'revId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificRevisionQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getRuleCountPerDeviceQuery - errors', () => {
      it('should have a getRuleCountPerDeviceQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getRuleCountPerDeviceQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getRulesByRevisionQuery - errors', () => {
      it('should have a getRulesByRevisionQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getRulesByRevisionQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getRulesByRevisionQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getRulesByRevisionQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getRevisionsRevisionIdRulesIdsQuery - errors', () => {
      it('should have a getRevisionsRevisionIdRulesIdsQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getRevisionsRevisionIdRulesIdsQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing revisionId', (done) => {
        try {
          a.getRevisionsRevisionIdRulesIdsQuery(null, null, null, (data, error) => {
            try {
              const displayE = 'revisionId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getRevisionsRevisionIdRulesIdsQuery', displayE);
              done();
            } catch (err) {
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
          a.getRevisionsRevisionIdRulesIdsQuery('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getRevisionsRevisionIdRulesIdsQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getRulesByDeviceQuery - errors', () => {
      it('should have a getRulesByDeviceQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getRulesByDeviceQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getRulesByDeviceQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getRulesByDeviceQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSpecificRuleQuery - errors', () => {
      it('should have a getSpecificRuleQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificRuleQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getSpecificRuleQuery(null, null, null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificRuleQuery', displayE);
              done();
            } catch (err) {
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
          a.getSpecificRuleQuery('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificRuleQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#findRulesQuery - errors', () => {
      it('should have a findRulesQuery function', (done) => {
        try {
          assert.equal(true, typeof a.findRulesQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.findRulesQuery(null, null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-findRulesQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getASpecificRuleQuery - errors', () => {
      it('should have a getASpecificRuleQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getASpecificRuleQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing ruleId', (done) => {
        try {
          a.getASpecificRuleQuery(null, null, (data, error) => {
            try {
              const displayE = 'ruleId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getASpecificRuleQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getServiceGroupsContainingSpecifiedServiceObjectsQuery - errors', () => {
      it('should have a getServiceGroupsContainingSpecifiedServiceObjectsQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getServiceGroupsContainingSpecifiedServiceObjectsQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getServiceGroupsContainingSpecifiedServiceObjectsQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getServiceGroupsContainingSpecifiedServiceObjectsQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getRulesContainingSpecifiedServiceObjectQuery - errors', () => {
      it('should have a getRulesContainingSpecifiedServiceObjectQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getRulesContainingSpecifiedServiceObjectQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getRulesContainingSpecifiedServiceObjectQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getRulesContainingSpecifiedServiceObjectQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getServicesByRevisionQuery - errors', () => {
      it('should have a getServicesByRevisionQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getServicesByRevisionQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getServicesByRevisionQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getServicesByRevisionQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSpecificServiceQuery - errors', () => {
      it('should have a getSpecificServiceQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificServiceQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing revisionId', (done) => {
        try {
          a.getSpecificServiceQuery(null, null, null, (data, error) => {
            try {
              const displayE = 'revisionId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificServiceQuery', displayE);
              done();
            } catch (err) {
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
          a.getSpecificServiceQuery('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificServiceQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getServicesByDeviceQuery - errors', () => {
      it('should have a getServicesByDeviceQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getServicesByDeviceQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getServicesByDeviceQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getServicesByDeviceQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getDevicesDeviceIdServicesIdsQuery - errors', () => {
      it('should have a getDevicesDeviceIdServicesIdsQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getDevicesDeviceIdServicesIdsQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getDevicesDeviceIdServicesIdsQuery(null, null, null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getDevicesDeviceIdServicesIdsQuery', displayE);
              done();
            } catch (err) {
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
          a.getDevicesDeviceIdServicesIdsQuery('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getDevicesDeviceIdServicesIdsQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getTimeObjectsByRevisionQuery - errors', () => {
      it('should have a getTimeObjectsByRevisionQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getTimeObjectsByRevisionQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getTimeObjectsByRevisionQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getTimeObjectsByRevisionQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSpecificTimeObjectQuery - errors', () => {
      it('should have a getSpecificTimeObjectQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificTimeObjectQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing revisionId', (done) => {
        try {
          a.getSpecificTimeObjectQuery(null, null, null, (data, error) => {
            try {
              const displayE = 'revisionId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificTimeObjectQuery', displayE);
              done();
            } catch (err) {
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
          a.getSpecificTimeObjectQuery('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificTimeObjectQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getTimeObjectsByDeviceQuery - errors', () => {
      it('should have a getTimeObjectsByDeviceQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getTimeObjectsByDeviceQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getTimeObjectsByDeviceQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getTimeObjectsByDeviceQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getPolicyRelevanceMetricsForTrafficQuery - errors', () => {
      it('should have a getPolicyRelevanceMetricsForTrafficQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getPolicyRelevanceMetricsForTrafficQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.getPolicyRelevanceMetricsForTrafficQuery('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getPolicyRelevanceMetricsForTrafficQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getViolationsForAnAccessRequestQuery - errors', () => {
      it('should have a getViolationsForAnAccessRequestQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getViolationsForAnAccessRequestQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.getViolationsForAnAccessRequestQuery('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getViolationsForAnAccessRequestQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#startATaskToCalculateViolationsForAnAccessRequestQuery - errors', () => {
      it('should have a startATaskToCalculateViolationsForAnAccessRequestQuery function', (done) => {
        try {
          assert.equal(true, typeof a.startATaskToCalculateViolationsForAnAccessRequestQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getAlertsQuery - errors', () => {
      it('should have a getAlertsQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getAlertsQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createAnAlertQuery - errors', () => {
      it('should have a createAnAlertQuery function', (done) => {
        try {
          assert.equal(true, typeof a.createAnAlertQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getASpecificAlertQuery - errors', () => {
      it('should have a getASpecificAlertQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getASpecificAlertQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getASpecificAlertQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getASpecificAlertQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#updateAnAlertQuery - errors', () => {
      it('should have a updateAnAlertQuery function', (done) => {
        try {
          assert.equal(true, typeof a.updateAnAlertQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.updateAnAlertQuery(null, null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-updateAnAlertQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteAlertsByIdsQuery - errors', () => {
      it('should have a deleteAlertsByIdsQuery function', (done) => {
        try {
          assert.equal(true, typeof a.deleteAlertsByIdsQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing ids', (done) => {
        try {
          a.deleteAlertsByIdsQuery(null, null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteAlertsByIdsQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createACloudTagPolicyQuery - errors', () => {
      it('should have a createACloudTagPolicyQuery function', (done) => {
        try {
          assert.equal(true, typeof a.createACloudTagPolicyQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getAllCloudTagPoliciesQuery - errors', () => {
      it('should have a getAllCloudTagPoliciesQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getAllCloudTagPoliciesQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getCloudTagPolicyQuery - errors', () => {
      it('should have a getCloudTagPolicyQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getCloudTagPolicyQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing policyId', (done) => {
        try {
          a.getCloudTagPolicyQuery(null, null, (data, error) => {
            try {
              const displayE = 'policyId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getCloudTagPolicyQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#replaceACloudTagPolicyQuery - errors', () => {
      it('should have a replaceACloudTagPolicyQuery function', (done) => {
        try {
          assert.equal(true, typeof a.replaceACloudTagPolicyQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing policyId', (done) => {
        try {
          a.replaceACloudTagPolicyQuery(null, null, null, (data, error) => {
            try {
              const displayE = 'policyId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-replaceACloudTagPolicyQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#modifyACloudTagPolicyQuery - errors', () => {
      it('should have a modifyACloudTagPolicyQuery function', (done) => {
        try {
          assert.equal(true, typeof a.modifyACloudTagPolicyQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing policyId', (done) => {
        try {
          a.modifyACloudTagPolicyQuery(null, null, null, (data, error) => {
            try {
              const displayE = 'policyId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-modifyACloudTagPolicyQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteCloudTagPolicyQuery - errors', () => {
      it('should have a deleteCloudTagPolicyQuery function', (done) => {
        try {
          assert.equal(true, typeof a.deleteCloudTagPolicyQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing policyId', (done) => {
        try {
          a.deleteCloudTagPolicyQuery(null, null, (data, error) => {
            try {
              const displayE = 'policyId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteCloudTagPolicyQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#checkIfTagsAreCompliantWithCloudTagPoliciesQuery - errors', () => {
      it('should have a checkIfTagsAreCompliantWithCloudTagPoliciesQuery function', (done) => {
        try {
          assert.equal(true, typeof a.checkIfTagsAreCompliantWithCloudTagPoliciesQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.checkIfTagsAreCompliantWithCloudTagPoliciesQuery('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-checkIfTagsAreCompliantWithCloudTagPoliciesQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getAllCloudTagPolicyViolationsForAVPCQuery - errors', () => {
      it('should have a getAllCloudTagPolicyViolationsForAVPCQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getAllCloudTagPolicyViolationsForAVPCQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createAnExceptionQuery - errors', () => {
      it('should have a createAnExceptionQuery function', (done) => {
        try {
          assert.equal(true, typeof a.createAnExceptionQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getAllExceptionsQuery - errors', () => {
      it('should have a getAllExceptionsQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getAllExceptionsQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getASpecificExceptionQuery - errors', () => {
      it('should have a getASpecificExceptionQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getASpecificExceptionQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing exceptionId', (done) => {
        try {
          a.getASpecificExceptionQuery(null, null, (data, error) => {
            try {
              const displayE = 'exceptionId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getASpecificExceptionQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteAnExceptionQuery - errors', () => {
      it('should have a deleteAnExceptionQuery function', (done) => {
        try {
          assert.equal(true, typeof a.deleteAnExceptionQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing exceptionId', (done) => {
        try {
          a.deleteAnExceptionQuery(null, null, (data, error) => {
            try {
              const displayE = 'exceptionId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteAnExceptionQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#startATaskToCalculateMatchingRulesForAnExceptionQuery - errors', () => {
      it('should have a startATaskToCalculateMatchingRulesForAnExceptionQuery function', (done) => {
        try {
          assert.equal(true, typeof a.startATaskToCalculateMatchingRulesForAnExceptionQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing exceptionId', (done) => {
        try {
          a.startATaskToCalculateMatchingRulesForAnExceptionQuery(null, null, (data, error) => {
            try {
              const displayE = 'exceptionId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-startATaskToCalculateMatchingRulesForAnExceptionQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getGlobalUnifiedSecurityPoliciesQuery - errors', () => {
      it('should have a getGlobalUnifiedSecurityPoliciesQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getGlobalUnifiedSecurityPoliciesQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getUnifiedSecurityPoliciesQuery - errors', () => {
      it('should have a getUnifiedSecurityPoliciesQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getUnifiedSecurityPoliciesQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteUnifiedSecurityPolicyQuery - errors', () => {
      it('should have a deleteUnifiedSecurityPolicyQuery function', (done) => {
        try {
          assert.equal(true, typeof a.deleteUnifiedSecurityPolicyQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.deleteUnifiedSecurityPolicyQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteUnifiedSecurityPolicyQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getUnifiedSecurityPolicyAsCSVQuery - errors', () => {
      it('should have a getUnifiedSecurityPolicyAsCSVQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getUnifiedSecurityPolicyAsCSVQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getUnifiedSecurityPolicyAsCSVQuery(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getUnifiedSecurityPolicyAsCSVQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#setManualDeviceMappingQuery - errors', () => {
      it('should have a setManualDeviceMappingQuery function', (done) => {
        try {
          assert.equal(true, typeof a.setManualDeviceMappingQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.setManualDeviceMappingQuery(null, null, null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-setManualDeviceMappingQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.setManualDeviceMappingQuery('fakeparam', 'fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-setManualDeviceMappingQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getUrlCategories - errors', () => {
      it('should have a getUrlCategories function', (done) => {
        try {
          assert.equal(true, typeof a.getUrlCategories === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing revisionId', (done) => {
        try {
          a.getUrlCategories(null, null, (data, error) => {
            try {
              const displayE = 'revisionId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getUrlCategories', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getProperties - errors', () => {
      it('should have a getProperties function', (done) => {
        try {
          assert.equal(true, typeof a.getProperties === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#setProperties - errors', () => {
      it('should have a setProperties function', (done) => {
        try {
          assert.equal(true, typeof a.setProperties === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.setProperties(null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-setProperties', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getPBRRules - errors', () => {
      it('should have a getPBRRules function', (done) => {
        try {
          assert.equal(true, typeof a.getPBRRules === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getPBRRules(null, null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getPBRRules', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#cloudSuggestions - errors', () => {
      it('should have a cloudSuggestions function', (done) => {
        try {
          assert.equal(true, typeof a.cloudSuggestions === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#cloudSuggestion - errors', () => {
      it('should have a cloudSuggestion function', (done) => {
        try {
          assert.equal(true, typeof a.cloudSuggestion === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing cloudId', (done) => {
        try {
          a.cloudSuggestion(null, null, (data, error) => {
            try {
              const displayE = 'cloudId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-cloudSuggestion', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getRouteMaps - errors', () => {
      it('should have a getRouteMaps function', (done) => {
        try {
          assert.equal(true, typeof a.getRouteMaps === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getRouteMaps(null, null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getRouteMaps', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#addZonesEntries - errors', () => {
      it('should have a addZonesEntries function', (done) => {
        try {
          assert.equal(true, typeof a.addZonesEntries === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.addZonesEntries('fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-addZonesEntries', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSdWanBindingsByRevision - errors', () => {
      it('should have a getSdWanBindingsByRevision function', (done) => {
        try {
          assert.equal(true, typeof a.getSdWanBindingsByRevision === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getSdWanBindingsByRevision(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSdWanBindingsByRevision', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSdWanBindingsByDevice - errors', () => {
      it('should have a getSdWanBindingsByDevice function', (done) => {
        try {
          assert.equal(true, typeof a.getSdWanBindingsByDevice === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getSdWanBindingsByDevice(null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSdWanBindingsByDevice', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#exportRulesToCsv - errors', () => {
      it('should have a exportRulesToCsv function', (done) => {
        try {
          assert.equal(true, typeof a.exportRulesToCsv === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#findServicesObjects - errors', () => {
      it('should have a findServicesObjects function', (done) => {
        try {
          assert.equal(true, typeof a.findServicesObjects === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getDeviceMapping - errors', () => {
      it('should have a getDeviceMapping function', (done) => {
        try {
          assert.equal(true, typeof a.getDeviceMapping === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getDeviceMapping(null, null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getDeviceMapping', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getResolvedInternetRepresentationForDeviceQuery - errors', () => {
      it('should have a getResolvedInternetRepresentationForDeviceQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getResolvedInternetRepresentationForDeviceQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getResolvedInternetRepresentationForDeviceQuery(null, null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getResolvedInternetRepresentationForDeviceQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#updateInternetRepresentationForDeviceQuery - errors', () => {
      it('should have a updateInternetRepresentationForDeviceQuery function', (done) => {
        try {
          assert.equal(true, typeof a.updateInternetRepresentationForDeviceQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.updateInternetRepresentationForDeviceQuery(null, null, null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-updateInternetRepresentationForDeviceQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.updateInternetRepresentationForDeviceQuery('fakeparam', 'fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-updateInternetRepresentationForDeviceQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getInternetRepresentationForDeviceQuery - errors', () => {
      it('should have a getInternetRepresentationForDeviceQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getInternetRepresentationForDeviceQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getInternetRepresentationForDeviceQuery(null, null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getInternetRepresentationForDeviceQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteInternetRepresentationForDeviceQuery - errors', () => {
      it('should have a deleteInternetRepresentationForDeviceQuery function', (done) => {
        try {
          assert.equal(true, typeof a.deleteInternetRepresentationForDeviceQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.deleteInternetRepresentationForDeviceQuery(null, null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteInternetRepresentationForDeviceQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#createAZonePatternEntryInASpecificZoneQuery - errors', () => {
      it('should have a createAZonePatternEntryInASpecificZoneQuery function', (done) => {
        try {
          assert.equal(true, typeof a.createAZonePatternEntryInASpecificZoneQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing zoneId', (done) => {
        try {
          a.createAZonePatternEntryInASpecificZoneQuery(null, null, null, (data, error) => {
            try {
              const displayE = 'zoneId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-createAZonePatternEntryInASpecificZoneQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.createAZonePatternEntryInASpecificZoneQuery('fakeparam', 'fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-createAZonePatternEntryInASpecificZoneQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getAllPatternEntriesForSpecificZonesQuery - errors', () => {
      it('should have a getAllPatternEntriesForSpecificZonesQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getAllPatternEntriesForSpecificZonesQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing ids', (done) => {
        try {
          a.getAllPatternEntriesForSpecificZonesQuery(null, null, (data, error) => {
            try {
              const displayE = 'ids is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getAllPatternEntriesForSpecificZonesQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getASpecificZonePatternEntryForASpecificZoneQuery - errors', () => {
      it('should have a getASpecificZonePatternEntryForASpecificZoneQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getASpecificZonePatternEntryForASpecificZoneQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getASpecificZonePatternEntryForASpecificZoneQuery(null, null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getASpecificZonePatternEntryForASpecificZoneQuery', displayE);
              done();
            } catch (err) {
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
          a.getASpecificZonePatternEntryForASpecificZoneQuery('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'zoneId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getASpecificZonePatternEntryForASpecificZoneQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getRevisionsIdRulesRuleIdDocumentationQuery - errors', () => {
      it('should have a getRevisionsIdRulesRuleIdDocumentationQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getRevisionsIdRulesRuleIdDocumentationQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getRevisionsIdRulesRuleIdDocumentationQuery(null, null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getRevisionsIdRulesRuleIdDocumentationQuery', displayE);
              done();
            } catch (err) {
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
          a.getRevisionsIdRulesRuleIdDocumentationQuery('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'ruleId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getRevisionsIdRulesRuleIdDocumentationQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#putRevisionsIdRulesRuleIdDocumentationQuery - errors', () => {
      it('should have a putRevisionsIdRulesRuleIdDocumentationQuery function', (done) => {
        try {
          assert.equal(true, typeof a.putRevisionsIdRulesRuleIdDocumentationQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.putRevisionsIdRulesRuleIdDocumentationQuery(null, null, null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-putRevisionsIdRulesRuleIdDocumentationQuery', displayE);
              done();
            } catch (err) {
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
          a.putRevisionsIdRulesRuleIdDocumentationQuery('fakeparam', null, null, null, (data, error) => {
            try {
              const displayE = 'ruleId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-putRevisionsIdRulesRuleIdDocumentationQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.putRevisionsIdRulesRuleIdDocumentationQuery('fakeparam', 'fakeparam', 'fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-putRevisionsIdRulesRuleIdDocumentationQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteRuleDocumentation - errors', () => {
      it('should have a deleteRuleDocumentation function', (done) => {
        try {
          assert.equal(true, typeof a.deleteRuleDocumentation === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.deleteRuleDocumentation(null, null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteRuleDocumentation', displayE);
              done();
            } catch (err) {
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
          a.deleteRuleDocumentation('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'ruleId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteRuleDocumentation', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getSpecificRuleDocumentationQuery - errors', () => {
      it('should have a getSpecificRuleDocumentationQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getSpecificRuleDocumentationQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.getSpecificRuleDocumentationQuery(null, null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificRuleDocumentationQuery', displayE);
              done();
            } catch (err) {
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
          a.getSpecificRuleDocumentationQuery('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'ruleId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getSpecificRuleDocumentationQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#modifySpecificRuleDocumentationQuery - errors', () => {
      it('should have a modifySpecificRuleDocumentationQuery function', (done) => {
        try {
          assert.equal(true, typeof a.modifySpecificRuleDocumentationQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.modifySpecificRuleDocumentationQuery(null, null, null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-modifySpecificRuleDocumentationQuery', displayE);
              done();
            } catch (err) {
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
          a.modifySpecificRuleDocumentationQuery('fakeparam', null, null, null, (data, error) => {
            try {
              const displayE = 'ruleId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-modifySpecificRuleDocumentationQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing body', (done) => {
        try {
          a.modifySpecificRuleDocumentationQuery('fakeparam', 'fakeparam', 'fakeparam', null, (data, error) => {
            try {
              const displayE = 'body is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-modifySpecificRuleDocumentationQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#deleteSpecificRuleDocumentationQuery - errors', () => {
      it('should have a deleteSpecificRuleDocumentationQuery function', (done) => {
        try {
          assert.equal(true, typeof a.deleteSpecificRuleDocumentationQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing id', (done) => {
        try {
          a.deleteSpecificRuleDocumentationQuery(null, null, null, (data, error) => {
            try {
              const displayE = 'id is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteSpecificRuleDocumentationQuery', displayE);
              done();
            } catch (err) {
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
          a.deleteSpecificRuleDocumentationQuery('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'ruleId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-deleteSpecificRuleDocumentationQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getLastHitsForAllRulesByDeviceQuery - errors', () => {
      it('should have a getLastHitsForAllRulesByDeviceQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getLastHitsForAllRulesByDeviceQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getLastHitsForAllRulesByDeviceQuery(null, null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getLastHitsForAllRulesByDeviceQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getlasthitforaspecificruleQuery - errors', () => {
      it('should have a getlasthitforaspecificruleQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getlasthitforaspecificruleQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing ruleUid', (done) => {
        try {
          a.getlasthitforaspecificruleQuery(null, null, null, (data, error) => {
            try {
              const displayE = 'ruleUid is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getlasthitforaspecificruleQuery', displayE);
              done();
            } catch (err) {
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
          a.getlasthitforaspecificruleQuery('fakeparam', null, null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getlasthitforaspecificruleQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getTheAmountOfViolatingRulesForTheSpecifiedDeviceQuery - errors', () => {
      it('should have a getTheAmountOfViolatingRulesForTheSpecifiedDeviceQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getTheAmountOfViolatingRulesForTheSpecifiedDeviceQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getTheAmountOfViolatingRulesForTheSpecifiedDeviceQuery(null, null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getTheAmountOfViolatingRulesForTheSpecifiedDeviceQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
              done(err);
            }
          });
        } catch (error) {
          log.error(`Adapter Exception: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
    });

    describe('#getTheViolatingRulesForTheSpecifiedDeviceQuery - errors', () => {
      it('should have a getTheViolatingRulesForTheSpecifiedDeviceQuery function', (done) => {
        try {
          assert.equal(true, typeof a.getTheViolatingRulesForTheSpecifiedDeviceQuery === 'function');
          done();
        } catch (error) {
          log.error(`Test Failure: ${error}`);
          done(error);
        }
      }).timeout(attemptTimeout);
      it('should error if - missing deviceId', (done) => {
        try {
          a.getTheViolatingRulesForTheSpecifiedDeviceQuery(null, null, (data, error) => {
            try {
              const displayE = 'deviceId is required';
              runErrorAsserts(data, error, 'AD.300', 'Test-tufin_securetrack-adapter-getTheViolatingRulesForTheSpecifiedDeviceQuery', displayE);
              done();
            } catch (err) {
              log.error(`Test Failure: ${err}`);
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
