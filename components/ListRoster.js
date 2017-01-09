import React from 'react';
import {Text, ListView, ScrollView, TouchableHighlight}  from 'react-native';
import xmpp from '../stores/XmppStore';
import { Actions } from 'react-native-mobx';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class ListRoster extends React.Component {
  constructor( props ) {
    super(props);
    this.state = {roster: props.roster};
  }

  componentWillReceiveProps(nextProps) {
    this.setState({roster: nextProps.roster})

  }

  render() {
    const dataSource = ds.cloneWithRows(this.state.roster.map(x=>x));
    return (
          <ListView enableEmptySections
                    ref="roster"
                    renderScrollComponent={props => <ScrollView {...props} />}
                    dataSource={dataSource}
                    renderRow={(row) =>
                        <TouchableHighlight onPress={() => {Actions.conversation({remote: row.displayName}); xmpp.setRemote(row.username)}}><Text>{row.presence} {row.displayName}</Text></TouchableHighlight>}
          />
    )
  }

}
