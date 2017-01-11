package com.xmpp.service;

import com.facebook.react.bridge.ReadableArray;

import org.jivesoftware.smack.ConnectionConfiguration;
import org.jivesoftware.smack.ConnectionListener;
import org.jivesoftware.smack.SmackException;
import org.jivesoftware.smack.StanzaListener;
import org.jivesoftware.smack.XMPPConnection;
import org.jivesoftware.smack.XMPPException;
import org.jivesoftware.smack.chat.Chat;
import org.jivesoftware.smack.chat.ChatManager;
import org.jivesoftware.smack.chat.ChatManagerListener;
import org.jivesoftware.smack.chat.ChatMessageListener;
import org.jivesoftware.smack.filter.StanzaTypeFilter;
import org.jivesoftware.smack.packet.IQ;
import org.jivesoftware.smack.packet.Message;
import org.jivesoftware.smack.packet.Presence;
import org.jivesoftware.smack.packet.Stanza;
import org.jivesoftware.smack.roster.Roster;
import org.jivesoftware.smack.roster.RosterEntry;
import org.jivesoftware.smack.roster.RosterLoadedListener;
import org.jivesoftware.smack.sasl.SASLErrorException;
import org.jivesoftware.smack.tcp.XMPPTCPConnection;
import org.jivesoftware.smack.tcp.XMPPTCPConnectionConfiguration;
import org.jivesoftware.smack.util.XmlStringBuilder;
import org.jivesoftware.smackx.muc.MultiUserChat;
import org.jivesoftware.smackx.muc.MultiUserChatManager;
import org.jivesoftware.smackx.xdata.Form;
import org.jivesoftware.smackx.muc.InvitationListener;
import org.jivesoftware.smackx.muc.InvitationRejectionListener;
import org.jivesoftware.smack.*;

import android.os.AsyncTask;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import android.util.Log;
import com.facebook.react.bridge.WritableArray;

//import com.project.rnxmpp.ssl.DisabledSSLContext;
import com.xmpp.ssl.UnsafeSSLContext;
import com.xmpp.utils.Parser;


/**
 * Created by Kristian Frølund on 7/19/16.
 * Copyright (c) 2016. Teletronics. All rights reserved
 */

public class XmppServiceSmackImpl implements XmppService, ChatManagerListener, StanzaListener, ConnectionListener, ChatMessageListener, RosterLoadedListener, InvitationListener  {
    XmppServiceListener xmppServiceListener;
    Logger logger = Logger.getLogger(XmppServiceSmackImpl.class.getName());

    XMPPTCPConnection connection;
    Roster roster;
    List<String> trustedHosts = new ArrayList<>();
    String password;

    public XmppServiceSmackImpl(XmppServiceListener xmppServiceListener) {
        this.xmppServiceListener = xmppServiceListener;
    }

    @Override
    public void trustHosts(ReadableArray trustedHosts) {
        logger.info("Inside trustHost in XmppServiceSmack");
        for(int i = 0; i < trustedHosts.size(); i++){
            this.trustedHosts.add(trustedHosts.getString(i));
        }
    }

