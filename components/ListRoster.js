import React from 'react';
import {View, Text, ListView, ScrollView, TouchableHighlight}  from 'react-native';
import xmpp from '../utils/XmppStore';
import { Actions } from 'react-native-mobx'
import styles from './styles';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class ListRoster extends React.Component {

  sortAlphabetically(array) {
    return array.sort(function( a, b ) {
      var nameA = a.displayName.toLowerCase();
      var nameB = b.displayName.toLowerCase();
      if( nameA < nameB ) {
        return -1;
      }
      if( nameA > nameB ) {
        return 1;
      }
      return 0;
    });
  }

  constructor( props ) {
    super(props);
    this.state = {roster: this.sortAlphabetically(props.roster),
      click: null,
      isChat: props.isChat
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({roster: nextProps.roster,
      click: nextProps.clicked,
      isChat: nextprops.isChat
    })
  }

  getAvailableIcon(status) {
    switch(status) {
      case 'available':
      case 'Online': return styles.online;
      case 'Away due to idle':
      case 'Away': return styles.idle;
      case 'unavailable': return styles.unavailable;
      default: return styles.unavailable;
    }
  }

  onClickedRow(row){
    if(xmpp.group){
     return this.state.click(row.username);
    }else{
       xmpp.setRemote(row.username)

      if(this.state.isChat){
        Actions.conversation({remote: row.displayName})
      }
      else {
        Actions.contactsConversation({remote: row.displayName});
      }
    }
  }

  render() {
    const data = this.sortAlphabetically(this.state.roster)
    const dataSource = ds.cloneWithRows(data.map(x=>x));
    return (
          <ListView enableEmptySections
                    ref="roster"
                    renderScrollComponent={props => <ScrollView {...props} />}
                    dataSource={dataSource}
                    renderRow={(row) =>
                        <TouchableHighlight onPress={() => this.onClickedRow(row)}><View style={[{flex:1}, {flexDirection: 'row'}]}><View style={[this.getAvailableIcon(row.presence), {justifyContent: 'flex-start'} ]}/><Text style={[{fontSize:17},{color: '#000000'}]}> {row.displayName}</Text></View></TouchableHighlight>}
          />
    )
  }

}
