## Using this Adapter

The `adapter.js` file contains the calls the adapter makes available to the rest of the Itential Platform. The API detailed for these calls should be available through JSDOC. The following is a brief summary of the calls.

### Generic Adapter Calls

These are adapter methods that IAP or you might use. There are some other methods not shown here that might be used for internal adapter functionality.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Method Signature</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Workflow?</span></th>
  </tr>
  <tr>
    <td style="padding:15px">connect()</td>
    <td style="padding:15px">This call is run when the Adapter is first loaded by he Itential Platform. It validates the properties have been provided correctly.</td>
    <td style="padding:15px">No</td>
  </tr>
  <tr>
    <td style="padding:15px">healthCheck(callback)</td>
    <td style="padding:15px">This call ensures that the adapter can communicate with Adapter for Tufin SecureTrack. The actual call that is used is defined in the adapter properties and .system entities action.json file.</td>
    <td style="padding:15px">No</td>
  </tr>
  <tr>
    <td style="padding:15px">refreshProperties(properties)</td>
    <td style="padding:15px">This call provides the adapter the ability to accept property changes without having to restart the adapter.</td>
    <td style="padding:15px">No</td>
  </tr>
  <tr>
    <td style="padding:15px">encryptProperty(property, technique, callback)</td>
    <td style="padding:15px">This call will take the provided property and technique, and return the property encrypted with the technique. This allows the property to be used in the adapterProps section for the credential password so that the password does not have to be in clear text. The adapter will decrypt the property as needed for communications with Adapter for Tufin SecureTrack.</td>
    <td style="padding:15px">No</td>
  </tr>
  <tr>
    <td style="padding:15px">iapUpdateAdapterConfiguration(configFile, changes, entity, type, action, callback)</td>
    <td style="padding:15px">This call provides the ability to update the adapter configuration from IAP - includes actions, schema, mockdata and other configurations.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapSuspendAdapter(mode, callback)</td>
    <td style="padding:15px">This call provides the ability to suspend the adapter and either have requests rejected or put into a queue to be processed after the adapter is resumed.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapUnsuspendAdapter(callback)</td>
    <td style="padding:15px">This call provides the ability to resume a suspended adapter. Any requests in queue will be processed before new requests.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapGetAdapterQueue(callback)</td>
    <td style="padding:15px">This call will return the requests that are waiting in the queue if throttling is enabled.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapFindAdapterPath(apiPath, callback)</td>
    <td style="padding:15px">This call provides the ability to see if a particular API path is supported by the adapter.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapTroubleshootAdapter(props, persistFlag, adapter, callback)</td>
    <td style="padding:15px">This call can be used to check on the performance of the adapter - it checks connectivity, healthcheck and basic get calls.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapRunAdapterHealthcheck(adapter, callback)</td>
    <td style="padding:15px">This call will return the results of a healthcheck.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapRunAdapterConnectivity(callback)</td>
    <td style="padding:15px">This call will return the results of a connectivity check.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapRunAdapterBasicGet(callback)</td>
    <td style="padding:15px">This call will return the results of running basic get API calls.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapMoveAdapterEntitiesToDB(callback)</td>
    <td style="padding:15px">This call will push the adapter configuration from the entities directory into the Adapter or IAP Database.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapDeactivateTasks(tasks, callback)</td>
    <td style="padding:15px">This call provides the ability to remove tasks from the adapter.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapActivateTasks(tasks, callback)</td>
    <td style="padding:15px">This call provides the ability to add deactivated tasks back into the adapter.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapExpandedGenericAdapterRequest(metadata, uriPath, restMethod, pathVars, queryData, requestBody, addlHeaders, callback)</td>
    <td style="padding:15px">This is an expanded Generic Call. The metadata object allows us to provide many new capabilities within the generic request.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">genericAdapterRequest(uriPath, restMethod, queryData, requestBody, addlHeaders, callback)</td>
    <td style="padding:15px">This call allows you to provide the path to have the adapter call. It is an easy way to incorporate paths that have not been built into the adapter yet.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">genericAdapterRequestNoBasePath(uriPath, restMethod, queryData, requestBody, addlHeaders, callback)</td>
    <td style="padding:15px">This call is the same as the genericAdapterRequest only it does not add a base_path or version to the call.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapRunAdapterLint(callback)</td>
    <td style="padding:15px">Runs lint on the addapter and provides the information back.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapRunAdapterTests(callback)</td>
    <td style="padding:15px">Runs baseunit and unit tests on the adapter and provides the information back.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapGetAdapterInventory(callback)</td>
    <td style="padding:15px">This call provides some inventory related information about the adapter.</td>
    <td style="padding:15px">Yes</td>
  </tr>
</table>
<br>
  
### Adapter Cache Calls

These are adapter methods that are used for adapter caching. If configured, the adapter will cache based on the interval provided. However, you can force a population of the cache manually as well.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Method Signature</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Workflow?</span></th>
  </tr>
  <tr>
    <td style="padding:15px">iapPopulateEntityCache(entityTypes, callback)</td>
    <td style="padding:15px">This call populates the adapter cache.</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">iapRetrieveEntitiesCache(entityType, options, callback)</td>
    <td style="padding:15px">This call retrieves the specific items from the adapter cache.</td>
    <td style="padding:15px">Yes</td>
  </tr>
</table>
<br>
  
### Adapter Broker Calls

These are adapter methods that are used to integrate to IAP Brokers. This adapter currently supports the following broker calls.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Method Signature</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Workflow?</span></th>
  </tr>
  <tr>
    <td style="padding:15px">hasEntities(entityType, entityList, callback)</td>
    <td style="padding:15px">This call is utilized by the IAP Device Broker to determine if the adapter has a specific entity and item of the entity.</td>
    <td style="padding:15px">No</td>
  </tr>
  <tr>
    <td style="padding:15px">getDevice(deviceName, callback)</td>
    <td style="padding:15px">This call returns the details of the requested device.</td>
    <td style="padding:15px">No</td>
  </tr>
  <tr>
    <td style="padding:15px">getDevicesFiltered(options, callback)</td>
    <td style="padding:15px">This call returns the list of devices that match the criteria provided in the options filter.</td>
    <td style="padding:15px">No</td>
  </tr>
  <tr>
    <td style="padding:15px">isAlive(deviceName, callback)</td>
    <td style="padding:15px">This call returns whether the device status is active</td>
    <td style="padding:15px">No</td>
  </tr>
  <tr>
    <td style="padding:15px">getConfig(deviceName, format, callback)</td>
    <td style="padding:15px">This call returns the configuration for the selected device.</td>
    <td style="padding:15px">No</td>
  </tr>
  <tr>
    <td style="padding:15px">iapGetDeviceCount(callback)</td>
    <td style="padding:15px">This call returns the count of devices.</td>
    <td style="padding:15px">No</td>
  </tr>
</table>
<br>

### Specific Adapter Calls

Specific adapter calls are built based on the API of the Tufin_securetrack. The Adapter Builder creates the proper method comments for generating JS-DOC for the adapter. This is the best way to get information on the calls.

