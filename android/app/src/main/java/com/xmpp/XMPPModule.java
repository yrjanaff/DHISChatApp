package com.xmpp;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;

import java.util.logging.Logger;

import com.xmpp.service.XMPPCommunicationBridge;
import com.xmpp.service.XmppServiceSmackImpl;

/**Created by Roa and Fraschetti
* All rights reserved.
**/
public class XMPPModule extends ReactContextBaseJavaModule implements com.xmpp.service.XmppService {

    public static final String MODULE_NAME = "XMPP";
    Logger logger = Logger.getLogger(XMPPModule.class.getName());
    XmppServiceSmackImpl xmppService;

    public XMPPModule(ReactApplicationContext reactContext) {
        super(reactContext);
        xmppService = new XmppServiceSmackImpl(new XMPPCommunicationBridge(reactContext));
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @Override
    @ReactMethod
    public void trustHosts(ReadableArray trustedHosts) {
        this.xmppService.trustHosts(trustedHosts);
    }

    @Override
    @ReactMethod
    public void connect(String jid, String password, String authMethod, String hostname, Integer port){
        this.xmppService.connect(jid, password, authMethod, hostname, port);
    }

    @Override
    @ReactMethod
    public void message(String text, String to, String thread){
        this.xmppService.message(text, to, thread);
    }

    @Override
    @ReactMethod
    public void presence(String to, String type) {
        this.xmppService.presence(to, type);
    }

    @Override
    @ReactMethod
    public void removeRoster(String to) {
        this.xmppService.removeRoster(to);
    }

    @Override
    @ReactMethod
    public void disconnect() {
        this.xmppService.disconnect();
    }

    @Override
    @ReactMethod
    public void fetchRoster() {
        this.xmppService.fetchRoster();
    }

    @Override
    @ReactMethod
    public void sendStanza(String stanza) {
        this.xmppService.sendStanza(stanza);
    }

    @Override
    @ReactMethod
    public void createConference(String name, String subject, String description, ReadableArray participants, String from) {
        this.xmppService.createConference(name, subject, description, participants, from);
    }

    @Override
    @ReactMethod
    public void getAllJoinedMucs(String username){ this.xmppService.getAllJoinedMucs(username);}
}
