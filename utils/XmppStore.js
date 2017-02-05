import XMPP from './CallbackHandler';
const DOMAIN = "yj-dev.dhis2.org";

import {observable} from 'mobx';
import autobind from 'autobind';
import {AsyncStorage, AppState, Vibration,Alert} from 'react-native';
import { Actions } from 'react-native-mobx';
import { sendPush } from './PushUtils'
import { fetchInterpretation } from './DhisUtils';
var btoa = require('Base64').btoa;
var dateFormat = require('dateformat');

@autobind
class XmppStore {
    @observable logged = false;
    @observable loading = false;
    @observable loginError = null;
    @observable error = null;
    @observable conversation = {};
    @observable roster = [];
    @observable multiUserChat = [];
    @observable remote = '';
    @observable currentInterpretation = '';
    @observable mucConversation = [];
    @observable group = false;
    @observable mucRemote = [];
    @observable newMucParticipants = [];
    @observable activeApp  = true;
    @observable sendFileError = null;
    @observable currentFileSent = true;
    @observable unSeenNotifications = {Chats: [],Groups: [],Interpretations: []};
    @observable remoteOnline = false;
    @observable offlineMode = false;
    @observable interpretations = {};
    @observable lastActive = null;
    @observable interpratationHasMuc = false;
    @observable drawerOpen = false;
    @observable logginIn = false;



  constructor() {
        XMPP.on('loginError', this.onLoginError);
        XMPP.on('error', this.onError);
        XMPP.on('disconnect', this.onDisconnect);
        XMPP.on('login', this.onLogin);
        XMPP.on('message', this.onReceiveMessage);
        XMPP.on('roster', this.onFetchedRoster);
        XMPP.on('allMucs',this.onAllMucsFetched);
        XMPP.on('mucMessage',this.onMucMessage);
        XMPP.on('mucInvitation', this.MucInvitationReceived);
        XMPP.on('fileTransfer', this.fileTransferMessage);
        XMPP.on('fileReceived', this.fileReceived);
        XMPP.on('userAdded', this.onUserAdded);
        XMPP.on('occupants', this.onOccupantsFetched);


        AppState.addEventListener('change', this.isAppActive.bind(this));

        // default values
        this.username = '';
        this.password = '';
        this.remote = '';
        this.mucUsername = '';
        this.currentInterpretation = '';
        this.savedData = {};
        this.retryPicture = null;
        this.createInterpretationMuc = false;
        this.mucSubject = null;
        this.remoteMuc = [];
        this.conversation={};
        this.selfDisconnect = false;
    }

  saveInterpretation(interpretation){
    if( !this.interpretations[interpretation.url] ){
      this.interpretations = Object.assign({}, this.interpretations, {[interpretation.url]: {id: interpretation.id, name: interpretation.name,
        text: interpretation.text, comments: [], imageURL: interpretation.imageURL, conversationName: interpretation.conversationName}});
    }
    this.setCurrentInterpretation(this.interpretations[interpretation.url]);
  }

  updateInterpretationComments(comments, url) {
    if(this.interpretations[url]) {
      this.interpretations[url].comments = this.interpretations[url].comments.concat(comments);
    }
  }

  fileTransferMessage(message){
    if(message === 'SUCCESS'){
      this.currentFileSent = true;
      this.sendFileError = null;

      if(!this.retryPicture){
        this.conversation[this.remote].chat[0].sent = true;
      }else{
          let chatArray = this.conversation[this.remote].chat;
        for(let i = 0; i < chatArray.length; i++){
          if(chatArray[i].text === this.retryPicture){
            this.conversation[this.remote].chat[i].sent = true;
            this.retryPicture = null;
            break;
          }
        }
      }
      this.savedData = Object.assign({}, this.savedData, {conversation: this.conversation});
      this.saveState(JSON.stringify(this.savedData));
    }
    else{
      this.retryPicture = null;
      this.currentFileSent = false;
      this.sendFileError = message;

    }
  }

