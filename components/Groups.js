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
  }

  onClick(remote){
    xmpp.setRemote(remote[0],true, remote[1]);
    xmpp.joinMuc(remote[1]);

    xmpp.unSeenNotifications.Groups = xmpp.unSeenNotifications.Groups.filter( notification => notification !== remote[0]);
    
    if(remote[2]){
      xmpp.setCurrentInterpretation(xmpp.interpretations[remote[2]]);
    }

    Actions.conversation();
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
                  <View style={{flexDirection: 'row', backgroundColor: "yellow"}}>
                    <Text style={[{fontSize: 20},{justifyContent: 'flex-start'},{fontWeight: xmpp.unSeenNotifications.Groups.indexOf(current[0]) > -1 ? 'bold': 'normal' }]}>{current[0]}</Text>
                    {current[2] ?
                        <Icon name="insert-chart" style={{justifyContent: 'flex-end'}} color="#5E5E5E"/>
                        : null
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
