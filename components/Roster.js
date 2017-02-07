import React from 'react';
import {View, Text}  from 'react-native';
import ListRoster from './ListRoster';
import styles from './styles';
import xmpp from '../utils/XmppStore';

export default class Roster extends React.Component {
  constructor( props ) {
    super(props);
    this.state = {};
  }

  render() {
    return (
        <View style={[styles.container,{marginTop: 10}]}>
          <ListRoster style={{color:'black'}} isChat={false} roster={xmpp.roster}/>
        </View>
    )
  }

}
