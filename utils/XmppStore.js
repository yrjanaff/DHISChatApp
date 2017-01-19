import XMPP from './CallbackHandler';
//const DOMAIN = "1x-193-157-182-210.uio.no";
const DOMAIN = "yj-dev.dhis2.org";

import {observable} from 'mobx';
import autobind from 'autobind';
import {AsyncStorage, AppState} from 'react-native';
import { Actions } from 'react-native-mobx';
import { sendPush } from './PushUtils'

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


    constructor() {
        XMPP.on('loginError', this.onLoginError);
        XMPP.on('error', this.onError);
        XMPP.on('disconnect', this.onDisconnect);
        XMPP.on('login', this.onLogin);
        XMPP.on('message', this.onReceiveMessage);
        XMPP.on('roster', this.onFetchedRoster);
        XMPP.on('presenceChanged', this.onPresenceChanged)
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
        
    }
  
  
  fileTransferMessage(message){
    if(message === 'SUCCESS'){
      console.log("SETTER TIL TRUE");
      this.currentFileSent = true;
      this.sendFileError = null;
      AsyncStorage.setItem(this._userForName(this.username), JSON.stringify(Object.assign({}, this.savedData, {conversation: this.conversation})));
    }
    else{
      this.currentFileSent = false;
      this.sendFileError = message;
    }
  }
  
  fileReceived({from, uri}){
    const from_name = from.split("/")[0];
    console.log(from);
    if( !this.conversation[from_name] ) {
      this.conversation = Object.assign({}, this.conversation, {[from_name]: {chat: [{own:false, text:uri, date: new Date(), image: true}]}});
    } else {
      this.conversation[from_name].chat.unshift({own: false, text: uri, date: new Date(), image: true})
    }
    AsyncStorage.setItem(this._userForName(this.username), JSON.stringify(Object.assign({}, this.savedData, {conversation: this.conversation})));
  }
  
  sentFileinChat(image){
    if( !this.conversation[this.remote] ) {
      this.conversation = Object.assign({}, this.conversation, {[this.remote]: {chat: [{own:true, text:image, date: new Date(), image: true}]}});
    } else {
      this.conversation[this.remote].chat.unshift({own: true, text: image, date: new Date(), image: true})
    }
    
  }

    isAppActive(appState){
      console.log("nå skifter jeg, går i" + appState)
      if(appState === 'background'){
        this.activeApp = false;
      }
      if(appState === 'active'){
        this.activeApp = true;
      }
    }
    getSavedData(){
      AsyncStorage.getItem(this._userForName(this.username)).then((value) => {
        if(value != null) {
          this.savedData = JSON.parse(value);
          this.conversation = JSON.parse(value).conversation;
        }else {
          this.conversation = {};
        }
      });
    }


  _userForName(name){
    return name + '@' + DOMAIN;
  }

  setCurrentInterpretation(interpretation){
    this.currentInterpretation = interpretation;
  }

  setRemote(remote, group, fullMucRemote){
    this.remote = remote;
    this.group = group;
    this.mucRemote = fullMucRemote;
  }

  createConversationObject(remote, own, message) {
    this.conversation = Object.assign({}, this.conversation, {[remote]: {chat: [{own:own, text:message, date: new Date() }]}});
  }


  sendMessage(message, group){
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
    }
  }

  onLoginError(){
    this.loading = false;
    this.loginError = "Cannot authenticate, please use correct local username";
  }

  onFetchedRoster(rosterList){
    this.roster =  rosterList;
  }

  onError(message){
    this.error = message;
  }

  onDisconnect(message){
    Actions.chat()
  }

  onLogin(){
    this.loading = false;
    this.loginError = null;
    this.logged = true;
    this.getAllJoinedMucs(this.mucUsername);
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
  }

  createConference(chatName, subject, description, participants, from) {
    console.log('conference is being created');
    this.multiUserChat = this.multiUserChat.concat([[chatName, chatName+'@conference.' +DOMAIN, subject, participants.length]]);
    XMPP.createConference(chatName, subject, description, participants, from);
  }

  getAllJoinedMucs(username){
    XMPP.getAllJoinedMucs(username);
  }

  onAllMucsFetched(allMucs){
    this.multiUserChat = allMucs;
  }

  MucInvitationReceived(props){
    let name = props.from.split("@")[0];
    this.multiUserChat = this.multiUserChat.concat([[name, props.from, props.subject, props.occupants.length]]);
    if(!this.activeApp){
      sendPush('Conference - invite', name, 'You have been added to a conference called: ' + name, props.from);
    }
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

    let own = from_name === this._userForName(this.username);

    if(!this.mucConversation[muc]){
      this.mucConversation = Object.assign({}, this.mucConversation, {[muc]: {chat: [{own:own, text: message, from: from_name, date: date}]}});
    }
    else {
      this.mucConversation[muc].chat.unshift({own: own, text: message, from: from_name, date: date});
    }
    if(!this.activeApp){
      sendPush('Conference', from_name, message, from);
    }

  }

  fileTransfer(uri) {   console.log(XMPP.fileTransfer(uri, this.remote)); }



}

export default new XmppStore();
