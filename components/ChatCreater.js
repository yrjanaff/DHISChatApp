import React from 'react';
import {Text,View, TextInput}  from 'react-native';
import ListRoster from './ListRoster';
import styles from './styles';
import xmpp from '../stores/XmppStore';

export default class ChatCreater extends React.Component {
  constructor( props ) {
    super(props);
    this.state = {
      roster: xmpp.roster,
      dataSource: xmpp.roster
    };
  }

  foundMatch(text) {
    const filteredRoster = this.state.roster.filter(checkUsername);

    function checkUsername(value) {
        return value.username.toLowerCase().indexOf(text) >= 0
    }

    this.setState({
      text,
      dataSource: filteredRoster
    });

  }

  render() {
    return(
        <View style={styles.container}>
          <View style={styles.toContainer}>
            <Text>TO:</Text>
            <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1, marginBottom:20}}
              onChangeText={(text) => {this.setState({text});this.foundMatch(text)}}
              value={this.state.text}
            />
          </View>
         <ListRoster roster={this.state.dataSource}/>
        </View>
      );
  }

}
