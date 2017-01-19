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
    const tmp = username.split("@");
    return tmp[0];
  }

  render() {
    this.setUp(this.state);
    {console.log(this.state.selectedImage)}
    return (
        <View style={styles.container}>

          <ScrollView  automaticallyAdjustContentInsets={true} horizontal={false} >
            {
           this.state.people.map((remote) => {
                  return (
                        <TouchableHighlight style={styles.touch} underlayColor={'#d3d3d3'} key={remote} onPress={() => {Actions.conversation(); xmpp.setRemote(remote, false)}}>
                          <View>
                            <Text style={styles.bold}>{this.prettifyUsername(remote)}</Text>
                            {
                              this.prevMessage(xmpp.conversation[remote].chat[0].text, xmpp.conversation[remote].chat[0].image)
                            }
                            <Text style={styles.dateColor}>{dateFormat(xmpp.conversation[remote].chat[0].date, "dd.mm.yyyy h:MM:ss TT")}</Text>
                          </View>
                        </TouchableHighlight>
                  );
           })
        }
          </ScrollView>
        </View>
     )
  }
}