  fileReceived({from, uri}){
    const from_name = from.split("/")[0];
    let date = new Date();
    if( !this.conversation[from_name] ) {
      this.conversation = Object.assign({}, this.conversation, {[from_name]: {chat: [{own:false, text:uri, date: dateFormat(date, "dd.mmm.yyyy"), time: dateFormat(date, "HH:MM"),image: true, sent: true}]}});
    } else {
      this.conversation[from_name].chat.unshift({own: false, text: uri,date: dateFormat(date, "dd.mmm.yyyy"), time: dateFormat(date, "HH:MM"), image: true, sent:true})
    }
    this.savedData = Object.assign({}, this.savedData, {conversation: this.conversation});
    this.saveState(JSON.stringify(this.savedData));
    if(!this.activeApp){
      sendPush('Chat',from.split("@")[0], "Sent you a picture", from_name, uri);
      Vibration.vibrate([0, 500, 200, 500], false);
    }
    if(this.remote !== from_name){
      this.unSeenNotifications.Chats.push(from_name);
      Vibration.vibrate([0, 200, 0, 0], false);
    }
  }
  sentFileinChat(image){
    let date = new Date();
    if( !this.conversation[this.remote] ) {
      this.conversation = Object.assign({}, this.conversation, {[this.remote]: {chat: [{own:true, text:image, date: dateFormat(date, "dd.mmm.yyyy"), time: dateFormat(date, "HH:MM"), image: true, sent: false}]}});
    } else {
      this.conversation[this.remote].chat.unshift({own: true, text: image, date: dateFormat(date, "dd.mmm.yyyy"), time: dateFormat(date, "HH:MM"), image: true, sent:false})
    }

  }

    isAppActive(appState){
      if(appState === 'background'){
        this.activeApp = false;
        this.savedData = Object.assign({}, this.savedData, {lastActive: new Date()})
        this.saveState( JSON.stringify(this.savedData));
      }
      if(appState === 'active'){
        this.activeApp = true;
        AsyncStorage.getItem(this._userForName(this.username)).then((value) => {
          if(value !== null)this.lastActive = JSON.parse(value).lastActive;
        }).catch((error) => {console.log(error)});
      }
    }
    getSavedData(){
      AsyncStorage.getItem(this._userForName(this.username)).then((value) => {
        if(value != null) {
          this.savedData = JSON.parse(value);

          this.conversation = JSON.parse(value).conversation ? JSON.parse(value).conversation : {};
          this.lastActive = JSON.parse(value).lastActive ? JSON.parse(value).lastActive : new Date();

        }else {
          this.savedData = {};
          this.conversation = {};
          this.lastActive = new Date()
        }
      }).catch(error => Alert.alert('Error',error));
    }


  _userForName(name){
    return name + '@' + DOMAIN;
  }

  setCurrentInterpretation(interpretation){
    this.currentInterpretation = interpretation;
  }

  fetchInterpretationForMuc(url, conversation){
    this.setCurrentInterpretation('');
    fetchInterpretation(url, conversation);
  }

  setRemote(remote, group, fullMucRemote){
    this.remote = remote;
    this.group = group;
    this.mucRemote = fullMucRemote;
    this.isRemoteOnline();
  }
  onUserAdded(props){
    this.getOccupants(props[1]);
  }
  onOccupantsFetched( occupants ){
    console.log("inni onOccupantsFetched: " + occupants);
    this.mucRemote[4] = occupants;

    for(let i = 0; i < this.multiUserChat.length; i++){
      if(this.multiUserChat[i][0] === this.mucRemote[0]){
        this.multiUserChat[i][4] = occupants;
        this.multiUserChat[i][3] = occupants.length;
        break;
      }
    }
  }

  createConversationObject(remote, own, message) {
    let date = new Date();

    this.conversation = Object.assign({}, this.conversation, {[remote]: {chat: [{own:own, text:message, date: dateFormat(date, "dd.mmm.yyyy"), time: dateFormat(date, "HH:MM") }]}});
  }


