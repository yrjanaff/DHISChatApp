import React from 'react';
import {Text,View, TextInput}  from 'react-native';
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

  foundMatch(text) {
    xmpp.group = false;
    const filteredRoster = this.state.roster.filter(value => value.username.toLowerCase().indexOf(text) >= 0);

    this.setState({
      text,
      dataSource: filteredRoster
    });

  }

  render() {
    return(
        <View style={styles.container}>
          <View  style={{flex:0, flexDirection: 'row', borderColor: 'lightgray', borderBottomWidth: 7}}>
            <Text style={{fontSize: 20, color: 'darkgray', marginTop:5 }}>TOO:</Text>
            <TextInput
              style={{height:40, width: 300}}
              onChangeText={(text) => {this.setState({text});this.foundMatch(text)}}
              value={this.state.text}
              underlineColorAndroid="#ffffff"
            />
          </View>
          <View style={{marginTop:10}}>
         <ListRoster roster={this.state.dataSource}/>
          </View>
        </View>
      );
  }

}
