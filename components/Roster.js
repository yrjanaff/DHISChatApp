import React from 'react';
import {View, Text, ListView, ScrollView, TouchableHighlight}  from 'react-native';
import Button from 'react-native-button';
import styles from './styles';
import xmpp from '../stores/XmppStore';
import { Actions } from 'react-native-mobx';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Roster extends React.Component {
  constructor( props ) {
    super(props);
    this.state = {};
  }

  render() {
    const dataSource = ds.cloneWithRows(xmpp.roster.map(x=>x));
    return (
         <View style={styles.container}>
           <Button onPress={() => xmpp.fetchRoster()}>Klikk her!</Button>
          <ListView enableEmptySections
                    ref="roster"
                    renderScrollComponent={props => <ScrollView {...props} />}
                    dataSource={dataSource}
                    renderRow={(row) =>
                        <TouchableHighlight onPress={() => {Actions.conversation({remote: row.displayName}); xmpp.setRemote(row.username)}}><Text>{row.presence} {row.displayName}</Text></TouchableHighlight>}
          />
         </View>
    )
  }

}
