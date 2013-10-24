/*global window, document */
define(['jquery', 
        'underscore',
        'api/snapshot/util/Math.uuid',
        'api/snapshot/SimCapiMessage'
], function($, _, Math, SimCapiMessage){

var SimCapi = function(options) {
    // current version of SimCapi
    var version = 0.1;

    // Ensure that options is initialized. This is just making code cleaner by avoiding lots of
    // null checks
    options = options || {};

    var self = this;

    // The mapping of watched 'attributes'
    var outgoingMap = options.outgoingMap || {};

    //The list
    var changeListeners = [];

    // Authentication handshake used for communicating to viewer
    var handshake = {
        requestToken : options.requestToken || Math.uuid(),
        authToken : options.authToken || null,
        version : version
    };

    // True if and only if we have a pending on ready message.
    var pendingOnReady = options.pendingOnReady || false;


    this.getHandshake = function(){
        return handshake;
    };

    /*
     * Helper to route messages to approvidate handlers
     */
    this.capiMessageHandler = function(message) {
        switch(message.type) {
        case SimCapiMessage.TYPES.HANDSHAKE_RESPONSE:
            handleHandshakeResponse(message);
            break;
        case SimCapiMessage.TYPES.VALUE_CHANGE:
            handleValueChangeMessage(message);
            break;
        case SimCapiMessage.TYPES.CONFIG_CHANGE:
            handleConfigChangeMessage(message);
            break;
        case SimCapiMessage.TYPES.VALUE_CHANGE_REQUEST:
            handleValueChangeRequestMessage(message);
            break;
        }
    };

    this.addChangeListener = function(changeListener){
      changeListeners.push(changeListener);
    };

    /*
     * Handles configuration changes to sharedsimdata
     */
    var handleConfigChangeMessage = function(message) {
        if (message.handshake.authToken === handshake.authToken) {
            handshake.config = message.handshake.config;
        }
    };
    
    /*
     * Handles request to report about value changes
     */
    var handleValueChangeRequestMessage = function(message) {
        if (message.handshake.authToken === handshake.authToken) {
            self.notifyValueChange();
        }
    };
    

    /*
     * Handles value change messages and update the model accordingly. If the
     * authToken doesn't match our authToken, we ignore the message.
     */
    var handleValueChangeMessage = function(message) {
        if (message.handshake.authToken === handshake.authToken) {

            // enumerate through all received values @see SimCapiMessage.values
            //key - the alias || original name
            //capiValue.key - the original name
            _.each(message.values, function(capiValue, key){

                // check if the key exists in the mapping and is writeable
                if (capiValue && !capiValue.readonly) {               
                    outgoingMap[key] = capiValue.value;   
                }
            });
        }
    };

    /*
     * Handles handshake response by storing the authtoken and sending an ON_READY message
     * if the requestToken matches our token. When the requestToken does not match,
     * the message wasn't intended for us so we just ignore it.
     */
    var handleHandshakeResponse = function(message) {
        if (message.handshake.requestToken === handshake.requestToken) {
            handshake.authToken = message.handshake.authToken;
            handshake.config = message.handshake.config;

            if (pendingOnReady) {
                self.notifyOnReady();
            }
        }
    };

    /*
     * Send a HANDSHAKE_REQUEST message.
     */
    var requestHandshake = function() {
        var handshakeRequest = new SimCapiMessage({
            type: SimCapiMessage.TYPES.HANDSHAKE_REQUEST,
            handshake: handshake
        });

        self.sendMessage(handshakeRequest);
    };

    /*
     * Send an ON_READY message to the viewer.
     */
    this.notifyOnReady = function() {
        if (!handshake.authToken) {
            pendingOnReady = true;

            // once everything is ready, we request and handshake from the viewer.
            requestHandshake();

        } else {
            var onReadyMsg = new SimCapiMessage({
                type: SimCapiMessage.TYPES.ON_READY,
                handshake: handshake
            });

            // send the message to the viewer
            self.sendMessage(onReadyMsg);
            pendingOnReady = false;

            // send initial value snapshot
            self.notifyValueChange();
        }
    };

    /*
     * Send a VALUE_CHANGE message to the viewer with a dump of the model.
     */
    this.notifyValueChange = function() {

      if (handshake.authToken) {

        //retrieve the VALUE_CHANGE message
        
        var valueChangeMsg = new SimCapiMessage({
            type : SimCapiMessage.TYPES.VALUE_CHANGE,
            handshake : this.getHandshake()
        });

        // populate the message with the values of the entire model
        _.each(outgoingMap, function(simCapiValue, attrName) {
            
            valueChangeMsg.values[attrName] = simCapiValue;
        });

        // send the message to the viewer
        self.sendMessage(valueChangeMsg);            
        return valueChangeMsg;            
      }
      return null;
    };

    this.setValue = function(attrName, simCapiValue){
      outgoingMap[attrName] = simCapiValue;

      this.notifyValueChange();
    };

    this.updateValue = function(attrName, value){
      if(outgoingMap[attrName]){
        outgoingMap[attrName].value = value;
      }
      else{
        throw new Error('Can not use updateValue');
      }

      this.notifyValueChange();
    };

    // Helper to send message to viewer
    this.sendMessage = function(message) {
        // window.parent can be itself if it's not inside an iframe
        if (window !== window.parent) {
            window.parent.postMessage(JSON.stringify(message), '*');
        }
    };

    // Returns the initial configuration passed in the handshake
    this.getConfig = function() {
        return handshake.config;
    };


    // handler for postMessages received from the viewer
    var messageEventHandler = function(event) {
        var message = JSON.parse(event.data);
        self.capiMessageHandler(message);
    };

    // we have to wait until the dom is ready to attach anything or sometimes the js files
    // haven't finished loading and crap happens.
    $(document).ready(function() {
        // attach event listener for messages received from the viewer
        window.addEventListener('message', messageEventHandler);
    });
};



var _instance = null;
var getInstance = function(options){
  if(!_instance){
    _instance = new SimCapi(options);
  }

  return _instance;
};

// in reality, we want a singleton but not for testing.
return {
  getInstance: getInstance,
  SimCapi: SimCapi
};
});
