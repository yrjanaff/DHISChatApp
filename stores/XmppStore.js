import XMPP from './CallbackHandler';
const DOMAIN = "1x-193-157-200-122.uio.no";
import {observable} from 'mobx';
import autobind from 'autobind';

@autobind
class XmppStore {
    @observable logged = false;
    @observable loading = false;
    @observable loginError = null;
    @observable error = null;
    @observable conversation = [];
    
    constructor() {
        console.log(XMPP);
        XMPP.on('loginError', this.onLoginError);
        XMPP.on('error', this.onError);
        XMPP.on('disconnect', this.onDisconnect);
        XMPP.on('login', this.onLogin);
        XMPP.on('message', this.onReceiveMessage);
        //XMPP.on('roster', this.onFetchedRoster);
        // default values
        this.local = 'rntestuser1';
        this.remote = 'rntestuser2';
    }
    
    _userForName(name){
        return name + '@' + DOMAIN;
    }

    sendMessage(message){
        if (!this.remote || !this.remote.trim()){
            console.error("No remote username is defined");
        }
        if (!message || !message.trim()){
            return false;
        }
        // add to list of messages
        this.conversation.unshift({own:true, text:message.trim()});
        // empty sent message
        this.error = null;
        // send to XMPP server
        XMPP.message(message.trim(), this._userForName(this.remote))
    }

    onReceiveMessage({from, body}){
        console.log("onReceiveMessage")
        // extract username from XMPP UID
        if (!from || !body){
            return;
        }
        var name = from.match(/^([^@]*)@/)[1];
        this.conversation.unshift({own:false, text:body});
    }


    onLoginError(){
        console.log("Inni onLoginError!!!");
        this.loading = false;
        this.conversation.replace([]);
        this.loginError = "Cannot authenticate, please use correct local username";
    }

   /* onFetchedRoster(props){
        console.log("Inni onFetchedRoster i XMPPStore");
        console.log(props);
    }*/

    onError(message){
        console.log("inni onError!!!");
        this.error = message;
    }

    onDisconnect(message){
        this.logged = false;
        this.loginError = message;
    }

    onLogin(){
        console.log("LOGGED!");
        this.conversation.replace([]);
        this.loading = false;
        this.loginError = null;
        this.logged = true;
    }

    login({local, remote}){
        console.log("Inni XmppStore sin login");
        this.local = local;
        this.remote = remote;
        if (!local || !local.trim()){
            this.loginError = "Local username should not be empty";
        } else if (!remote || !remote.trim()){
            this.loginError = "Remote username should not be empty";
        } else if (local==remote){
            this.loginError = "Local username should not be the same as remote username";
        } else {
            this.loginError = null;

            console.log("fortsatt i login, før trustHosts");
            XMPP.trustHosts(['1x-193-157-200-122.uio.no'])
            // try to login to test domain with the same password as username
            console.log("fortatt i login, etter trusthost, før connect");
            XMPP.connect(this._userForName(this.local),this.local, "", DOMAIN, 5222);
            console.log("fortsatt inni login, etter connect");
            this.loading = true;
        }

    }

   /* fetchRoster() {
        XMPP.fetchRoster();
    }*/

    disconnect() {
        XMPP.disconnect();
    }


}

export default new XmppStore();