import React from 'react';
import {View, Text, TouchableHighlight, ScrollView}  from 'react-native';
import styles from './styles';
import xmpp from '../utils/XmppStore';
import {Actions} from 'react-native-mobx';
var dateFormat = require('dateformat');


export default class Chats extends React.Component {

  sortArray( array ) {
    return array.sort(function( a, b ) {
      var nameA = Date.parse(xmpp.conversation[a].chat[0].fullDate);
      var nameB = Date.parse(xmpp.conversation[b].chat[0].fullDate);
      return nameB - nameA;
    });
  }

  sortRecentConversations( conversationsList, people ) {
    for( let remote in conversationsList ) {
      people.push(remote);
    }
    return this.sortArray(people);
  }

  constructor( props ) {
    super(props);
    this.setUp(props);
    xmpp.remote = '';
  }

  componentWillReceiveProps( props ) {
    xmpp.remote = '';
    xmpp.mucRemote = [];
  }


  setUp( props ) {
    let tempmessages = {};
    let tempPeople = [];

    tempmessages = xmpp.conversation;
    tempPeople = this.sortRecentConversations(xmpp.conversation, tempPeople);

    this.state = {
      messages: tempmessages,
      people: tempPeople,
      selectedImage: ''
    };
  }

  formatDate( date, time ) {
    let today = new Date();
    return dateFormat(today, "dd.mmm.yyyy") === date ? time : date;

  }

  prevMessage( message, image ) {
    if( image ) {
      return <Text>Sent a picture</Text>
    }
    if( message.length > 40 ) {
      const out = message.slice(0, 37).concat('...');
      return <Text>{out}</Text>;
    }
    return <Text>{message}</Text>;
  }

  prettifyUsername( username ) {
    if( xmpp.roster[username] ) {
      return xmpp.roster[username].displayName;
    }
    return username.split('@')[0];
  }

  onClick( remote ) {
    xmpp.setRemote(remote, false);
    xmpp.unSeenNotifications.Chats = xmpp.unSeenNotifications.Chats.filter(notification => notification !== remote);
    Actions.conversation();
  }

  render() {

    this.setUp(this.state);
    return (
        <View style={styles.container}>
          { this.state.people.length !== 0 ?

              <ScrollView automaticallyAdjustContentInsets={true} horizontal={false}>
                {
                  this.state.people.map(( remote ) => {
                    return (
                        <TouchableHighlight underlayColor={'#d3d3d3'} key={remote} onPress={() => this.onClick(remote)}>
                          <View
                              style={{flex:1, flexDirection: 'column', borderColor: 'lightgray', borderBottomWidth: 0.5, marginBottom: 10}}>
                            <View style={{flexDirection:'row', justifyContent: 'space-between', marginLeft: 10}}>
                              <Text
                                  style={[{fontSize: 20},{fontWeight: xmpp.unSeenNotifications.Chats.indexOf(remote) > -1 ? 'bold': 'normal' }]}>{this.prettifyUsername(remote)}</Text>
                              <Text
                                  style={styles.dateColor}>{this.formatDate(xmpp.conversation[remote].chat[0].date, xmpp.conversation[remote].chat[0].time)}</Text>
                            </View>
                            <Text style={{marginLeft:10, marginBottom: 5}}>
                              {
                                this.prevMessage(xmpp.conversation[remote].chat[0].text, xmpp.conversation[remote].chat[0].image)
                              }
                            </Text>
                          </View>
                        </TouchableHighlight>
                    );
                  })
                }
              </ScrollView> :
              <View>
                <Text style={styles.emptyResult}>No chats</Text>
                <Text style={{
                  fontSize: 16,
                  color: "#5E5E5E65",
                  textAlign: 'center',
                  marginTop: 0
                }}>press + to start a new chat</Text>
              </View>
          }
        </View>
    )
  }
}

