import React from 'react';
import {View,Text, TouchableHighlight, ScrollView}  from 'react-native';
import styles from './styles';
import xmpp from '../utils/XmppStore';
import { Actions } from 'react-native-mobx';
var dateFormat = require('dateformat');


export default class Chats extends React.Component {

  sortArray(array) {
    return array.sort(function( a, b ) {
      var nameA = new Date(xmpp.conversation[a].chat[0].date);
      var nameB = new Date(xmpp.conversation[b].chat[0].date);
      return nameB - nameA;
    });
  }

  sortRecentConversations(conversationsList, people){
    for(let remote in conversationsList){
            people.push(remote);
    }
    return this.sortArray(people);
  }

  constructor( props ) {
    super(props);
    this.setUp(props);
  }


      setUp(props){
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

  formatDate(date){
        let thisDate = new Date(date);
        let today = new Date();

        if( today.getFullYear() === thisDate.getFullYear() &&
        today.getMonth() === thisDate.getMonth() &&
        today.getDate() === thisDate.getDate()){
          return dateFormat(thisDate, "HH:MM");
        }
        if( today.getFullYear() === thisDate.getFullYear() &&
            today.getMonth() === thisDate.getMonth()){
          return dateFormat(thisDate, "dd.mmm");
        }
        else {
          return dateFormat(thisDate, "dd.mm.yyyy");
        }
  }

  prevMessage(message, image) {
    if(image){
      return <Text>Sent a picture</Text>
    }
     if(message.length > 40){
      	const out = message.slice(0,37).concat('...');
        return <Text>{out}</Text>;
     }
     return <Text>{message}</Text>;
  }

  prettifyUsername(username) {
    if(xmpp.roster[username]){
      return xmpp.roster[username].displayName;
    }
      return username.split('@')[0];
  }

  onClick(remote){
    xmpp.setRemote(remote, false);
    xmpp.unSeenNotifications.Chats = xmpp.unSeenNotifications.Chats.filter( notification => notification !== remote);
    Actions.conversation();
  }

  render() {
    this.setUp(this.state);
    return (
        <View style={styles.container}>
          { this.state.people.length !== 0 ?

            <ScrollView  automaticallyAdjustContentInsets={true} horizontal={false} >
              {
               this.state.people.map((remote) => {
                      return (
                            <TouchableHighlight style={styles.touch} underlayColor={'#d3d3d3'} key={remote} onPress={() => this.onClick(remote)}>
                              <View>
                              <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                                <Text style={[{fontSize: 20},{fontWeight: xmpp.unSeenNotifications.Chats.indexOf(remote) > -1 ? 'bold': 'normal' }]}>{this.prettifyUsername(remote)}</Text>
                                <Text style={styles.dateColor}>{this.formatDate(xmpp.conversation[remote].chat[0].date)}</Text>
                              </View>
                                {
                                  this.prevMessage(xmpp.conversation[remote].chat[0].text, xmpp.conversation[remote].chat[0].image)
                                }
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

