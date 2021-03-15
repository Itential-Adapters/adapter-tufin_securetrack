/* @copyright Itential, LLC 2019 (pre-modifications) */

/* eslint import/no-dynamic-require: warn */
/* eslint object-curly-newline: warn */
/* eslint no-underscore-dangle: warn  */
/* eslint camelcase: warn  */

// Set globals
/* global log */

/* Required libraries.  */
const path = require('path');

/* Fetch in the other needed components for the this Adaptor */
const AdapterBaseCl = require(path.join(__dirname, 'adapterBase.js'));

/**
 * This is the adapter/interface into Tufin_securetrack
 */

/* GENERAL ADAPTER FUNCTIONS */
class TufinSecuretrack extends AdapterBaseCl {
  /**
   * TufinSecuretrack Adapter
   * @constructor
   */
  /* Working on changing the way we do Emit methods due to size and time constrainsts
  constructor(prongid, properties) {
    // Instantiate the AdapterBase super class
    super(prongid, properties);

    const restFunctionNames = this.getWorkflowFunctions();

    // Dynamically bind emit functions
    for (let i = 0; i < restFunctionNames.length; i += 1) {
      // Bind function to have name fnNameEmit for fnName
      const version = restFunctionNames[i].match(/__v[0-9]+/);
      const baseFnName = restFunctionNames[i].replace(/__v[0-9]+/, '');
      const fnNameEmit = version ? `${baseFnName}Emit${version}` : `${baseFnName}Emit`;
      this[fnNameEmit] = function (...args) {
        // extract the callback
        const callback = args[args.length - 1];
        // slice the callback from args so we can insert our own
        const functionArgs = args.slice(0, args.length - 1);
        // create a random name for the listener
        const eventName = `${restFunctionNames[i]}:${Math.random().toString(36)}`;
        // tell the calling class to start listening
        callback({ event: eventName, status: 'received' });
        // store parent for use of this context later
        const parent = this;
        // store emission function
        const func = function (val, err) {
          parent.removeListener(eventName, func);
          parent.emit(eventName, val, err);
        };
        // Use apply to call the function in a specific context
        this[restFunctionNames[i]].apply(this, functionArgs.concat([func])); // eslint-disable-line prefer-spread
      };
    }

    // Uncomment if you have things to add to the constructor like using your own properties.
    // Otherwise the constructor in the adapterBase will be used.
    // Capture my own properties - they need to be defined in propertiesSchema.json
    // if (this.allProps && this.allProps.myownproperty) {
    //   mypropvariable = this.allProps.myownproperty;
    // }
  }
  */

  /**
   * @callback healthCallback
   * @param {Object} reqObj - the request to send into the healthcheck
   * @param {Callback} callback - The results of the call
   */
  healthCheck(reqObj, callback) {
    // you can modify what is passed into the healthcheck by changing things in the newReq
    let newReq = null;
    if (reqObj) {
      newReq = Object.assign(...reqObj);
    }
    super.healthCheck(newReq, callback);
  }

  /**
   * @getWorkflowFunctions
   */
  getWorkflowFunctions(inIgnore) {
    let myIgnore = [];
    if (!inIgnore && Array.isArray(inIgnore)) {
      myIgnore = inIgnore;
    } else if (!inIgnore && typeof inIgnore === 'string') {
      myIgnore = [inIgnore];
    }

    // The generic adapter functions should already be ignored (e.g. healthCheck)
    // you can add specific methods that you do not want to be workflow functions to ignore like below
    // myIgnore.push('myMethodNotInWorkflow');

    return super.getWorkflowFunctions(myIgnore);
  }

  /**
   * updateAdapterConfiguration is used to update any of the adapter configuration files. This
   * allows customers to make changes to adapter configuration without having to be on the
   * file system.
   *
   * @function updateAdapterConfiguration
   * @param {string} configFile - the name of the file being updated (required)
   * @param {Object} changes - an object containing all of the changes = formatted like the configuration file (required)
   * @param {string} entity - the entity to be changed, if an action, schema or mock data file (optional)
   * @param {string} type - the type of entity file to change, (action, schema, mock) (optional)
   * @param {string} action - the action to be changed, if an action, schema or mock data file (optional)
   * @param {Callback} callback - The results of the call
   */
  updateAdapterConfiguration(configFile, changes, entity, type, action, callback) {
    const origin = `${this.id}-adapter-updateAdapterConfiguration`;
    log.trace(origin);
    super.updateAdapterConfiguration(configFile, changes, entity, type, action, callback);
  }

  /**
   * See if the API path provided is found in this adapter
   *
   * @function findPath
   * @param {string} apiPath - the api path to check on
   * @param {Callback} callback - The results of the call
   */
  findPath(apiPath, callback) {
    const origin = `${this.id}-adapter-findPath`;
    log.trace(origin);
    super.findPath(apiPath, callback);
  }

  /**
    * @summary Suspends adapter
    *
    * @function suspend
    * @param {Callback} callback - callback function
    */
  suspend(mode, callback) {
    const origin = `${this.id}-adapter-suspend`;
    log.trace(origin);
    try {
      return super.suspend(mode, callback);
    } catch (error) {
      log.error(`${origin}: ${error}`);
      return callback(null, error);
    }
  }

  /**
    * @summary Unsuspends adapter
    *
    * @function unsuspend
    * @param {Callback} callback - callback function
    */
  unsuspend(callback) {
    const origin = `${this.id}-adapter-unsuspend`;
    log.trace(origin);
    try {
      return super.unsuspend(callback);
    } catch (error) {
      log.error(`${origin}: ${error}`);
      return callback(null, error);
    }
  }

  /**
    * @summary Get the Adaoter Queue
    *
    * @function getQueue
    * @param {Callback} callback - callback function
    */
  getQueue(callback) {
    const origin = `${this.id}-adapter-getQueue`;
    log.trace(origin);
    return super.getQueue(callback);
  }

  /**
  * @summary Runs troubleshoot scripts for adapter
  *
  * @function troubleshoot
  * @param {Object} props - the connection, healthcheck and authentication properties
  *
  * @param {boolean} persistFlag - whether the adapter properties should be updated
  * @param {Callback} callback - The results of the call
  */
  troubleshoot(props, persistFlag, callback) {
    const origin = `${this.id}-adapter-troubleshoot`;
    log.trace(origin);
    try {
      return super.troubleshoot(props, persistFlag, this, callback);
    } catch (error) {
      log.error(`${origin}: ${error}`);
      return callback(null, error);
    }
  }

  /**
    * @summary runs healthcheck script for adapter
    *
    * @function runHealthcheck
    * @param {Adapter} adapter - adapter instance to troubleshoot
    * @param {Callback} callback - callback function
    */
  runHealthcheck(callback) {
    const origin = `${this.id}-adapter-runHealthcheck`;
    log.trace(origin);
    try {
      return super.runHealthcheck(this, callback);
    } catch (error) {
      log.error(`${origin}: ${error}`);
      return callback(null, error);
    }
  }

  /**
    * @summary runs connectivity check script for adapter
    *
    * @function runConnectivity
    * @param {Callback} callback - callback function
    */
  runConnectivity(callback) {
    const origin = `${this.id}-adapter-runConnectivity`;
    log.trace(origin);
    try {
      return super.runConnectivity(callback);
    } catch (error) {
      log.error(`${origin}: ${error}`);
      return callback(null, error);
    }
  }

  /**
    * @summary runs basicGet script for adapter
    *
    * @function runBasicGet
    * @param {Callback} callback - callback function
    */
  runBasicGet(callback) {
    const origin = `${this.id}-adapter-runBasicGet`;
    log.trace(origin);
    try {
      return super.runBasicGet(callback);
    } catch (error) {
      log.error(`${origin}: ${error}`);
      return callback(null, error);
    }
  }

  /**
   * @summary Determines if this adapter supports the specific entity
   *
   * @function hasEntity
   * @param {String} entityType - the entity type to check for
   * @param {String/Array} entityId - the specific entity we are looking for
   *
   * @param {Callback} callback - An array of whether the adapter can has the
   *                              desired capability or an error
   */
  hasEntity(entityType, entityId, callback) {
    const origin = `${this.id}-adapter-hasEntity`;
    log.trace(origin);

    // Make the call -
    // verifyCapability(entityType, actionType, entityId, callback)
    return this.verifyCapability(entityType, null, entityId, callback);
  }

  /**
   * @summary Provides a way for the adapter to tell north bound integrations
   * whether the adapter supports type, action and specific entity
   *
   * @function verifyCapability
   * @param {String} entityType - the entity type to check for
   * @param {String} actionType - the action type to check for
   * @param {String/Array} entityId - the specific entity we are looking for
   *
   * @param {Callback} callback - An array of whether the adapter can has the
   *                              desired capability or an error
   */
  verifyCapability(entityType, actionType, entityId, callback) {
    const meth = 'adapterBase-verifyCapability';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    // if caching
    if (this.caching) {
      // Make the call - verifyCapability(entityType, actionType, entityId, callback)
      return this.requestHandlerInst.verifyCapability(entityType, actionType, entityId, (results, error) => {
        if (error) {
          return callback(null, error);
        }

        // if the cache needs to be updated, update and try again
        if (results && results[0] === 'needupdate') {
          switch (entityType) {
            case 'template_entity': {
              // if the cache is invalid, update the cache
              return this.getEntities(null, null, null, null, (data, err) => {
                if (err) {
                  const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Could not update entity: $VARIABLE$, cache', [entityType], null, null, null);
                  log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
                  return callback(null, errorObj);
                }

                // need to check the cache again since it has been updated
                return this.requestHandlerInst.verifyCapability(entityType, actionType, entityId, (vcapable, verror) => {
                  if (verror) {
                    return callback(null, verror);
                  }

                  return this.capabilityResults(vcapable, callback);
                });
              });
            }
            default: {
              // unsupported entity type
              const result = [false];

              // put false in array for all entities
              if (Array.isArray(entityId)) {
                for (let e = 1; e < entityId.length; e += 1) {
                  result.push(false);
                }
              }

              return callback(result);
            }
          }
        }

        // return the results
        return this.capabilityResults(results, callback);
      });
    }

    // if no entity id
    if (!entityId) {
      // need to check the cache again since it has been updated
      return this.requestHandlerInst.verifyCapability(entityType, actionType, null, (vcapable, verror) => {
        if (verror) {
          return callback(null, verror);
        }

        return this.capabilityResults(vcapable, callback);
      });
    }

    // if not caching
    switch (entityType) {
      case 'template_entity': {
        // need to get the entities to check
        return this.getEntities(null, null, null, null, (data, err) => {
          if (err) {
            const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Could not update entity: $VARIABLE$, cache', [entityType], null, null, null);
            log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
            return callback(null, errorObj);
          }

          // need to check the cache again since it has been updated
          return this.requestHandlerInst.verifyCapability(entityType, actionType, null, (vcapable, verror) => {
            if (verror) {
              return callback(null, verror);
            }

            // is the entity in the list?
            const isEntity = this.entityInList(entityId, data.response, callback);
            const res = [];

            // not found
            for (let i = 0; i < isEntity.length; i += 1) {
              if (vcapable) {
                res.push(isEntity[i]);
              } else {
                res.push(false);
              }
            }

            return callback(res);
          });
        });
      }
      default: {
        // unsupported entity type
        const result = [false];

        // put false in array for all entities
        if (Array.isArray(entityId)) {
          for (let e = 1; e < entityId.length; e += 1) {
            result.push(false);
          }
        }

        return callback(result);
      }
    }
  }

  /**
   * @summary Updates the cache for all entities by call the get All entity method
   *
   * @function updateEntityCache
   *
   */
  updateEntityCache() {
    const origin = `${this.id}-adapter-updateEntityCache`;
    log.trace(origin);

    if (this.caching) {
      // if the cache is invalid, update the cache
      this.getEntities(null, null, null, null, (data, err) => {
        if (err) {
          log.trace(`${origin}: Could not load template_entity into cache - ${err}`);
        }
      });
    }
  }

