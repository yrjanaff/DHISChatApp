import React from 'react';
import {View,Text, TouchableHighlight, ScrollView, Button}  from 'react-native';
import styles from './styles';
import xmpp from '../utils/XmppStore';
import { Actions } from 'react-native-mobx';
import { Icon } from 'react-native-material-design';
//import InterpretationMeta from '../utils/InterpretationMeta';

export default class Groups extends React.Component {
  constructor( props ) {
    super(props);
    xmpp.remote = null;
  }

  sortArray(array) {
    return array.sort(function( a, b ) {
      if(xmpp.mucConversation[a[0]] && xmpp.mucConversation[b[0]]) {
         return new Date(xmpp.mucConversation[b[0]].chat[0].date) - new Date(xmpp.mucConversation[a[0]].chat[0].date);
      }
      if(xmpp.mucConversation[a[0]]){
        return -1;
      }
      if(xmpp.mucConversation[b[1]]) {
        return 1;
      }
      return 0;
    });
  }

  onClick(remote){
    xmpp.setRemote(remote[0],true, remote[1]);
    xmpp.joinMuc(remote[1]);

    xmpp.unSeenNotifications.Groups = xmpp.unSeenNotifications.Groups.filter( notification => notification !== remote[0]);

    if(remote[2]){
      xmpp.setCurrentInterpretation(xmpp.interpretations[remote[2]]);
    }

    Actions.groupConversation();
  }

  prevMessage(message) {
    if(message.length > 30){
      const out = message.slice(0,27).concat('...');
      return out;
    }
    return message;
  }

  render() {
   let groupChats =  this.sortArray(xmpp.multiUserChat);

        return (
        <View style={[styles.container, {marginTop: 10}]}>
          {
            groupChats.length !== 0 ?

            <ScrollView  automaticallyAdjustContentInsets={true} horizontal={false} >
            {
              groupChats.map((current) => {
                return (
                    <TouchableHighlight style={styles.touch} underlayColor={'#ffffff'} key={current[0]} onPress={() => this.onClick(current)}>
                      <View>
                        <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                          <Text style={[{fontSize: 18},{fontWeight: xmpp.unSeenNotifications.Groups.indexOf(current[0]) > -1 ? 'bold': 'normal' }]}>{current[0]}</Text>
                          <View style={{flexDirection: 'row'}}>
                          {current[2] ?
                              <Icon name="insert-chart" color="#5E5E5E"/>
                              : null
                          }
                          <Icon name="people-outline" color="#276696" size={18} style={{marginTop: 3, marginRight: 3}}/>
                            <Text style={{fontSize: 18, paddingRight: 7}}>{current[3]}</Text>
                          </View>
                        </View>
                        {
                          xmpp.mucConversation[current[0]] ?
                          <Text>{xmpp.mucConversation[current[0]].chat[0].from.split('@')[0]}: {this.prevMessage(xmpp.mucConversation[current[0]].chat[0].text)}</Text>: null
                        }
                      </View>
                    </TouchableHighlight>
                );
              })
            }
            </ScrollView>:
            <View>
              <Text style={styles.emptyResult}>No groups</Text>
              <Text style={{
                fontSize: 16,
                color: "#5E5E5E65",
                textAlign: 'center',
                marginTop: 0
            }}>press + to start a new group</Text>
            </View>
          }
        </View>
      )
  }

}
