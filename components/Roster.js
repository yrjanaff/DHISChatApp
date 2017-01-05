import React from 'react';
import {View, Text, ListView, ScrollView}  from 'react-native';
import Button from 'react-native-button';
import styles from './styles';
import xmpp from '../stores/XmppStore';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Roster extends React.Component {
  constructor( props ) {
    console.log("Inni roster");
    console.log(props);
    super(props);
    this.state = {};
  }

  render() {
    const dataSource = ds.cloneWithRows(xmpp.roster.map(x=>x));
    return (
        <View style={styles.container}>
          <ListView enableEmptySections
                    ref="roster"
                    renderScrollComponent={props => <ScrollView {...props} />}
                    dataSource={dataSource}
                    renderRow={(row) =>
                            <Text style={styles.messageItem}>{row.presence} {row.displayName}</Text>}
          />
          <Button onPress={() => xmpp.fetchRoster()}>Klikk her!</Button>
         </View>
    )
  }

}
