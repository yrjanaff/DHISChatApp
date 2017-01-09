import XMPP from './CallbackHandler';
const DOMAIN = "1x-193-157-182-210.uio.no";


import {observable} from 'mobx';
import autobind from 'autobind';
import {AsyncStorage} from 'react-native';

@autobind
class XmppStore {
    @observable logged = false;
    @observable loading = false;
    @observable loginError = null;
    @observable error = null;
    @observable conversation = {};
    @observable roster = [];

    constructor() {
        console.log(XMPP);
        XMPP.on('loginError', this.onLoginError);
        XMPP.on('error', this.onError);
        XMPP.on('disconnect', this.onDisconnect);
        XMPP.on('login', this.onLogin);
        XMPP.on('message', this.onReceiveMessage);
        XMPP.on('roster', this.onFetchedRoster);
        // default values
        this.usename = '';
        this.password = '';
        this.remote = '';

        AsyncStorage.getItem("conversation").then((value) => {
            if(value != null) {
              this.conversation = JSON.parse(value);
            }else {
              this.conversation = {};
            }
        });
    }

    _userForName(name){
        return name + '@' + DOMAIN;
    }

    setRemote(remote){
        this.remote = remote;

        if(!this.conversation[this.remote]) {
          this.conversation = Object.assign({}, this.conversation, {[this.remote]: {chat: []}});
        }
    }

    sendMessage(message){
        if (!this.remote || !this.remote.trim()){
            console.error("No remote username is defined");
        }
        if (!message || !message.trim()){
            return false;
        }

       this.conversation[this.remote].chat.unshift({own:true, text:message, date: new Date()})
        // empty sent message
        this.error = null;
        // send to XMPP server
        XMPP.message(message.trim(), this.remote)

        AsyncStorage.setItem("conversation", JSON.stringify(this.conversation));


    }

    onReceiveMessage({from, body, thread, subject, src}){
        // extract username from XMPP UID
        if (!from || !body){
            return;
        }
        var name = from.match(/^([^@]*)@/)[1];

        this.conversation[this.remote].chat.unshift({own:false, text:body, date: new Date() }) //Date er en foreløpig løsning..

        AsyncStorage.setItem("conversation", JSON.stringify(this.conversation));
    }


    onLoginError(){
        this.loading = false;
        this.loginError = "Cannot authenticate, please use correct local username";
    }

    onFetchedRoster(rosterList){
        this.roster.replace(rosterList);
    }

    onError(message){
        this.error = message;
    }

    onDisconnect(message){
        this.logged = false;
        this.loginError = message;
    }

    onLogin(){
        this.loading = false;
        this.loginError = null;
        this.logged = true;
        //this.conversation = {};
    }

    login({username, password}){
        this.username = username;
        this.password = password;
        if (!username || !username.trim()){
            this.loginError = "Username should not be empty";
        } else if (!password || !password.trim()){
            this.loginError = "Password should not be empty";
        } else {
            this.loginError = null;

            XMPP.trustHosts(['1x-193-157-182-210.uio.no', '1x-193-157-200-122.uio.no', 'yj-dev.dhis2.org'])
            // try to login to test domain with the same password as username
            XMPP.connect(this._userForName(this.username),this.password, "", DOMAIN, 5222);
            this.loading = true;
        }

    }

    fetchRoster() {
       XMPP.fetchRoster();
    }

    presence() {
        console.log("inni XMPPStore presence");
    }
    disconnect() {
        XMPP.disconnect();
    }


}

export default new XmppStore();
