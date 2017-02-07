package com.xmpp.service;

import org.jivesoftware.smack.packet.IQ;
import org.jivesoftware.smack.packet.Message;
import org.jivesoftware.smack.packet.Presence;
import org.jivesoftware.smack.roster.Roster;
import com.facebook.react.bridge.WritableArray;


/**
 * Created by Kristian Frølund on 7/19/16.
 * Copyright (c) 2016. Teletronics. All rights reserved
 */

public interface XmppServiceListener
{
    void onError( Exception e );

    void onLoginError( String errorMessage );

    void onLoginError( Exception e );

    void onMessage( Message message );

    void onRosterReceived( Roster roster );

    void onIQ( IQ iq );

    void onPresence( Presence presence );

    void onConnnect( String username, String password );

    void onDisconnect( Exception e );

    void onLogin( String username, String password );

    void onMucInvotationRecevied( String room, String inviter, Message message, String[] occupants, String reason );

    void onAllMucFetced( WritableArray mucRooms );

    void onPresenceChanged( String user, String status );

    void onJoinedMessage( WritableArray occupants, WritableArray messages );

    void onMucMessage( String body, String from, String time );

    void onFileTransfer( String message );

    void onFileRecieved( String uri, String jid );

    void onUserAddedToGroup( String username, String roomId );

    void onOccupantsFetched( WritableArray occupants );
}