    @Override
    public void connect(String jid, String password, String authMethod, String hostname, Integer port) {
        logger.info("Inside connect in XmppServiceSmack");
        Log.d("ServiceImpl", "Inne i connect!! Jippi!!! :D");
        final String[] jidParts = jid.split("@");
        String[] serviceNameParts = jidParts[1].split("/");
        String serviceName = serviceNameParts[0];

       this.password = password;
        //  Se på connectionConfig for unødvendig kode

        XMPPTCPConnectionConfiguration.Builder confBuilder = XMPPTCPConnectionConfiguration.builder()
            .setServiceName(serviceName)
            .setUsernameAndPassword(jidParts[0], password)
            .setConnectTimeout(3000)
            //.setDebuggerEnabled(true)
            .setSecurityMode(ConnectionConfiguration.SecurityMode.disabled); //required

        if (serviceNameParts.length>1){
            confBuilder.setResource(serviceNameParts[1]);
        } else {
            confBuilder.setResource(Long.toHexString(Double.doubleToLongBits(Math.random())));
        }
        if (hostname != null){
            confBuilder.setHost(hostname);
        }
        if (port != null){
            confBuilder.setPort(port);
        }
        logger.info(trustedHosts.toString());
        if (trustedHosts.contains(hostname) || (hostname == null && trustedHosts.contains(serviceName))){
            logger.info("trustedhost IF");
            confBuilder.setCustomSSLContext(UnsafeSSLContext.INSTANCE.getContext());
        }
        //Remove in production! This disables SSL Verification
        /*if (!trustedHosts.contains(hostname)){
            confBuilder.setCustomSSLContext(DisabledSSLContext.INSTANCE.getContext());
        }*/
        XMPPTCPConnectionConfiguration connectionConfiguration = confBuilder.build();
        logger.info("ConnectBuilder");
        logger.info(connectionConfiguration.toString());
        connection = new XMPPTCPConnection(connectionConfiguration);

        connection.addAsyncStanzaListener(this, new StanzaTypeFilter(IQ.class));
        connection.addConnectionListener(this);

        logger.info(connection.toString());

        ChatManager.getInstanceFor(connection).addChatListener(this);

        MultiUserChatManager.getInstanceFor(connection).addInvitationListener(this);
        roster = Roster.getInstanceFor(connection);
        roster.addRosterLoadedListener(this);

        new AsyncTask<Void, Void, Void>() {

            @Override
            protected Void doInBackground(Void... params) {
                try {
                    connection.connect().login();
                    logger.info("prøver å connecte");
                } catch (XMPPException | SmackException | IOException e) {
                    logger.log(Level.SEVERE, "Could not login for user " + jidParts[0], e);
                    logger.info("EXCEPTION BOOOOM " + e);
                    if (e instanceof SASLErrorException){
                        XmppServiceSmackImpl.this.xmppServiceListener.onLoginError(((SASLErrorException) e).getSASLFailure().toString());
                    }else{
                        XmppServiceSmackImpl.this.xmppServiceListener.onError(e);
                    }

                }
                return null;
            }

            @Override
            protected void onPostExecute(Void dummy) {

            }
        }.execute();
    }

    @Override
    public void message(String text, String to, String thread) {
        String chatIdentifier = (thread == null ? to : thread);

        ChatManager chatManager = ChatManager.getInstanceFor(connection);
        Chat chat = chatManager.getThreadChat(chatIdentifier);
        if (chat == null) {
            if (thread == null){
                chat = chatManager.createChat(to, this);
            }else{
                chat = chatManager.createChat(to, thread, this);
            }
        }
        try {
            chat.sendMessage(text);
        } catch (SmackException e) {
            logger.log(Level.WARNING, "Could not send message", e);
        }
    }

    @Override
    public void presence(String to, String type) {
        try {
            connection.sendStanza(new Presence(Presence.Type.fromString(type), type, 1, Presence.Mode.fromString(type)));
        } catch (SmackException.NotConnectedException e) {
            logger.log(Level.WARNING, "Could not send presence", e);
        }
    }

    @Override
    public void removeRoster(String to) {
        Roster roster = Roster.getInstanceFor(connection);
        RosterEntry rosterEntry = roster.getEntry(to);
        if (rosterEntry != null){
            try {
                roster.removeEntry(rosterEntry);
            } catch (SmackException.NotLoggedInException | SmackException.NotConnectedException | XMPPException.XMPPErrorException | SmackException.NoResponseException e) {
                logger.log(Level.WARNING, "Could not remove roster entry: " + to);
            }
        }
    }

    @Override
    public void disconnect() {
        logger.info("Inside disconnect in XmppServiceSmack");
        connection.disconnect();
    }

    @Override
    public void fetchRoster() {
        try {
            roster.reload();
        } catch (SmackException.NotLoggedInException | SmackException.NotConnectedException e) {
            logger.log(Level.WARNING, "Could not fetch roster", e);
        }
    }

    public class StanzaPacket extends org.jivesoftware.smack.packet.Stanza {
        private String xmlString;

        public StanzaPacket(String xmlString) {
            super();
            this.xmlString = xmlString;
        }

        @Override
        public XmlStringBuilder toXML() {
            XmlStringBuilder xml = new XmlStringBuilder();
            xml.append(this.xmlString);
            return xml;
        }
    }

