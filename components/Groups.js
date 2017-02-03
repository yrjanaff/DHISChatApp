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
    xmpp.remoteMuc = remote;
    xmpp.setRemote(remote[0],true, remote);
    xmpp.joinMuc(remote[1]);

    xmpp.unSeenNotifications.Groups = xmpp.unSeenNotifications.Groups.filter( notification => notification !== remote[0]);
    
    if(remote[2]){
      if(xmpp.interpretations[remote[2]]){
        xmpp.setCurrentInterpretation(xmpp.interpretations[remote[2]]);
        xmpp.remoteMuc.push(remote[0]);
        xmpp.remoteMuc.push(remote[2]);
      }
      else{
        xmpp.fetchInterpretationForMuc(remote[2], remote[0]);
        xmpp.remoteMuc.push(remote[0]);
        xmpp.remoteMuc.push(remote[2]);
      }
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
  componentWillReceiveProps(props){
    xmpp.drawerOpen = false;
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
                    <TouchableHighlight underlayColor={'#ffffff'} key={current[0]} onPress={() => this.onClick(current)}>
                      <View style={{flex:1, flexDirection: 'column', borderColor: 'lightgray', borderBottomWidth: 0.5, marginBottom: 10}}>
                        <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                          <Text style={[{fontSize: 18, marginLeft: 10},{fontWeight: xmpp.unSeenNotifications.Groups.indexOf(current[0]) > -1 ? 'bold': 'normal' }]}>{current[0]}</Text>
                          <View style={{flexDirection: 'row'}}>
                            <Icon name="people-outline" color="#1d5288" size={18} style={{marginTop: 2, marginRight: 3}}/>
                            <Text style={{fontSize: 16, paddingRight: 7}}>{current[3]}</Text>
                          </View>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                          {
                            xmpp.mucConversation[current[0]] ?
                                <Text style={{marginLeft: 10, marginBottom: 5}}>{xmpp.mucConversation[current[0]].chat[0].from.split('@')[0]}: {this.prevMessage(xmpp.mucConversation[current[0]].chat[0].text)}</Text>:
                                <Text style={{marginLeft: 10, marginBottom: 5, color:"lightgray"}}>No messages</Text>
                          }
                          {current[2] ?
                              <Icon name="equalizer" color="#1d528899" size={20} style={{marginRight: 20, marginBottom: 5}}/>
                              : null
                          }
                        </View>
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
