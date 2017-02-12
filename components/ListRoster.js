import React from 'react';
import {View, Text, ListView, ScrollView, TouchableHighlight}  from 'react-native';
import xmpp from '../utils/XmppStore';
import { Actions } from 'react-native-mobx'
import styles from './styles';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class ListRoster extends React.Component {

  sortAlphabetically(list) {
    let keys =[];
    for (let k in list) {
        keys.push(k);
    }
    return keys.sort();

  }

  constructor( props ) {
    super(props);
    this.state = {roster: props.roster,
      click: null,
      isChat: props.isChat
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({roster: nextProps.roster,
      click: nextProps.clicked,
      isChat: nextProps.isChat
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
    if(this.state.click){
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
    const data = this.sortAlphabetically(this.state.roster);
    const dataSource = ds.cloneWithRows(data.map(x=>x));
    return (
          <ListView enableEmptySections
                    ref="roster"
                    renderScrollComponent={props => <ScrollView {...props} />}
                    dataSource={dataSource}
                    renderRow={(row) =>
                        <TouchableHighlight underlayColor='transparent' onPress={() => this.onClickedRow(this.state.roster[row])}>
                          <View style={{flex:1, flexDirection: 'row', borderBottomColor: 'lightgray', borderBottomWidth: 0.5, marginBottom: 10 }}>
                            <View style={[this.getAvailableIcon(this.state.roster[row].presence), {justifyContent: 'flex-start', paddingBottom: 10} ]}/>
                            <Text style={[{fontSize:17},{paddingBottom: 10},this.props.style]}> {this.state.roster[row].displayName}</Text>
                          </View></TouchableHighlight>
                    }
          />
    )
  }

}