<table border="1" class="bordered-table">
  <tr>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Method Signature</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Description</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Path</span></th>
    <th bgcolor="lightgrey" style="padding:15px"><span style="font-size:12.0pt">Workflow?</span></th>
  </tr>
  <tr>
    <td style="padding:15px">getAdditionalParametersIdentitiesByRevision(revisionId, callback)</td>
    <td style="padding:15px">Get additional parameters identities by revision</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/additional_parameters?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificAdditionalParameterIdentity(revisionId, ids, callback)</td>
    <td style="padding:15px">Get specific additional parameter identity</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/additional_parameters/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getAURLCategory(revisionId, ids, callback)</td>
    <td style="padding:15px">Get a URL Category.</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/url_categories/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getApplicationIdentitiesByDevice(id, callback)</td>
    <td style="padding:15px">Get application identities by device</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/applications?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificApplicationIdentity(id, ids, callback)</td>
    <td style="padding:15px">Get specific application identity</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/applications/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getApplicationsIdentitiesByRevision(id, callback)</td>
    <td style="padding:15px">Get applications identities by revision</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/applications?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getRevisionsRevisionIdApplicationsIds(revisionId, ids, callback)</td>
    <td style="padding:15px">Get specific application identity</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/applications/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">determineIfChangesBetweenTwoRevisionsAreAuthorized(callback)</td>
    <td style="padding:15px">Determine if changes between two revisions are authorized</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/change_authorization/?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">compareRevisionsOnTwoDifferentDevicesInTermsOfTraffic(body, callback)</td>
    <td style="padding:15px">Compare revisions on two different devices in terms of traffic.</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/change_authorization/policyTrafficComparison?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getNameAndStatusForAllChangeWindows(callback)</td>
    <td style="padding:15px">Get name and status for all change windows</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/change_windows/?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSchedulingAndDeviceDetailsForASpecificChangeWindow(uid, taskId, callback)</td>
    <td style="padding:15px">Get scheduling and device details for a specific change window</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/change_windows/{pathv1}/tasks/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getAListOfCompletedPolicyChangesForASpecificChangeWindow(uid, callback)</td>
    <td style="padding:15px">Get a list of completed policy changes for a specific change window</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/change_windows/{pathv1}/tasks?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getNetworkInterfacesByDevice(id, callback)</td>
    <td style="padding:15px">Get network interfaces by device</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/interfaces?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getNetworkInterfacesByRevision(id, callback)</td>
    <td style="padding:15px">Get network interfaces by revision</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/interfaces?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getDeviceZonesByRevision(id, callback)</td>
    <td style="padding:15px">Get device zones by revision</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/zones?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getDeviceZonesByDevice(id, callback)</td>
    <td style="padding:15px">Get device zones by device</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/zones?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getZonesAndNetworkInterfacesThatParticipateInSubPolicies(id, callback)</td>
    <td style="padding:15px">Get zones and network interfaces that participate in sub-policies</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/bindable_objects?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getDomain(id, callback)</td>
    <td style="padding:15px">Get domain</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/domains/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateADomain(body, id, callback)</td>
    <td style="padding:15px">Update a domain</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/domains/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">addADomain(body, callback)</td>
    <td style="padding:15px">Add a domain</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/domains/?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getAllDomains(callback)</td>
    <td style="padding:15px">Get all domains</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/domains/?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getGeneralProperties(callback)</td>
    <td style="padding:15px">Get general properties</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/properties/?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getCiscoCryptographicMapsByRevision(id, callback)</td>
    <td style="padding:15px">Get Cisco cryptographic maps by revision</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/crypto_maps?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getCiscoIPsecPolicyAndPeers(deviceId, callback)</td>
    <td style="padding:15px">Get Cisco IPsec policy and peers</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/bindings/{pathv1}/ipsec_tunnels?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getCheckPointVPNIPSecCommunitiesAndGateways(deviceId, callback)</td>
    <td style="padding:15px">Get Check Point VPN (IPSec) communities and gateways</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/bindings/{pathv1}/ipsec_communities?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getCiscoCryptographicMapsByDevice(id, callback)</td>
    <td style="padding:15px">Get Cisco cryptographic maps by device</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/crypto_maps?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getResolvedInternetRepresentationForDevice(deviceId, callback)</td>
    <td style="padding:15px">Get resolved Internet representation for device</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/internet_referral/{pathv1}/object?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createNewInternetRepresentationForADevice(body, callback)</td>
    <td style="padding:15px">Create new Internet representation for a device</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/internet_referral/?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteInternetRepresentationForDevice(deviceId, callback)</td>
    <td style="padding:15px">Delete Internet representation for device</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/internet_referral/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateInternetRepresentationForDevice(body, deviceId, callback)</td>
    <td style="padding:15px">Update Internet representation for device</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/internet_referral/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getInternetRepresentationForDevice(deviceId, callback)</td>
    <td style="padding:15px">Get Internet representation for device</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/internet_referral/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getLDAPEntryDetailsByDN(callback)</td>
    <td style="padding:15px">Get LDAP entry details by DN</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/ldap/getEntryByDN?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">returnEntriesThatExactlyMatchOneOfTheGivenStrings(body, callback)</td>
    <td style="padding:15px">Return entries that exactly match one of the given strings</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/ldap/getEntriesByNames?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getTheBaseDNEntryDetails(callback)</td>
    <td style="padding:15px">Get the base DN entry details</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/ldap/getBaseDNEntry?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">returnLDAPEntriesWhichMatchTheGivenSearchCriteria(body, callback)</td>
    <td style="padding:15px">Return LDAP entries which match the given search criteria</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/ldap/search?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getTextualConfigurationByRevision(id, callback)</td>
    <td style="padding:15px">Get textual configuration by revision</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/config?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">importManagedDevices(body, callback)</td>
    <td style="padding:15px">Import managed devices</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/bulk/import?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">editSecuretrackDevice(callback)</td>
    <td style="padding:15px">Edit Securetrack device</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/bulk/?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">addDevicesToSecureTrack(body, callback)</td>
    <td style="padding:15px">Add devices to SecureTrack</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/bulk/?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificTaskResultsOfBulkOperationsOnDevices(taskUid, callback)</td>
    <td style="padding:15px">Get specific task results of bulk operations on devices</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/bulk/tasks/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">addConfigurationForOfflineDevice(body, callback)</td>
    <td style="padding:15px">Add configuration for offline device</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/tasks/add_device_config_task?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificDevice(id, callback)</td>
    <td style="padding:15px">Get specific device</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateOfflineDevice(body, deviceId, callback)</td>
    <td style="padding:15px">Update offline device</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getDevices(callback)</td>
    <td style="padding:15px">Get devices</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">addOfflineDevice(body, callback)</td>
    <td style="padding:15px">Add offline device</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getTextualConfigurationByDevice(id, callback)</td>
    <td style="padding:15px">Get textual configuration by device</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/config?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getNATObjectsByDevice(id, callback)</td>
    <td style="padding:15px">Get NAT objects by device</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/nat_objects?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getNATObjectsByRevision(id, callback)</td>
    <td style="padding:15px">Get NAT objects by revision</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/nat_objects?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getNATRulesByDevice(id, callback)</td>
    <td style="padding:15px">Get NAT rules by device</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/nat_rules/bindings?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getNetworkGroupsContainingSpecifiedNetworkObject(id, callback)</td>
    <td style="padding:15px">Get network groups containing specified network object</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/network_objects/{pathv1}/groups?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificNetworkObjectsByRevision(revisionId, ids, callback)</td>
    <td style="padding:15px">Get specific network objects by revision</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/network_objects/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificNetworkObject(deviceId, ids, callback)</td>
    <td style="padding:15px">Get specific network object</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/network_objects/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getNetworkObjectsByRevision(id, callback)</td>
    <td style="padding:15px">Get network objects by revision</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/network_objects?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getNetworkObjectsMatchingSpecifiedCriteria(callback)</td>
    <td style="padding:15px">Get network objects matching specified criteria</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/network_objects/search?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getRulesContainingSpecifiedNetworkObject(id, callback)</td>
    <td style="padding:15px">Get rules containing specified network object</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/network_objects/{pathv1}/rules?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getNetworkObjectsByDevice(id, callback)</td>
    <td style="padding:15px">Get network objects by device</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/network_objects?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificTopologyCloud(id, callback)</td>
    <td style="padding:15px">Get Specific topology cloud</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/clouds/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateACloud(body, id, callback)</td>
    <td style="padding:15px">Update a cloud</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/clouds/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getTopologySubnets(callback)</td>
    <td style="padding:15px">Get topology subnets</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/subnets?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getTopologyNetworkInterfacesByDevice(callback)</td>
    <td style="padding:15px">Get topology network interfaces by device</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/topology_interfaces?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getMostSpecificNetworkInterfacesFromWhichAHostIPIsAccessible(callback)</td>
    <td style="padding:15px">Get most specific network interfaces from which a host IP is accessible</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/interfaces/last_hop?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificTopologySubnet(id, callback)</td>
    <td style="padding:15px">Get Specific topology subnet</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/subnets/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getTopologySynchronizationStatus(callback)</td>
    <td style="padding:15px">Get Topology Synchronization status</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/synchronize/status?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteGenericDeviceFromTopologyModel(id, callback)</td>
    <td style="padding:15px">Delete generic device from Topology model</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/generic_devices/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateAnExistingGenericDeviceInTheTopologyModel(body, id, callback)</td>
    <td style="padding:15px">Update an existing generic device in the Topology model</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/generic_devices/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getCloudInternalNetworks(id, callback)</td>
    <td style="padding:15px">Get Cloud Internal Networks</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/cloud_internal_networks/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getCloudInformation(cloudId, callback)</td>
    <td style="padding:15px">Get cloud information</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/cloud_suggestions/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">synchronizeTheTopologyModel(body, callback)</td>
    <td style="padding:15px">Synchronize the Topology model</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/synchronize?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getTopologyGenericVPNConnections(callback)</td>
    <td style="padding:15px">Get topology generic VPN connections</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/generic_vpns?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getTopologyRoutingTablesForAGivenDevice(callback)</td>
    <td style="padding:15px">Get topology routing tables for a given device</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/topology_routes?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getTopologyCloudSuggestions(callback)</td>
    <td style="padding:15px">Get cloud information</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/cloud_suggestions?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">addGenericDeviceToTopologyModel(body, callback)</td>
    <td style="padding:15px">Add generic device to Topology model</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/generic_devices/?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getGenericDevicesThatAreConfiguredInST(callback)</td>
    <td style="padding:15px">Get generic devices that are configured in ST</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/generic_devices/?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getPathImageForSpecifiedTraffic(callback)</td>
    <td style="padding:15px">Get path image for specified traffic</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/path_image?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getPathForSpecifiedTraffic(callback)</td>
    <td style="padding:15px">Get path for specified traffic</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/path?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createAJoinedTopologyCloud(body, callback)</td>
    <td style="padding:15px">Create a joined topology cloud</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/clouds?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getTopologyClouds(callback)</td>
    <td style="padding:15px">Get topology clouds</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/clouds?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getASpecificZonePatternEntryForASpecificZone(zoneId, id, callback)</td>
    <td style="padding:15px">Get a specific zone pattern entry for a specific zone</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}/pattern-entries/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createAZonePatternEntryInASpecificZone(body, zoneId, callback)</td>
    <td style="padding:15px">Create a zone pattern entry in a specific zone</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}/pattern-entries?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getAllPatternEntriesForSpecificZones(ids, callback)</td>
    <td style="padding:15px">Get all pattern entries for specific zones</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}/pattern-entries?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getASpecificZoneEntry(zoneId, id, callback)</td>
    <td style="padding:15px">Get a specific zone entry</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}/entries/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteZoneEntries(zoneId, id, callback)</td>
    <td style="padding:15px">Delete zone entries</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}/entries/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">modifyAZoneEntry(body, zoneId, id, callback)</td>
    <td style="padding:15px">Modify a zone entry</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}/entries/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">modifyMultipleExistingZoneEntries(body, zoneIds, ids, callback)</td>
    <td style="padding:15px">Modify multiple existing zone entries</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}/entries/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteZonesZoneIdsEntriesIds(zoneIds, ids, callback)</td>
    <td style="padding:15px">Modify a zone entry</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}/entries/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createAZoneEntry(body, zoneId, callback)</td>
    <td style="padding:15px">Create a zone entry</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}/entries?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getEntriesForAZone(ids, callback)</td>
    <td style="padding:15px">Get entries for a zone</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}/entries?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">importAZone(body, ids, callback)</td>
    <td style="padding:15px">Import a zone</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/import/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getConfigurationUsagesForAZone(ids, callback)</td>
    <td style="padding:15px">Get configuration usages for a zone</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}/dependencies?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">removeAZoneAsAnDescendantsToAZone(parentId, childIds, callback)</td>
    <td style="padding:15px">Remove a zone as an descendants to a zone</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}/descendants/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">addAZoneAsADescendantToAZone(body, parentId, childIds, callback)</td>
    <td style="padding:15px">Add a zone as a descendant to a zone</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}/descendants/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createAZone(body, callback)</td>
    <td style="padding:15px">Create a zone</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getAllZones(callback)</td>
    <td style="padding:15px">Get all zones</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteAllZones(callback)</td>
    <td style="padding:15px">Delete all zones</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSharedZones(callback)</td>
    <td style="padding:15px">Get shared zones</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/shared?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteAZone(ids, callback)</td>
    <td style="padding:15px">Delete a zone</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">addAZoneAsAnAncestorToAZone(body, childId, parentIds, callback)</td>
    <td style="padding:15px">Add a zone as an ancestor to a zone</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}/ancestors/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">removeAZoneAsAnAncestorToAZone(childId, parentIds, callback)</td>
    <td style="padding:15px">Remove a zone as an ancestor to a zone</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}/ancestors/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">modifyAZone(body, id, callback)</td>
    <td style="padding:15px">Modify a zone</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getASpecificZone(id, callback)</td>
    <td style="padding:15px">Get a specific zone</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getAncestorZonesForAZone(ids, callback)</td>
    <td style="padding:15px">Get ancestor zones for a zone</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}/ancestors?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getDescendantZonesForAZone(ids, callback)</td>
    <td style="padding:15px">Get descendant zones for a zone</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}/descendants?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">mapNetworkElementsToSecurityZones(body, callback)</td>
    <td style="padding:15px">Map network elements to security zones</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/security_zones/?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getListOfSubPoliciesBindingsWithInputAndOrOutputInterfaces(deviceId, callback)</td>
    <td style="padding:15px">Get list of sub-policies (bindings) with input and/or output interfaces</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/bindings/{pathv1}/binding_query?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getPoliciesByRevision(id, callback)</td>
    <td style="padding:15px">Get policies by revision</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/policies?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSubPoliciesBindingsByDevice(id, callback)</td>
    <td style="padding:15px">Get sub-policies (bindings) by device</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/bindings?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getRulesByInputAndOutputInterfaces(deviceId, callback)</td>
    <td style="padding:15px">Get rules by input and output interfaces</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/bindings/{pathv1}/topology_interfaces?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSubPoliciesBindingsByRevision(id, callback)</td>
    <td style="padding:15px">Get sub-policies (bindings) by revision</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/bindings?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getPoliciesByDevice(id, callback)</td>
    <td style="padding:15px">Get policies by device</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/policies?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">runPolicyAnalysisQuery(callback)</td>
    <td style="padding:15px">Run Policy Analysis query</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/policy_analysis/query/matching_rules?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteSpecificRuleDocumentation(id, ruleId, callback)</td>
    <td style="padding:15px">Delete specific rule documentation</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/rules/{pathv2}/documentation?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificRuleDocumentation(id, ruleId, callback)</td>
    <td style="padding:15px">Get specific rule documentation</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/rules/{pathv2}/documentation?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">modifySpecificRuleDocumentation(body, id, ruleId, callback)</td>
    <td style="padding:15px">Modify specific rule documentation</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/rules/{pathv2}/documentation?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">putRevisionsIdRulesRuleIdDocumentation(body, id, ruleId, callback)</td>
    <td style="padding:15px">Modify specific rule documentation</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/rules/{pathv2}/documentation?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteRevisionsIdRulesRuleIdDocumentation(id, ruleId, callback)</td>
    <td style="padding:15px">Delete specific rule documentation</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/rules/{pathv2}/documentation?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getRevisionsIdRulesRuleIdDocumentation(id, ruleId, callback)</td>
    <td style="padding:15px">Get specific rule documentation</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/rules/{pathv2}/documentation?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getCleanupsResults(callback)</td>
    <td style="padding:15px">Get cleanups results</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/cleanup/?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getTheSpecificObjectsOrRulesIdentifiedForTheCleanupResults(cleanupId, callback)</td>
    <td style="padding:15px">Get the specific objects or rules identified for the cleanup results</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/cleanup/{pathv1}/instances?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getTheSpecificObjectsOrRulesIdentifiedForTheRiskResults(riskId, callback)</td>
    <td style="padding:15px">Get the specific objects or rules identified for the risk results</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/risk/{pathv1}/instances?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getCleanupsByDevice(deviceId, callback)</td>
    <td style="padding:15px">Get cleanups by device</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/cleanups?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getDevicesInRiskResults(riskId, callback)</td>
    <td style="padding:15px">Get devices in risk results</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/risk/{pathv1}/devices?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getRisksResults(callback)</td>
    <td style="padding:15px">Get risks results</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/risk/?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getShadowingRulesByDevice(deviceId, callback)</td>
    <td style="padding:15px">Get shadowing rules by device</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/shadowing_rules?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getDevicesInCleanupResults(cleanupId, callback)</td>
    <td style="padding:15px">Get devices in cleanup results</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/cleanup/{pathv1}/devices?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getRevisionsByDevice(id, callback)</td>
    <td style="padding:15px">Get revisions by device</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/revisions?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificRevision(revId, callback)</td>
    <td style="padding:15px">Get specific revision</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getLatestRevisionByDevice(id, callback)</td>
    <td style="padding:15px">Get latest revision by device</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/latest_revision?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getLastHitsForAllRulesByDevice(deviceId, callback)</td>
    <td style="padding:15px">Get last hits for all rules by device</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/rule_last_usage/find_all/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getLastHitForASpecificRule(deviceId, ruleUid, callback)</td>
    <td style="padding:15px">Get last hit for a specific rule</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/rule_last_usage/find/{pathv1}/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getASpecificRule(ruleId, callback)</td>
    <td style="padding:15px">Get a specific rule</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/rules/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificRule(deviceId, ids, callback)</td>
    <td style="padding:15px">Get specific rule</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/rules/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getRuleCountPerDevice(callback)</td>
    <td style="padding:15px">Get rule count per device</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/rule_search/?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getRevisionsRevisionIdRulesIds(revisionId, ids, callback)</td>
    <td style="padding:15px">Get specific rule</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/rules/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getRulesByRevision(id, callback)</td>
    <td style="padding:15px">Get rules by revision</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/rules?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">findRules(deviceId, callback)</td>
    <td style="padding:15px">Find rules</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/rule_search/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getRulesByDevice(id, callback)</td>
    <td style="padding:15px">Get rules by device</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/rules?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getServiceGroupsContainingSpecifiedServiceObjects(id, callback)</td>
    <td style="padding:15px">Get service groups containing specified service objects</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/services/{pathv1}/groups?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificService(revisionId, ids, callback)</td>
    <td style="padding:15px">Get specific service</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/services/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getDevicesDeviceIdServicesIds(deviceId, ids, callback)</td>
    <td style="padding:15px">Get specific service</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/services/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getRulesContainingSpecifiedServiceObject(id, callback)</td>
    <td style="padding:15px">Get rules containing specified service object</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/services/{pathv1}/rules?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getServicesByRevision(id, callback)</td>
    <td style="padding:15px">Get services by revision</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/services?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getServicesObjectsMatchingSpecifiedCriteria(callback)</td>
    <td style="padding:15px">Get services objects matching specified criteria</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/services/search?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getServicesByDevice(id, callback)</td>
    <td style="padding:15px">Get services by device</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/services?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getTimeObjectsByRevision(id, callback)</td>
    <td style="padding:15px">Get time objects by revision</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/time_objects?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getTimeObjectsByDevice(id, callback)</td>
    <td style="padding:15px">Get time objects by device</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/time_objects?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificTimeObject(revisionId, ids, callback)</td>
    <td style="padding:15px">Get specific time object</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/time_objects/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getPolicyRelevanceMetricsForTraffic(body, callback)</td>
    <td style="padding:15px">Get policy relevance metrics for traffic</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/traffic_policy/?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">startATaskToCalculateViolationsForAnAccessRequest(body, callback)</td>
    <td style="padding:15px">Start a task to calculate violations for an access request</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/violations/access_requests/task?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getViolationTaskResults(taskId, callback)</td>
    <td style="padding:15px">Get violation task results</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/violations/access_requests/result/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getViolationTaskStatus(taskId, callback)</td>
    <td style="padding:15px">Get violation task status</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/violations/access_requests/status/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">cancelViolationTask(taskId, callback)</td>
    <td style="padding:15px">Cancel violation task</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/violations/access_requests/task/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getViolationsForAnAccessRequest(body, callback)</td>
    <td style="padding:15px">Get violations for an access request</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/violations/access_requests/sync?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteAlertsByIds(ids, callback)</td>
    <td style="padding:15px">Delete alerts by ids</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/security_policies/alerts/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getASpecificAlert(id, callback)</td>
    <td style="padding:15px">Get a specific alert</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/security_policies/alerts/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateAnAlert(body, id, callback)</td>
    <td style="padding:15px">Update an alert</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/security_policies/alerts/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createAnAlert(body, callback)</td>
    <td style="padding:15px">Create an alert</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/security_policies/alerts/?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getAlerts(callback)</td>
    <td style="padding:15px">Get alerts</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/security_policies/alerts/?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteCloudTagPolicy(policyId, callback)</td>
    <td style="padding:15px">Delete cloud tag policy</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/policies/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">replaceACloudTagPolicy(body, policyId, callback)</td>
    <td style="padding:15px">Replace a cloud tag policy</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/policies/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">modifyACloudTagPolicy(policyId, callback)</td>
    <td style="padding:15px">Modify a cloud tag policy</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/policies/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getCloudTagPolicy(policyId, callback)</td>
    <td style="padding:15px">Get cloud tag policy</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/policies/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">checkIfTagsAreCompliantWithCloudTagPolicies(body, callback)</td>
    <td style="padding:15px">Check if tags are compliant with cloud tag policies</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/violation_check/?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getAllCloudTagPolicies(callback)</td>
    <td style="padding:15px">Get all cloud tag policies</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/policies/?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createACloudTagPolicy(body, callback)</td>
    <td style="padding:15px">Create a cloud tag policy</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/policies/?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getAllCloudTagPolicyViolationsForAVPC(callback)</td>
    <td style="padding:15px">Get all cloud tag policy violations for a VPC</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/tag_violations/?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">startATaskToCalculateMatchingRulesForAnException(body, exceptionId, callback)</td>
    <td style="padding:15px">Start a task to calculate matching rules for an exception</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/security_policies/exceptions/{pathv1}/matching_rules/start?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getMatchingRulesTaskStatus(taskId, callback)</td>
    <td style="padding:15px">Get matching rules task status</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/security_policies/exceptions/matching_rules/status/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteAnException(exceptionId, callback)</td>
    <td style="padding:15px">Delete an exception</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/security_policies/exceptions/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getASpecificException(exceptionId, callback)</td>
    <td style="padding:15px">Get a specific exception</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/security_policies/exceptions/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">cancelMatchingRulesTask(taskId, callback)</td>
    <td style="padding:15px">Cancel Matching rules task</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/security_policies/exceptions/matching_rules/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getAllExceptions(callback)</td>
    <td style="padding:15px">Get all exceptions</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/security_policies/exceptions/?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createAnException(body, callback)</td>
    <td style="padding:15px">Create an exception</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/security_policies/exceptions/?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getMatchingRulesTaskResults(taskId, callback)</td>
    <td style="padding:15px">Get matching rules task results</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/security_policies/exceptions/matching_rules/result/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getGlobalUnifiedSecurityPolicies(callback)</td>
    <td style="padding:15px">Get global unified security policies</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/security_policies/global?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getUnifiedSecurityPolicies(callback)</td>
    <td style="padding:15px">Get unified security policies</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/security_policies/?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getUnifiedSecurityPolicyAsCSV(id, callback)</td>
    <td style="padding:15px">Get unified security policy as CSV</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/security_policies/{pathv1}/export?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteUnifiedSecurityPolicy(id, callback)</td>
    <td style="padding:15px">Delete unified security policy</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/security_policies/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">setManualDeviceMapping(body, deviceId, callback)</td>
    <td style="padding:15px">Set manual device mapping</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/security_policies/{pathv1}/manual_mapping?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getTheAmountOfViolatingRulesForTheSpecifiedDevice(deviceId, callback)</td>
    <td style="padding:15px">Get the amount of violating rules for the specified device.</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/violating_rules/{pathv1}/count?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getTheViolatingRulesForTheSpecifiedDevice(deviceId, callback)</td>
    <td style="padding:15px">Get the violating rules for the specified device.</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/violating_rules/{pathv1}/device_violations?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificAdditionalParameterIdentityQuery(revisionId, ids, queryObject, callback)</td>
    <td style="padding:15px">GetspecificadditionalparameteridentityQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/additional_parameters/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getAURLCategoryQuery(revisionId, ids, queryObject, callback)</td>
    <td style="padding:15px">GetaURLCategory.Query</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/url_categories/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getAdditionalParametersIdentitiesByRevisionQuery(revisionId, queryObject, callback)</td>
    <td style="padding:15px">getAdditionalParameters</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/additional_parameters?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getApplicationsIdentitiesByRevisionQuery(id, queryObject, callback)</td>
    <td style="padding:15px">GetapplicationsidentitiesbyrevisionQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/applications?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getRevisionsRevisionIdApplicationsIdsQuery(revisionId, ids, queryObject, callback)</td>
    <td style="padding:15px">Fetches one or more applications</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/applications/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getApplicationIdentitiesByDeviceQuery(id, queryObject, callback)</td>
    <td style="padding:15px">GetapplicationidentitiesbydeviceQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/applications?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificApplicationIdentityQuery(id, ids, queryObject, callback)</td>
    <td style="padding:15px">GetgetSpecificApplication</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/applications/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">determineIfChangesBetweenTwoRevisionsAreAuthorizedQuery(queryObject, callback)</td>
    <td style="padding:15px">DetermineifchangesbetweentworevisionsareauthorizedQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/change_authorization?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getNameAndStatusForAllChangeWindowsQuery(queryObject, callback)</td>
    <td style="padding:15px">GetnameandstatusforallchangewindowsQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/change_windows?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSchedulingAndDeviceDetailsForASpecificChangeWindowQuery(uid, taskId, queryObject, callback)</td>
    <td style="padding:15px">GetschedulinganddevicedetailsforaspecificchangewindowQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/change_windows/{pathv1}/tasks/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getAListOfCompletedPolicyChangesForASpecificChangeWindowQuery(uid, queryObject, callback)</td>
    <td style="padding:15px">GetalistofcompletedpolicychangesforaspecificchangewindowQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/change_windows/{pathv1}/tasks?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getDeviceZonesByRevisionQuery(id, queryObject, callback)</td>
    <td style="padding:15px">GetdevicezonesbyrevisionQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/zones?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getNetworkInterfacesByRevisionQuery(id, queryObject, callback)</td>
    <td style="padding:15px">GetnetworkinterfacesbyrevisionQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/interfaces?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getDeviceZonesByDeviceQuery(id, queryObject, callback)</td>
    <td style="padding:15px">GetdevicezonesbydeviceQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/zones?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getZonesAndNetworkInterfacesThatParticipateInSubPoliciesQuery(id, queryObject, callback)</td>
    <td style="padding:15px">Getzonesandnetworkinterfacesthatparticipateinsub-policiesQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/bindable_objects?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getNetworkInterfacesByDeviceQuery(id, queryObject, callback)</td>
    <td style="padding:15px">GetnetworkinterfacesbydeviceQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/interfaces?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getDomainQuery(id, queryObject, callback)</td>
    <td style="padding:15px">GetdomainQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/domains/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getCiscoCryptographicMapsByRevisionQuery(id, queryObject, callback)</td>
    <td style="padding:15px">GetCiscocryptographicmapsbyrevisionQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/crypto_maps?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getCiscoCryptographicMapsByDeviceQuery(id, queryObject, callback)</td>
    <td style="padding:15px">GetCiscocryptographicmapsbydeviceQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/crypto_maps?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getCiscoIPsecPolicyAndPeersQuery(deviceId, queryObject, callback)</td>
    <td style="padding:15px">GetIpsecTunnelsForTopologyInterface</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/bindings/{pathv1}/ipsec_tunnels?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getCheckPointVPNIPSecCommunitiesAndGatewaysQuery(deviceId, queryObject, callback)</td>
    <td style="padding:15px">GetIpsecCommunitiesForManagementId</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/bindings/{pathv1}/ipsec_communities?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getLDAPEntryDetailsByDNQuery(queryObject, callback)</td>
    <td style="padding:15px">GetLDAPentrydetailsbyDNQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/ldap/getEntryByDN?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getLicense(id, queryObject, callback)</td>
    <td style="padding:15px">getLicense</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/licenses/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getLicenses(callback)</td>
    <td style="padding:15px">getLicenses</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/licenses?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getQueueSizeConfig(callback)</td>
    <td style="padding:15px">getQueueSizeConfig</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/provisioning/config/queue_size?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateQueueMaxSize(body, callback)</td>
    <td style="padding:15px">updateQueueMaxSize</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/provisioning/config/queue_size?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getTextualConfigurationByRevisionQuery(id, queryObject, callback)</td>
    <td style="padding:15px">GettextualconfigurationbyrevisionQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/config?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getDevicesQuery(queryObject, callback)</td>
    <td style="padding:15px">GetdevicesQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificDeviceQuery(id, queryObject, callback)</td>
    <td style="padding:15px">GetspecificdeviceQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getTextualConfigurationByDeviceQuery(id, queryObject, callback)</td>
    <td style="padding:15px">GettextualconfigurationbydeviceQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/config?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">abortTask(body, callback)</td>
    <td style="padding:15px">abort</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/provisioning/abort_task?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">abortAllTasks(body, callback)</td>
    <td style="padding:15px">abortAllTasks</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/provisioning/abort_all_tasks?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getWaitingTasks(callback)</td>
    <td style="padding:15px">getWaitingTasks</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/provisioning/waiting_tasks?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getWaitingTasksForDevice(deviceId, callback)</td>
    <td style="padding:15px">getWaitingTasksForDevice</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/provisioning/waiting_tasks/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateOfflineDeviceQuery(deviceId, queryObject, body, callback)</td>
    <td style="padding:15px">updateDevice</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getNATObjectsByRevisionQuery(id, queryObject, callback)</td>
    <td style="padding:15px">GetNATobjectsbyrevisionQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/nat_objects?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getNATObjectsByDeviceQuery(id, queryObject, callback)</td>
    <td style="padding:15px">GetNATobjectsbydeviceQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/nat_objects?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getNATRulesByDeviceQuery(id, queryObject, callback)</td>
    <td style="padding:15px">GetNATrulesbydeviceQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/nat_rules/bindings?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getNetworkObjectsByRevisionQuery(id, queryObject, callback)</td>
    <td style="padding:15px">GetnetworkobjectsbyrevisionQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/network_objects?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificNetworkObjectsByRevisionQuery(revisionId, ids, queryObject, callback)</td>
    <td style="padding:15px">GetspecificnetworkobjectsbyrevisionQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/network_objects/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getNetworkObjectsByDeviceQuery(id, queryObject, callback)</td>
    <td style="padding:15px">GetnetworkobjectsbydeviceQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/network_objects?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificNetworkObjectQuery(deviceId, ids, queryObject, callback)</td>
    <td style="padding:15px">GetspecificnetworkobjectQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/network_objects/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getNetworkObjectsMatchingSpecifiedCriteriaQuery(queryObject, callback)</td>
    <td style="padding:15px">GetnetworkobjectsmatchingspecifiedcriteriaQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/network_objects/search?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getNetworkGroupsContainingSpecifiedNetworkObjectQuery(id, queryObject, callback)</td>
    <td style="padding:15px">GetnetworkgroupscontainingspecifiednetworkobjectQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/network_objects/{pathv1}/groups?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getRulesContainingSpecifiedNetworkObjectQuery(id, queryObject, callback)</td>
    <td style="padding:15px">GetrulescontainingspecifiednetworkobjectQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/network_objects/{pathv1}/rules?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getTopologyGenericVPNConnectionsQuery(queryObject, callback)</td>
    <td style="padding:15px">GettopologygenericVPNconnectionsQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/generic_vpns?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateACloudQuery(id, queryObject, body, callback)</td>
    <td style="padding:15px">UpdateacloudQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/clouds/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">synchronizeTheTopologyModelQuery(queryObject, callback)</td>
    <td style="padding:15px">SynchronizetheTopologymodelQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/synchronize?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSynchronizerCronTabDetails(callback)</td>
    <td style="padding:15px">getSynchronizerCronTabDetails</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/synchronize/getSynchronizerCronTabDetails?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getPathPdf(queryObject, callback)</td>
    <td style="padding:15px">getPathPdf</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/export_path_results.pdf?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getPathDomains(queryObject, callback)</td>
    <td style="padding:15px">getPathDomains</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/path_domains?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getPathObjectTraffic(queryObject, callback)</td>
    <td style="padding:15px">getPathObjectTraffic</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/path_objects_traffic?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getPathImageForSpecifiedTrafficQuery(queryObject, callback)</td>
    <td style="padding:15px">GetpathimageforspecifiedtrafficQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/path_image?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getPathForSpecifiedTrafficQuery(queryObject, callback)</td>
    <td style="padding:15px">GetpathforspecifiedtrafficQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/path?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getTopologyCloudsQuery(queryObject, callback)</td>
    <td style="padding:15px">GettopologycloudsQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/clouds?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createAJoinedTopologyCloudQuery(queryObject, body, callback)</td>
    <td style="padding:15px">CreateajoinedtopologycloudQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/clouds?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getTopologySubnetsQuery(queryObject, callback)</td>
    <td style="padding:15px">GettopologysubnetsQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/subnets?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getget(cloudId, callback)</td>
    <td style="padding:15px">Getget</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/join/clouds/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deletedelete(cloudId, queryObject, callback)</td>
    <td style="padding:15px">Deletedelete</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/join/clouds/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createJoinCloud(queryObject, body, callback)</td>
    <td style="padding:15px">Create Join Cloud</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/join/clouds?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateJoinClouds(queryObject, body, callback)</td>
    <td style="padding:15px">update join clouds</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/join/clouds?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getVpn(vpnId, callback)</td>
    <td style="padding:15px">getVpn</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/generic/vpn/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteVpn(vpnId, callback)</td>
    <td style="padding:15px">deleteVpn</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/generic/vpn/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getInterface(inId, callback)</td>
    <td style="padding:15px">getInterface</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/generic/interface/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteInterface(inId, callback)</td>
    <td style="padding:15px">deleteInterface</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/generic/interface/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getRoute(routeId, callback)</td>
    <td style="padding:15px">getRoute</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/generic/route/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteRoute(routeId, callback)</td>
    <td style="padding:15px">deleteRoute</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/generic/route/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createRoutes(body, callback)</td>
    <td style="padding:15px">createRoutes</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/generic/route?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateRoutes(body, callback)</td>
    <td style="padding:15px">updateRoutes</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/generic/route?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getRoutes(mgmtId, callback)</td>
    <td style="padding:15px">getRoutes</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/generic/route/mgmt/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteRoutes(mgmtId, callback)</td>
    <td style="padding:15px">deleteRoutes</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/generic/route/mgmt/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getInterfaceCustomer(interfaceCustomerId, callback)</td>
    <td style="padding:15px">getInterfaceCustomer</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/generic/interfacecustomer/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteInterfaceCustomer(interfaceCustomerId, callback)</td>
    <td style="padding:15px">deleteInterfaceCustomer</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/generic/interfacecustomer/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getInterfaceCustomers(deviceId, queryObject, callback)</td>
    <td style="padding:15px">getInterfaceCustomers</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/generic/interfacecustomer/device/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteInterfaceCustomers(deviceId, queryObject, callback)</td>
    <td style="padding:15px">deleteInterfaceCustomers</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/generic/interfacecustomer/device/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createInterfaceCustomers(body, callback)</td>
    <td style="padding:15px">createInterfaceCustomers</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/generic/interfacecustomer?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateInterfaceCustomers(body, callback)</td>
    <td style="padding:15px">updateInterfaceCustomers</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/generic/interfacecustomer?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getgetInterfaces(mgmtId, callback)</td>
    <td style="padding:15px">GetgetInterfaces</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/generic/interface/mgmt/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteInterfaces(mgmtId, callback)</td>
    <td style="padding:15px">deleteInterfaces</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/generic/interface/mgmt/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createInterfaces(body, callback)</td>
    <td style="padding:15px">createInterfaces</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/generic/interface?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateInterfaces(body, callback)</td>
    <td style="padding:15px">updateInterfaces</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/generic/interface?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getVpns(deviceId, queryObject, callback)</td>
    <td style="padding:15px">getVpns</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/generic/vpn/device/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteVpns(deviceId, queryObject, callback)</td>
    <td style="padding:15px">deleteVpns</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/generic/vpn/device/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createVpns(body, callback)</td>
    <td style="padding:15px">createVpns</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/generic/vpn?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateVpns(body, callback)</td>
    <td style="padding:15px">updateVpns</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/generic/vpn?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getTransparentFirewalls(deviceId, queryObject, callback)</td>
    <td style="padding:15px">getTransparentFirewalls</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/generic/transparentfw/device/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteTransparentFirewalls(deviceId, callback)</td>
    <td style="padding:15px">deleteTransparentFirewalls</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/generic/transparentfw/device/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteTransparentFirewall(layer2DataId, callback)</td>
    <td style="padding:15px">deleteTransparentFirewall</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/generic/transparentfw/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createTransparentFirewalls(body, callback)</td>
    <td style="padding:15px">createTransparentFirewalls</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/generic/transparentfw?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateTransparentFirewalls(body, callback)</td>
    <td style="padding:15px">updateTransparentFirewalls</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/generic/transparentfw?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getIgnoredInterfaces(mgmtId, callback)</td>
    <td style="padding:15px">getIgnoredInterfaces</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/generic/ignoredinterface/mgmt/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteIgnoredInterfaces(mgmtId, callback)</td>
    <td style="padding:15px">deleteIgnoredInterfaces</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/generic/ignoredinterface/mgmt/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createIgnoredInterfaces(body, callback)</td>
    <td style="padding:15px">createIgnoredInterfaces</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/generic/ignoredinterface?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteGenericDeviceFromTopologyModelQuery(id, queryObject, callback)</td>
    <td style="padding:15px">DeletegenericdevicefromTopologymodelQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/generic_devices/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getGenericDevicesThatAreConfiguredInSTQuery(queryObject, callback)</td>
    <td style="padding:15px">GetgenericdevicesthatareconfiguredinSTQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/generic_devices?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getTopologyRoutingTablesForAGivenDeviceQuery(queryObject, callback)</td>
    <td style="padding:15px">GettopologyroutingtablesforagivendeviceQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/topology_routes?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getTopologyNetworkInterfacesByDeviceQuery(queryObject, callback)</td>
    <td style="padding:15px">GettopologynetworkinterfacesbydeviceQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/topology_interfaces?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getMostSpecificNetworkInterfacesFromWhichAHostIPIsAccessibleQuery(queryObject, callback)</td>
    <td style="padding:15px">GetmostspecificnetworkinterfacesfromwhichahostIPisaccessibleQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/interfaces/last_hop?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">joinOrSplitSubnet(queryObject, body, callback)</td>
    <td style="padding:15px">Join/Split Subnet.</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/join/subnets?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">modifyAZoneEntryQuery(zoneId, id, queryObject, body, callback)</td>
    <td style="padding:15px">PutModifyazoneentryQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}/entries/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getASpecificZoneEntryQuery(id, zoneId, queryObject, callback)</td>
    <td style="padding:15px">getZoneEntry</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}/entries/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteZoneEntriesQuery(id, zoneId, queryObject, callback)</td>
    <td style="padding:15px">deleteZoneEntry</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}/entries/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createAZoneEntryQuery(zoneId, queryObject, body, callback)</td>
    <td style="padding:15px">addZoneEntry</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}/entries?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteZonesZoneIdsEntriesIdsQuery(zoneIds, ids, queryObject, callback)</td>
    <td style="padding:15px">deleteZoneEntries</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}/entries/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">modifyMultipleExistingZoneEntriesQuery(zoneIds, ids, queryObject, body, callback)</td>
    <td style="padding:15px">editZoneEntries</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}/entries/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getEntriesForAZoneQuery(ids, queryObject, callback)</td>
    <td style="padding:15px">getZoneEntries</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}/entries?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getASpecificZoneQuery(id, queryObject, callback)</td>
    <td style="padding:15px">GetaspecificzoneQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">modifyAZoneQuery(id, queryObject, body, callback)</td>
    <td style="padding:15px">ModifyazoneQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getAllZonesQuery(queryObject, callback)</td>
    <td style="padding:15px">GetallzonesQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createAZoneQuery(queryObject, body, callback)</td>
    <td style="padding:15px">CreateazoneQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteAllZonesQuery(queryObject, callback)</td>
    <td style="padding:15px">DeleteallzonesQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSharedZonesQuery(queryObject, callback)</td>
    <td style="padding:15px">GetsharedzonesQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/shared?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getConfigurationUsagesForAZoneQuery(ids, queryObject, callback)</td>
    <td style="padding:15px">getZoneDependencies</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}/dependencies?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getDescendantZonesForAZoneQuery(ids, queryObject, callback)</td>
    <td style="padding:15px">getChildrenHierarchy</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}/descendants?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getAncestorZonesForAZoneQuery(ids, queryObject, callback)</td>
    <td style="padding:15px">getParentsHierarchy</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}/ancestors?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">addAZoneAsADescendantToAZoneQuery(parentId, childIds, queryObject, callback)</td>
    <td style="padding:15px">addContainedZone</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}/descendants/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">removeAZoneAsAnDescendantsToAZoneQuery(parentId, childIds, queryObject, callback)</td>
    <td style="padding:15px">deleteContainedZone</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}/descendants/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">addAZoneAsAnAncestorToAZoneQuery(childId, parentIds, queryObject, callback)</td>
    <td style="padding:15px">addToZone</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}/ancestors/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">removeAZoneAsAnAncestorToAZoneQuery(childId, parentIds, queryObject, callback)</td>
    <td style="padding:15px">deleteFromZone</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}/ancestors/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteAZoneQuery(ids, queryObject, callback)</td>
    <td style="padding:15px">deleteZones</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">importAZoneQuery(ids, queryObject, callback)</td>
    <td style="padding:15px">importZones</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/import/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getPoliciesByRevisionQuery(id, queryObject, callback)</td>
    <td style="padding:15px">GetpoliciesbyrevisionQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/policies?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSubPoliciesBindingsByRevisionQuery(id, queryObject, callback)</td>
    <td style="padding:15px">Getsub-policies(bindings)byrevisionQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/bindings?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getPoliciesByDeviceQuery(id, queryObject, callback)</td>
    <td style="padding:15px">GetpoliciesbydeviceQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/policies?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSubPoliciesBindingsByDeviceQuery(id, queryObject, callback)</td>
    <td style="padding:15px">Getsub-policies(bindings)bydeviceQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/bindings?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getRulesByInputAndOutputInterfacesQuery(deviceId, queryObject, callback)</td>
    <td style="padding:15px">getBindingsForTopologyInterfaces</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/bindings/{pathv1}/topology_interfaces?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getListOfSubPoliciesBindingsWithInputAndOrOutputInterfacesQuery(deviceId, queryObject, callback)</td>
    <td style="padding:15px">getLastInstalledVersionBindingsByVersionId</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/bindings/{pathv1}/binding_query?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">runPolicyAnalysisQueryQuery(queryObject, callback)</td>
    <td style="padding:15px">RunPolicyAnalysisqueryQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/policy_analysis/query/matching_rules?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getRisksResultsQuery(queryObject, callback)</td>
    <td style="padding:15px">GetrisksresultsQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/risk?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getCleanupsResultsQuery(queryObject, callback)</td>
    <td style="padding:15px">GetcleanupsresultsQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/cleanup?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getTheSpecificObjectsOrRulesIdentifiedForTheRiskResultsQuery(riskId, queryObject, callback)</td>
    <td style="padding:15px">getRiskInstances</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/risk/{pathv1}/instances?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getDevicesInRiskResultsQuery(riskId, queryObject, callback)</td>
    <td style="padding:15px">getRiskDevices</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/risk/{pathv1}/devices?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getTheSpecificObjectsOrRulesIdentifiedForTheCleanupResultsQuery(cleanupId, queryObject, callback)</td>
    <td style="padding:15px">getCleanupInstances</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/cleanup/{pathv1}/instances?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getDevicesInCleanupResultsQuery(cleanupId, queryObject, callback)</td>
    <td style="padding:15px">getCleanupDevices</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/cleanup/{pathv1}/devices?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getCleanupsByDeviceQuery(deviceId, queryObject, callback)</td>
    <td style="padding:15px">getCleanupInstanceResultAndInfo</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/cleanups?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getShadowingRulesByDeviceQuery(deviceId, queryObject, callback)</td>
    <td style="padding:15px">getShadowingResultAndInfo</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/shadowing_rules?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getRevisionsByDeviceQuery(id, queryObject, callback)</td>
    <td style="padding:15px">GetrevisionsbydeviceQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/revisions?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getLatestRevisionByDeviceQuery(id, queryObject, callback)</td>
    <td style="padding:15px">GetlatestrevisionbydeviceQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/latest_revision?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificRevisionQuery(revId, queryObject, callback)</td>
    <td style="padding:15px">getRevision</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getRuleCountPerDeviceQuery(queryObject, callback)</td>
    <td style="padding:15px">GetrulecountperdeviceQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/rule_search?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getRulesByRevisionQuery(id, queryObject, callback)</td>
    <td style="padding:15px">GetrulesbyrevisionQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/rules?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getRevisionsRevisionIdRulesIdsQuery(revisionId, ids, queryObject, callback)</td>
    <td style="padding:15px">Returns a list of rules</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/rules/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getRulesByDeviceQuery(id, queryObject, callback)</td>
    <td style="padding:15px">GetrulesbydeviceQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/rules?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificRuleQuery(deviceId, ids, queryObject, callback)</td>
    <td style="padding:15px">GetspecificruleQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/rules/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">findRulesQuery(deviceId, queryObject, callback)</td>
    <td style="padding:15px">findRules</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/rule_search/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getASpecificRuleQuery(ruleId, queryObject, callback)</td>
    <td style="padding:15px">getRule</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/rules/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getServiceGroupsContainingSpecifiedServiceObjectsQuery(id, queryObject, callback)</td>
    <td style="padding:15px">GetservicegroupscontainingspecifiedserviceobjectsQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/services/{pathv1}/groups?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getRulesContainingSpecifiedServiceObjectQuery(id, queryObject, callback)</td>
    <td style="padding:15px">GetrulescontainingspecifiedserviceobjectQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/services/{pathv1}/rules?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getServicesByRevisionQuery(id, queryObject, callback)</td>
    <td style="padding:15px">GetservicesbyrevisionQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/services?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificServiceQuery(revisionId, ids, queryObject, callback)</td>
    <td style="padding:15px">GetspecificserviceQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/services/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getServicesByDeviceQuery(id, queryObject, callback)</td>
    <td style="padding:15px">GetservicesbydeviceQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/services?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getDevicesDeviceIdServicesIdsQuery(deviceId, ids, queryObject, callback)</td>
    <td style="padding:15px">Fetches list of specific service objects</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/services/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getTimeObjectsByRevisionQuery(id, queryObject, callback)</td>
    <td style="padding:15px">GettimeobjectsbyrevisionQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/time_objects?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificTimeObjectQuery(revisionId, ids, queryObject, callback)</td>
    <td style="padding:15px">GetspecifictimeobjectQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/time_objects/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getTimeObjectsByDeviceQuery(id, queryObject, callback)</td>
    <td style="padding:15px">GettimeobjectsbydeviceQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/time_objects?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getPolicyRelevanceMetricsForTrafficQuery(queryObject, body, callback)</td>
    <td style="padding:15px">GetpolicyrelevancemetricsfortrafficQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/traffic_policy?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getViolationsForAnAccessRequestQuery(queryObject, body, callback)</td>
    <td style="padding:15px">GetviolationsforanaccessrequestQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/violations/access_requests/sync?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">startATaskToCalculateViolationsForAnAccessRequestQuery(queryObject, body, callback)</td>
    <td style="padding:15px">StartatasktocalculateviolationsforanaccessrequestQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/violations/access_requests/task?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getAlertsQuery(queryObject, callback)</td>
    <td style="padding:15px">GetalertsQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/security_policies/alerts?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createAnAlertQuery(queryObject, body, callback)</td>
    <td style="padding:15px">CreateanalertQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/security_policies/alerts?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getASpecificAlertQuery(id, queryObject, callback)</td>
    <td style="padding:15px">GetaspecificalertQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/security_policies/alerts/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateAnAlertQuery(id, queryObject, body, callback)</td>
    <td style="padding:15px">UpdateanalertQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/security_policies/alerts/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteAlertsByIdsQuery(ids, queryObject, callback)</td>
    <td style="padding:15px">deleteUSPAlert</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/security_policies/alerts/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createACloudTagPolicyQuery(queryObject, body, callback)</td>
    <td style="padding:15px">CreateacloudtagpolicyQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/policies?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getAllCloudTagPoliciesQuery(queryObject, callback)</td>
    <td style="padding:15px">GetallcloudtagpoliciesQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/policies?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getCloudTagPolicyQuery(policyId, queryObject, callback)</td>
    <td style="padding:15px">GetcloudtagpolicyQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/policies/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">replaceACloudTagPolicyQuery(policyId, queryObject, body, callback)</td>
    <td style="padding:15px">ReplaceacloudtagpolicyQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/policies/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">modifyACloudTagPolicyQuery(policyId, queryObject, body, callback)</td>
    <td style="padding:15px">ModifyacloudtagpolicyQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/policies/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteCloudTagPolicyQuery(policyId, queryObject, callback)</td>
    <td style="padding:15px">DeletecloudtagpolicyQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/policies/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">checkIfTagsAreCompliantWithCloudTagPoliciesQuery(queryObject, body, callback)</td>
    <td style="padding:15px">CheckiftagsarecompliantwithcloudtagpoliciesQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/violation_check?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getAllCloudTagPolicyViolationsForAVPCQuery(queryObject, callback)</td>
    <td style="padding:15px">GetallcloudtagpolicyviolationsforaVPCQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/tag_violations?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createAnExceptionQuery(queryObject, body, callback)</td>
    <td style="padding:15px">CreateanexceptionQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/security_policies/exceptions?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getAllExceptionsQuery(queryObject, callback)</td>
    <td style="padding:15px">GetallexceptionsQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/security_policies/exceptions?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getASpecificExceptionQuery(exceptionId, queryObject, callback)</td>
    <td style="padding:15px">Getget2</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/security_policies/exceptions/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteAnExceptionQuery(exceptionId, queryObject, callback)</td>
    <td style="padding:15px">Deletedelete2</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/security_policies/exceptions/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">startATaskToCalculateMatchingRulesForAnExceptionQuery(exceptionId, queryObject, callback)</td>
    <td style="padding:15px">Postcreate4</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/security_policies/exceptions/{pathv1}/matching_rules/start?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getGlobalUnifiedSecurityPoliciesQuery(queryObject, callback)</td>
    <td style="padding:15px">GetglobalunifiedsecuritypoliciesQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/security_policies/global?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getUnifiedSecurityPoliciesQuery(queryObject, callback)</td>
    <td style="padding:15px">GetunifiedsecuritypoliciesQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/security_policies?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteUnifiedSecurityPolicyQuery(id, queryObject, callback)</td>
    <td style="padding:15px">DeleteunifiedsecuritypolicyQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/security_policies/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getUnifiedSecurityPolicyAsCSVQuery(id, queryObject, callback)</td>
    <td style="padding:15px">GetunifiedsecuritypolicyasCSVQuery</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/security_policies/{pathv1}/export?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">setManualDeviceMappingQuery(deviceId, queryObject, body, callback)</td>
    <td style="padding:15px">setManualDeviceMapping</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/security_policies/{pathv1}/manual_mapping?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getUrlCategories(revisionId, queryObject, callback)</td>
    <td style="padding:15px">getUrlCategories</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/url_categories?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getProperties(callback)</td>
    <td style="padding:15px">getProperties</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/properties?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">setProperties(body, callback)</td>
    <td style="padding:15px">setProperties</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/properties?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getPBRRules(deviceId, queryObject, callback)</td>
    <td style="padding:15px">getPBRRules</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/bindings/{pathv1}/PBR_rules?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">cloudSuggestions(queryObject, callback)</td>
    <td style="padding:15px">cloudSuggestions</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/cloud_suggestions?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">cloudSuggestion(cloudId, queryObject, callback)</td>
    <td style="padding:15px">cloudSuggestion</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/topology/cloud_suggestions/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getRouteMaps(deviceId, queryObject, callback)</td>
    <td style="padding:15px">getRouteMaps</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/route_maps?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">addZonesEntries(queryObject, body, callback)</td>
    <td style="padding:15px">addZonesEntries</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/entries?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSdWanBindingsByRevision(id, queryObject, callback)</td>
    <td style="padding:15px">Returns a list of all of the subpolicies (bindings) for a given revision.</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/sdwan_bindings?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSdWanBindingsByDevice(id, queryObject, callback)</td>
    <td style="padding:15px">Returns a list of all of the subpolicies (bindings) for a given device</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/sdwan_bindings?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">exportRulesToCsv(queryObject, callback)</td>
    <td style="padding:15px">exportRulesToCsv</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/rule_search/export?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">findServicesObjects(queryObject, callback)</td>
    <td style="padding:15px">findServicesObjects</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/services/search?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getDeviceMapping(deviceId, queryObject, callback)</td>
    <td style="padding:15px">getDeviceMapping</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/security_policies/{pathv1}/mapping?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getResolvedInternetRepresentationForDeviceQuery(deviceId, queryObject, callback)</td>
    <td style="padding:15px">getInternetObject</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/internet_referral/{pathv1}/object?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">updateInternetRepresentationForDeviceQuery(deviceId, queryObject, body, callback)</td>
    <td style="padding:15px">update</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/internet_referral/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getInternetRepresentationForDeviceQuery(deviceId, queryObject, callback)</td>
    <td style="padding:15px">get</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/internet_referral/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteInternetRepresentationForDeviceQuery(deviceId, queryObject, callback)</td>
    <td style="padding:15px">delete</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/internet_referral/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">createAZonePatternEntryInASpecificZoneQuery(zoneId, queryObject, body, callback)</td>
    <td style="padding:15px">addPatternMatchEntry</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}/pattern-entries?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getAllPatternEntriesForSpecificZonesQuery(ids, queryObject, callback)</td>
    <td style="padding:15px">getPatternMatchEntries</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}/pattern-entries?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getASpecificZonePatternEntryForASpecificZoneQuery(id, zoneId, queryObject, callback)</td>
    <td style="padding:15px">getPatternMatchEntry</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/zones/{pathv1}/pattern-entries/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getRevisionsIdRulesRuleIdDocumentationQuery(id, ruleId, queryObject, callback)</td>
    <td style="padding:15px">Fetches rule documentation</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/rules/{pathv2}/documentation?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">putRevisionsIdRulesRuleIdDocumentationQuery(id, ruleId, queryObject, body, callback)</td>
    <td style="padding:15px">modifyRuleDocumentation</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/rules/{pathv2}/documentation?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteRuleDocumentation(id, ruleId, queryObject, callback)</td>
    <td style="padding:15px">deleteRuleDocumentation</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/revisions/{pathv1}/rules/{pathv2}/documentation?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getSpecificRuleDocumentationQuery(id, ruleId, queryObject, callback)</td>
    <td style="padding:15px">Fetches rule documentation for a single rule given by device ID and rule ID</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/rules/{pathv2}/documentation?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">modifySpecificRuleDocumentationQuery(id, ruleId, queryObject, body, callback)</td>
    <td style="padding:15px">Modify rule documentation for a single rule given by device ID and rule ID</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/rules/{pathv2}/documentation?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">deleteSpecificRuleDocumentationQuery(id, ruleId, queryObject, callback)</td>
    <td style="padding:15px">Delete rule documentation for a single rule</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/devices/{pathv1}/rules/{pathv2}/documentation?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getLastHitsForAllRulesByDeviceQuery(deviceId, queryObject, callback)</td>
    <td style="padding:15px">findAllWithObjects</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/rule_last_usage/find_all/{pathv1}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getlasthitforaspecificruleQuery(ruleUid, deviceId, queryObject, callback)</td>
    <td style="padding:15px">findWithObjects</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/rule_last_usage/find/{pathv1}/{pathv2}?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getTheAmountOfViolatingRulesForTheSpecifiedDeviceQuery(deviceId, queryObject, callback)</td>
    <td style="padding:15px">getRulesCount</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/violating_rules/{pathv1}/count?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
  <tr>
    <td style="padding:15px">getTheViolatingRulesForTheSpecifiedDeviceQuery(deviceId, queryObject, callback)</td>
    <td style="padding:15px">GetgetDeviceViolations</td>
    <td style="padding:15px">{base_path}/{version}/securetrack/api/violating_rules/{pathv1}/device_violations?{query}</td>
    <td style="padding:15px">Yes</td>
  </tr>
</table>
<br>
