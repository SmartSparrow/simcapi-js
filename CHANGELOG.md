## Release History

- Unreleased
- 1.2.0 (21 Oct 2016)
    - Adding PeerResponseAPI calls

### Old Version ###
- 1.01 - No longer reverts domain to its original when granting access
- 1.00 - New SimCapiMessage Type: ALLOW_INTERNAL_ACCESS
       New public transporter method: requestInternalViewerAccess
- 0.99 - SimCapiValue of type string will cast values as a string
- 0.98 - Removed the error thrown while trying to add a listener after handshake complete and added the listener
- 0.97 - Allow setDataRequest to be called from a setDataRequest callback
- 0.96 - Added InchRepoService search method to the list of allowed thrift calls
- 0.95 - Update simcapi to send out value changed messages for properties that haven't been exposed
- 0.94 - Update simcapi to allow the sim to request its parent container should resize
- 0.93 - Add fake data persistence when the sim is not in an iFrame or is in the authoring tool
- 0.92 - Added a way to define callbacks to be invoked when the handshake is completed
- 0.91 - Added DataSyncAPI and DeviceAPI methods to the list of allowed thrift calls
- 0.90 - SimcapiHandler was moved into core, separating the sim and viewer logic.
- 0.80 - Added the ability to bind a sim's capi property to a capi property external to the sim
- 0.71 - Improvement: allow sims to make thrift calls
- 0.70 - Fixed: adapter unexpose removing incorrect capi property
- 0.69 - Fixed: unexpose not removing capi properties from snapshot
- 0.68 - Added ability for users of SimCapiHandler to target a particular instance
       of an iframe (among several with the same iframe ID) by using questionId data
       in the DOM elements.
- 0.67 - Added public method to clear the snapshot and descriptors for an iframe
         - Fixed bug where the snapshot wouldn't get deleted when the iframe was removed
- 0.66 - Switch underscore to lodash
- 0.65 - Added Array Point type
- 0.64 - Added MathExpression as a type
         - Validation checks on the sim side will ensure that it's the same on the platform side
         - Capi properties can be write only now
- 0.63 - When exposing a property after the first time the default value will overwritten
- 0.62 - Add ability to save lesson attempt
- 0.61 - Bug fix with Check start Event
- 0.6  - Added Check Start Event
- 0.59 - Enums are finally implemented.
- 0.58 - Applies capi properties received before the expose.
- 0.55 - Added initial setup complete event, true pending message queue, Do not delete tokens for invisible iframes
- 0.54 - Upgraded jquery dependency.
- 0.53 - Minor fix so no object can be passed to triggerCheck.
- 0.52 - Throttles the notifying of value changes.
- 0.51 - Bug fix for the adapters
- 0.5  - Added get/set data
- 0.4  - Added check events
- 0.3  - Minor changes
- 0.2  - Rewrite of the client slide implementation
- 0.1  - Added support for SimCapiMessage.TYPES.VALUE_CHANGE_REQUEST message allowing the handler to provoke the sim into sending all of its properties.