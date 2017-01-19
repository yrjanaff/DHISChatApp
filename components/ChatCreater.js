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
          <View  style={[{flex:0}, {flexDirection: 'row'}]}>
            <Text style={{marginTop:10}}>TO:</Text>
            <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1, marginBottom:20, width: 300}}
              onChangeText={(text) => {this.setState({text});this.foundMatch(text)}}
              value={this.state.text}
            />
          </View>
         <ListRoster roster={this.state.dataSource}/>
        </View>
      );
  }

}
