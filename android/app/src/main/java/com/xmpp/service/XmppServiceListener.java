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

    void onMessage( Message message, String date );

    void onRosterReceived( Roster roster );

    void onIQ( IQ iq );

    void onConnnect( String username, String password );

    void onDisconnect( Exception e );

    void onLogin( String username, String password );

    void onMucInvotationRecevied( Message message, String[] occupants, String reason );

    void onAllMucFetced( WritableArray mucRooms );

    void onMucMessage( String body, String from, String time );

    void onFileTransfer( String message );

    void onFileRecieved( String uri, String jid );

    void onUserAddedToGroup( String username, String roomId );

    void onOccupantsFetched( WritableArray occupants );
}
