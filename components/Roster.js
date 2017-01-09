import React from 'react';
import {View, Text}  from 'react-native';
import Button from 'react-native-button';
import ListRoster from './ListRoster';
import styles from './styles';
import xmpp from '../stores/XmppStore';

export default class Roster extends React.Component {
  constructor( props ) {
    super(props);
    this.state = {};
  }

  render() {
    return (
         <View style={styles.container}>
           <Button onPress={() => xmpp.fetchRoster()}>Klikk her for roster update!</Button>
          <ListRoster roster={xmpp.roster}/>
         </View>
    )
  }

}