  /**
   * Makes the requested generic call
   *
   * @function genericAdapterRequest
   * @param {String} uriPath - the path of the api call - do not include the host, port, base path or version (required)
   * @param {String} restMethod - the rest method (GET, POST, PUT, PATCH, DELETE) (required)
   * @param {Object} queryData - the parameters to be put on the url (optional).
   *                 Can be a stringified Object.
   * @param {Object} requestBody - the body to add to the request (optional).
   *                 Can be a stringified Object.
   * @param {Object} addlHeaders - additional headers to be put on the call (optional).
   *                 Can be a stringified Object.
   * @param {getCallback} callback - a callback function to return the result (Generics)
   *                 or the error
   */
  genericAdapterRequest(uriPath, restMethod, queryData, requestBody, addlHeaders, callback) {
    const meth = 'adapter-genericAdapterRequest';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (uriPath === undefined || uriPath === null || uriPath === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['uriPath'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (restMethod === undefined || restMethod === null || restMethod === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['restMethod'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // remove any leading / and split the uripath into path variables
    let myPath = uriPath;
    while (myPath.indexOf('/') === 0) {
      myPath = myPath.substring(1);
    }
    const pathVars = myPath.split('/');
    const queryParamsAvailable = queryData;
    const queryParams = {};
    const bodyVars = requestBody;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      uriOptions: {}
    };
    // add headers if provided
    if (addlHeaders) {
      reqObj.addlHeaders = addlHeaders;
    }

    // determine the call and return flag
    let action = 'getGenerics';
    let returnF = true;
    if (restMethod.toUpperCase() === 'POST') {
      action = 'createGeneric';
    } else if (restMethod.toUpperCase() === 'PUT') {
      action = 'updateGeneric';
    } else if (restMethod.toUpperCase() === 'PATCH') {
      action = 'patchGeneric';
    } else if (restMethod.toUpperCase() === 'DELETE') {
      action = 'deleteGeneric';
      returnF = false;
    }

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('.generic', action, reqObj, returnF, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['genericAdapterRequest'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @callback healthCallback
   * @param {Object} result - the result of the get request (contains an id and a status)
   */
  /**
   * @callback getCallback
   * @param {Object} result - the result of the get request (entity/ies)
   * @param {String} error - any error that occurred
   */
  /**
   * @callback createCallback
   * @param {Object} item - the newly created entity
   * @param {String} error - any error that occurred
   */
  /**
   * @callback updateCallback
   * @param {String} status - the status of the update action
   * @param {String} error - any error that occurred
   */
  /**
   * @callback deleteCallback
   * @param {String} status - the status of the delete action
   * @param {String} error - any error that occurred
   */

  /**
   * @summary Some firewall vendors use special fields in their security policy. For example: Palo Alto uses Tags, Security Profiles and Log Profiles and Fortinet uses NAT Pools and other NAT configurations. SecureTrack refers to these fields as “Additional Parameters”. The additional parameters API retrieves the possible values of these fields. This API is currently supported for Palo Alto Networks firewalls and Fortinet devices managed by Fortimanager.   Parameters:  context: Global MSSP context [optional] ...(description truncated)
   *
   * @function getAdditionalParametersIdentitiesByRevision
   * @param {default} revisionId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getAdditionalParametersIdentitiesByRevision(revisionId, callback) {
    const meth = 'adapter-getAdditionalParametersIdentitiesByRevision';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (revisionId === undefined || revisionId === null || revisionId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['revisionId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [revisionId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('AdditionalPolicyFields', 'getAdditionalParametersIdentitiesByRevision', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getAdditionalParametersIdentitiesByRevision'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Some firewall vendors use special fields in their security policy. For example: Palo Alto uses Tags, Security Profiles and Log Profiles and Fortinet uses NAT Pools and other NAT configurations. SecureTrack refers to these fields as “Additional Parameters”. The additional parameters API retrieves the possible values of these fields. This API is currently supported for Palo Alto Networks firewalls and Fortinet devices managed by Fortimanager.   Parameters:  context: Global MSSP context [optional] ...(description truncated)
   *
   * @function getSpecificAdditionalParameterIdentity
   * @param {default} revisionId - path parameter
   * @param {default} ids - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSpecificAdditionalParameterIdentity(revisionId, ids, callback) {
    const meth = 'adapter-getSpecificAdditionalParameterIdentity';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (revisionId === undefined || revisionId === null || revisionId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['revisionId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (ids === undefined || ids === null || ids === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['ids'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [revisionId, ids];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('AdditionalPolicyFields', 'getSpecificAdditionalParameterIdentity', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSpecificAdditionalParameterIdentity'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Fetches one or more URL Categories. This API is supported for Panorama in advanced mode and Panorama Device Groups.   Parameters:  context: Global MSSP context [optional] revision_id: Revision ID ids: Url Category IDs separated by commas   Usage Example  https://192.168.1.1/securetrack/api/revisions/762/url_categories/242767,242768,242760
   *
   * @function getAURLCategory
   * @param {default} revisionId - path parameter
   * @param {default} ids - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getAURLCategory(revisionId, ids, callback) {
    const meth = 'adapter-getAURLCategory';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (revisionId === undefined || revisionId === null || revisionId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['revisionId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (ids === undefined || ids === null || ids === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['ids'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [revisionId, ids];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('AdditionalPolicyFields', 'getAURLCategory', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getAURLCategory'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Fetches list of applications defined on device given by ID. This API is currently supported for Palo Alto Networks firewalls. In Panorama NG, overrides property in returned ApplicationDTO will be set to true, if the application overrides an original value. The default value for get_total is false. For API calls that have pagination, set get_total to true on the first call. Use the value to returned in total to determine how many additional calls are required to retrieve all the desired results. ...(description truncated)
   *
   * @function getApplicationIdentitiesByDevice
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getApplicationIdentitiesByDevice(id, callback) {
    const meth = 'adapter-getApplicationIdentitiesByDevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ApplicationIDs', 'getApplicationIdentitiesByDevice', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getApplicationIdentitiesByDevice'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Fetches one or more applications defined by a device ID and Application Id or comma separated applications ids list. This API is currently supported for Palo Alto Networks firewalls.  Note:  This API retrieves the information from the latest revision. In Panorama NG, overrides property in returned ApplicationDTO will be set to true, if the application overrides an original value.    Parameters:  context: Global MSSP context [optional] id: Device ID ids: Application IDs separated by commas   Usag...(description truncated)
   *
   * @function getSpecificApplicationIdentity
   * @param {default} id - path parameter
   * @param {default} ids - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSpecificApplicationIdentity(id, ids, callback) {
    const meth = 'adapter-getSpecificApplicationIdentity';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (ids === undefined || ids === null || ids === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['ids'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id, ids];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ApplicationIDs', 'getSpecificApplicationIdentity', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSpecificApplicationIdentity'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Fetches list of applications defined in a revision given by ID. This API is currently supported for Palo Alto Networks firewalls. In Panorama NG, overrides property in returned ApplicationDTO will be set to true, if the application overrides an original value. The default value for get_total is false. For API calls that have pagination, set get_total to true on the first call. Use the value to returned in total to determine how many additional calls are required to retrieve all the desired resul...(description truncated)
   *
   * @function getApplicationsIdentitiesByRevision
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getApplicationsIdentitiesByRevision(id, callback) {
    const meth = 'adapter-getApplicationsIdentitiesByRevision';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ApplicationIDs', 'getApplicationsIdentitiesByRevision', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getApplicationsIdentitiesByRevision'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Fetches one or more applications defined by a revision ID and Application Id or comma separated applications ids list. This API is currently supported for Palo Alto Networks firewalls. In Panorama NG, overrides property in returned ApplicationDTO will be set to true, if the application overrides an original value.    Parameters:  context: Global MSSP context [optional] revision_id: Revision ID ids: Application IDs separated by commas   Usage Example  https://192.168.1.1/securetrack/api/revisions...(description truncated)
   *
   * @function getRevisionsRevisionIdApplicationsIds
   * @param {default} revisionId - path parameter
   * @param {default} ids - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getRevisionsRevisionIdApplicationsIds(revisionId, ids, callback) {
    const meth = 'adapter-getRevisionsRevisionIdApplicationsIds';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (revisionId === undefined || revisionId === null || revisionId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['revisionId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (ids === undefined || ids === null || ids === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['ids'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [revisionId, ids];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ApplicationIDs', 'getRevisionsRevisionIdApplicationsIds', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getRevisionsRevisionIdApplicationsIds'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary This API checks for unauthorized changes between any two versions of a firewall policy. The API returns authorized if and only if all traffic changes between the two versions were authorized by SecureChange tickets. The API returns unauthorized if there is at least one change that cannot be matched to a SecureChange ticket.  The API checks access that was granted (checked against access requests with action=Accept) as well as access that was removed (checked against access requests with action=D...(description truncated)
   *
   * @function determineIfChangesBetweenTwoRevisionsAreAuthorized
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  determineIfChangesBetweenTwoRevisionsAreAuthorized(callback) {
    const meth = 'adapter-determineIfChangesBetweenTwoRevisionsAreAuthorized';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ChangeAuthorization', 'determineIfChangesBetweenTwoRevisionsAreAuthorized', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['determineIfChangesBetweenTwoRevisionsAreAuthorized'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary This API compares two arbitrary revisions from any devices. The comparison will be done in terms of allowed/denied traffic. The API returns authorized if and only if there are no differences between the traffic allowed/denied by the rules in the two revisions. The API returns unauthorized if there is at least one difference in terms of allowed/denied traffic between the two revisions. Note 1: To map policies from one revision to the other use oldId2newIdMap and provide the UIDs of the policies t...(description truncated)
   *
   * @function compareRevisionsOnTwoDifferentDevicesInTermsOfTraffic
   * @param {object} body - POST body parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  compareRevisionsOnTwoDifferentDevicesInTermsOfTraffic(body, callback) {
    const meth = 'adapter-compareRevisionsOnTwoDifferentDevicesInTermsOfTraffic';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '', contentType: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ChangeAuthorization', 'compareRevisionsOnTwoDifferentDevicesInTermsOfTraffic', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['compareRevisionsOnTwoDifferentDevicesInTermsOfTraffic'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieves a list of all change windows. For valid pagination, both  start  and  count  should be provided. Otherwise, pagination is turned off.  The default value for  get_total  is false. For API calls that have pagination, set  get_total  to true on the first call.  Use the value to returned in total to determine how many additional calls are required to retrieve all the desired results.  To improve performance, omit or set  get_total  to false on any subsequent calls.     Parameters:  context...(description truncated)
   *
   * @function getNameAndStatusForAllChangeWindows
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getNameAndStatusForAllChangeWindows(callback) {
    const meth = 'adapter-getNameAndStatusForAllChangeWindows';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ChangeWindows', 'getNameAndStatusForAllChangeWindows', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getNameAndStatusForAllChangeWindows'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieves scheduling and device details for a specific change window.   Parameters:  context: Global MSSP context [optional] uid: Change window uuid task_id: Task Id   Usage Example     URL  https://192.168.1.1/securetrack/api/change_windows/fc7b167c-29ea-49a1-9ee3-efb6d1351343/tasks/1     OUTPUT   { &nbsp;&nbsp;&nbsp;&nbsp;"commit_task": { &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id": 1, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"start_date": "04-Nov-2018 01:30:00PM +0200", &nbsp;...(description truncated)
   *
   * @function getSchedulingAndDeviceDetailsForASpecificChangeWindow
   * @param {default} uid - path parameter
   * @param {default} taskId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSchedulingAndDeviceDetailsForASpecificChangeWindow(uid, taskId, callback) {
    const meth = 'adapter-getSchedulingAndDeviceDetailsForASpecificChangeWindow';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (uid === undefined || uid === null || uid === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['uid'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (taskId === undefined || taskId === null || taskId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['taskId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [uid, taskId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ChangeWindows', 'getSchedulingAndDeviceDetailsForASpecificChangeWindow', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSchedulingAndDeviceDetailsForASpecificChangeWindow'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieves a list of completed policy changes for a specific change window. For valid pagination, both  start  and  count  should be provided. Otherwise, pagination is turned off.  The default value for  get_total  is false. For API calls that have pagination, set  get_total  to true on the first call.  Use the value to returned in total to determine how many additional calls are required to retrieve all the desired results.  To improve performance, omit or set  get_total  to false on any subsequ...(description truncated)
   *
   * @function getAListOfCompletedPolicyChangesForASpecificChangeWindow
   * @param {default} uid - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getAListOfCompletedPolicyChangesForASpecificChangeWindow(uid, callback) {
    const meth = 'adapter-getAListOfCompletedPolicyChangesForASpecificChangeWindow';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (uid === undefined || uid === null || uid === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['uid'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [uid];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ChangeWindows', 'getAListOfCompletedPolicyChangesForASpecificChangeWindow', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getAListOfCompletedPolicyChangesForASpecificChangeWindow'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Reflects static data from the running-config. For dynamic information see the /topology_interfaces API. This API is not applicable for Check Point.   Parameters:  context: Global MSSP context [optional] id: Device ID   Usage Example  https://192.168.1.1/securetrack/api/devices/10/interfaces
   *
   * @function getNetworkInterfacesByDevice
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getNetworkInterfacesByDevice(id, callback) {
    const meth = 'adapter-getNetworkInterfacesByDevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('DeviceInterfacesAndZones', 'getNetworkInterfacesByDevice', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getNetworkInterfacesByDevice'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Reflects static data from the running-config. For dynamic information see the /topology_interfaces API. This API is not applicable for Check Point.   Parameters:  context: Global MSSP context [optional] id: Revision ID   Usage Example  https://192.168.1.1/securetrack/api/revisions/227/interfaces
   *
   * @function getNetworkInterfacesByRevision
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getNetworkInterfacesByRevision(id, callback) {
    const meth = 'adapter-getNetworkInterfacesByRevision';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('DeviceInterfacesAndZones', 'getNetworkInterfacesByRevision', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getNetworkInterfacesByRevision'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns a list of the zones for the specified Juniper, Stonesoft, Fortinet or Palo Alto Networks revision. Note: this API returns device zones, not Tufin zones.   Parameters:  context: Global MSSP context [optional] id: Revision ID   Usage Example  https://192.168.1.1/securetrack/api/revisions/787/zones
   *
   * @function getDeviceZonesByRevision
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getDeviceZonesByRevision(id, callback) {
    const meth = 'adapter-getDeviceZonesByRevision';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('DeviceInterfacesAndZones', 'getDeviceZonesByRevision', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getDeviceZonesByRevision'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns a list of the zones for the specified Juniper, Stonesoft, Fortinet or Palo Alto Networks device. Note: this API returns device zones, not Tufin zones.   Parameters:  context: Global MSSP context [optional] id: Device ID   Usage Example  https://192.168.1.1/securetrack/api/devices/104/zones
   *
   * @function getDeviceZonesByDevice
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getDeviceZonesByDevice(id, callback) {
    const meth = 'adapter-getDeviceZonesByDevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('DeviceInterfacesAndZones', 'getDeviceZonesByDevice', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getDeviceZonesByDevice'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Parameters:  context: Global MSSP context [optional] id: Device ID   Usage Example  https://192.168.1.1/securetrack/api/devices/104/bindable_objects
   *
   * @function getZonesAndNetworkInterfacesThatParticipateInSubPolicies
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getZonesAndNetworkInterfacesThatParticipateInSubPolicies(id, callback) {
    const meth = 'adapter-getZonesAndNetworkInterfacesThatParticipateInSubPolicies';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('DeviceInterfacesAndZones', 'getZonesAndNetworkInterfacesThatParticipateInSubPolicies', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getZonesAndNetworkInterfacesThatParticipateInSubPolicies'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Parameters:  context: Global MSSP context [optional] id: Domain id   Usage Example  https://192.168.1.1/securetrack/api/domains/1   Response Messages:  401: User not permitted to access domains 400: Domain with ID was not found
   *
   * @function getDomain
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getDomain(id, callback) {
    const meth = 'adapter-getDomain';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Domains', 'getDomain', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getDomain'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Parameters:  id: Domain id body [optional]   Usage Example  https://192.168.1.1/securetrack/api/domains/1   Response Messages:  401: User not permitted to access domains 400: Domain with ID was not found 400: Domain with this name already exists 400: Domain name is empty 400: Default domain cannot be changed
   *
   * @function updateADomain
   * @param {object} body - PUT body parameter
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  updateADomain(body, id, callback) {
    const meth = 'adapter-updateADomain';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Domains', 'updateADomain', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['updateADomain'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Parameters:  body [optional]   Usage Example  https://192.168.1.1/securetrack/api/domains   Response Messages:  401: User not permitted to access domains 400: Domain with this name already exists 400: Domain name is empty
   *
   * @function addADomain
   * @param {object} body - POST body parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  addADomain(body, callback) {
    const meth = 'adapter-addADomain';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Domains', 'addADomain', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['addADomain'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Usage Example  https://192.168.1.1/securetrack/api/domains   Response Messages:  401: User not permitted to access domains
   *
   * @function getAllDomains
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getAllDomains(callback) {
    const meth = 'adapter-getAllDomains';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Domains', 'getAllDomains', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getAllDomains'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Usage Example     URL  https://192.168.1.1/securetrack/api/properties    OUTPUT  { &nbsp;&nbsp;&nbsp;&nbsp;"properties": { &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"sc_addresses": { &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"sc_address": [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"i...(description truncated)
   *
   * @function getGeneralProperties
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getGeneralProperties(callback) {
    const meth = 'adapter-getGeneralProperties';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('GeneralProperties', 'getGeneralProperties', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getGeneralProperties'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Parameters:  context: Global MSSP context [optional] id: Revision ID   Usage Example  https://191.168.1.1/securetrack/api/revisions/18/crypto_maps
   *
   * @function getCiscoCryptographicMapsByRevision
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getCiscoCryptographicMapsByRevision(id, callback) {
    const meth = 'adapter-getCiscoCryptographicMapsByRevision';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IPsecVPN', 'getCiscoCryptographicMapsByRevision', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getCiscoCryptographicMapsByRevision'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Get policy and peers defined on a Cisco crypto map which is applied to specific interface (provided through the outputInterfaceName parameter) in the running config. You can retrieve the interface names by calling the /devices/id/interfaces API.   Parameters:  device_id: The unique identifier of target device outputInterfaceName: Interface name   Usage Example  https://192.168.1.1/securetrack/api/bindings/32/ipsec_tunnels?outputInterfaceName=GigabitEthernet1
   *
   * @function getCiscoIPsecPolicyAndPeers
   * @param {default} deviceId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getCiscoIPsecPolicyAndPeers(deviceId, callback) {
    const meth = 'adapter-getCiscoIPsecPolicyAndPeers';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (deviceId === undefined || deviceId === null || deviceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['deviceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [deviceId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IPsecVPN', 'getCiscoIPsecPolicyAndPeers', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getCiscoIPsecPolicyAndPeers'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Get Check Point VPN (IPSec) Communities and gateways that partcipant in those communities. Works on clusters and gateways, not on management servers.   Parameters:  device_id: The unique identifier of target device   Usage Example  https://192.168.1.1/securetrack/api/bindings/20/ipsec_communities
   *
   * @function getCheckPointVPNIPSecCommunitiesAndGateways
   * @param {default} deviceId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getCheckPointVPNIPSecCommunitiesAndGateways(deviceId, callback) {
    const meth = 'adapter-getCheckPointVPNIPSecCommunitiesAndGateways';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (deviceId === undefined || deviceId === null || deviceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['deviceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [deviceId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IPsecVPN', 'getCheckPointVPNIPSecCommunitiesAndGateways', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getCheckPointVPNIPSecCommunitiesAndGateways'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Parameters:  context: Global MSSP context [optional] id: Device ID   Usage Example  https://192.168.1.1/securetrack/api/devices/19/crypto_maps
   *
   * @function getCiscoCryptographicMapsByDevice
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getCiscoCryptographicMapsByDevice(id, callback) {
    const meth = 'adapter-getCiscoCryptographicMapsByDevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('IPsecVPN', 'getCiscoCryptographicMapsByDevice', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getCiscoCryptographicMapsByDevice'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary The order of precedence used to resolve the Internet object is: Step 1: Identify the Internet referral: Search for a defined Internet referral on the specified device. If it is not found on the device, search the parent and grandparents (up the device tree) for a defined Internet referral. If a defined Internet referral is found, then match the name in the Internet referral to a network object, as defined in Step 2. If an Internet referral is not found, it resolves to “Any”. Step 2: Resolve the ...(description truncated)
   *
   * @function getResolvedInternetRepresentationForDevice
   * @param {default} deviceId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getResolvedInternetRepresentationForDevice(deviceId, callback) {
    const meth = 'adapter-getResolvedInternetRepresentationForDevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (deviceId === undefined || deviceId === null || deviceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['deviceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [deviceId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('InternetObjects', 'getResolvedInternetRepresentationForDevice', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getResolvedInternetRepresentationForDevice'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary The internet referral lets you represent the Internet as an object on a device. See REST API: /internet_referral/{deviceId:[0-9]+}/object for a description of how internet referral is resolved.   Parameters:  body: Internet referral configuration   Usage Example     URL  https://192.168.1.1/securetrack/api/internet_referral    BODY  { &nbsp;&nbsp;&nbsp;&nbsp;"internet_referral": { &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"@xsi.type": "internetReferralObjectNameDTO", &nbsp;&nbsp;&nbsp;&nbs...(description truncated)
   *
   * @function createNewInternetRepresentationForADevice
   * @param {object} body - POST body parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createNewInternetRepresentationForADevice(body, callback) {
    const meth = 'adapter-createNewInternetRepresentationForADevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('InternetObjects', 'createNewInternetRepresentationForADevice', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createNewInternetRepresentationForADevice'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Parameters:  deviceId: SecureTrack Device ID   Usage Example  https://192.168.1.1/securetrack/api/internet_referral/2   Response Messages:  200: Internet referral configuration was deleted 400: Device with given ID does not exist 400: Internet referral object can only be configured for StoneSoft (except master engine) or Check Point SMC/CMA devices 400: Internet referral configuration for device ID does not exist 401: Access is denied.
   *
   * @function deleteInternetRepresentationForDevice
   * @param {default} deviceId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteInternetRepresentationForDevice(deviceId, callback) {
    const meth = 'adapter-deleteInternetRepresentationForDevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (deviceId === undefined || deviceId === null || deviceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['deviceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [deviceId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('InternetObjects', 'deleteInternetRepresentationForDevice', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteInternetRepresentationForDevice'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Updates the Internet referral configuration for the device. If there was no previous configuration, it will be created.   Parameters:  deviceId: SecureTrack Device ID body: Internet referral configuration   Usage Example     URL  https://192.168.1.1/securetrack/api/internet_referral    BODY  { &nbsp;&nbsp;&nbsp;&nbsp;"internet_referral": { &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"@xsi.type": "internetReferralObjectNameDTO", &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"device_id": 2, ...(description truncated)
   *
   * @function updateInternetRepresentationForDevice
   * @param {object} body - PUT body parameter
   * @param {default} deviceId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  updateInternetRepresentationForDevice(body, deviceId, callback) {
    const meth = 'adapter-updateInternetRepresentationForDevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (deviceId === undefined || deviceId === null || deviceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['deviceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [deviceId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('InternetObjects', 'updateInternetRepresentationForDevice', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['updateInternetRepresentationForDevice'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Parameters:  deviceId: SecureTrack Device ID   Usage Example  https://192.168.1.1/securetrack/api/internet_referral/2   Response Messages:  200: Internet referral configuration is returned 400: Device with given ID does not exist 400: Internet referral object can only be configured for StoneSoft (except master engine) or Check Point SMC/CMA devices 404: Internet referral configuration was not found for device ID 401: Access is denied.
   *
   * @function getInternetRepresentationForDevice
   * @param {default} deviceId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getInternetRepresentationForDevice(deviceId, callback) {
    const meth = 'adapter-getInternetRepresentationForDevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (deviceId === undefined || deviceId === null || deviceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['deviceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [deviceId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('InternetObjects', 'getInternetRepresentationForDevice', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getInternetRepresentationForDevice'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns the UID, DN and Name of a LDAP entry specified by the DN.   Parameters:  dn: LDAP DN   Usage Example     URL  https://192.168.1.1/securetrack/api/ldap/getEntryByDN?dn=CN=Manufacturing,OU=RSA_Demo,DC=tufintest,DC=com    OUTPUT  { &nbsp;&nbsp;&nbsp;&nbsp;"ldap_entry": { &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"uid": "mYbWQms7p0q5YinEyW5Byw==", &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"dn": "CN=Manufacturing,OU=RSA_Demo,DC=tufintest,DC=com", &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbs...(description truncated)
   *
   * @function getLDAPEntryDetailsByDN
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getLDAPEntryDetailsByDN(callback) {
    const meth = 'adapter-getLDAPEntryDetailsByDN';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('LDAP', 'getLDAPEntryDetailsByDN', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getLDAPEntryDetailsByDN'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Return list of LDAP entries which match the exact given multiple search_text.   Parameters:  body: Names to search   Usage Example     URL  https://192.168.1.1/securetrack/api/ldap/getEntriesByNames    BODY  { &nbsp;&nbsp;&nbsp;&nbsp;"search_by_name_criteria": { &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"search_texts": { &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"search_text": [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbs...(description truncated)
   *
   * @function returnEntriesThatExactlyMatchOneOfTheGivenStrings
   * @param {object} body - POST body parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  returnEntriesThatExactlyMatchOneOfTheGivenStrings(body, callback) {
    const meth = 'adapter-returnEntriesThatExactlyMatchOneOfTheGivenStrings';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '', contentType: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('LDAP', 'returnEntriesThatExactlyMatchOneOfTheGivenStrings', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['returnEntriesThatExactlyMatchOneOfTheGivenStrings'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary The returned "base DN" is used by GetEntriesByNames API as the search start entry.     Usage Example     URL  https://192.168.1.1/securetrack/api/ldap/getBaseDNEntry    OUTPUT  { &nbsp;&nbsp;&nbsp;&nbsp;"ldap_entry": { &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"dn": "DC=tufintest,DC=com", &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"uid": "nABbRP/lPUKlteNRI4j6iA==" &nbsp;&nbsp;&nbsp;&nbsp;} }      Response Messages:  200: OK 404: Base Entry cannot be found 501: LDAP server is not confi...(description truncated)
   *
   * @function getTheBaseDNEntryDetails
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getTheBaseDNEntryDetails(callback) {
    const meth = 'adapter-getTheBaseDNEntryDetails';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('LDAP', 'getTheBaseDNEntryDetails', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getTheBaseDNEntryDetails'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Return list of LDAP entries which match the given search criteria according to the search mode (EXACT, CONTAINS, STARTS_WITH, ENDS_WITH). The search is case insensitive. The limit of max_search_result is 1000.   Parameters:  body: Search criteria   Usage Example     URL  https://192.168.1.1/securetrack/api/ldap/search     BODY  { &nbsp;&nbsp;&nbsp;&nbsp;"search_criteria": { &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"search_base_dn": "DC=tufintest,DC=com", &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbs...(description truncated)
   *
   * @function returnLDAPEntriesWhichMatchTheGivenSearchCriteria
   * @param {object} body - POST body parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  returnLDAPEntriesWhichMatchTheGivenSearchCriteria(body, callback) {
    const meth = 'adapter-returnLDAPEntriesWhichMatchTheGivenSearchCriteria';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '', contentType: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('LDAP', 'returnLDAPEntriesWhichMatchTheGivenSearchCriteria', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['returnLDAPEntriesWhichMatchTheGivenSearchCriteria'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns textual configuration for the specified revision Id.    Parameters:  context: Global MSSP context [optional] id: Revision id   Usage Example  https://192.168.1.1/securetrack/api/revisions/227/config
   *
   * @function getTextualConfigurationByRevision
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getTextualConfigurationByRevision(id, callback) {
    const meth = 'adapter-getTextualConfigurationByRevision';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('MonitoredDevices', 'getTextualConfigurationByRevision', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getTextualConfigurationByRevision'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Use this API to import more managed devices to SecureTrack. The following devices can be added: Device Groups (for Panorama), Administrative Domains (for FortiManager).
Currently supported types: Panorama, FortiManager, Cisco ASA. Please see examples below per device id: device id 1 for Panorama, device 2 for FortiManager, device id 3 for Cisco ASA.   Parameters:  body: device_list   Usage Example     URL   https://192.168.1.1/securetrack/api/devices/bulk/import    BODY  {     &nbsp;&nbsp;&nbsp;...(description truncated)
   *
   * @function importManagedDevices
   * @param {object} body - POST body parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  importManagedDevices(body, callback) {
    const meth = 'adapter-importManagedDevices';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('MonitoredDevices', 'importManagedDevices', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['importManagedDevices'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Use this API to edit the settings of a management device, including changing multiple parameters in the same call. The API body should include a JSON file with the mandatory parameters for the operation. String parameters contain only lower and upper case letters, digits, space, dot, backward slash, forward slash, underscore or one of the following signs: #@:;=!^(). The following devices can be edited: Check Point CMA R77, Check Point SMC R77, Cisco ASA, Panorama NG and FortiManager. Note: This ...(description truncated)
   *
   * @function editSecuretrackDevice
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  editSecuretrackDevice(callback) {
    const meth = 'adapter-editSecuretrackDevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('MonitoredDevices', 'editSecuretrackDevice', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['editSecuretrackDevice'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Use this API to add a single device or a list of devices to SecureTrack.  The following devices can be added: Check Point CMA R77, Check Point SMC R77, Cisco ASA, Panorama NG and FortiManager.  The API body should include a JSON file with the mandatory parameters for the operation.  String parameters contain only lower and upper case letters, digits, space, dot, backward slash, forward slash, underscore or one of the following signs: #@:;=!^().  Currently supported types: CMA, SMC, ASA, Panorama...(description truncated)
   *
   * @function addDevicesToSecureTrack
   * @param {object} body - POST body parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  addDevicesToSecureTrack(body, callback) {
    const meth = 'adapter-addDevicesToSecureTrack';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('MonitoredDevices', 'addDevicesToSecureTrack', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['addDevicesToSecureTrack'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Use this API to track and display the current progress of the devices being edited or added to
SecureTrack for a specific Task ID.  For a list of devices, the status of each device is displayed.  A device that was not added due to some reason will be added to "failed" list with status element containing a description. For example: "description": "No connection to device".   Parameters:  task_uid: Task UID   Usage Example     URL  https://192.168.1.1/securetrack/api/devices/bulk/tasks/d7e88799-a6...(description truncated)
   *
   * @function getSpecificTaskResultsOfBulkOperationsOnDevices
   * @param {default} taskUid - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSpecificTaskResultsOfBulkOperationsOnDevices(taskUid, callback) {
    const meth = 'adapter-getSpecificTaskResultsOfBulkOperationsOnDevices';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (taskUid === undefined || taskUid === null || taskUid === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['taskUid'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [taskUid];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('MonitoredDevices', 'getSpecificTaskResultsOfBulkOperationsOnDevices', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSpecificTaskResultsOfBulkOperationsOnDevices'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Parameters:  device_id: Device ID configuration_file: Configuration File   Usage Example  curl -X POST -u user:password -H "Content-Type: multipart/form-data" --tlsv1 -L -k1 --http1.0 -F "configuration_file=@/tmp/config.txt;type=application/octet-stream" -F "device_id=1" https://192.168.1.1/securetrack/api/tasks/add_device_config_task   Response Messages:  200: Configuration added successfully.
   *
   * @function addConfigurationForOfflineDevice
   * @param {object} body - POST body parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  addConfigurationForOfflineDevice(body, callback) {
    const meth = 'adapter-addConfigurationForOfflineDevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('MonitoredDevices', 'addConfigurationForOfflineDevice', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['addConfigurationForOfflineDevice'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns the vendor, model, name, domain and ID for the specified device. For more information on supported devices, supported models and virtual types please refer to 'Device and Revision Resources' section in the Tufin Knowledge Center .   Parameters:  context: Global MSSP context [optional] id: Device ID show_os_version: Show os version as apart of the response [optional]   Usage Example  https://192.168.1.1/securetrack/api/devices/60   Usage Example  https://192.168.1.1/securetrack/api/device...(description truncated)
   *
   * @function getSpecificDevice
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSpecificDevice(id, callback) {
    const meth = 'adapter-getSpecificDevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('MonitoredDevices', 'getSpecificDevice', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSpecificDevice'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Device name should contain only Lower and upper case letters, digits, space, dot, backward slash, forward slash, underscore or one of the following signs: #@:;=!^()   Parameters:  device_id: Device ID body: Device to be updated   Usage Example     URL  https://192.168.1.1/securetrack/api/devices/1    BODY  &lt;device&gt; &nbsp;&nbsp;&nbsp;&nbsp;  &lt;name&gt;API OFFLINE ASA2&lt;/name&gt; &nbsp;&nbsp;&nbsp;&nbsp;  &lt;topology&gt;true&lt;/topology&gt; &lt;/device&gt;
   *
   * @function updateOfflineDevice
   * @param {object} body - PUT body parameter
   * @param {default} deviceId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  updateOfflineDevice(body, deviceId, callback) {
    const meth = 'adapter-updateOfflineDevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (deviceId === undefined || deviceId === null || deviceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['deviceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [deviceId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('MonitoredDevices', 'updateOfflineDevice', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['updateOfflineDevice'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns the list of devices that are configured in SecureTrack, including the vendor, model, name, domain and device ID. The results can be sorted by ip, name, vendor and model. For more information on supported devices, supported models and virtual types please refer to 'Device and Revision Resources' section in the Tufin Knowledge Center .   Parameters:  context: Global MSSP context [optional] name: Device name [optional] ip: Device IP address [optional] vendor: Device vendor [optional] model:...(description truncated)
   *
   * @function getDevices
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getDevices(callback) {
    const meth = 'adapter-getDevices';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('MonitoredDevices', 'getDevices', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getDevices'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary You can choose to select the domain either by name or id using the domain_id or domain_name tags.
Device name should contain only Lower and upper case letters, digits, space, dot, backward slash, forward slash, underscore or one of the following signs: #@:;=!^()   Parameters:  body: Device to be added   Usage Example     URL  https://192.168.1.1/securetrack/api/devices    BODY  &lt;device&gt; &nbsp;&nbsp;&nbsp;&nbsp;  &lt;model&gt;asa&lt;/model&gt;  &nbsp;&nbsp;&nbsp;&nbsp;  &lt;vendor&gt;Cisco&...(description truncated)
   *
   * @function addOfflineDevice
   * @param {object} body - POST body parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  addOfflineDevice(body, callback) {
    const meth = 'adapter-addOfflineDevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('MonitoredDevices', 'addOfflineDevice', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['addOfflineDevice'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Get latest revision of running configuration for a given device Id.    Parameters:  context: global MSSP context [optional] id: Device ID   Usage Example  https://192.168.1.1/securetrack/api/devices/111/config
   *
   * @function getTextualConfigurationByDevice
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getTextualConfigurationByDevice(id, callback) {
    const meth = 'adapter-getTextualConfigurationByDevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('MonitoredDevices', 'getTextualConfigurationByDevice', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getTextualConfigurationByDevice'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Fetches a list of NAT objects defined on device given by device ID Note: NAT objects are only relevant for Check Point management servers and Juniper Netscreen devices. The default value for get_total is false. For API calls that have pagination, set get_total to true on the first call. Use the value to returned in total to determine how many additional calls are required to retrieve all the desired results. To improve performance, omit or set get_total to false on any subsequent calls.    Param...(description truncated)
   *
   * @function getNATObjectsByDevice
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getNATObjectsByDevice(id, callback) {
    const meth = 'adapter-getNATObjectsByDevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NATPolicies', 'getNATObjectsByDevice', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getNATObjectsByDevice'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Fetches a list of NAT objects for a given revision Note: NAT objects are only relevant for Check Point management servers and Juniper Netscreen devices. The default value for get_total is false. For API calls that have pagination, set get_total to true on the first call. Use the value to returned in total to determine how many additional calls are required to retrieve all the desired results. To improve performance, omit or set get_total to false on any subsequent calls.    Parameters:  context:...(description truncated)
   *
   * @function getNATObjectsByRevision
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getNATObjectsByRevision(id, callback) {
    const meth = 'adapter-getNATObjectsByRevision';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NATPolicies', 'getNATObjectsByRevision', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getNATObjectsByRevision'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Fetches list of NAT rules for device given by device ID  input_interface and output_interface are not supported for Panorama running in Advanced management mode nat_stage is supported for Netscreen and JunOS nat_type is supported for FortiManager Note: For Check Point, NAT rules are available from the modules (not managements) Note: For Palo Alto, filtering NAT rules by interface is only available for firewall devices   Parameters:  context: Global MSSP context [optional] id: Device ID input_int...(description truncated)
   *
   * @function getNATRulesByDevice
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getNATRulesByDevice(id, callback) {
    const meth = 'adapter-getNATRulesByDevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NATPolicies', 'getNATRulesByDevice', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getNATRulesByDevice'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns groups that contain the specified network object    Parameters:  context: Returns results for the specified domain ID. [optional] id: The SecureTrack object ID of the network object.   Usage Example  https://192.168.1.1/securetrack/api/network_objects/69577/groups
   *
   * @function getNetworkGroupsContainingSpecifiedNetworkObject
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getNetworkGroupsContainingSpecifiedNetworkObject(id, callback) {
    const meth = 'adapter-getNetworkGroupsContainingSpecifiedNetworkObject';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkObjects', 'getNetworkGroupsContainingSpecifiedNetworkObject', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getNetworkGroupsContainingSpecifiedNetworkObject'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Fetches a single or partial list of the network objects for a given revision. For group network objects, the returned results will also include full details of every group member. Set show_members=false to return only the name and ID of the members, and omit the full details of the group members.   Parameters:  context: Global MSSP context [optional] revision_id: Revision id ids: Network object IDs separated by commas show_members: Set to false to return only the name and ID of the members [opti...(description truncated)
   *
   * @function getSpecificNetworkObjectsByRevision
   * @param {default} revisionId - path parameter
   * @param {default} ids - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSpecificNetworkObjectsByRevision(revisionId, ids, callback) {
    const meth = 'adapter-getSpecificNetworkObjectsByRevision';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (revisionId === undefined || revisionId === null || revisionId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['revisionId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (ids === undefined || ids === null || ids === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['ids'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [revisionId, ids];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkObjects', 'getSpecificNetworkObjectsByRevision', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSpecificNetworkObjectsByRevision'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Fetches a single or partial list of the network objects for a given device ID. For group network objects, the returned results will also include full details of every group member. Set show_members=false to return only the name and ID of the members, and omit the full details of the group members.  Note:  This API retrieves the information from the latest revision.   Parameters:  context: Global MSSP context [optional] device_id: Device ID ids: Network object IDs separated by commas show_members...(description truncated)
   *
   * @function getSpecificNetworkObject
   * @param {default} deviceId - path parameter
   * @param {default} ids - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSpecificNetworkObject(deviceId, ids, callback) {
    const meth = 'adapter-getSpecificNetworkObject';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (deviceId === undefined || deviceId === null || deviceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['deviceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (ids === undefined || ids === null || ids === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['ids'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [deviceId, ids];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkObjects', 'getSpecificNetworkObject', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSpecificNetworkObject'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Fetches list of network objects from specific revision The default value for get_total is false. For API calls that have pagination, set get_total to true on the first call. Use the value to returned in total to determine how many additional calls are required to retrieve all the desired results. To improve performance, omit or set get_total to false on any subsequent calls. The show_members parameter is only relevant if type=group. If type=group, the returned results will also include full deta...(description truncated)
   *
   * @function getNetworkObjectsByRevision
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getNetworkObjectsByRevision(id, callback) {
    const meth = 'adapter-getNetworkObjectsByRevision';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkObjects', 'getNetworkObjectsByRevision', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getNetworkObjectsByRevision'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary You can search for network objects where the IP address, name or comment fields have a specified text string, or you can search for network objects that have an IP address that matches, contains or is contained in a specified IP subnet, or you can search for network objects by uid.   Parameters:  context: Returns results for the specified domain ID. [optional] start: Returns the results beginning with the specified result number. [optional] count: Returns the specified number of results. If this...(description truncated)
   *
   * @function getNetworkObjectsMatchingSpecifiedCriteria
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getNetworkObjectsMatchingSpecifiedCriteria(callback) {
    const meth = 'adapter-getNetworkObjectsMatchingSpecifiedCriteria';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkObjects', 'getNetworkObjectsMatchingSpecifiedCriteria', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getNetworkObjectsMatchingSpecifiedCriteria'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns the security rules that contain the specified network object    Parameters:  context: Returns results for the specified domain ID. [optional] id: The SecureTrack object ID of the network object. include_groups: You can add "include_groups" to find rules that include the network object and rules that include the groups that include the network object. [optional] start: Returns the results beginning with the specified result number. [optional] count: Returns the specified number of results...(description truncated)
   *
   * @function getRulesContainingSpecifiedNetworkObject
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getRulesContainingSpecifiedNetworkObject(id, callback) {
    const meth = 'adapter-getRulesContainingSpecifiedNetworkObject';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkObjects', 'getRulesContainingSpecifiedNetworkObject', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getRulesContainingSpecifiedNetworkObject'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Fetches list of network objects defined on device given by ID The default value for get_total is false. For API calls that have pagination, set get_total to true on the first call. Use the value to returned in total to determine how many additional calls are required to retrieve all the desired results. To improve performance, omit or set get_total to false on any subsequent calls. The show_members parameter is only relevant if type=group. If type=group, the returned results will also include fu...(description truncated)
   *
   * @function getNetworkObjectsByDevice
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getNetworkObjectsByDevice(id, callback) {
    const meth = 'adapter-getNetworkObjectsByDevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkObjects', 'getNetworkObjectsByDevice', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getNetworkObjectsByDevice'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns the topology cloud data for the specified id. This API requires 'Super admin' or 'Multi-Domain admin' privileges. Multi-Domain user must have access permission to the domain where the cloud resides.   Parameters:  id: Cloud id   Usage Example     URL  https://192.168.1.1/securetrack/api/topology/clouds/48    OUTPUT  { &nbsp;&nbsp;&nbsp;&nbsp;"topology_cloud": { &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id": 48, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "Cloud 69.70.1...(description truncated)
   *
   * @function getSpecificTopologyCloud
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSpecificTopologyCloud(id, callback) {
    const meth = 'adapter-getSpecificTopologyCloud';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkTopology', 'getSpecificTopologyCloud', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSpecificTopologyCloud'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Modify the name of a topology cloud, and add/remove members of a joined cloud. This API requires either 'Super admin' or 'Multi-Domain admin' privileges. Multi-Domain user must have access permission to the domain context of the joined cloud, and any members specified in the body. To change the name of a topology cloud, enter a value in the name field of the body. To add/remove members of a joined cloud, specify the action and specify the clouds in the members list of the body. The action is use...(description truncated)
   *
   * @function updateACloud
   * @param {object} body - PUT body parameter
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  updateACloud(body, id, callback) {
    const meth = 'adapter-updateACloud';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkTopology', 'updateACloud', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['updateACloud'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns a list of the topology subnets for all the domains for which the user has permission to access. This API requires either 'Super admin' or 'Multi-Domain admin' privileges. For users with ‘Super admin’ permission, the context parameter is optional. If a context is not specified, the Global context will be used. For users with ‘Multi-Domain’ privilege, the context parameter is required. To get the context parameter, call the /domains/ API and use the id included in the returned domain DTO. ...(description truncated)
   *
   * @function getTopologySubnets
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getTopologySubnets(callback) {
    const meth = 'adapter-getTopologySubnets';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkTopology', 'getTopologySubnets', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getTopologySubnets'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary The returned interfaces are taken from the topology data and will include only devices that are topology enabled. When adding a device, the user can can choose whether to use dynamic or static topology for the device, this choice will determine which kind of data is stored in the topology graph and returned by this API.  The parameter mgmtId should be a cluster or a gateway, not a management server. You may provide a generic device Id (see generic_devices API under 'Monitored Devices' category) ...(description truncated)
   *
   * @function getTopologyNetworkInterfacesByDevice
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getTopologyNetworkInterfacesByDevice(callback) {
    const meth = 'adapter-getTopologyNetworkInterfacesByDevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkTopology', 'getTopologyNetworkInterfacesByDevice', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getTopologyNetworkInterfacesByDevice'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Parameters:  context: Global MSSP context [optional] host: IP address of device for a query   Usage Example  https://192.168.1.1/securetrack/api/devices/interfaces/last_hop?host=192.168.1.66
   *
   * @function getMostSpecificNetworkInterfacesFromWhichAHostIPIsAccessible
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getMostSpecificNetworkInterfacesFromWhichAHostIPIsAccessible(callback) {
    const meth = 'adapter-getMostSpecificNetworkInterfacesFromWhichAHostIPIsAccessible';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkTopology', 'getMostSpecificNetworkInterfacesFromWhichAHostIPIsAccessible', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getMostSpecificNetworkInterfacesFromWhichAHostIPIsAccessible'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns the subnet for the specified id, including information regarding attached devices and join candidates. This API requires 'Super admin' or 'Multi-Domain admin' privileges. Multi-Domain user must have access permission to the domain where the subnet resides.   Parameters:  id: Subnet id   Usage Example     URL  https://192.168.1.1/securetrack/api/topology/subnets/20    OUTPUT  { &nbsp;&nbsp;&nbsp;&nbsp;"subnet": { &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id": 18, &nbsp;&nbsp;&nbsp;...(description truncated)
   *
   * @function getSpecificTopologySubnet
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSpecificTopologySubnet(id, callback) {
    const meth = 'adapter-getSpecificTopologySubnet';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkTopology', 'getSpecificTopologySubnet', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSpecificTopologySubnet'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns the progress status of the Topology Model Synchronization.     Usage Example  https://192.168.1.1/securetrack/api/topology/synchronize/status   Response Messages:  200: The topology synchronization was invoked successfully. 401: Access is denied 500: Error getting synchronize progress
   *
   * @function getTopologySynchronizationStatus
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getTopologySynchronizationStatus(callback) {
    const meth = 'adapter-getTopologySynchronizationStatus';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkTopology', 'getTopologySynchronizationStatus', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getTopologySynchronizationStatus'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Delete a generic device from the Topology model. The ID must be for a valid generic device listed in the Topology Model. If update update_topology = true, then the Topology model will be updated immediately after the device is deleted. For maximum efficiency, if you are deleting multiple generic devices in consecutive API calls, you can set update_topology = false on all API calls  except for the last one. On the last call, set update_toplogy = true. Default value for update_topology = true.   P...(description truncated)
   *
   * @function deleteGenericDeviceFromTopologyModel
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteGenericDeviceFromTopologyModel(id, callback) {
    const meth = 'adapter-deleteGenericDeviceFromTopologyModel';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkTopology', 'deleteGenericDeviceFromTopologyModel', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteGenericDeviceFromTopologyModel'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Modify an existing generic device by uploading a new configuration file and/or specifying a new name.  If name field is specified, the generic device will be renamed. configuration_file is optional, if provided it must include a valid generic device configuration. The specified path points to a file in the client machine. If a generic device name is changed and a new configuration file is not provided, topology will not be synchronized (update_topology flag is ignored). Default value for update_...(description truncated)
   *
   * @function updateAnExistingGenericDeviceInTheTopologyModel
   * @param {object} body - PUT body parameter
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  updateAnExistingGenericDeviceInTheTopologyModel(body, id, callback) {
    const meth = 'adapter-updateAnExistingGenericDeviceInTheTopologyModel';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkTopology', 'updateAnExistingGenericDeviceInTheTopologyModel', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['updateAnExistingGenericDeviceInTheTopologyModel'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns the internal networks for the specified Cloud management id. This API requires 'Super admin' privileges.   Parameters:  id: Cloud management id   Usage Example     URL  https://192.168.1.1/securetrack/api/topology/cloud_internal_networks/20    OUTPUT  { &nbsp;&nbsp;&nbsp;&nbsp;"network_list": &nbsp;&nbsp;&nbsp;&nbsp;{ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"count": 3, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"total": 3, &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"net...(description truncated)
   *
   * @function getCloudInternalNetworks
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getCloudInternalNetworks(id, callback) {
    const meth = 'adapter-getCloudInternalNetworks';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkTopology', 'getCloudInternalNetworks', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getCloudInternalNetworks'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns information about a specific cloud in the topology. This API includes the ID of the cloud, the number of routes that point to the cloud, and the relevant devices (including the management_id) that have routes that point to the cloud. This information can be used to identify missing devices that may need to be added to the topology or to identify clouds that are candidates for being joined.   Parameters:  cloud_id: cloud id start: The starting element to include in the returned results [o...(description truncated)
   *
   * @function getCloudInformation
   * @param {default} cloudId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getCloudInformation(cloudId, callback) {
    const meth = 'adapter-getCloudInformation';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (cloudId === undefined || cloudId === null || cloudId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['cloudId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [cloudId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '', contentType: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkTopology', 'getCloudInformation', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getCloudInformation'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Invoke of the Topology Model Synchronization. full_sync=false - Builds the topology model from the information stored in the Tufin database. full_sync=true - Retrieves the current data from devices and builds the topology model. Default value for full_sync = false.   Parameters:  full_sync: Perform full sync [optional]   Usage Example  https://192.168.1.1/securetrack/api/topology/synchronize   Usage Example  https://192.168.1.1/securetrack/api/topology/synchronize?full_sync=true   Response Messa...(description truncated)
   *
   * @function synchronizeTheTopologyModel
   * @param {object} body - POST body parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  synchronizeTheTopologyModel(body, callback) {
    const meth = 'adapter-synchronizeTheTopologyModel';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkTopology', 'synchronizeTheTopologyModel', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['synchronizeTheTopologyModel'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns a list of the generic vpn connections in the Topology map, for all the domains for which the user has permission to access. This API requires either 'Super admin' or 'Multi-Domain admin' privileges. For users with ‘Super admin’ permission, the context parameter is optional. If a context is not specified, the Global context will be used. For users with ‘Multi-Domain’ privilege, the context parameter is required. To get the context parameter, call the /domains/ API and use the id included ...(description truncated)
   *
   * @function getTopologyGenericVPNConnections
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getTopologyGenericVPNConnections(callback) {
    const meth = 'adapter-getTopologyGenericVPNConnections';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkTopology', 'getTopologyGenericVPNConnections', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getTopologyGenericVPNConnections'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary The returned routing tables are taken from the topology data and will include only devices that are topology enabled. When adding a device, the user can can choose whether to use dynamic or static topology for the device, this choice will determine which kind of data is stored in the topology graph and returned by this API.  The parameter mgmtId should be a cluster or a gateway, not a management server. You may provide a generic device Id (see generic_devices API under 'Monitored Devices' catego...(description truncated)
   *
   * @function getTopologyRoutingTablesForAGivenDevice
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getTopologyRoutingTablesForAGivenDevice(callback) {
    const meth = 'adapter-getTopologyRoutingTablesForAGivenDevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkTopology', 'getTopologyRoutingTablesForAGivenDevice', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getTopologyRoutingTablesForAGivenDevice'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns information about all clouds in the topology. This API includes the ID of the cloud, the number of routes that point to the cloud, and the relevant devices (including the management_id) that have routes that point to the cloud. This information can be used to identify missing devices that may need to be added to the topology or to identify clouds that are candidates for being joined.   Parameters:  context: Global MSSP context [optional] start: The starting element to include in the retu...(description truncated)
   *
   * @function getTopologyCloudSuggestions
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getTopologyCloudSuggestions(callback) {
    const meth = 'adapter-getTopologyCloudSuggestions';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkTopology', 'getTopologyCloudSuggestions', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getTopologyCloudSuggestions'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Upload a configuration file that will be used to add a generic device to the Topology model. The context field is the domain ID to which the generic device is added: If not provided, the device is added to the global domain. configuration_file must include a valid generic device configuration. The specified path must point to a file on the computer being sue to make the REST API call. If update update_topology = true, then the Topology model will be updated immediately after the device is added....(description truncated)
   *
   * @function addGenericDeviceToTopologyModel
   * @param {object} body - POST body parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  addGenericDeviceToTopologyModel(body, callback) {
    const meth = 'adapter-addGenericDeviceToTopologyModel';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkTopology', 'addGenericDeviceToTopologyModel', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['addGenericDeviceToTopologyModel'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns a list of the generic devices included in all the domains that the user has permission to. Use context and/or name optional parameters to get more specific results. To get context optional parameter, you can call /domains/ API and use the id included within the returned domain DTO.   Parameters:  context: Global MSSP context [optional] name: Generic device name [optional]   Usage Example  https://192.168.1.1/securetrack/api/generic_devices
   *
   * @function getGenericDevicesThatAreConfiguredInST
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getGenericDevicesThatAreConfiguredInST(callback) {
    const meth = 'adapter-getGenericDevicesThatAreConfiguredInST';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkTopology', 'getGenericDevicesThatAreConfiguredInST', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getGenericDevicesThatAreConfiguredInST'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns an image containing one or more paths for the specified traffic. src and dst parameters may contain multiple, comma separated values. Service parameter can be a port (for example, “tcp:80”, “any”) or an application (for example, “Skype”, “Facebook”). Application names are case sensitive. Service parameter can also be a combination of ports and applications, for example “tcp:80, Skype, Facebook” If sourceDomainIdTag is provided, the path starting points will be restricted to the specified...(description truncated)
   *
   * @function getPathImageForSpecifiedTraffic
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getPathImageForSpecifiedTraffic(callback) {
    const meth = 'adapter-getPathImageForSpecifiedTraffic';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkTopology', 'getPathImageForSpecifiedTraffic', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getPathImageForSpecifiedTraffic'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns one or more paths for the specified traffic. src and dst parameters may contain multiple, comma separated values. Service parameter can be a port (for example, “tcp:80”, “any”) or an application (for example, “Skype”, “Facebook”). Application names are case sensitive. Service parameter can also be a combination of ports and applications, for example “tcp:80, Skype, Facebook” If sourceDomainIdTag is provided, the path starting points will be restricted to the specified domain ID.  sourceD...(description truncated)
   *
   * @function getPathForSpecifiedTraffic
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getPathForSpecifiedTraffic(callback) {
    const meth = 'adapter-getPathForSpecifiedTraffic';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkTopology', 'getPathForSpecifiedTraffic', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getPathForSpecifiedTraffic'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Create a new topology cloud in the Interactive Map by joining existing clouds together. This API requires either 'Super admin' or 'Multi-Domain admin' privileges. For users with ‘Super admin’ permission, the context parameter is optional. If a context is not specified, the Global context will be used. For users with ‘Multi-Domain’ privilege, the context parameter is required. To get the context parameter, call the /domains/ API and use the id included in the returned domain DTO. The body must in...(description truncated)
   *
   * @function createAJoinedTopologyCloud
   * @param {object} body - POST body parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createAJoinedTopologyCloud(body, callback) {
    const meth = 'adapter-createAJoinedTopologyCloud';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkTopology', 'createAJoinedTopologyCloud', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createAJoinedTopologyCloud'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns a list of the topology clouds for all the domains for which the user has permission to access. This API requires either 'Super admin' or 'Multi-Domain admin' privileges. For users with ‘Super admin’ permission, the context parameter is optional. If a context is not specified, the Global context will be used. For users with ‘Multi-Domain’ privilege, the context parameter is required. To get the context parameter, call the /domains/ API and use the id included in the returned domain DTO. U...(description truncated)
   *
   * @function getTopologyClouds
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getTopologyClouds(callback) {
    const meth = 'adapter-getTopologyClouds';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkTopology', 'getTopologyClouds', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getTopologyClouds'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Get a specific zone pattern entry for a specific zone by identifier   Parameters:  context: Global MSSP context. [optional] zone_id: Identifier of the zone containing the zone entry. id: Identifier of the zone pattern entry.   Usage Example     URL  https://192.168.1.1/securetrack/api/zones/75/pattern-entries/2    BODY  &lt;?xml version="1.0" encoding="UTF-8" standalone="yes"?&gt; &lt;pattern_match_entry&gt; &nbsp;&nbsp;&nbsp;&nbsp;&lt;id&gt;2&lt;/id&gt;&nbsp;&nbsp;&nbsp;&nbsp;&lt;type&gt;securi...(description truncated)
   *
   * @function getASpecificZonePatternEntryForASpecificZone
   * @param {default} zoneId - path parameter
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getASpecificZonePatternEntryForASpecificZone(zoneId, id, callback) {
    const meth = 'adapter-getASpecificZonePatternEntryForASpecificZone';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (zoneId === undefined || zoneId === null || zoneId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['zoneId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [zoneId, id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '', contentType: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkZoneManagerPatterns', 'getASpecificZonePatternEntryForASpecificZone', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getASpecificZonePatternEntryForASpecificZone'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Create a zone pattern entry in a specific zone by identifier   Parameters:  context: Global MSSP context. [optional] zone_id: Identifier of the zone containing the zone pattern entry. body: The zone pattern entry to create.   Usage Example     URL  https://192.168.1.1/securetrack/api/zones/2/pattern-entries    BODY  &lt;?xml version="1.0" encoding="UTF-8" standalone="yes"?&gt; &lt;create_pattern_match_entry&gt; &nbsp;&nbsp;&nbsp;&nbsp;&lt;pattern_match_entry&gt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nb...(description truncated)
   *
   * @function createAZonePatternEntryInASpecificZone
   * @param {object} body - POST body parameter
   * @param {default} zoneId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createAZonePatternEntryInASpecificZone(body, zoneId, callback) {
    const meth = 'adapter-createAZonePatternEntryInASpecificZone';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (zoneId === undefined || zoneId === null || zoneId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['zoneId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [zoneId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkZoneManagerPatterns', 'createAZonePatternEntryInASpecificZone', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createAZonePatternEntryInASpecificZone'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Get the list of zone pattern entries for specific zones by identifiers   Parameters:  context: Global MSSP context. [optional] ids: Filter by IDs for the pattern entry results. [optional] pattern: Filter by pattern string for the zone entry results. [optional] name: Filter by zone name for the pattern entry results. [optional] comment: Filter by comment for the pattern entry results. [optional] sort: Sort ascending or descending. [optional] start: Starting page number for query results. [optiona...(description truncated)
   *
   * @function getAllPatternEntriesForSpecificZones
   * @param {default} ids - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getAllPatternEntriesForSpecificZones(ids, callback) {
    const meth = 'adapter-getAllPatternEntriesForSpecificZones';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (ids === undefined || ids === null || ids === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['ids'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [ids];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '', contentType: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkZoneManagerPatterns', 'getAllPatternEntriesForSpecificZones', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getAllPatternEntriesForSpecificZones'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Get a specific zone entry by ID for a zone.   Parameters:  context: Global MSSP context. [optional] zone_id: The ID of the zone containing the zone entry. id: The ID of the zone entry.   Usage Example  https://192.168.1.1/securetrack/api/zones/2/entries/123   Response Messages:  200: The zone entry was successfully retrieved. 401: User is not permitted to access the specified domain 404: A zone with the specified ID was not found. 404: A zone entry with the specified ID was not found.
   *
   * @function getASpecificZoneEntry
   * @param {default} zoneId - path parameter
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getASpecificZoneEntry(zoneId, id, callback) {
    const meth = 'adapter-getASpecificZoneEntry';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (zoneId === undefined || zoneId === null || zoneId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['zoneId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [zoneId, id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkZoneManagerSubnets', 'getASpecificZoneEntry', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getASpecificZoneEntry'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Delete existing zone entries.   Parameters:  context: Global MSSP context. [optional] zone_id: The ID of the zone containing the zone entry. id: The ID of the zone entry to delete.   Usage Example  https://192.168.1.1/securetrack/api/zones/2/entries/10   Response Messages:  200: The zone entry was deleted successfully. 401: User is not permitted to access the specified domain 404: A zone with the specified ID was not found. 404: A zone entry with the specified ID was not found.
   *
   * @function deleteZoneEntries
   * @param {default} zoneId - path parameter
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteZoneEntries(zoneId, id, callback) {
    const meth = 'adapter-deleteZoneEntries';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (zoneId === undefined || zoneId === null || zoneId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['zoneId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [zoneId, id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkZoneManagerSubnets', 'deleteZoneEntries', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteZoneEntries'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary For IPv4 entry provide IP and netmask/prefix (see Usage Example #1 and #2). For IPv6 provide IP and prefix only, netmask is not allowed(see Usage Example #3).   Parameters:  context: Global MSSP context. [optional] zone_id: The ID of the zone containing the zone entry. id: The ID of the zone entry. body: The modified zone entry.   Usage Example     URL  https://192.168.1.1/securetrack/api/zones/2/entries/1    BODY  { "zone_entry": { &nbsp;&nbsp;&nbsp;&nbsp;"ip": "192.168.2.3", &nbsp;&nbsp;&nbsp;...(description truncated)
   *
   * @function modifyAZoneEntry
   * @param {object} body - PUT body parameter
   * @param {default} zoneId - path parameter
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  modifyAZoneEntry(body, zoneId, id, callback) {
    const meth = 'adapter-modifyAZoneEntry';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (zoneId === undefined || zoneId === null || zoneId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['zoneId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [zoneId, id];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkZoneManagerSubnets', 'modifyAZoneEntry', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['modifyAZoneEntry'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary For IPv4 entry provide IP and netmask/prefix. For IPv6 provide IP and prefix only, netmask is not allowed. new_zone_id is not optional, it may be the same as the present zoneId.   Parameters:  context: Global MSSP context. [optional] zone_ids: The ID(s) of the zones containing the zone entries. ids: The ID(s) of the zone entries to modify. body [optional]   Usage Example     URL  https://192.168.1.1/securetrack/api/zones/85,98/entries/120,139    BODY  { "zone_entries" : { &nbsp;&nbsp;&nbsp;&nbsp...(description truncated)
   *
   * @function modifyMultipleExistingZoneEntries
   * @param {object} body - PUT body parameter
   * @param {default} zoneIds - path parameter
   * @param {default} ids - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  modifyMultipleExistingZoneEntries(body, zoneIds, ids, callback) {
    const meth = 'adapter-modifyMultipleExistingZoneEntries';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (zoneIds === undefined || zoneIds === null || zoneIds === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['zoneIds'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (ids === undefined || ids === null || ids === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['ids'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [zoneIds, ids];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkZoneManagerSubnets', 'modifyMultipleExistingZoneEntries', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['modifyMultipleExistingZoneEntries'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Modify an existing zone entry.   Parameters:  context: Global MSSP context. [optional] zone_ids: The ID(s) of the zones containing the zone entry. ids: The ID(s) of the zone entries to delete.   Usage Example  https://192.168.1.1/securetrack/api/zones/2,3/entries/10,20   Response Messages:  200: The zone entry was deleted successfully. 401: User is not permitted to access the specified domain 404: A zone with the specified ID was not found. 404: A zone entry with the specified ID was not found.
   *
   * @function deleteZonesZoneIdsEntriesIds
   * @param {default} zoneIds - path parameter
   * @param {default} ids - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteZonesZoneIdsEntriesIds(zoneIds, ids, callback) {
    const meth = 'adapter-deleteZonesZoneIdsEntriesIds';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (zoneIds === undefined || zoneIds === null || zoneIds === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['zoneIds'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (ids === undefined || ids === null || ids === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['ids'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [zoneIds, ids];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkZoneManagerSubnets', 'deleteZonesZoneIdsEntriesIds', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteZonesZoneIdsEntriesIds'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary For IPv4 entry provide IP and netmask/prefix (see Usage Example #1 and #2). For IPv6 provide IP and prefix only, netmask is not allowed(see Usage Example #3).   Parameters:  context: Global MSSP context. [optional] zone_id: The ID of the zone containing the zone entry. body: The zone entry to create.   Usage Example     URL  https://192.168.1.1/securetrack/api/zones/2/entries    BODY  { "zone_entry": { &nbsp;&nbsp;&nbsp;&nbsp;"ip": "192.168.2.3", &nbsp;&nbsp;&nbsp;&nbsp;"netmask": "255.255.255.0...(description truncated)
   *
   * @function createAZoneEntry
   * @param {object} body - POST body parameter
   * @param {default} zoneId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createAZoneEntry(body, zoneId, callback) {
    const meth = 'adapter-createAZoneEntry';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (zoneId === undefined || zoneId === null || zoneId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['zoneId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [zoneId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkZoneManagerSubnets', 'createAZoneEntry', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createAZoneEntry'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Get the list of zone entries for a zone.   Parameters:  context: Global MSSP context. [optional] ids: Filter by IDs for the zone entry results. [optional] name: Filter by name for the zone entry results. [optional] ip: Filter by IP for the zone entry results. [optional] netmask: Filter by netmask for the zone entry results. [optional] prefix: Filter by prefix for the zone entry results. [optional] comment: Filter by comment for the zone entry results. [optional] group: Filter by device group for...(description truncated)
   *
   * @function getEntriesForAZone
   * @param {default} ids - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getEntriesForAZone(ids, callback) {
    const meth = 'adapter-getEntriesForAZone';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (ids === undefined || ids === null || ids === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['ids'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [ids];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkZoneManagerSubnets', 'getEntriesForAZone', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getEntriesForAZone'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Import a shared zone into the specified domain   Parameters:  context: Global MSSP context. [optional] ids: The ID(s) of the zones to import. [optional]   Usage Example  https://192.168.1.1/securetrack/api/zones/import/10,20   Response Messages:  200: The zone was imported successfully. 401: User is not permitted to access the specified domain 404: A zone with the specified ID was not found.
   *
   * @function importAZone
   * @param {object} body - POST body parameter
   * @param {default} ids - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  importAZone(body, ids, callback) {
    const meth = 'adapter-importAZone';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (ids === undefined || ids === null || ids === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['ids'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [ids];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkZoneManagerZones', 'importAZone', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['importAZone'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Get a list of configuration usages for the specified zone(s).   Parameters:  context: Global MSSP context. [optional] ids: The ID(s) of the zones for which to look for configuration dependencies.   Usage Example  https://192.168.1.1/securetrack/api/zones/2,3/dependencies   Response Messages:  200: The zone dependencies were retrieved successfully. 401: User is not permitted to access the specified domain 404: A zone with the specified ID was not found.
   *
   * @function getConfigurationUsagesForAZone
   * @param {default} ids - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getConfigurationUsagesForAZone(ids, callback) {
    const meth = 'adapter-getConfigurationUsagesForAZone';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (ids === undefined || ids === null || ids === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['ids'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [ids];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkZoneManagerZones', 'getConfigurationUsagesForAZone', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getConfigurationUsagesForAZone'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Remove a zone(s) as an descendants to a existing zone.   Parameters:  context: Global MSSP context. [optional] parent_id: The ID of the zone for which to remove descendant zone(s). child_ids: The ID(s) of the zone to remove as a descendant.   Usage Example  https://192.168.1.1/securetrack/api/zones/1/descendants/10,20   Response Messages:  200: The zone was removed as an descendant successfully. 401: User is not permitted to access the specified domain 404: A zone with the specified ID was not f...(description truncated)
   *
   * @function removeAZoneAsAnDescendantsToAZone
   * @param {default} parentId - path parameter
   * @param {default} childIds - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  removeAZoneAsAnDescendantsToAZone(parentId, childIds, callback) {
    const meth = 'adapter-removeAZoneAsAnDescendantsToAZone';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (parentId === undefined || parentId === null || parentId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['parentId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (childIds === undefined || childIds === null || childIds === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['childIds'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [parentId, childIds];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkZoneManagerZones', 'removeAZoneAsAnDescendantsToAZone', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['removeAZoneAsAnDescendantsToAZone'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Add a zone(s) as a descendant to a existing zone.   Parameters:  context: Global MSSP context. [optional] parent_id: The ID of the zone for which to add descendant zone(s). child_ids: The ID(s) of the zones to add as descendants.   Usage Example  https://192.168.1.1/securetrack/api/zones/1/descendants/10,20   Response Messages:  200: The zone was added as an descendant successfully. 401: User is not permitted to access the specified domain 404: A zone with the specified ID was not found.
   *
   * @function addAZoneAsADescendantToAZone
   * @param {object} body - PUT body parameter
   * @param {default} parentId - path parameter
   * @param {default} childIds - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  addAZoneAsADescendantToAZone(body, parentId, childIds, callback) {
    const meth = 'adapter-addAZoneAsADescendantToAZone';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (parentId === undefined || parentId === null || parentId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['parentId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (childIds === undefined || childIds === null || childIds === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['childIds'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [parentId, childIds];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkZoneManagerZones', 'addAZoneAsADescendantToAZone', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['addAZoneAsADescendantToAZone'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Create a zone.   Parameters:  context: Global MSSP context. [optional] body: The zone to add.   Usage Example     URL  https://192.168.1.1/securetrack/api/zones    BODY  &lt;?xml version="1.0" encoding="UTF-8"?&gt; &lt;zone&gt; &nbsp;&nbsp;&nbsp;&nbsp;&lt;name&gt;DMZ&lt;/name&gt; &nbsp;&nbsp;&nbsp;&nbsp;&lt;comment&gt;All DMZ addresses&lt;/comment&gt; &nbsp;&nbsp;&nbsp;&nbsp;&lt;shared&gt;false&lt;/shared&gt; &lt;/zone&gt;      Response Messages:  201: The zone was created successfully. 401: Use...(description truncated)
   *
   * @function createAZone
   * @param {object} body - POST body parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createAZone(body, callback) {
    const meth = 'adapter-createAZone';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkZoneManagerZones', 'createAZone', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createAZone'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Gets a list of all zones.   Parameters:  context: Global MSSP context. [optional] name: Filter by zone name for the zone results. [optional] comment: Filter by zone comment for the zone results. [optional] imported: List domains that imported zones. [optional] includeInternet: Include the Internet zone. [optional] includeImported: Include imported zones. [optional] sort: Sort ascending or descending. [optional] start: Starting page number for query results. [optional] count: Number of pages to r...(description truncated)
   *
   * @function getAllZones
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getAllZones(callback) {
    const meth = 'adapter-getAllZones';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkZoneManagerZones', 'getAllZones', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getAllZones'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Delete all existing zones.   Parameters:  context: Global MSSP context. [optional]   Usage Example  https://192.168.1.1/securetrack/api/zones   Response Messages:  204: All zones were successfully deleted. 401: User is not permitted to access the specified domain
   *
   * @function deleteAllZones
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteAllZones(callback) {
    const meth = 'adapter-deleteAllZones';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkZoneManagerZones', 'deleteAllZones', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteAllZones'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Get a list of shared zones.   Parameters:  context: Global MSSP context. [optional]   Usage Example  https://192.168.1.1/securetrack/api/zones/shared   Response Messages:  200: The list of shared zones was retrieved successfully. 401: User is not permitted to access the specified domain
   *
   * @function getSharedZones
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSharedZones(callback) {
    const meth = 'adapter-getSharedZones';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkZoneManagerZones', 'getSharedZones', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSharedZones'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Delete an existing zone.   Parameters:  context: Global MSSP context. [optional] ids: The ID(s) of the zone to delete.   Usage Example  https://192.168.1.1/securetrack/api/zones/1,2   Response Messages:  204: The specified zone was successfully deleted. 401: User is not permitted to access the specified domain 404: A zone with the specified ID was not found.
   *
   * @function deleteAZone
   * @param {default} ids - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteAZone(ids, callback) {
    const meth = 'adapter-deleteAZone';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (ids === undefined || ids === null || ids === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['ids'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [ids];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkZoneManagerZones', 'deleteAZone', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteAZone'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Add a zone(s) as an ancestor to a existing zone.   Parameters:  context: Global MSSP context. [optional] child_id: The ID of the zone for which to add ancestors zone(s). parent_ids: The ID(s) of the zones to add as ancestors.   Usage Example  https://192.168.1.1/securetrack/api/zones/1/ancestors/10,20   Response Messages:  200: The zone was added as an ancestor successfully. 401: User is not permitted to access the specified domain 404: A zone with the specified ID was not found.
   *
   * @function addAZoneAsAnAncestorToAZone
   * @param {object} body - PUT body parameter
   * @param {default} childId - path parameter
   * @param {default} parentIds - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  addAZoneAsAnAncestorToAZone(body, childId, parentIds, callback) {
    const meth = 'adapter-addAZoneAsAnAncestorToAZone';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (childId === undefined || childId === null || childId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['childId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (parentIds === undefined || parentIds === null || parentIds === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['parentIds'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [childId, parentIds];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkZoneManagerZones', 'addAZoneAsAnAncestorToAZone', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['addAZoneAsAnAncestorToAZone'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Remove a zone(s) as an ancestor to a existing zone.   Parameters:  context: Global MSSP context. [optional] child_id: The ID of the zone for which to remove ancestors zone(s). parent_ids: The ID(s) of the zones to remove as ancestors.   Usage Example  https://192.168.1.1/securetrack/api/zones/1/ancestors/10,20   Response Messages:  200: The zone was removed as an ancestor successfully. 401: User is not permitted to access the specified domain 404: A zone with the specified ID was not found.
   *
   * @function removeAZoneAsAnAncestorToAZone
   * @param {default} childId - path parameter
   * @param {default} parentIds - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  removeAZoneAsAnAncestorToAZone(childId, parentIds, callback) {
    const meth = 'adapter-removeAZoneAsAnAncestorToAZone';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (childId === undefined || childId === null || childId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['childId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (parentIds === undefined || parentIds === null || parentIds === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['parentIds'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [childId, parentIds];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkZoneManagerZones', 'removeAZoneAsAnAncestorToAZone', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['removeAZoneAsAnAncestorToAZone'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Modify an existing zone.   Parameters:  context: Global MSSP context. [optional] id: The ID of the zone to modify. body [optional]   Usage Example     URL  https://192.168.1.1/securetrack/api/zones/2    BODY  &lt;?xml version="1.0" encoding="UTF-8"?&gt; &lt;zone&gt; &nbsp;&nbsp;&nbsp;&nbsp;&lt;id&gt;2&lt;/id&gt; &nbsp;&nbsp;&nbsp;&nbsp;&lt;name&gt;DMZ&lt;/name&gt; &nbsp;&nbsp;&nbsp;&nbsp;&lt;comment&gt;All DMZ hosts&lt;/comment&gt; &nbsp;&nbsp;&nbsp;&nbsp;&lt;shared&gt;false&lt;/shared&gt; &nbsp...(description truncated)
   *
   * @function modifyAZone
   * @param {object} body - PUT body parameter
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  modifyAZone(body, id, callback) {
    const meth = 'adapter-modifyAZone';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkZoneManagerZones', 'modifyAZone', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['modifyAZone'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Get the zone with the specified ID.   Parameters:  context: Global MSSP context. [optional] id: The ID of the zone to get. imported: List domains that imported zones. [optional]   Usage Example  https://192.168.1.1/securetrack/api/zones/2   Response Messages:  200: The zone was retrieved successfully. 401: User is not permitted to access the specified domain 401: A zone with the specified ID does not exist.
   *
   * @function getASpecificZone
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getASpecificZone(id, callback) {
    const meth = 'adapter-getASpecificZone';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkZoneManagerZones', 'getASpecificZone', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getASpecificZone'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Get a list of ancestor zones for the specified zone(s).   Parameters:  context: Global MSSP context. [optional] ids: The ID(s) of the zones for which to look for ancestor zones.   Usage Example  https://192.168.1.1/securetrack/api/zones/123,234/ancestors   Response Messages:  200: The zone ancestors were retrieved successfully. 401: User is not permitted to access the specified domain 404: A zone with the specified ID was not found.
   *
   * @function getAncestorZonesForAZone
   * @param {default} ids - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getAncestorZonesForAZone(ids, callback) {
    const meth = 'adapter-getAncestorZonesForAZone';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (ids === undefined || ids === null || ids === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['ids'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [ids];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkZoneManagerZones', 'getAncestorZonesForAZone', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getAncestorZonesForAZone'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Get a list of zones descended from the specified zone(s).   Parameters:  context: Global MSSP context. [optional] ids: The ID(s) of the zones for which to look for descendant zones.   Usage Example  https://192.168.1.1/securetrack/api/zones/10,20/descendants   Response Messages:  200: The zone descendants were retrieved successfully. 401: User is not permitted to access the specified domain 404: A zone with the specified ID was not found.
   *
   * @function getDescendantZonesForAZone
   * @param {default} ids - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getDescendantZonesForAZone(ids, callback) {
    const meth = 'adapter-getDescendantZonesForAZone';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (ids === undefined || ids === null || ids === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['ids'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [ids];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkZoneManagerZones', 'getDescendantZonesForAZone', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getDescendantZonesForAZone'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary This API maps each network element in the AccessRequestNetworkListDTO (such as IP address, IP address range, object, or group) to all matching Tufin security zones. If the network element is a group, then each zone also identifies all matching group members. The internet referral object can be included in the list, and will always map to the predefined Internet security zone. If the 'Any' element is included in the list it will map to all zones. Note: if multi-domain mode is enabled, the API cal...(description truncated)
   *
   * @function mapNetworkElementsToSecurityZones
   * @param {object} body - POST body parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  mapNetworkElementsToSecurityZones(body, callback) {
    const meth = 'adapter-mapNetworkElementsToSecurityZones';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '', contentType: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('NetworkZoneManagerZones', 'mapNetworkElementsToSecurityZones', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['mapNetworkElementsToSecurityZones'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieve list of bindings of input and/or output interfaces   Parameters:  device_id: The unique identifier of target device supremum_version_id: The unique identifier of target revision inputInterfaceName: Input interface name outputInterfaceName: Output interface name   Usage Example  https://192.168.1.1/securetrack/api/bindings/20/binding_query?supremum_version_id=785&inputInterfaceName=Any&outputInterfaceName=Any
   *
   * @function getListOfSubPoliciesBindingsWithInputAndOrOutputInterfaces
   * @param {default} deviceId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getListOfSubPoliciesBindingsWithInputAndOrOutputInterfaces(deviceId, callback) {
    const meth = 'adapter-getListOfSubPoliciesBindingsWithInputAndOrOutputInterfaces';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (deviceId === undefined || deviceId === null || deviceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['deviceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [deviceId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('PoliciesAndSubPolicies', 'getListOfSubPoliciesBindingsWithInputAndOrOutputInterfaces', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getListOfSubPoliciesBindingsWithInputAndOrOutputInterfaces'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Fetches list of policies defined on a given revision ID    Parameters:  context: Global MSSP context [optional] id: Revision ID   Usage Example  https://192.168.1.1/securetrack/api/revisions/785/policies
   *
   * @function getPoliciesByRevision
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getPoliciesByRevision(id, callback) {
    const meth = 'adapter-getPoliciesByRevision';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('PoliciesAndSubPolicies', 'getPoliciesByRevision', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getPoliciesByRevision'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns a list of all of the subpolicies (bindings) for a given device. The definition of subpolicy is different for each vendor: Check Point - policy package and inline layer (inline layer will be returned only when the optional include_subpolicy parameter is set to true) Cisco - ACL Juniper/Fortinet/Palo Alto/Stonesoft - zone-to-zone policy Cloud platforms - Security Groups    Parameters:  context: Global MSSP context [optional] id: Device ID ipType: Policy ip Type, values can be 'ipv4' or 'ip...(description truncated)
   *
   * @function getSubPoliciesBindingsByDevice
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSubPoliciesBindingsByDevice(id, callback) {
    const meth = 'adapter-getSubPoliciesBindingsByDevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('PoliciesAndSubPolicies', 'getSubPoliciesBindingsByDevice', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSubPoliciesBindingsByDevice'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Parameters:  device_id: The unique identifier of target device inputInterfaceName: Input interface name [optional] outputInterfaceName: Output interface name [optional]   Usage Example  https://192.168.1.1/securetrack/api/bindings/2/topology_interfaces?inputInterfaceName=ethernet1/1&outputInterfaceName=ethernet1/2
   *
   * @function getRulesByInputAndOutputInterfaces
   * @param {default} deviceId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getRulesByInputAndOutputInterfaces(deviceId, callback) {
    const meth = 'adapter-getRulesByInputAndOutputInterfaces';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (deviceId === undefined || deviceId === null || deviceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['deviceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [deviceId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('PoliciesAndSubPolicies', 'getRulesByInputAndOutputInterfaces', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getRulesByInputAndOutputInterfaces'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns a list of all of the subpolicies (bindings) for a given revision. The definition of subpolicy is different for each vendor: Check Point - policy package and inline layer (inline layer will be returned only when the optional include_subpolicy parameter is set to true) Cisco - ACL Juniper/Fortinet/Palo Alto/Stonesoft - zone-to-zone policy Cloud platforms - Security Groups    Parameters:  context: Global MSSP context [optional] id: Revision ID ipType: Policy ip Type, values can be 'ipv4' or...(description truncated)
   *
   * @function getSubPoliciesBindingsByRevision
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSubPoliciesBindingsByRevision(id, callback) {
    const meth = 'adapter-getSubPoliciesBindingsByRevision';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('PoliciesAndSubPolicies', 'getSubPoliciesBindingsByRevision', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSubPoliciesBindingsByRevision'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Fetches list of policies defined on a given device ID.  Supported devices: CheckPoint, Panorama Advanced, FortiManager Basic and Advanced, FMC and NSX.   Parameters:  context: Global MSSP context [optional] id: Device ID   Usage Example  https://192.168.1.1/securetrack/api/devices/20/policies
   *
   * @function getPoliciesByDevice
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getPoliciesByDevice(id, callback) {
    const meth = 'adapter-getPoliciesByDevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('PoliciesAndSubPolicies', 'getPoliciesByDevice', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getPoliciesByDevice'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Parameters:  device_ids: Device ids sources: Source list destinations: Destination list services: Service list exclude_any: Exclude any in the specified, comma-separated fields of  source, destination or service. For example: exclude_any = destination,service [optional] action: Action [optional]   Usage Example  https://192.168.1.1/securetrack/api/policy_analysis/query/matching_rules?device_ids=41&sources=33.33.33.0:24,113.113.113.100&destinations=114.1.1.0:24&services=tcp:80&exclude_any=source...(description truncated)
   *
   * @function runPolicyAnalysisQuery
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  runPolicyAnalysisQuery(callback) {
    const meth = 'adapter-runPolicyAnalysisQuery';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('PolicyAnalysis', 'runPolicyAnalysisQuery', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['runPolicyAnalysisQuery'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Delete rule documentation for a single rule given by device ID and rule ID   Parameters:  context: Global MSSP context [optional] id: Device ID rule_id: Rule ID   Usage Example  https://192.168.1.1/securetrack/api/devices/20/rules/3040/documentation
   *
   * @function deleteSpecificRuleDocumentation
   * @param {default} id - path parameter
   * @param {default} ruleId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteSpecificRuleDocumentation(id, ruleId, callback) {
    const meth = 'adapter-deleteSpecificRuleDocumentation';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (ruleId === undefined || ruleId === null || ruleId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['ruleId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id, ruleId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('PolicyBrowserFormerlyRuleDocumentation', 'deleteSpecificRuleDocumentation', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteSpecificRuleDocumentation'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Fetches rule documentation for a single rule given by device ID and rule ID   Parameters:  context: Global MSSP context [optional] id: Device ID rule_id: Rule ID   Usage Example  https://192.168.1.1/securetrack/api/devices/20/rules/16373/documentation
   *
   * @function getSpecificRuleDocumentation
   * @param {default} id - path parameter
   * @param {default} ruleId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSpecificRuleDocumentation(id, ruleId, callback) {
    const meth = 'adapter-getSpecificRuleDocumentation';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (ruleId === undefined || ruleId === null || ruleId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['ruleId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id, ruleId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('PolicyBrowserFormerlyRuleDocumentation', 'getSpecificRuleDocumentation', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSpecificRuleDocumentation'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Modify rule documentation for a single rule given by device ID and rule ID A single rule can be set as either a stealth rule or legacy rule. If both flags are set, an error will be returned (error 400, Bad request). If there is no existing rule documentation for the rule, the specified documentation is added to the rule and the response code is: 201 Created. If there is existing rule documentation for the rule, the specified documentation replaces the existing documentation and the response code...(description truncated)
   *
   * @function modifySpecificRuleDocumentation
   * @param {object} body - PUT body parameter
   * @param {default} id - path parameter
   * @param {default} ruleId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  modifySpecificRuleDocumentation(body, id, ruleId, callback) {
    const meth = 'adapter-modifySpecificRuleDocumentation';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (ruleId === undefined || ruleId === null || ruleId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['ruleId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id, ruleId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('PolicyBrowserFormerlyRuleDocumentation', 'modifySpecificRuleDocumentation', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['modifySpecificRuleDocumentation'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Modify rule documentation for a single rule identified by revision ID and rule ID. A single rule can be set as either a stealth rule or legacy rule. If both flags are set, an error will be returned (error 400, Bad request). If no rule documentation exists for the rule, the specified documentation is added to the rule and the response code is: 201 Created. If rule documentation already exists for the rule, the specified documentation replaces the existing documentation and the response code is: 2...(description truncated)
   *
   * @function putRevisionsIdRulesRuleIdDocumentation
   * @param {object} body - PUT body parameter
   * @param {default} id - path parameter
   * @param {default} ruleId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  putRevisionsIdRulesRuleIdDocumentation(body, id, ruleId, callback) {
    const meth = 'adapter-putRevisionsIdRulesRuleIdDocumentation';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (ruleId === undefined || ruleId === null || ruleId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['ruleId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id, ruleId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('PolicyBrowserFormerlyRuleDocumentation', 'putRevisionsIdRulesRuleIdDocumentation', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['putRevisionsIdRulesRuleIdDocumentation'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Delete rule documentation for a single rule given by revision ID and rule ID. If the rule has automatic mapping to a ticket, the record is not deleted.   Parameters:  context: Global MSSP context [optional] id: Revision id rule_id: Rule id   Usage Example  https://192.168.1.1/securetrack/api/revisions/173/rules/3373/documentation
   *
   * @function deleteRevisionsIdRulesRuleIdDocumentation
   * @param {default} id - path parameter
   * @param {default} ruleId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteRevisionsIdRulesRuleIdDocumentation(id, ruleId, callback) {
    const meth = 'adapter-deleteRevisionsIdRulesRuleIdDocumentation';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (ruleId === undefined || ruleId === null || ruleId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['ruleId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id, ruleId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('PolicyBrowserFormerlyRuleDocumentation', 'deleteRevisionsIdRulesRuleIdDocumentation', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteRevisionsIdRulesRuleIdDocumentation'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Fetches rule documentation for a single rule given by revision ID and rule ID.   Parameters:  context: Global MSSP context [optional] id: Revision id rule_id: Id of the requested rule   Usage Example  https://192.168.1.1/securetrack/api/revisions/785/rules/16373/documentation
   *
   * @function getRevisionsIdRulesRuleIdDocumentation
   * @param {default} id - path parameter
   * @param {default} ruleId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getRevisionsIdRulesRuleIdDocumentation(id, ruleId, callback) {
    const meth = 'adapter-getRevisionsIdRulesRuleIdDocumentation';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (ruleId === undefined || ruleId === null || ruleId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['ruleId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id, ruleId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('PolicyBrowserFormerlyRuleDocumentation', 'getRevisionsIdRulesRuleIdDocumentation', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getRevisionsIdRulesRuleIdDocumentation'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Parameters:  context: Global MSSP context [optional] devices: Devices ids [optional]   Usage Example  https://192.168.1.1/securetrack/api/cleanup
   *
   * @function getCleanupsResults
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getCleanupsResults(callback) {
    const meth = 'adapter-getCleanupsResults';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('PolicyOptimization', 'getCleanupsResults', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getCleanupsResults'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Parameters:  context: Global MSSP context [optional] cleanup_id: Cleanup id devices: Devices ids [optional] start: Start [optional] count: Results count [optional]   Usage Example  https://192.168.1.1/securetrack/api/cleanup/1/instances
   *
   * @function getTheSpecificObjectsOrRulesIdentifiedForTheCleanupResults
   * @param {default} cleanupId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getTheSpecificObjectsOrRulesIdentifiedForTheCleanupResults(cleanupId, callback) {
    const meth = 'adapter-getTheSpecificObjectsOrRulesIdentifiedForTheCleanupResults';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (cleanupId === undefined || cleanupId === null || cleanupId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['cleanupId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [cleanupId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('PolicyOptimization', 'getTheSpecificObjectsOrRulesIdentifiedForTheCleanupResults', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getTheSpecificObjectsOrRulesIdentifiedForTheCleanupResults'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Parameters:  context: Global MSSP context [optional] risk_id: Risk id devices: Devices ids [optional] start: Start [optional] count: Results count [optional]   Usage Example  https://192.168.1.1/securetrack/api/risk/1/instances
   *
   * @function getTheSpecificObjectsOrRulesIdentifiedForTheRiskResults
   * @param {default} riskId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getTheSpecificObjectsOrRulesIdentifiedForTheRiskResults(riskId, callback) {
    const meth = 'adapter-getTheSpecificObjectsOrRulesIdentifiedForTheRiskResults';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (riskId === undefined || riskId === null || riskId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['riskId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [riskId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('PolicyOptimization', 'getTheSpecificObjectsOrRulesIdentifiedForTheRiskResults', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getTheSpecificObjectsOrRulesIdentifiedForTheRiskResults'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Fetches set of Cleanup calculation results for a device given by ID. Only fully shadowed rules (cleanup code C01) are supported.   Parameters:  context: Global MSSP context [optional] device_id: Device ID code: Cleanup category code start: Starting page for query allowable values are numeric [optional] count: Number of pages for query result allowable values are numeric [optional]   Usage Example  https://192.168.1.1/securetrack/api/devices/31/cleanups?code=C01
   *
   * @function getCleanupsByDevice
   * @param {default} deviceId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getCleanupsByDevice(deviceId, callback) {
    const meth = 'adapter-getCleanupsByDevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (deviceId === undefined || deviceId === null || deviceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['deviceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [deviceId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('PolicyOptimization', 'getCleanupsByDevice', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getCleanupsByDevice'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Parameters:  context: Global MSSP context [optional] risk_id: Risk id   Usage Example  https://192.168.1.1/securetrack/api/risk/1/devices
   *
   * @function getDevicesInRiskResults
   * @param {default} riskId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getDevicesInRiskResults(riskId, callback) {
    const meth = 'adapter-getDevicesInRiskResults';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (riskId === undefined || riskId === null || riskId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['riskId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [riskId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('PolicyOptimization', 'getDevicesInRiskResults', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getDevicesInRiskResults'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Parameters:  context: Global MSSP context [optional] devices: Devices ids [optional]   Usage Example  https://192.168.1.1/securetrack/api/risk
   *
   * @function getRisksResults
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getRisksResults(callback) {
    const meth = 'adapter-getRisksResults';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('PolicyOptimization', 'getRisksResults', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getRisksResults'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Find shadowing rules for given shadowed rules of a specific device   Parameters:  device_id: Device ID shadowed_uids: UIDs of shadowed rules separated by commas   Usage Example  https://192.168.1.1/securetrack/api/devices/31/shadowing_rules?shadowed_uids=78786a0d-b9cc-478e-b7a2-dea953c976c7
   *
   * @function getShadowingRulesByDevice
   * @param {default} deviceId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getShadowingRulesByDevice(deviceId, callback) {
    const meth = 'adapter-getShadowingRulesByDevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (deviceId === undefined || deviceId === null || deviceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['deviceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [deviceId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('PolicyOptimization', 'getShadowingRulesByDevice', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getShadowingRulesByDevice'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Parameters:  context: Global MSSP context [optional] cleanup_id: Cleanup id   Usage Example  https://192.168.1.1/securetrack/api/cleanup/1/devices
   *
   * @function getDevicesInCleanupResults
   * @param {default} cleanupId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getDevicesInCleanupResults(cleanupId, callback) {
    const meth = 'adapter-getDevicesInCleanupResults';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (cleanupId === undefined || cleanupId === null || cleanupId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['cleanupId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [cleanupId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('PolicyOptimization', 'getDevicesInCleanupResults', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getDevicesInCleanupResults'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Fetches revisions for a given device   Parameters:  context: Global MSSP context [optional] id: Device ID start: Starting page for query allowable type is numeric [optional] count: Number of pages for query starting from starting page allowable type is numeric [optional]   Usage Example  https://192.168.1.1/securetrack/api/devices/105/revisions
   *
   * @function getRevisionsByDevice
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getRevisionsByDevice(id, callback) {
    const meth = 'adapter-getRevisionsByDevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Revisions', 'getRevisionsByDevice', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getRevisionsByDevice'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Fetches a revision specified by revision Id. To get revId for this API, use the 'id' property of RevisionDTO that is returned by 'Get revisions by device' or 'Get latest revision by device' APIs   Parameters:  context: Global MSSP context [optional] revId: Id of fetched revision   Usage Example  https://192.168.1.1/securetrack/api/revisions/785
   *
   * @function getSpecificRevision
   * @param {default} revId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSpecificRevision(revId, callback) {
    const meth = 'adapter-getSpecificRevision';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (revId === undefined || revId === null || revId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['revId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [revId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Revisions', 'getSpecificRevision', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSpecificRevision'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Fetches latest revision for a given device   Parameters:  context: Global MSSP context [optional] id: Device ID   Usage Example  https://192.168.1.1/securetrack/api/devices/105/latest_revision
   *
   * @function getLatestRevisionByDevice
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getLatestRevisionByDevice(id, callback) {
    const meth = 'adapter-getLatestRevisionByDevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('Revisions', 'getLatestRevisionByDevice', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getLatestRevisionByDevice'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Get last hit dates for all rules in a given device. For Palo Alto firewalls, this also returns last hits for users and applications in the rule.   Parameters:  device_id: device id   Usage Example  https://192.168.1.1/securetrack/api/rule_last_usage/find_all/20
   *
   * @function getLastHitsForAllRulesByDevice
   * @param {default} deviceId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getLastHitsForAllRulesByDevice(deviceId, callback) {
    const meth = 'adapter-getLastHitsForAllRulesByDevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (deviceId === undefined || deviceId === null || deviceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['deviceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [deviceId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('RuleUsage', 'getLastHitsForAllRulesByDevice', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getLastHitsForAllRulesByDevice'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Get last hit dates for all rules in a given device. For Palo Alto firewalls, this also returns last hits for users and applications in the rule. The rule_uid is the value from the uid field returned by the /rules API: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx   Parameters:  device_id: device_id rule_uid: rule_uid   Usage Example  https://192.168.1.1/securetrack/api/rule_last_usage/find/20/ea9db13e-d058-45c6-a2f0-cd731027c22b
   *
   * @function getLastHitForASpecificRule
   * @param {default} deviceId - path parameter
   * @param {default} ruleUid - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getLastHitForASpecificRule(deviceId, ruleUid, callback) {
    const meth = 'adapter-getLastHitForASpecificRule';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (deviceId === undefined || deviceId === null || deviceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['deviceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (ruleUid === undefined || ruleUid === null || ruleUid === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['ruleUid'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [deviceId, ruleUid];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('RuleUsage', 'getLastHitForASpecificRule', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getLastHitForASpecificRule'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Parameters:  ruleId: Rule ID   Usage Example  https://192.168.1.1/securetrack/api/rules/60
   *
   * @function getASpecificRule
   * @param {default} ruleId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getASpecificRule(ruleId, callback) {
    const meth = 'adapter-getASpecificRule';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (ruleId === undefined || ruleId === null || ruleId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['ruleId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [ruleId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('SecurityRules', 'getASpecificRule', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getASpecificRule'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns a list of rules by device ID, rule IDs and additional criteria.  Note:  This API retrieves the information from the latest revision.    Parameters:  context: Global MSSP context [optional] device_id: Device ID ids: Rule IDs policy: Policy Name [optional] interface: Interfaces to query [optional] zone: Zone name [optional] is_global: Get global rules only(device dependent, see implementation Notes) [optional] add: If set to "documentation" result will include rule documentation [optional]...(description truncated)
   *
   * @function getSpecificRule
   * @param {default} deviceId - path parameter
   * @param {default} ids - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSpecificRule(deviceId, ids, callback) {
    const meth = 'adapter-getSpecificRule';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (deviceId === undefined || deviceId === null || deviceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['deviceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (ids === undefined || ids === null || ids === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['ids'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [deviceId, ids];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('SecurityRules', 'getSpecificRule', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSpecificRule'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary The search_text parameter provides the same capabilities as the Policy Browser feature in SecureTrack. You can search for a string across all rule fields, or you can search for a combination of specific strings in specific fields. The text format is for a field is &lt;fieldname&gt;:&lt;text&gt; for example uid:9259f6ee-47a0-4996-a214-ab7edc14a916. See the search info documentation in Securetrack Policy Browser page for more information. This API will return a list of all the devices, the devices...(description truncated)
   *
   * @function getRuleCountPerDevice
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getRuleCountPerDevice(callback) {
    const meth = 'adapter-getRuleCountPerDevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('SecurityRules', 'getRuleCountPerDevice', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getRuleCountPerDevice'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns a list of rules by revision ID, rule IDs and additional criteria   Parameters:  context: Global MSSP context [optional] revision_id: Revision id ids: Rule IDs policy: Policy name [optional] interface: Interfaces to query [optional] zone: Zone name [optional] is_global: Get global rules (Only for: ACL devices) [optional] add: If set to \"documentation\" result will include rule documentation [optional] groupBy: Rules grouping criteria, can be set only to \"bindings\" [optional]   Usage Ex...(description truncated)
   *
   * @function getRevisionsRevisionIdRulesIds
   * @param {default} revisionId - path parameter
   * @param {default} ids - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getRevisionsRevisionIdRulesIds(revisionId, ids, callback) {
    const meth = 'adapter-getRevisionsRevisionIdRulesIds';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (revisionId === undefined || revisionId === null || revisionId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['revisionId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (ids === undefined || ids === null || ids === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['ids'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [revisionId, ids];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('SecurityRules', 'getRevisionsRevisionIdRulesIds', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getRevisionsRevisionIdRulesIds'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns a list of all of the security rules for the specified revision.  Use add=documentation to retrieve rule documentation.  The is_global parameter is device dependent. For ACL devices, only global rules are returned when set to true. For Check Point R80, only global layers are returned when set to true, and specify a layer name in the subpolicy_name parameter This parameter is ignored for all other vendors. The default value is false.  The subpolicy_name parameter is device dependent. For C...(description truncated)
   *
   * @function getRulesByRevision
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getRulesByRevision(id, callback) {
    const meth = 'adapter-getRulesByRevision';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('SecurityRules', 'getRulesByRevision', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getRulesByRevision'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary The search_text parameter provides the same capabilities as the Policy Browser feature in SecureTrack. You can search for a string across all rule fields, or you can search for a combination of specific strings in specific fields. The text format is for a field is &lt;fieldname&gt;:&lt;text&gt; for example uid:9259f6ee-47a0-4996-a214-ab7edc14a916. See the search info documentation in Securetrack Policy Browser page for more information.To get more information regarding objects included in the re...(description truncated)
   *
   * @function findRules
   * @param {default} deviceId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  findRules(deviceId, callback) {
    const meth = 'adapter-findRules';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (deviceId === undefined || deviceId === null || deviceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['deviceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [deviceId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('SecurityRules', 'findRules', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['findRules'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns a list of all of the security rules for the specified device.  Use add=documentation to retrieve rule documentation.  The is_global parameter is device dependent. For ACL devices, only global rules are returned when set to true. For Check Point R80, only global layers are returned when set to true, and specify a layer name in the subpolicy_name parameter This parameter is ignored for all other vendors. The default value is false.  The subpolicy_name parameter is device dependent. For Che...(description truncated)
   *
   * @function getRulesByDevice
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getRulesByDevice(id, callback) {
    const meth = 'adapter-getRulesByDevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('SecurityRules', 'getRulesByDevice', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getRulesByDevice'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns groups that contain the specified service objects    Parameters:  context: Returns results for the specified domain ID. [optional] id: The SecureTrack object ID of the service object.   Usage Example  https://192.168.1.1/securetrack/api/services/69577/groups
   *
   * @function getServiceGroupsContainingSpecifiedServiceObjects
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getServiceGroupsContainingSpecifiedServiceObjects(id, callback) {
    const meth = 'adapter-getServiceGroupsContainingSpecifiedServiceObjects';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ServicesAndPorts', 'getServiceGroupsContainingSpecifiedServiceObjects', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getServiceGroupsContainingSpecifiedServiceObjects'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Fetches list of specific service objects defined in revision given by revision ID and specified by their IDs    Parameters:  context: Global MSSP context [optional] revision_id: Revision id ids: Rule IDs show_members: Set to false to return only the name and ID of the members [optional]   Usage Example  https://192.168.1.1/securetrack/api/revisions/785/services/959888
   *
   * @function getSpecificService
   * @param {default} revisionId - path parameter
   * @param {default} ids - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSpecificService(revisionId, ids, callback) {
    const meth = 'adapter-getSpecificService';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (revisionId === undefined || revisionId === null || revisionId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['revisionId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (ids === undefined || ids === null || ids === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['ids'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [revisionId, ids];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ServicesAndPorts', 'getSpecificService', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSpecificService'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Fetches list of specific service objects defined in device given by device ID and specified by their IDs.  Note:  This API retrieves the information from the latest revision.   Parameters:  context: Global MSSP context [optional] device_id: Device ID ids: Service object IDs separated by commas show_members: Set to false to return only the name and ID of the members [optional]   Usage Example  https://192.168.1.1/securetrack/api/devices/20/services/959888,959966
   *
   * @function getDevicesDeviceIdServicesIds
   * @param {default} deviceId - path parameter
   * @param {default} ids - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getDevicesDeviceIdServicesIds(deviceId, ids, callback) {
    const meth = 'adapter-getDevicesDeviceIdServicesIds';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (deviceId === undefined || deviceId === null || deviceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['deviceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (ids === undefined || ids === null || ids === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['ids'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [deviceId, ids];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ServicesAndPorts', 'getDevicesDeviceIdServicesIds', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getDevicesDeviceIdServicesIds'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns the security rules that contain the specified service object    Parameters:  context: Returns results for the specified domain ID. [optional] id: The SecureTrack object ID of the service object. include_groups: You can add "include_groups" to find rules that include the service object and rules that include the groups that include the service object. [optional] start: Returns the results beginning with the specified result number. [optional] count: Returns the specified number of results...(description truncated)
   *
   * @function getRulesContainingSpecifiedServiceObject
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getRulesContainingSpecifiedServiceObject(id, callback) {
    const meth = 'adapter-getRulesContainingSpecifiedServiceObject';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ServicesAndPorts', 'getRulesContainingSpecifiedServiceObject', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getRulesContainingSpecifiedServiceObject'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Fetches list of service objects defined in revision given by revision ID  The default value for get_total is false. For API calls that have pagination, set get_total to true on the first call. Use the value to returned in total to determine how many additional calls are required to retrieve all the desired results. To improve performance, omit or set get_total to false on any subsequent calls.    Parameters:  context: Global MSSP context [optional] id: Revision id show_members: Set to false to r...(description truncated)
   *
   * @function getServicesByRevision
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getServicesByRevision(id, callback) {
    const meth = 'adapter-getServicesByRevision';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ServicesAndPorts', 'getServicesByRevision', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getServicesByRevision'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary You can search for service objects where the name or comment fields have a specified text string, or you can search for service objects that have an Port or protocol that matches, or you can search for service objects by uid.   Parameters:  context: Returns results for the specified domain ID. [optional] start: Returns the results beginning with the specified result number. [optional] count: Returns the specified number of results. If this field is not added or if a number greater than 100 is sp...(description truncated)
   *
   * @function getServicesObjectsMatchingSpecifiedCriteria
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getServicesObjectsMatchingSpecifiedCriteria(callback) {
    const meth = 'adapter-getServicesObjectsMatchingSpecifiedCriteria';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ServicesAndPorts', 'getServicesObjectsMatchingSpecifiedCriteria', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getServicesObjectsMatchingSpecifiedCriteria'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Fetches list of service objects defined on device given by device ID. The default value for get_total is false. For APIF calls that have pagination, set get_total to true on the first call. Use the value to returned in total to determine how many additional calls are required to retrieve all the desired results. To improve performance, omit or set get_total to false on any subsequent calls.    Parameters:  context: Global MSSP context [optional] id: Device ID show_members: Set to false to return...(description truncated)
   *
   * @function getServicesByDevice
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getServicesByDevice(id, callback) {
    const meth = 'adapter-getServicesByDevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('ServicesAndPorts', 'getServicesByDevice', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getServicesByDevice'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns the time objects used in the specified revision.   Parameters:  context: Global MSSP context [optional] id: Revision ID start: Starting page for query allowable value is numeric [optional] count: Number of pages for query starting from starting page, allowable type is numeric [optional]   Usage Example  https://192.168.1.1/securetrack/api/revisions/785/time_objects
   *
   * @function getTimeObjectsByRevision
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getTimeObjectsByRevision(id, callback) {
    const meth = 'adapter-getTimeObjectsByRevision';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('TimeObjects', 'getTimeObjectsByRevision', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getTimeObjectsByRevision'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns the time objects used in the specified device.   Parameters:  context: Global MSSP context [optional] id: Device ID start: Starting page for query allowable values are numeric [optional] count: Starting page for query allowable values are numeric [optional]   Usage Example  https://192.168.1.1/securetrack/api/devices/20/time_objects
   *
   * @function getTimeObjectsByDevice
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getTimeObjectsByDevice(id, callback) {
    const meth = 'adapter-getTimeObjectsByDevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('TimeObjects', 'getTimeObjectsByDevice', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getTimeObjectsByDevice'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Fetches list of time objects by revision ID and rule ID   Parameters:  context: Global MSSP context [optional] revision_id: Revision ID ids: Rule IDs   Usage Example  https://192.168.1.1/securetrack/api/revisions/7/time_objects/9
   *
   * @function getSpecificTimeObject
   * @param {default} revisionId - path parameter
   * @param {default} ids - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getSpecificTimeObject(revisionId, ids, callback) {
    const meth = 'adapter-getSpecificTimeObject';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (revisionId === undefined || revisionId === null || revisionId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['revisionId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (ids === undefined || ids === null || ids === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['ids'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [revisionId, ids];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('TimeObjects', 'getSpecificTimeObject', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getSpecificTimeObject'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary The response lists all the relevant security groups, tags, relevant instances, and count of unrelated instances for each Amazon VPC in the specified traffic path. A relevant security group contains at least one instance including either the source or destination IP address. An unrelated instance is included in the security group but not part of the specified traffic path. If context is provided, path will be calculated for the specified domain context, otherwise the default domain context is use...(description truncated)
   *
   * @function getPolicyRelevanceMetricsForTraffic
   * @param {object} body - POST body parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getPolicyRelevanceMetricsForTraffic(body, callback) {
    const meth = 'adapter-getPolicyRelevanceMetricsForTraffic';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '', contentType: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('TrafficPolicyMatcher', 'getPolicyRelevanceMetricsForTraffic', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getPolicyRelevanceMetricsForTraffic'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Create a calculation task to find access requests violations. Returns a task Id that can be used to check the task status and get the task results   Parameters:  body [optional] use_topology: Use topology to determine access request domains. [optional] ar_domain_mode: The access request uses resources from multiple domains. [optional]   Usage Example     URL  https://192.168.1.1/securetrack/api/violations/access_requests/task?use_topology=false&ar_domain_mode=false    BODY  &lt;access_requests&g...(description truncated)
   *
   * @function startATaskToCalculateViolationsForAnAccessRequest
   * @param {object} body - POST body parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  startATaskToCalculateViolationsForAnAccessRequest(body, callback) {
    const meth = 'adapter-startATaskToCalculateViolationsForAnAccessRequest';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UnifiedSecurityPolicyAccessRequestViolations', 'startATaskToCalculateViolationsForAnAccessRequest', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['startATaskToCalculateViolationsForAnAccessRequest'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Get result of access requests violations task.   Parameters:  taskId: The unique identifier of the access request violations task.   Usage Example  https://192.168.1.1/securetrack/api/violations/access_requests/result/2d8e0a3c-2b07-42b8-b501-336fe74080a3   Response Messages:  200: Access request violations task results were received. 401: Access is denied. 404: An error occurred during the calculation. 404: The calculation for the task has not finished yet.
   *
   * @function getViolationTaskResults
   * @param {default} taskId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getViolationTaskResults(taskId, callback) {
    const meth = 'adapter-getViolationTaskResults';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (taskId === undefined || taskId === null || taskId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['taskId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [taskId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UnifiedSecurityPolicyAccessRequestViolations', 'getViolationTaskResults', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getViolationTaskResults'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Get access requests violations task status.   Parameters:  taskId: The unique identifier of the access request violations task.   Usage Example  https://192.168.1.1/securetrack/api/violations/access_requests/status/2d8e0a3c-2b07-42b8-b501-336fe74080a3   Response Messages:  200: Access request violations task status was received. 401: Access is denied. 404: Access request violations task status was not found.
   *
   * @function getViolationTaskStatus
   * @param {default} taskId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getViolationTaskStatus(taskId, callback) {
    const meth = 'adapter-getViolationTaskStatus';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (taskId === undefined || taskId === null || taskId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['taskId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [taskId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UnifiedSecurityPolicyAccessRequestViolations', 'getViolationTaskStatus', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getViolationTaskStatus'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Delete an access request violations task.   Parameters:  taskId: The unique identifier of the access request violations task.   Usage Example  https://192.168.1.1/securetrack/api/violations/access_requests/task/2d8e0a3c-2b07-42b8-b501-336fe74080a3   Response Messages:  204: Access request violations task has been aborted successfully. 401: Access is denied. 404: Access request violations task was not found.
   *
   * @function cancelViolationTask
   * @param {default} taskId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  cancelViolationTask(taskId, callback) {
    const meth = 'adapter-cancelViolationTask';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (taskId === undefined || taskId === null || taskId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['taskId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [taskId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UnifiedSecurityPolicyAccessRequestViolations', 'cancelViolationTask', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['cancelViolationTask'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Calculate the violations for the given access request. Note: this API may take a while to complete. See the asynchronous API /violations/access_request/task as an alternative.   Parameters:  body: AccessRequestListDTO use_topology: Use topology to determine access request domains. [optional] ar_domain_mode: The access request supports multiple domains. [optional]   Usage Example     URL  https://192.168.1.1/securetrack/api/violations/access_requests/sync?use_topology=false&ar_domain_mode=false  ...(description truncated)
   *
   * @function getViolationsForAnAccessRequest
   * @param {object} body - POST body parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getViolationsForAnAccessRequest(body, callback) {
    const meth = 'adapter-getViolationsForAnAccessRequest';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '', contentType: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UnifiedSecurityPolicyAccessRequestViolations', 'getViolationsForAnAccessRequest', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getViolationsForAnAccessRequest'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Delete specified alerts by IDs To delete multiple alert_ids, use a comma between each ID   Parameters:  context: Delete alerts in the specified domain ID. [optional] ids: The alert Ids for deletion   Usage Example  https://192.168.1.1/securetrack/api/security_policies/alerts/87   Usage Example  https://192.168.1.1/securetrack/api/security_policies/alerts/86,87,88   Response Messages:  200:  401: Security Policy Alert Ids: :|'alert ids'| don't exist
   *
   * @function deleteAlertsByIds
   * @param {default} ids - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteAlertsByIds(ids, callback) {
    const meth = 'adapter-deleteAlertsByIds';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (ids === undefined || ids === null || ids === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['ids'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [ids];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UnifiedSecurityPolicyAlerts', 'deleteAlertsByIds', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteAlertsByIds'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns a specified alert. If the alert_id does not exist, an error message is returned.   Parameters:  context: MSSP context [optional] id: The alert Id   Usage Example  https://192.168.1.1/securetrack/api/security_policies/alerts/1   Response Messages:  401: Alert ID does not exist
   *
   * @function getASpecificAlert
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getASpecificAlert(id, callback) {
    const meth = 'adapter-getASpecificAlert';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UnifiedSecurityPolicyAlerts', 'getASpecificAlert', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getASpecificAlert'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Update an alert for unified security policies. Alerts can be defined for all devices (all_devices:true) or for specified device IDs. An email and/or user name must be defined. For multiple entries of emails or user names, use a semicolon to separate values. For SecureTrack, users in the collection are populated with "user_ids". The alert will be sent to the users (according to the addresses configured in SecureTrack) and to the emails. To get the domain_id (optional parameter), call /domains/ AP...(description truncated)
   *
   * @function updateAnAlert
   * @param {object} body - PUT body parameter
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  updateAnAlert(body, id, callback) {
    const meth = 'adapter-updateAnAlert';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UnifiedSecurityPolicyAlerts', 'updateAnAlert', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['updateAnAlert'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Create an alert for unified security policies. Returns location with the alert id to get the alert. Alerts can be defined for all devices (all_devices:true) or for specified device IDs. An email and/or user name must be defined. For multiple entries of emails or user names, use a semicolon to separate values. For SecureTrack, users in the collection are populated with "user_ids". The alert will be sent to the users (according to the addresses configured in SecureTrack) and to the emails. To get ...(description truncated)
   *
   * @function createAnAlert
   * @param {object} body - POST body parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createAnAlert(body, callback) {
    const meth = 'adapter-createAnAlert';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UnifiedSecurityPolicyAlerts', 'createAnAlert', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createAnAlert'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Returns a list of all alerts. If an empty list is returned, it implies that there are no configured alerts for that context. You must set start and count parameters to limit the number of returned alerts. Start is zero based - to start from the second rule use start=1, to get rules 51-60 use start=50 and count=10.   Parameters:  context: MSSP context [optional] start: Returns the results beginning with the specified result number count: Returns the specified number of results   Usage Example  ht...(description truncated)
   *
   * @function getAlerts
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getAlerts(callback) {
    const meth = 'adapter-getAlerts';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UnifiedSecurityPolicyAlerts', 'getAlerts', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getAlerts'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Delete the cloud tag policy specified by policyId.  If the return code is not OK, the errorMessage field of the TagPolicyResponseDTO may contain additional details describing the cause of the error.   Parameters:  context: Delete policy of the specified domain ID [optional] policyId: cloud tag policy id [optional]   Usage Example     URL  https://192.168.1.1/securetrack/api/tagpolicy/policies/policyId     OUTPUT   { &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"status": "OK", &nbsp;&nbsp;&nbs...(description truncated)
   *
   * @function deleteCloudTagPolicy
   * @param {default} policyId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteCloudTagPolicy(policyId, callback) {
    const meth = 'adapter-deleteCloudTagPolicy';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (policyId === undefined || policyId === null || policyId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['policyId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [policyId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UnifiedSecurityPolicyCloudTagPolicy', 'deleteCloudTagPolicy', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteCloudTagPolicy'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Replace the cloud tag policy specified by policyID with the new policy attributes.  Use PATCH in order to partially modify a policy. If the return code is not OK, the errorMessage field of the TagPolicyResponseDTO may contain additional details describing the cause of the error.   Parameters:  context: Replace policy of the specified domain ID [optional] policyId: cloud tag policy id [optional] body: cloud tag policy dTO [optional]   Usage Example     URL  https://{ip}/securetrack/api/tagpolicy/...(description truncated)
   *
   * @function replaceACloudTagPolicy
   * @param {object} body - PUT body parameter
   * @param {default} policyId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  replaceACloudTagPolicy(body, policyId, callback) {
    const meth = 'adapter-replaceACloudTagPolicy';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (policyId === undefined || policyId === null || policyId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['policyId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [policyId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '', contentType: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UnifiedSecurityPolicyCloudTagPolicy', 'replaceACloudTagPolicy', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['replaceACloudTagPolicy'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Partially modify a cloud tag policy by stating the modified attributes. Providing requirements replaces the entire list.  Specifying an empty requirement list is not permitted. Modify some attributes of the cloud tag policy specified by policyID with the attributes provided. If one or more "requirement" objects is provided, the exsiting "requirement" objects will be deleted and replaced with the new objetcs. Specifying an empty requirement list is not permitted.If the return code is not OK, the ...(description truncated)
   *
   * @function modifyACloudTagPolicy
   * @param {default} policyId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  modifyACloudTagPolicy(policyId, callback) {
    const meth = 'adapter-modifyACloudTagPolicy';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (policyId === undefined || policyId === null || policyId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['policyId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [policyId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '', contentType: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UnifiedSecurityPolicyCloudTagPolicy', 'modifyACloudTagPolicy', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['modifyACloudTagPolicy'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary This API retrieves the details of the cloud tag policy specified by policyId.  User must have admin permissions to the policy affiliated domain. If the return code is not OK, the errorMessage field of the TagPolicyResponseDTO may contain additional details describing the cause of the error.   Parameters:  context: Returns results for the specified domain ID [optional] policyId: cloud tag policy id [optional]   Usage Example     URL  https://192.168.1.1/securetrack/api/tagpolicy/policies/policyId...(description truncated)
   *
   * @function getCloudTagPolicy
   * @param {default} policyId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getCloudTagPolicy(policyId, callback) {
    const meth = 'adapter-getCloudTagPolicy';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (policyId === undefined || policyId === null || policyId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['policyId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [policyId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UnifiedSecurityPolicyCloudTagPolicy', 'getCloudTagPolicy', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getCloudTagPolicy'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Check if the tags of a cloud resource are compliant with the specified cloud tag policy. Specify the tag policy to validate in the TagPolicyViolationsCheckRequestDTO. The tags of a cloud resource are specified as a json object with the attribute 'tags' at the root level. 'tags' attributes can be a list of tag names or a map including both the tag name and value. If no tags are specified or if the tag is specified incorrectly, The compliance check will treat the resource as if it has no tags. If ...(description truncated)
   *
   * @function checkIfTagsAreCompliantWithCloudTagPolicies
   * @param {object} body - POST body parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  checkIfTagsAreCompliantWithCloudTagPolicies(body, callback) {
    const meth = 'adapter-checkIfTagsAreCompliantWithCloudTagPolicies';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '', contentType: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UnifiedSecurityPolicyCloudTagPolicy', 'checkIfTagsAreCompliantWithCloudTagPolicies', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['checkIfTagsAreCompliantWithCloudTagPolicies'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary This API returns the details of all the tag policies.  Results are filtered according to user domain permissions and request context. If the return code is not OK, the errorMessage field of the TagPolicyResponseDTO may contain additional details describing the cause of the error.   Parameters:  context: Returns results for the specified domain ID [optional]   Usage Example     URL  https://192.168.1.1/securetrack/api/tagpolicy/policies/     OUTPUT  { &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nb...(description truncated)
   *
   * @function getAllCloudTagPolicies
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getAllCloudTagPolicies(callback) {
    const meth = 'adapter-getAllCloudTagPolicies';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UnifiedSecurityPolicyCloudTagPolicy', 'getAllCloudTagPolicies', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getAllCloudTagPolicies'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Create a new cloud tag policy. The policyName field specified in the TagPolicyDTO must be unique. Define the requirements enforced by the cloud tag policy in the requirements field of the TagPolicyDTO. The supported value for the "requirement_type" field are "mandatory_tags" and "valid_values"If the return code is not OK, the errorMessage field of the TagPolicyResponseDTO may contain additional details describing the cause of the error.   Parameters:  context: Create policy for the specified dom...(description truncated)
   *
   * @function createACloudTagPolicy
   * @param {object} body - POST body parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createACloudTagPolicy(body, callback) {
    const meth = 'adapter-createACloudTagPolicy';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '', contentType: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UnifiedSecurityPolicyCloudTagPolicy', 'createACloudTagPolicy', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createACloudTagPolicy'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Retrieve all cloud tag policy violations for the specified VPC and severity level.   Parameters:  context: Global MSSP context. [optional] deviceId: The device ID for which to get violations severity: Return only violations of this severity resourceId: The id of the VM instance [optional] start: Returns the results beginning with the specified result number. [optional] count: Returns the specified number of results. If this field is not added or if a number greater than 100 is specified, the que...(description truncated)
   *
   * @function getAllCloudTagPolicyViolationsForAVPC
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getAllCloudTagPolicyViolationsForAVPC(callback) {
    const meth = 'adapter-getAllCloudTagPolicyViolationsForAVPC';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UnifiedSecurityPolicyCloudTagPolicy', 'getAllCloudTagPolicyViolationsForAVPC', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getAllCloudTagPolicyViolationsForAVPC'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Create a calculation task to find matching rules. The results will be on the relevant devices for each access. Returns a task Id that can be used to check the task status and get the task results   Parameters:  exceptionId: Security policy Exception ID on which to run the API.   Usage Example  https://192.168.1.1/securetrack/api/security_policies/exceptions/1/matching_rules/start   Response Messages:  401: User not permitted to Security policy exceptions. 404: A security policy exception with th...(description truncated)
   *
   * @function startATaskToCalculateMatchingRulesForAnException
   * @param {object} body - POST body parameter
   * @param {default} exceptionId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  startATaskToCalculateMatchingRulesForAnException(body, exceptionId, callback) {
    const meth = 'adapter-startATaskToCalculateMatchingRulesForAnException';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (exceptionId === undefined || exceptionId === null || exceptionId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['exceptionId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [exceptionId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UnifiedSecurityPolicyExceptions', 'startATaskToCalculateMatchingRulesForAnException', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['startATaskToCalculateMatchingRulesForAnException'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Parameters:  taskId: The unique identifier of the matching rules task.   Usage Example  https://192.168.1.1/securetrack/api/security_policies/exceptions/matching_rules/status/2d8e0a3c-2b07-42b8-b501-336fe74080a3   Response Messages:  200: Matching rules task status was received. 401: User not permitted to Security policy exceptions. 404: Matching rules task status was not found.
   *
   * @function getMatchingRulesTaskStatus
   * @param {default} taskId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getMatchingRulesTaskStatus(taskId, callback) {
    const meth = 'adapter-getMatchingRulesTaskStatus';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (taskId === undefined || taskId === null || taskId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['taskId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [taskId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UnifiedSecurityPolicyExceptions', 'getMatchingRulesTaskStatus', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getMatchingRulesTaskStatus'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Delete the specific unified security policy exceptions   Parameters:  exceptionId: The ID of the exception to delete.   Usage Example  https://192.168.1.1/securetrack/api/security_policies/exceptions/14   Response Messages:  404: The security policy with the specified ID does not exist 401: User not permitted to access the specified domain.
   *
   * @function deleteAnException
   * @param {default} exceptionId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteAnException(exceptionId, callback) {
    const meth = 'adapter-deleteAnException';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (exceptionId === undefined || exceptionId === null || exceptionId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['exceptionId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [exceptionId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UnifiedSecurityPolicyExceptions', 'deleteAnException', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteAnException'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Gets a specific exception for unified security policies.   Parameters:  exceptionId: The ID of the exception to get. context: Global MSSP context [optional]   Usage Example  https://192.168.1.1/securetrack/api/security_policies/exceptions/14   Response Messages:  401: User not permitted to access the specified domain 404: A security policy exception with the specified ID was not found.
   *
   * @function getASpecificException
   * @param {default} exceptionId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getASpecificException(exceptionId, callback) {
    const meth = 'adapter-getASpecificException';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (exceptionId === undefined || exceptionId === null || exceptionId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['exceptionId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [exceptionId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UnifiedSecurityPolicyExceptions', 'getASpecificException', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getASpecificException'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Parameters:  taskId: The unique identifier of the matching rules task.   Usage Example  https://192.168.1.1/securetrack/api/security_policies/exceptions/matching_rules/2d8e0a3c-2b07-42b8-b501-336fe74080a3   Response Messages:  204: Matching rules task has been aborted successfully. 401: User not permitted to Security policy exceptions. 404: Matching rules task was not found.
   *
   * @function cancelMatchingRulesTask
   * @param {default} taskId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  cancelMatchingRulesTask(taskId, callback) {
    const meth = 'adapter-cancelMatchingRulesTask';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (taskId === undefined || taskId === null || taskId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['taskId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [taskId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UnifiedSecurityPolicyExceptions', 'cancelMatchingRulesTask', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['cancelMatchingRulesTask'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Gets a list of all unified security policy exceptions.   Parameters:  context: Global MSSP context [optional] start: Starting page for query allowable type is numeric [optional] count: Number of pages for query starting from starting page allowable type in numeric [optional]   Usage Example  https://192.168.1.1/securetrack/api/security_policies/exceptions   Response Messages:  401: User not permitted to access the specified domain
   *
   * @function getAllExceptions
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getAllExceptions(callback) {
    const meth = 'adapter-getAllExceptions';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UnifiedSecurityPolicyExceptions', 'getAllExceptions', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getAllExceptions'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Create an exception for unified security policies.   Parameters:  context: Global MSSP context [optional] body [optional]   Usage Example     URL  https://192.168.1.1/securetrack/api/security_policies/exceptions    BODY  &lt;?xml version="1.0" encoding="UTF-8"?&gt; &lt;security_policy_exception&gt; &nbsp;&nbsp;&nbsp;&nbsp;&lt;approved_by&gt;admin&lt;/approved_by&gt; &nbsp;&nbsp;&nbsp;&nbsp;&lt;created_by&gt;st_user&lt;/created_by&gt; &nbsp;&nbsp;&nbsp;&nbsp;&lt;creation_date&gt;2015-01-01&lt;/cr...(description truncated)
   *
   * @function createAnException
   * @param {object} body - POST body parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  createAnException(body, callback) {
    const meth = 'adapter-createAnException';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UnifiedSecurityPolicyExceptions', 'createAnException', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['createAnException'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Parameters:  taskId: The unique identifier of the matching rules task.   Usage Example  https://192.168.1.1/securetrack/api/security_policies/exceptions/matching_rules/result/2d8e0a3c-2b07-42b8-b501-336fe74080a3   Response Messages:  200: Matching rules task results were received. 401: User not permitted to Security policy exceptions. 404: An error occurred during the calculation. 404: The calculation for the task has not finished yet.
   *
   * @function getMatchingRulesTaskResults
   * @param {default} taskId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getMatchingRulesTaskResults(taskId, callback) {
    const meth = 'adapter-getMatchingRulesTaskResults';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (taskId === undefined || taskId === null || taskId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['taskId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [taskId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UnifiedSecurityPolicyExceptions', 'getMatchingRulesTaskResults', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getMatchingRulesTaskResults'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Fetches the global security zone matrices defined under Unified Security Policy.     Usage Example  https://192.168.1.1/securetrack/api/security_policies/global   Response Messages:  401: User not permitted to access global security policies
   *
   * @function getGlobalUnifiedSecurityPolicies
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getGlobalUnifiedSecurityPolicies(callback) {
    const meth = 'adapter-getGlobalUnifiedSecurityPolicies';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UnifiedSecurityPolicySecurityZoneMatrix', 'getGlobalUnifiedSecurityPolicies', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getGlobalUnifiedSecurityPolicies'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Fetches the security zone matrices defined under Unified Security Policy.   Parameters:  context: Returns results for the specified domain ID. [optional]   Usage Example  https://192.168.1.1/securetrack/api/security_policies   Response Messages:  401: User not permitted to access the specified domain
   *
   * @function getUnifiedSecurityPolicies
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getUnifiedSecurityPolicies(callback) {
    const meth = 'adapter-getUnifiedSecurityPolicies';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const reqObj = null;

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UnifiedSecurityPolicySecurityZoneMatrix', 'getUnifiedSecurityPolicies', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getUnifiedSecurityPolicies'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Exports a Security Policy in CSV format   Parameters:  context: Returns results for the specified domain ID. [optional] id: ID of the security policy. [optional]   Usage Example  https://192.168.1.1/securetrack/api/security_policies/1/export   Response Messages:  401: User not permitted to access the specified domain 404: Security Policy does not exist
   *
   * @function getUnifiedSecurityPolicyAsCSV
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getUnifiedSecurityPolicyAsCSV(id, callback) {
    const meth = 'adapter-getUnifiedSecurityPolicyAsCSV';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UnifiedSecurityPolicySecurityZoneMatrix', 'getUnifiedSecurityPolicyAsCSV', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getUnifiedSecurityPolicyAsCSV'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Delete a Security Policy Matrix   Parameters:  context: Returns results for the specified domain ID. [optional] id: The unique identifier of the security policy matrix to delete   Usage Example  https://192.168.1.1/securetrack/api/security_policies/1
   *
   * @function deleteUnifiedSecurityPolicy
   * @param {default} id - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  deleteUnifiedSecurityPolicy(id, callback) {
    const meth = 'adapter-deleteUnifiedSecurityPolicy';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (id === undefined || id === null || id === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['id'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [id];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UnifiedSecurityPolicySecurityZoneMatrix', 'deleteUnifiedSecurityPolicy', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['deleteUnifiedSecurityPolicy'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Add or remove a zone on a device interface   Parameters:  context: Global MSSP context [optional] deviceId: Device ID body: InterfacesManualMappingsDTO   Usage Example     URL  https://127.0.0.1/securetrack/api/security_policies/10/manual_mapping     BODY  &lt;interfaces_manual_mappings&gt;                 &lt;interface_manual_mapping&gt;                                 &lt;interface_name&gt;Vlan_30&lt;/interface_name&gt;                                 &lt;zones_user_actions&gt;                ...(description truncated)
   *
   * @function setManualDeviceMapping
   * @param {object} body - POST body parameter
   * @param {default} deviceId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  setManualDeviceMapping(body, deviceId, callback) {
    const meth = 'adapter-setManualDeviceMapping';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (body === undefined || body === null || body === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['body'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
    if (deviceId === undefined || deviceId === null || deviceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['deviceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [deviceId];
    const bodyVars = body;

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { contentType: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UnifiedSecurityPolicySecurityZoneMatrix', 'setManualDeviceMapping', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['setManualDeviceMapping'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary Parameters:  deviceId: The device ID for which to get violations.   Usage Example  https://192.168.1.1/securetrack/api/violating_rules/1/count   Response Messages:  200: The violation count was successfully retrieved 404: A device with the specified ID was not found
   *
   * @function getTheAmountOfViolatingRulesForTheSpecifiedDevice
   * @param {default} deviceId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getTheAmountOfViolatingRulesForTheSpecifiedDevice(deviceId, callback) {
    const meth = 'adapter-getTheAmountOfViolatingRulesForTheSpecifiedDevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (deviceId === undefined || deviceId === null || deviceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['deviceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [deviceId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UnifiedSecurityPolicyViolations', 'getTheAmountOfViolatingRulesForTheSpecifiedDevice', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getTheAmountOfViolatingRulesForTheSpecifiedDevice'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }

  /**
   * @summary policyName is supported for management devices running in Advanced management mode.   Parameters:  deviceId: The device ID for which to get violations policyName: Return only violations that match this policy [optional] severity: Return only violations of this severity type: Return only violations of this type   Usage Example  https://192.168.1.1/securetrack/api/violating_rules/1/device_violations?policy=policy_name&type=SECURITY_POLICY&severity=MEDIUM   Response Messages:  200: The violations w...(description truncated)
   *
   * @function getTheViolatingRulesForTheSpecifiedDevice
   * @param {default} deviceId - path parameter
   * @param {getCallback} callback - a callback function to return the result
   */
  /* YOU CAN CHANGE THE PARAMETERS YOU TAKE IN HERE AND IN THE pronghorn.json FILE */
  getTheViolatingRulesForTheSpecifiedDevice(deviceId, callback) {
    const meth = 'adapter-getTheViolatingRulesForTheSpecifiedDevice';
    const origin = `${this.id}-${meth}`;
    log.trace(origin);

    if (this.suspended && this.suspendMode === 'error') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'AD.600', [], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU VALIDATE DATA */
    if (deviceId === undefined || deviceId === null || deviceId === '') {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Missing Data', ['deviceId'], null, null, null);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }

    /* HERE IS WHERE YOU SET THE DATA TO PASS INTO REQUEST */
    // set up the request object - payload, uriPathVars, uriQuery, uriOptions, addlHeaders
    const queryParamsAvailable = {};
    const queryParams = {};
    const pathVars = [deviceId];
    const bodyVars = {};

    // loop in template. long callback arg name to avoid identifier conflicts
    Object.keys(queryParamsAvailable).forEach((thisKeyInQueryParamsAvailable) => {
      if (queryParamsAvailable[thisKeyInQueryParamsAvailable] !== undefined && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== null
          && queryParamsAvailable[thisKeyInQueryParamsAvailable] !== '') {
        queryParams[thisKeyInQueryParamsAvailable] = queryParamsAvailable[thisKeyInQueryParamsAvailable];
      }
    });

    // if you want to expose addlHeaders to workflow, add it to the method signature here and in pronghorn.json
    let thisHeaderData = null;

    // if the additional headers was passed in as a string parse the json into an object
    if (thisHeaderData !== null && thisHeaderData.constructor === String) {
      try {
        // parse the additional headers object that was passed in
        thisHeaderData = JSON.parse(thisHeaderData);
      } catch (err) {
        const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'addlHeaders string must be a stringified JSON', [], null, null, null);
        log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
        return callback(null, errorObj);
      }
    } else if (thisHeaderData === null) {
      thisHeaderData = { Accept: '' };
    }

    const reqObj = {
      payload: bodyVars,
      uriPathVars: pathVars,
      uriQuery: queryParams,
      addlHeaders: thisHeaderData
    };

    try {
      // Make the call -
      // identifyRequest(entity, action, requestObj, returnDataFlag, callback)
      return this.requestHandlerInst.identifyRequest('UnifiedSecurityPolicyViolations', 'getTheViolatingRulesForTheSpecifiedDevice', reqObj, true, (irReturnData, irReturnError) => {
        // if we received an error or their is no response on the results
        // return an error
        if (irReturnError) {
          /* HERE IS WHERE YOU CAN ALTER THE ERROR MESSAGE */
          return callback(null, irReturnError);
        }
        if (!Object.hasOwnProperty.call(irReturnData, 'response')) {
          const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Invalid Response', ['getTheViolatingRulesForTheSpecifiedDevice'], null, null, null);
          log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
          return callback(null, errorObj);
        }

        /* HERE IS WHERE YOU CAN ALTER THE RETURN DATA */
        // return the response
        return callback(irReturnData, null);
      });
    } catch (ex) {
      const errorObj = this.requestHandlerInst.formatErrorObject(this.id, meth, 'Caught Exception', null, null, null, ex);
      log.error(`${origin}: ${errorObj.IAPerror.displayString}`);
      return callback(null, errorObj);
    }
  }
}

module.exports = TufinSecuretrack;
