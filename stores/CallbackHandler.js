'use strict';
var React = require('react-native');
var {NativeAppEventEmitter, NativeModules, AsyncStorage} = React;
var XMPPModule = NativeModules.XMPP;

var map = {
  'message' : 'XMPPMessage',
  'iq': 'XMPPIQ',
  'presence': 'XMPPPresence',
  'connect': 'XMPPConnect',
  'disconnect': 'XMPPDisconnect',
  'error': 'XMPPError',
  'loginError': 'XMPPLoginError',
  'login': 'XMPPLogin',
  'roster': 'XMPPRoster',
  'mucInvitation': 'XMPPMucInvitation'
}

const LOG = (message) => {
  if (__DEV__) {
    console.log('react-native-xmpp: ' + message);
  }
}

class XMPP{

  constructor(){
    this.isConnected = false;
    this.isLogged = false;
    this.listeners = [
        NativeAppEventEmitter.addListener(map.connect, this.onConnected.bind(this)),
        NativeAppEventEmitter.addListener(map.disconnect, this.onDisconnected.bind(this)),
        NativeAppEventEmitter.addListener(map.error, this.onError.bind(this)),
        NativeAppEventEmitter.addListener(map.loginError, this.onLoginError.bind(this)),
        NativeAppEventEmitter.addListener(map.login, this.onLogin.bind(this)),
        NativeAppEventEmitter.addListener(map.roster, this.onFetchedRoster.bind(this)),
        NativeAppEventEmitter.addListener(map.roster, this.onMucInvitationReceived.bind(this))
    ];
  }

  onConnected(){
    LOG("Connected");
    this.isConnected = true;
  }

  onLogin(props){
    AsyncStorage.setItem("userCredentials", JSON.stringify(props));
    LOG("Login");
    console.log(props);
    this.isLogged = true;
  }

  onDisconnected(error){
    LOG("Disconnected, error: "+error);
    this.isConnected = false;
    this.isLogged = false;
  }

  onError(text){
    LOG("Error: "+text);
  }

  onLoginError(text){
    this.isLogged = false;
    LOG("LoginError: "+text);
  }

  onFetchedRoster(props){
    console.log("Roster fetched");
    console.log(props);
  }

  on(type, callback){
    if (map[type]){
      const listener = NativeAppEventEmitter.addListener(map[type], callback);
      this.listeners.push(listener);
      return listener;
    } else {
      throw "No registered type: " + type;
    }
  }

  removeListener(type) {
    if (map[type]) {
      for (var i = 0; i < this.listeners.length; i++) {
        var listener = this.listeners[i];
        if (listener.eventType === map[type]) {
          listener.remove();
          var index = this.listeners.indexOf(listener);
          if (index > -1) {
            this.listeners.splice(index, 1);
          }
          LOG(`Event listener of type "${type}" removed`);
        }
      }
    }
  }

  removeListeners() {
    for (var i = 0; i < this.listeners.length; i++) {
      this.listeners[i].remove();
    }
    this.listeners = [];
    LOG('All event listeners removed');
  }

  trustHosts(hosts){
    XMPPModule.trustHosts(hosts);
  }

  connect(username, password, auth = XMPP.SCRAMSHA1, hostname, port = 5222){
    XMPPModule.connect(username, password, auth, hostname, port);
  }

  message(text, user, thread = null){
    LOG(`Message: "${text}" being sent to user: ${user}`);
    XMPPModule.message(text, user, thread);
  }

  sendStanza(stanza){
    XMPPModule.sendStanza(stanza);
  }

  fetchRoster(){
    XMPPModule.fetchRoster();
  }

  presence(to, type){
    XMPPModule.presence(to, type);
  }

  removeFromRoster(to){
    XMPPModule.removeRoster(to);
  }

  disconnect(){
    if (this.isConnected){
      XMPPModule.disconnect();
    }
  }

  createConference(chatName, subject, description, participants, from) {
    console.log('conference is being created');
    XMPPModule.createConference(chatName, subject, description, participants, from);
  }

  onMucInvitationReceived(props) {
    console.log("inne i onReveieved MUC");
    console.log(props);
  }
}

module.exports = new XMPP();
