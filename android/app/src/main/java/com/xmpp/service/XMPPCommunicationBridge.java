package com.xmpp.service;

import android.support.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.RCTNativeAppEventEmitter;

import org.jivesoftware.smack.packet.IQ;
import org.jivesoftware.smack.packet.Message;
import org.jivesoftware.smack.packet.Presence;
import org.jivesoftware.smack.roster.Roster;
import org.jivesoftware.smack.roster.RosterEntry;
import org.jivesoftware.smack.roster.RosterGroup;
import org.jivesoftware.smack.packet.Presence;

import com.xmpp.utils.Parser;
import android.util.Log;

/**
 * Created by Kristian Frølund on 7/19/16.
 * Copyright (c) 2016. Teletronics. All rights reserved
 */

public class XMPPCommunicationBridge implements XmppServiceListener {

    public static final String RNXMPP_ERROR =       "XMPPError";
    public static final String RNXMPP_LOGIN_ERROR = "XMPPLoginError";
    public static final String RNXMPP_MESSAGE =     "XMPPMessage";
    public static final String RNXMPP_ROSTER =      "XMPPRoster";
    public static final String RNXMPP_IQ =          "XMPPIQ";
    public static final String RNXMPP_PRESENCE =    "XMPPPresence";
    public static final String RNXMPP_CONNECT =     "XMPPConnect";
    public static final String RNXMPP_DISCONNECT =  "XMPPDisconnect";
    public static final String RNXMPP_LOGIN =       "XMPPLogin";
    ReactContext reactContext;

    public XMPPCommunicationBridge(ReactContext reactContext) {
        this.reactContext = reactContext;
    }

    @Override
    public void onError(Exception e) {
        sendEvent(reactContext, RNXMPP_ERROR, "Hei! Du er nå i onError..."/*e.getLocalizedMessage()*/);
    }

    @Override
    public void onLoginError(String errorMessage) {
        sendEvent(reactContext, RNXMPP_LOGIN_ERROR, errorMessage);
    }

    @Override
    public void onLoginError(Exception e) {
        this.onLoginError(e.getLocalizedMessage());
    }

    @Override
    public void onMessage(Message message) {
        WritableMap params = Arguments.createMap();
        params.putString("thread", message.getThread());
        params.putString("subject", message.getSubject());
        params.putString("body", message.getBody());
        params.putString("from", message.getFrom());
        params.putString("src", message.toXML().toString());
        sendEvent(reactContext, RNXMPP_MESSAGE, params);
    }

    @Override
    public void onRosterReceived(Roster roster) {
        Log.d("ComBridge", "Inni onRosterRecieved");
        Log.d("ComBridge", roster.toString());
        WritableArray rosterResponse = Arguments.createArray();
        for (RosterEntry rosterEntry : roster.getEntries()) {
            WritableMap rosterProps = Arguments.createMap();
            Log.d("ComBridge", "RosterProps");
            Log.d("ComBridge", rosterEntry.toString());
            rosterProps.putString("username", rosterEntry.getUser());
            rosterProps.putString("displayName", rosterEntry.getName());
            Presence presence = roster.getPresence(rosterEntry.getUser());
            String status = presence.getStatus();
            if (status == null) {
                status = presence.getType().name();
            }
            rosterProps.putString("presence", status);
            rosterProps.putString("status", roster.getPresence(rosterEntry.getUser()).toString());
            WritableArray groupArray = Arguments.createArray();
            for (RosterGroup rosterGroup : rosterEntry.getGroups()) {
                groupArray.pushString(rosterGroup.getName());
            }
            rosterProps.putArray("groups", groupArray);
            rosterProps.putString("subscription", rosterEntry.getType().toString());
            rosterResponse.pushMap(rosterProps);
        }
        sendEvent(reactContext, RNXMPP_ROSTER, rosterResponse);
    }

    @Override
    public void onIQ(IQ iq) {
        sendEvent(reactContext, RNXMPP_IQ, Parser.parse(iq.toString()));
    }

    @Override
    public void onPresence(Presence presence) {
        sendEvent(reactContext, RNXMPP_PRESENCE, presence.toString());
    }

    @Override
    public void onConnnect(String username, String password) {
        WritableMap params = Arguments.createMap();
        params.putString("username", username);
        params.putString("password", password);
        sendEvent(reactContext, RNXMPP_CONNECT, params);
    }

    @Override
    public void onDisconnect(Exception e) {
        sendEvent(reactContext, RNXMPP_DISCONNECT, e.getLocalizedMessage());
    }

    @Override
    public void onLogin(String username, String password) {
        WritableMap params = Arguments.createMap();
        params.putString("username", username);
        params.putString("password", password);
        sendEvent(reactContext, RNXMPP_LOGIN, params);
    }

    void sendEvent(ReactContext reactContext, String eventName, @Nullable Object params) {
        reactContext
            .getJSModule(RCTNativeAppEventEmitter.class)
            .emit(eventName, params);
    }
}
