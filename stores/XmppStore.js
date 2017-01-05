import XMPP from './CallbackHandler';
const DOMAIN = "1x-193-157-182-210.uio.no";
import {observable} from 'mobx';
import autobind from 'autobind';

@autobind
class XmppStore {
    @observable logged = false;
    @observable loading = false;
    @observable loginError = null;
    @observable error = null;
    @observable conversation = [];
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
        this.loading = false;
        this.conversation.replace([]);
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
        this.conversation.replace([]);
        this.loading = false;
        this.loginError = null;
        this.logged = true;
    }

    login({local, remote}){
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

            XMPP.trustHosts(['1x-193-157-182-210.uio.no'])
            // try to login to test domain with the same password as username
            XMPP.connect(this._userForName(this.local),this.local, "", DOMAIN, 5222);
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
