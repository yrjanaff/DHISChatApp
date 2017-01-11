import React from 'react';
import {View,Text, TouchableHighlight, ScrollView}  from 'react-native';
import styles from './styles';
import xmpp from '../stores/XmppStore';
import { Actions } from 'react-native-mobx';
var dateFormat = require('dateformat');

import Button from 'react-native-button';

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
    if(!props.groups)  {
      tempmessages = xmpp.conversation;
      tempPeople = this.sortRecentConversations(xmpp.conversation, tempPeople);
    }else {
      tempmessages = {}; //denne skal settes til gruppe meldingene
    }

    this.state = {
      group: props.groups,
      messages: tempmessages,
      people: tempPeople
    };
  }

  prevMessage(message) {
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
    if(xmpp.messageSentorRecieved) {
      this.setUp(this.state);
      xmpp.messageSentorRecieved = false;
    }
    return (
        <View style={styles.container}>
          <ScrollView  automaticallyAdjustContentInsets={true} horizontal={false} >
          <Button onPress={()=>Actions.newChat()}>Klikk her for ny {!this.state.group ? 'chat' : 'group'}!</Button>
            <Button onPress={()=> xmpp.createConference('TestDIZSHIT', 'TestingDIz', "Dette er en test multichat for å se om det går", ['yrjanaff@1x-193-157-182-210.uio.no','julie@1x-193-157-182-210.uio.no'], "administrator") }>TEST</Button>

            {
           this.state.people.map((remote) => {
                  return (
                        <TouchableHighlight style={styles.touch} underlayColor={'#d3d3d3'} key={remote} onPress={() => {Actions.conversation({remote: this.prettifyUsername(remote)}); xmpp.setRemote(remote)}}>
                          <View>
                            <Text style={styles.bold}>{this.prettifyUsername(remote)}</Text>
                            {
                              this.prevMessage(xmpp.conversation[remote].chat[0].text)
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
