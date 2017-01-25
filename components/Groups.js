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
        return (
        <View style={styles.container}>
          <View>

          </View>
        <ScrollView  automaticallyAdjustContentInsets={true} horizontal={false} >
        {
          xmpp.multiUserChat.map((current) => {
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