  sendMessage(message, group){
    let date = new Date();
    if(!group) {
      if( !this.remote || !this.remote.trim() ) {
        console.error("No remote username is defined");
      }
      if( !message || !message.trim() ) {
        return false;
      }
      if( !this.conversation[this.remote] ) {
        this.createConversationObject(this.remote, true, message);
      } else {
        this.conversation[this.remote].chat.unshift({own: true, text: message, date: dateFormat(date, "dd.mmm.yyyy"), time: dateFormat(date, "HH:MM")})
      }
      // empty sent message
      this.error = null;
      // send to XMPP server
      XMPP.message(message.trim(), this.remote);
      this.savedData = Object.assign({}, this.savedData, {conversation: this.conversation});
      this.saveState(JSON.stringify(this.savedData));
    }
    else{
      XMPP.sendMucMessage(message, this.mucRemote[1]);
    }
  }

  onReceiveMessage({from, body}){
    let date = new Date();
    if (!from || !body){
      return;
    }

    const from_name = from.split("/")[0];


    if( !this.conversation[from_name] ) {
      this.createConversationObject(from_name, false, body);
    }else{
      this.conversation[from_name].chat.unshift({own:false, text:body, date: dateFormat(date, "dd.mmm.yyyy"), time: dateFormat(date, "HH:MM") }) //Date er en foreløpig løsning..
    }
    this.savedData = Object.assign({}, this.savedData, {conversation: this.conversation})
    this.saveState(JSON.stringify(this.savedData));

    if(!this.activeApp) {
      sendPush('Chat', from.split("@")[0], body, from_name);
      Vibration.vibrate([0, 500, 200, 500], false);
    }
    if(this.remote !== from_name){
      this.unSeenNotifications.Chats.push(from_name);
      Vibration.vibrate([0, 200, 0, 0], false);
    }
  }

  onLoginError(){
    this.logginIn = false;
    this.loading = false;
    this.loginError = "Cannot authenticate, please use correct local username";
  }

  onFetchedRoster(rosterList){
    this.roster =  rosterList;
    this.isRemoteOnline();
  }

  isRemoteOnline(){
    if(this.remote !== '' && this.roster[this.remote]) {
      this.remoteOnline =  this.roster[this.remote].presence === 'Online' || this.roster[this.remote].presence === 'available';
    }
  }

  onError(message){
    this.error = message;
  }

  onDisconnect(message){
    //this.logged = false;
  }

  onLogin(){
    this.logginIn = true;
    this.loading = false;
    this.loginError = null;
    this.logged = true;
    this.getAllJoinedMucs(this.mucUsername);

    Actions.tabbar();
  }


  login({username, password}){
    if(!this.logginIn) {
      this.logginIn = true;
      this.username = username;
      this.mucUsername = this._userForName(username) + "/DHISCHAT";
      this.password = password;
      if( !username || !username.trim() ) {
        this.loginError = "Username should not be empty";
      } else if( !password || !password.trim() ) {
        this.loginError = "Password should not be empty";
      } else {
        this.loginError = null;

        XMPP.trustHosts(['1x-193-157-251-127.uio.no', '1x-193-157-200-122.uio.no', '1x-193-157-188-65.uio.no', 'yj-dev.dhis2.org'])
        // try to login to test domain with the same password as username
        XMPP.connect(this._userForName(this.username), this.password, "", DOMAIN, 5222);
        this.loading = true

        this.getSavedData()
      }
    }
  }

  getAllMuc(){
    XMPP.getAllMuc()
  }

  fetchRoster() {
    XMPP.fetchRoster();
  }

  disconnect() {
    this.logginIn = false;
    XMPP.disconnect();
    Actions.chatTab();
    this.savedData = Object.assign({}, this.savedData, {lastActive: new Date()});
    this.saveState(JSON.stringify(this.savedData));
    this.logged = false;
  }

