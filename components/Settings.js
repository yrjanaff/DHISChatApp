import React from 'react';
import {View, Text, Switch}  from 'react-native';
import styles from './styles';
import Button from 'react-native-button';
import ActivityIndicator from './ActivityIndicator';
import xmpp from '../utils/XmppStore';

export default class Settings extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  render(){
    return (
        <View style={styles.container}>
          <View style={{flexDirection: 'row', paddingLeft: 20,justifyContent: 'space-between'}}>
            <Text>Offline mode: </Text>
          <Switch
              onValueChange={(value) => xmpp.settingOfflineMode(value)}
              style={{marginBottom: 10}}
              value={xmpp.offlineMode} />
          </View>
          <View style={[styles.button,{alignItems:'center'}]}><Button onPress={()=>xmpp.disconnect()}>Log out</Button></View>
          <ActivityIndicator active={xmpp.loading}/>
        </View>
    )
  }
}
