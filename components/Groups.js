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
      console.log(a);
      console.log(b)
      var nameA = 0;
      var nameB = 0;
      console.log(xmpp.mucConversation)
      console.log(xmpp.mucConversation[a[1]])
      console.log(xmpp.mucConversation[b[1]])
      if(xmpp.mucConversation[a[1]] && xmpp.mucConversation[b[1]]) {
         nameA = new Date(xmpp.mucConversation[a[0]].chat[0].date);
         nameB = new Date(xmpp.mucConversation[b[0]].chat[0].date);
      }

      return nameB - nameA;
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

  render() {
   let groupChats =  this.sortArray(xmpp.multiUserChat);

        return (
        <View style={[styles.container, {marginTop: 10}]}>
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
                      <Text>{xmpp.mucConversation[current[0]].chat[0].from.split('@')[0]}: {xmpp.mucConversation[current[0]].chat[0].text}</Text>: null
                    }
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
