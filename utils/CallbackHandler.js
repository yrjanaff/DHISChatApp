'use strict';
var React = require('react-native');
var {NativeAppEventEmitter, NativeModules, AsyncStorage, Alert} = React;
var XMPPModule = NativeModules.XMPP;
import {Actions} from 'react-native-mobx';
import XmppStore from './XmppStore';

var map = {
  'message': 'XMPPMessage',
  'iq': 'XMPPIQ',
  'connect': 'XMPPConnect',
  'disconnect': 'XMPPDisconnect',
  'error': 'XMPPError',
  'loginError': 'XMPPLoginError',
  'login': 'XMPPLogin',
  'roster': 'XMPPRoster',
  'mucInvitation': 'XMPPMucInvitation',
  'allMucs': 'XMPPAllMucRooms',
  'mucMessage': 'XMPPMucMessage',
  'fileTransfer': 'XMPPFileTransfer',
  'fileReceived': 'XMPPFileReceived',
  'userAdded': 'XMPPUserAddedToGroup',
  'occupants': 'XMPPOCCUPANTSFETCHED'
}

const LOG = ( message ) => {
  if( __DEV__ ) {
    console.log('react-native-xmpp: ' + message);
  }
}

class XMPP {

  constructor() {
    this.isConnected = false;
    this.isLogged = false;
    this.disconnectMessage = false;
    this.listeners = [
      NativeAppEventEmitter.addListener(map.connect, this.onConnected.bind(this)),
      NativeAppEventEmitter.addListener(map.disconnect, this.onDisconnected.bind(this)),
      NativeAppEventEmitter.addListener(map.error, this.onError.bind(this)),
      NativeAppEventEmitter.addListener(map.loginError, this.onLoginError.bind(this)),
      NativeAppEventEmitter.addListener(map.login, this.onLogin.bind(this)),
    ];
  }

  fileTransfer( uri, remote ) {
    XMPPModule.fileTransfer(uri, remote);
  }

  onConnected() {
    LOG("Connected");
    this.isConnected = true;
  }

  onLogin( props ) {
    AsyncStorage.setItem("userCredentials", JSON.stringify(props));
    this.isLogged = true;
  }

  onDisconnected( error ) {
    LOG("Disconnected, error: " + error);

    if( !this.disconnectMessage && !XmppStore.selfDisconnect ) {
      this.disconnectMessage = true;
      XmppStore.logginIn = false;
      Alert.alert(
          'DHIS Chat',
          'Your client was disconnected. Log in again!',
          [
            {
              text: 'OK', onPress: () => {
              Actions.chatTab();
              XmppStore.savedData = Object.assign({}, XmppStore.savedData, {lastActive: new Date()});
              XmppStore.saveState(JSON.stringify(XmppStore.savedData));
              XmppStore.logged = false;
              this.disconnectMessage = false;
            }
            }
          ]
      )
    }
  }

  onError( text ) {
    LOG("Error: " + text);
    XmppStore.logginIn = false;
    Alert.alert(
        'DHIS Chat',
        'Something went wrong. Connection timeout!',
        [
          {
            text: 'OK', onPress: () => {
            Actions.chatTab();
            XmppStore.savedData = Object.assign({}, XmppStore.savedData, {lastActive: new Date()});
            XmppStore.saveState(JSON.stringify(XmppStore.savedData));
            XmppStore.logged = false;
            this.disconnectMessage = false;
            XmppStore.loading = false;
          }
          }
        ]
    )
  }

  onLoginError( text ) {
    this.isLogged = false;
    LOG("LoginError: " + text);
  }

  on( type, callback ) {
    if( map[type] ) {
      const listener = NativeAppEventEmitter.addListener(map[type], callback);
      this.listeners.push(listener);
      return listener;
    } else {
      throw "No registered type: " + type;
    }
  }

  removeListener( type ) {
    if( map[type] ) {
      for( var i = 0; i < this.listeners.length; i++ ) {
        var listener = this.listeners[i];
        if( listener.eventType === map[type] ) {
          listener.remove();
          var index = this.listeners.indexOf(listener);
          if( index > -1 ) {
            this.listeners.splice(index, 1);
          }
          LOG(`Event listener of type "${type}" removed`);
        }
      }
    }
  }

  removeListeners() {
    for( var i = 0; i < this.listeners.length; i++ ) {
      this.listeners[i].remove();
    }
    this.listeners = [];
    LOG('All event listeners removed');
  }

  trustHosts( hosts ) {
    XMPPModule.trustHosts(hosts);
  }

  connect( username, password, auth = XMPP.SCRAMSHA1, hostname, port = 5222 ) {
    XMPPModule.connect(username, password, auth, hostname, port);
  }

  message( text, user, thread = null ) {
    LOG(`Message: "${text}" being sent to user: ${user}`);
    XMPPModule.message(text, user, thread);
  }

  fetchRoster() {
    XMPPModule.fetchRoster();
  }

  disconnect() {
    if( this.isConnected ) {
      XMPPModule.disconnect();
    }
  }

  getOccupants( roomId ) {
    XMPPModule.getOccupants(roomId)
  }

  createConference( chatName, subject, participants, from ) {
    XMPPModule.createConference(chatName, subject, participants, from);
  }

  getAllJoinedMucs( username ) {
    XMPPModule.getAllJoinedMucs(username);
  }

  joinMuc( roomId ) {
    XMPPModule.joinMuc(roomId);
  }

  sendMucMessage( message, to ) {
    XMPPModule.sendMessage(message, to);
  }

  addUserToGroup( username, roomId, subject ) {
    XMPPModule.addUserToGroup(username, roomId, subject);
  }

}

module.exports = new XMPP();
