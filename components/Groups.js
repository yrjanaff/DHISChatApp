import React from 'react';
import {View,Text, TouchableHighlight, ScrollView}  from 'react-native';
import styles from './styles';
import xmpp from '../utils/XmppStore';
import { Actions } from 'react-native-mobx';

export default class Groups extends React.Component {
  constructor( props ) {
    super(props);
  }

  onClick(remote){
    xmpp.setRemote(remote[0],true, remote[1]);
    xmpp.joinMuc(remote[1]);

    xmpp.unSeenNotifications.Groups = xmpp.unSeenNotifications.Groups.filter( notification => notification !== remote[0]);

    Actions.conversation();
  }

  render() {
        return (
        <View style={styles.container}>
        <ScrollView  automaticallyAdjustContentInsets={true} horizontal={false} >
        {
          xmpp.multiUserChat.map((current) => {
            return (
                <TouchableHighlight style={styles.touch} underlayColor={'#ffffff'} key={current[0]} onPress={() => this.onClick(current)}>
                  <View>
                    <Text style={[{fontSize: 20},{fontWeight: xmpp.unSeenNotifications.Groups.indexOf(current[0]) > -1 ? 'bold': 'normal' }]}>{current[0]}</Text>
                    <Text> {current[2]}</Text>
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
