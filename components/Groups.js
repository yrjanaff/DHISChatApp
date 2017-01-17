import React from 'react';
import {View,Text, TouchableHighlight, ScrollView}  from 'react-native';
import styles from './styles';
import xmpp from '../stores/XmppStore';
import { Actions } from 'react-native-mobx';

export default class Groups extends React.Component {
  constructor( props ) {
    super(props);
  }

  render() {
        return (
        <View style={styles.container}>
        <ScrollView  automaticallyAdjustContentInsets={true} horizontal={false} >
        {
          xmpp.multiUserChat.map((current) => {
            return (
                <TouchableHighlight style={styles.touch} underlayColor={'#d3d3d3'} key={current[0]} onPress={() => {Actions.conversation(); xmpp.setRemote(current[0],true, current[1]); xmpp.joinMuc(current[1])}}>
                  <View>
                    {console.log(current)}
                    <Text style={styles.bold}>{current[0]}</Text>
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
