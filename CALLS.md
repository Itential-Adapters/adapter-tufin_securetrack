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
</table>
<br>