  createConference(chatName, subject, participants, from) {
    this.remoteMuc = [];
    this.setRemote(chatName.toLowerCase(),true,[chatName,chatName+'@conference.' +DOMAIN,subject, participants.length, participants])
    this.multiUserChat = this.multiUserChat.concat([[chatName.toLowerCase(), chatName+'@conference.' +DOMAIN, subject, participants.length, participants]]);
    XMPP.createConference(chatName.toLowerCase(), subject, participants, from);
    this.newMucParticipants = []
    if(subject){
      this.interpretations[subject].conversationName = chatName;
      this.setCurrentInterpretation(this.interpretations[subject]);
      this.remoteMuc.push(chatName);
      this.remoteMuc.push(chatName+'@conference.' +DOMAIN);
      this.remoteMuc.push(subject);
    }
  }

  getAllJoinedMucs(username){
    XMPP.getAllJoinedMucs(username);
  }

  onAllMucsFetched(allMucs){
    this.multiUserChat = allMucs;

    this.multiUserChat.map((current) => {
      if(current[2])
        this.fetchInterpretationForMuc(current[2], current[0]);
    });
  }

  MucInvitationReceived(props){
    let name = props.from.split("@")[0];
    this.multiUserChat = this.multiUserChat.concat([[name, props.from, props.subject, props.occupants.length,props.occupants ]]);
    if(!this.activeApp){
      sendPush('Conference - invite', name, 'You have been added to a conference called: ' + name, props.from);
      Vibration.vibrate([0, 500, 200, 500], false);
    }
    else{
      this.unSeenNotifications.Groups.push(props.from);
      Vibration.vibrate([0, 200, 0, 0], false);
    }

    this.multiUserChat.map((current) => {
      if(current[2])
        this.fetchInterpretationForMuc(current[2], current[0]);
    });
  }

  joinMuc(roomId){
    XMPP.joinMuc(roomId);
  }

  onMucMessage({time,from, message}){
    if (!from || !message){
      return;
    }
    let date = time !== null ? Date.parse(time) : new Date();
    let muc = from.split("@")[0];
    let from_name = from.split("/")[1];

    let own = from_name === this.username || from_name === this._userForName(this.username);

    if(!this.mucConversation[muc]){
      this.mucConversation = Object.assign({}, this.mucConversation, {[muc]: {chat: [{own:own, text: message, from: from_name, date: dateFormat(date, "dd.mmm.yyyy"), time: dateFormat(date, "HH:MM")}]}});
    }
    else {
      this.mucConversation[muc].chat.unshift({own: own, text: message, from: from_name, date: dateFormat(date, "dd.mmm.yyyy"), time: dateFormat(date, "HH:MM")});
    }

    if(!this.activeApp){
      sendPush('Conference', from_name, message, from);
      Vibration.vibrate([0, 500, 200, 500], false);
    }

    let timeDate = Date.parse(time);

    if(this.remote !== muc && (Date.parse(time) > Date.parse(this.lastActive) || time === null)){
      this.unSeenNotifications.Groups.push(muc);
      Vibration.vibrate([0, 200, 0, 0], false);
    }


  }

  addUserToGroup(username, groupId, subject ){
    XMPP.addUserToGroup(username,groupId,subject)

  }
  getOccupants(roomId){
    XMPP.getOccupants(roomId)
  }


  fileTransfer(uri) { 
    XMPP.fileTransfer(uri, this.remote);
   }

  settingOfflineMode(isOffline){
    this.offlineMode = isOffline;
    this.saveState(JSON.stringify(Object.assign({}, this.savedData, {lastActive: new Date()})));

    isOffline ? XMPP.goOffline() : XMPP.goOnline();

  }

  async saveState(state) {
    try {
      await AsyncStorage.setItem(this._userForName(this.username), state);
    } catch( error ) {
      Alert.alert('AsyncStorage error: ', error.message);
    }
  }


}

export default new XmppStore();
