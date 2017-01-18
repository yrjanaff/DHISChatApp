import React from 'react';
import {View, Text}  from 'react-native';
import styles from './styles';
import Button from 'react-native-button';
import ActivityIndicator from './ActivityIndicator';
import xmpp from '../stores/XmppStore';

export default class Settings extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  render(){
    return (
        <View style={[styles.container,{alignItems:'center'}]}>
          <View style={styles.button}><Button onPress={()=>xmpp.disconnect()}>Log out</Button></View>
          <ActivityIndicator active={xmpp.loading}/>
        </View>
    )
  }
}