    @Override
    public void sendStanza(String stanza) {
        StanzaPacket packet = new StanzaPacket(stanza);
        try {
            connection.sendPacket(packet);
        } catch (SmackException e) {
            logger.log(Level.WARNING, "Could not send stanza", e);
        }
    }

    @Override
    public void chatCreated(Chat chat, boolean createdLocally) {
        chat.addMessageListener(this);
    }

    @Override
    public void processPacket(Stanza packet) throws SmackException.NotConnectedException {
        this.xmppServiceListener.onIQ((IQ) packet);
    }

    @Override
    public void reconnectionFailed(Exception e) {
        logger.log(Level.WARNING, "Could not reconnect", e);

    }

    @Override
    public void reconnectingIn(int seconds) {
        logger.log(Level.INFO, "Reconnecting in {0} seconds", seconds);
    }

    @Override
    public void connected(XMPPConnection connection) {
        this.xmppServiceListener.onConnnect(connection.getUser(), password);
    }

    @Override
    public void authenticated(XMPPConnection connection, boolean resumed) {
        this.xmppServiceListener.onLogin(connection.getUser(), password);
    }

    @Override
    public void processMessage(Chat chat, Message message) {
        this.xmppServiceListener.onMessage(message);
    }

    @Override
    public void onRosterLoaded(Roster roster) {
        this.xmppServiceListener.onRosterReceived(roster);
    }

    @Override
    public void connectionClosedOnError(Exception e) {
        this.xmppServiceListener.onDisconnect(e);
    }

    @Override
    public void connectionClosed() {
        logger.log(Level.INFO, "Connection was closed.");
    }

    @Override
    public void reconnectionSuccessful() {
        logger.log(Level.INFO, "Did reconnect");
    }

    @Override
    public void invitationReceived(XMPPConnection conn, MultiUserChat room, String inviter, String reason,
        String password, Message message) {
        logger.info("Fikk ei invitation da");
        try {
            String[] tmp = connection.getUser().split("/");
            String jid = tmp[0];
            room.join(jid);

        } catch (SmackException.NoResponseException e) {
            logger.info("No response from chat server.." + e);
        } catch (XMPPException.XMPPErrorException e) {
            logger.info( "XMPP Error" + e);
        } catch (SmackException e) {
            logger.info("Something wrong with chat server.." + e);
        } catch (Exception e) {
            logger.info("Something went wrong.." + e);
        }
    }

    // NY KODE
    @Override
    public void createConference(String name, String subject, String description, ReadableArray participants, String from) {
      MultiUserChatManager manager = MultiUserChatManager.getInstanceFor(connection);
      MultiUserChat muc = manager.getMultiUserChat(name + "@conference." + connection.getServiceName());
        try {
            String[] tmp = connection.getUser().split("/");
            String jid = tmp[0];
            muc.create(jid);
            logger.info("vreated: " + jid);
            muc.changeSubject(subject);
            Form submitForm = muc.getConfigurationForm().createAnswerForm();


            submitForm.setAnswer("muc#roomconfig_publicroom", true);
            submitForm.setAnswer("muc#roomconfig_persistentroom", true);
            submitForm.setAnswer("muc#roomconfig_enablelogging", true);
            submitForm.setAnswer("muc#roomconfig_roomdesc", description);
            muc.sendConfigurationForm(submitForm);
            logger.info("Is joining room" + from);
            muc.join(from);
            logger.info("is adding invitationRejected");
            muc.addInvitationRejectionListener(new InvitationRejectionListener() {
                public void invitationDeclined(String invitee, String reason) {
                    logger.info("En invitasjon got declined: " + invitee + " and the reason is " + reason );
                }
            });

            for(int i = 0; i< participants.size(); i++)
            {
                logger.info("inviting participant: " + participants.getString(i));
                muc.invite(participants.getString(i), "Join us in a chat on " + subject);
            }

            logger.info("all OK");

        } catch (SmackException.NoResponseException e) {
            logger.info("No response from chat server.." + e);
        } catch (XMPPException.XMPPErrorException e) {
            logger.info( "XMPP Error" + e);
        } catch (SmackException e) {
            logger.info("Something wrong with chat server.." + e);
        } catch (Exception e) {
            logger.info("Something went wrong.." + e);
        }

    }

}
