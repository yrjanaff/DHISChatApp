import XMPP from './CallbackHandler';
const DOMAIN = "yj-dev.dhis2.org";

import {observable} from 'mobx';
import autobind from 'autobind';
import {AsyncStorage, AppState, Vibration} from 'react-native';
import { Actions } from 'react-native-mobx';
import { sendPush } from './PushUtils'
import { fetchInterpretation } from './DhisUtils';
var btoa = require('Base64').btoa;

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
    @observable mucRemote = '';
    @observable newMucParticipants = [];
    @observable activeApp  = true;
    @observable sendFileError = null;
    @observable currentFileSent = true;
    @observable unSeenNotifications = {Chats: [],Groups: [],Interpretations: []};
    @observable remoteOnline = false;
    @observable offlineMode = false;
    @observable interpretations = {};
    @observable lastActive = null;


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
    }

  saveInterpretation(interpretation){
    if( !this.interpretations[interpretation.url] ){
      this.interpretations = Object.assign({}, this.interpretations, {[interpretation.url]: {id: interpretation.id, name: interpretation.name,
        text: interpretation.text, comments: [], imageURL: interpretation.imageURL, conversationName: interpretation.conversationName}});
    }
  }

  updateInterpretationComments(comments, url) {
    console.log(comments);
    console.log(this.interpretations[url]);
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
      AsyncStorage.setItem(this._userForName(this.username), JSON.stringify(Object.assign({}, this.savedData, {conversation: this.conversation})));
    }
    else{
      this.retryPicture = null;
      this.currentFileSent = false;
      this.sendFileError = message;

    }
  }

  fileReceived({from, uri}){
    const from_name = from.split("/")[0];
    if( !this.conversation[from_name] ) {
      this.conversation = Object.assign({}, this.conversation, {[from_name]: {chat: [{own:false, text:uri, date: new Date(), image: true, sent: true}]}});
    } else {
      this.conversation[from_name].chat.unshift({own: false, text: uri, date: new Date(), image: true, sent:true})
    }
    AsyncStorage.setItem(this._userForName(this.username), JSON.stringify(Object.assign({}, this.savedData, {conversation: this.conversation})));
    if(!this.activeApp){
      sendPush('Chat',from.split("@")[0], "Sent you a picture", from_name, uri);
      Vibration.vibrate([0, 500, 200, 500], false);
    }else{
      this.unSeenNotifications.Chats.push(from_name);
      console.log(this.unSeenNotifications);
      Vibration.vibrate([0, 200, 0, 0], false);
    }
  }

  sentFileinChat(image){
    if( !this.conversation[this.remote] ) {
      this.conversation = Object.assign({}, this.conversation, {[this.remote]: {chat: [{own:true, text:image, date: new Date(), image: true, sent: false}]}});
    } else {
      this.conversation[this.remote].chat.unshift({own: true, text: image, date: new Date(), image: true, sent:false})
    }

  }

    isAppActive(appState){
      if(appState === 'background'){
        this.activeApp = false
        AsyncStorage.setItem(this._userForName(this.username), JSON.stringify(Object.assign({}, this.savedData, {lastActive: new Date()})));
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
          this.conversation = JSON.parse(value).conversation;
          this.lastActive = JSON.parse(value).lastActive;
        }else {
          this.conversation = {};
          this.lastActive = new Date()
        }
      });
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

  createConversationObject(remote, own, message) {
    this.conversation = Object.assign({}, this.conversation, {[remote]: {chat: [{own:own, text:message, date: new Date() }]}});
  }


  sendMessage(message, group){
    console.log(group);
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
        this.conversation[this.remote].chat.unshift({own: true, text: message, date: new Date()})
      }
      // empty sent message
      this.error = null;
      // send to XMPP server
      XMPP.message(message.trim(), this.remote)
      AsyncStorage.setItem(this._userForName(this.username), JSON.stringify(Object.assign({}, this.savedData, {conversation: this.conversation})));
    }
    else{
      console.log(this.mucRemote)
      XMPP.sendMucMessage(message, this.mucRemote);
    }
  }

  onReceiveMessage({from, body}){
    if (!from || !body){
      return;
    }

    const from_name = from.split("/")[0];


    if( !this.conversation[from_name] ) {
      this.createConversationObject(from_name, false, body);
    }else{
      this.conversation[from_name].chat.unshift({own:false, text:body, date: new Date() }) //Date er en foreløpig løsning..
    }

    AsyncStorage.setItem(this._userForName(this.username), JSON.stringify(Object.assign({}, this.savedData, {conversation: this.conversation})));

    if(!this.activeApp){
      sendPush('Chat',from.split("@")[0], body, from_name );
      Vibration.vibrate([0, 500, 200, 500], false);
    }else{
      this.unSeenNotifications.Chats.push(from_name);
      console.log(this.unSeenNotifications);
      Vibration.vibrate([0, 200, 0, 0], false);
    }
  }

  onLoginError(){
    this.loading = false;
    this.loginError = "Cannot authenticate, please use correct local username";
  }

  onFetchedRoster(rosterList){
    this.roster =  rosterList;
    this.isRemoteOnline();
  }

  isRemoteOnline(){
    if(this.remote !== ''){
      this.roster.map((person) => {
        if(person.username === this.remote){
          if(person.presence === 'Online' || person.presence === 'available'){
            this.remoteOnline = true;
          }
          else{
            this.remoteOnline = false;
          }
        }
      })
    }
  }

  onError(message){
    this.error = message;
  }

  onDisconnect(message){
    Actions.chat()
  }

  onLogin(){
    console.log("inni onLogin!!!");
    this.loading = false;
    this.loginError = null;
    this.logged = true;
    this.getAllJoinedMucs(this.mucUsername);

    Actions.tabbar();
  }


  login({username, password}){
    this.username = username;
    this.mucUsername = this._userForName(username) + "/DHISCHAT";
    this.password = password;
    if (!username || !username.trim()){
      this.loginError = "Username should not be empty";
    } else if (!password || !password.trim()){
      this.loginError = "Password should not be empty";
    } else {
      this.loginError = null;

      XMPP.trustHosts(['1x-193-157-251-127.uio.no', '1x-193-157-200-122.uio.no', 'yj-dev.dhis2.org'])
      // try to login to test domain with the same password as username
      XMPP.connect(this._userForName(this.username),this.password, "", DOMAIN, 5222);
      this.loading = true

      this.getSavedData()
    }

  }

  getAllMuc(){
    XMPP.getAllMuc()
  }

  fetchRoster() {
    XMPP.fetchRoster();
  }

  disconnect() {
    XMPP.disconnect();
    this.logged = false;
    AsyncStorage.setItem(this._userForName(this.username), JSON.stringify(Object.assign({}, this.savedData, {lastActive: new Date()})));
  }

  createConference(chatName, subject, participants, from) {

    this.setRemote(chatName.toLowerCase(),true,chatName+'@conference.' +DOMAIN)
    this.multiUserChat = this.multiUserChat.concat([[chatName.toLowerCase(), chatName+'@conference.' +DOMAIN, subject, participants.length]]);
    XMPP.createConference(chatName.toLowerCase(), subject, participants, from);
    console.log('created');
    console.log(subject);
    if(subject){
      console.log(this.interpretations[subject]);
      this.interpretations[subject].conversationName = chatName;
      this.setCurrentInterpretation(this.interpretations[subject]);
      console.log(this.interpretations[subject])
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
    console.log("fikk en mucInvitation");
    let name = props.from.split("@")[0];
    this.multiUserChat = this.multiUserChat.concat([[name, props.from, props.subject, props.occupants.length]]);
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

    let date = time !== null ? time : new Date();
    let muc = from.split("@")[0];
    let from_name = from.split("/")[1];

    let own = from_name === this.username || from_name === this._userForName(this.username);

    if(!this.mucConversation[muc]){
      this.mucConversation = Object.assign({}, this.mucConversation, {[muc]: {chat: [{own:own, text: message, from: from_name, date: date}]}});
    }
    else {
      this.mucConversation[muc].chat.unshift({own: own, text: message, from: from_name, date: date});
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


  fileTransfer(uri) { 
    XMPP.fileTransfer(uri, this.remote);
   }

  settingOfflineMode(isOffline){
    this.offlineMode = isOffline;
    AsyncStorage.setItem(this._userForName(this.username), JSON.stringify(Object.assign({}, this.savedData, {lastActive: new Date()})));

    isOffline ? XMPP.goOffline() : XMPP.goOnline();

  }




}

export default new XmppStore();
