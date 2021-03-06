package com.xmpp.service;

import android.support.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.RCTNativeAppEventEmitter;

import org.jivesoftware.smack.packet.IQ;
import org.jivesoftware.smack.packet.Message;
import org.jivesoftware.smackx.delay.packet.DelayInformation;
import org.jivesoftware.smack.packet.Presence;
import org.jivesoftware.smack.roster.Roster;
import org.jivesoftware.smack.roster.RosterEntry;
import org.jivesoftware.smack.roster.RosterGroup;
import org.jivesoftware.smack.packet.Presence;

import com.xmpp.utils.Parser;
import android.util.Log;

import java.util.logging.Logger;

/**
 *
 * Connection Bridge between Android and JS
 */

public class XMPPCommunicationBridge implements XmppServiceListener
{
    //TAGs to send to JS
    public static final String RNXMPP_ERROR = "XMPPError";
    public static final String RNXMPP_LOGIN_ERROR = "XMPPLoginError";
    public static final String RNXMPP_MESSAGE = "XMPPMessage";
    public static final String RNXMPP_ROSTER = "XMPPRoster";
    public static final String RNXMPP_IQ = "XMPPIQ";
    public static final String RNXMPP_PRESENCE = "XMPPPresence";
    public static final String RNXMPP_CONNECT = "XMPPConnect";
    public static final String RNXMPP_DISCONNECT = "XMPPDisconnect";
    public static final String RNXMPP_LOGIN = "XMPPLogin";
    public static final String RNXMPP_MUCINVITATION = "XMPPMucInvitation";
    public static final String RNXMPP_ALLMUCS = "XMPPAllMucRooms";
    public static final String RNXMPP_PRESENCECHANGE = "XMPPPresenceChanced";
    public static final String RXMPP_ROOMJOINED = "XMPPRoomJoined";
    public static final String RXMPP_MucMessage = "XMPPMucMessage";
    public static final String RNXMPP_FILETRANSFER = "XMPPFileTransfer";
    public static final String RNXMPP_FILERECEIVED = "XMPPFileReceived";
    public static final String RNXMPP_USERADDED = "XMPPUserAddedToGroup";
    public static final String RNXMPP_OCCUPANTSFETCHED = "XMPPOCCUPANTSFETCHED";
    ReactContext reactContext;

    Logger logger = Logger.getLogger( XMPPCommunicationBridge.class.getName() );

    public XMPPCommunicationBridge( ReactContext reactContext )
    {
        this.reactContext = reactContext;
    }

    @Override
    public void onError( Exception e )
    {
        sendEvent( reactContext, RNXMPP_ERROR, e.getLocalizedMessage() );
    }

    @Override
    public void onLoginError( String errorMessage )
    {
        sendEvent( reactContext, RNXMPP_LOGIN_ERROR, errorMessage );
    }

    @Override
    public void onLoginError( Exception e )
    {
        this.onLoginError( e.getLocalizedMessage() );
    }

    @Override
    public void onMessage( Message message, String time )
    {
        WritableMap params = Arguments.createMap();
        params.putString( "body", message.getBody() );
        params.putString( "from", message.getFrom() );
        params.putString( "time", time);
        sendEvent( reactContext, RNXMPP_MESSAGE, params );
    }

    @Override
    public void onRosterReceived( Roster roster )
    {
        WritableMap rosterResponse = Arguments.createMap();
        for ( RosterEntry rosterEntry : roster.getEntries() )
        {
            WritableMap rosterProps = Arguments.createMap();

            rosterProps.putString( "username", rosterEntry.getUser() );
            rosterProps.putString( "displayName", rosterEntry.getName() );
            Presence presence = roster.getPresence( rosterEntry.getUser() );
            String status = presence.getStatus();
            if ( status == null )
            {
                status = presence.getType().name();
            }
            rosterProps.putString( "presence", status );
            rosterResponse.putMap( rosterEntry.getUser(), rosterProps );
        }
        sendEvent( reactContext, RNXMPP_ROSTER, rosterResponse );
    }

    @Override
    public void onIQ( IQ iq )
    {
        sendEvent( reactContext, RNXMPP_IQ, Parser.parse( iq.toString() ) );
    }

    @Override
    public void onConnnect( String username, String password )
    {
        WritableMap params = Arguments.createMap();
        params.putString( "username", username );
        params.putString( "password", password );
        sendEvent( reactContext, RNXMPP_CONNECT, params );
    }

    @Override
    public void onDisconnect( Exception e )
    {
        sendEvent( reactContext, RNXMPP_DISCONNECT, e.getLocalizedMessage() );
    }

    @Override
    public void onLogin( String username, String password )
    {
        WritableMap params = Arguments.createMap();
        params.putString( "username", username );
        params.putString( "password", password );
        sendEvent( reactContext, RNXMPP_LOGIN, params );
    }

    @Override
    public void onMucInvotationRecevied(Message message, String[] occupants, String reason )
    {
        WritableMap params = Arguments.createMap();
        params.putString( "subject", reason );
        params.putString( "from", message.getFrom() );
        WritableArray participants = Arguments.createArray();
        for ( String occupant : occupants )
        {
            participants.pushString( occupant );
        }
        params.putArray( "occupants", participants );
        sendEvent( reactContext, RNXMPP_MUCINVITATION, params );
    }


    @Override
    public void onAllMucFetced( WritableArray mucRooms )
    {
        sendEvent( reactContext, RNXMPP_ALLMUCS, mucRooms );
    }

    @Override
    public void onMucMessage( String body, String from, String time )
    {
        WritableMap params = Arguments.createMap();
        params.putString( "message", body );
        params.putString( "from", from );
        params.putString( "time", time );
        sendEvent( reactContext, RXMPP_MucMessage, params );
    }

    @Override
    public void onFileTransfer( String message )
    {
        sendEvent( reactContext, RNXMPP_FILETRANSFER, message );
    }

    @Override
    public void onFileRecieved( String uri, String jid )
    {
        WritableMap params = Arguments.createMap();
        params.putString( "uri", uri );
        params.putString( "from", jid );
        sendEvent( reactContext, RNXMPP_FILERECEIVED, params );
    }

    @Override
    public void onUserAddedToGroup( String added, String room )
    {
        WritableArray params = Arguments.createArray();
        params.pushString( added );
        params.pushString( room );
        sendEvent( reactContext, RNXMPP_USERADDED, params );
    }

    @Override
    public void onOccupantsFetched( WritableArray occupants )
    {
        sendEvent( reactContext, RNXMPP_OCCUPANTSFETCHED, occupants );
    }

    //Sends event from Android to JS
    void sendEvent( ReactContext reactContext, String eventName, @Nullable Object params )
    {
        reactContext
            .getJSModule( RCTNativeAppEventEmitter.class )
            .emit( eventName, params );
    }
}
