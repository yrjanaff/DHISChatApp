import React from 'react';
import {View,Text, TouchableHighlight}  from 'react-native';
import styles from './styles';
import xmpp from '../stores/XmppStore';
import { Actions } from 'react-native-mobx';

import Button from 'react-native-button';

export default class Chats extends React.Component {

  sortRecentConversations(conversationsList, people){       //Denne må sortere etterhvert og daa
    for(let remote in conversationsList){
            people.push(remote);
    }
    return people;
  }

  constructor( props ) {
    super(props);
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
    return (

        <View style={styles.container}>
          <Button onPress={()=>Actions.newChat()}>Klikk her for ny {!this.state.group ? 'chat' : 'group'}!</Button>
        {
           this.state.people.map((remote) => {
                  return (
                        <TouchableHighlight style={styles.touch} underlayColor={'#d3d3d3'} key={remote} onPress={() => {Actions.conversation({remote: this.prettifyUsername(remote)}); xmpp.setRemote(remote)}}>
                          <View>
                            <Text style={styles.bold}>{this.prettifyUsername(remote)}</Text>
                            {console.log(remote)}
                            {
                              this.prevMessage(xmpp.conversation[remote].chat[0].text)
                            }

                          </View>
                        </TouchableHighlight>
                  );
           })
        }
        </View>
     )
  }
}
