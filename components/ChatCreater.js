import React from 'react';
import {Text, View, TextInput, ScrollView}  from 'react-native';
import ListRoster from './ListRoster';
import styles from './styles';
import xmpp from '../utils/XmppStore';

export default class ChatCreater extends React.Component {
  constructor( props ) {
    super(props);
    this.state = {
      roster: xmpp.roster,
      dataSource: xmpp.roster
    };
  }

  foundMatch( text ) {
    xmpp.group = false;

    let filteredRoster = [];
    for( let k in this.state.roster ) {
      if( this.state.roster[k].displayName.toLowerCase().indexOf(text) >= 0 )
        filteredRoster.unshift(this.state.roster[k]);
    }

    this.setState({
      text,
      dataSource: filteredRoster
    });

  }

  render() {
    return (
        <View style={styles.container}>
          <View style={{flex:0, flexDirection: 'row', borderColor: 'lightgray', borderBottomWidth: 7}}>
            <Text style={{fontSize: 20, color: 'darkgray', marginTop:5 }}>To:</Text>
            <TextInput
                style={{height:40, flex:1}}
                onChangeText={(text) => {this.setState({text});this.foundMatch(text)}}
                value={this.state.text}
                underlineColorAndroid="#ffffff"
            />
          </View>
          <ScrollView style={{marginTop:10}}>
            <ListRoster style={{color:'black'}} isChat={true} roster={this.state.dataSource}/>
          </ScrollView>
        </View>
    );
  }

}
