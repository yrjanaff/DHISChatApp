import React from 'react';
import {Text,View, TextInput}  from 'react-native';
import styles from './styles';
import xmpp from '../stores/XmppStore';
import Button from 'react-native-button';
import { Actions } from 'react-native-mobx';

export default class MucCreater extends React.Component {
  constructor( props ) {
    const username = xmpp.username.split("@");
    super(props);
    this.state = {
      roster: xmpp.roster,
      dataSource: xmpp.roster,
      participants: ['yrjanaff@yj-dev.dhis2.org', 'admin@yj-dev.dhis2.org'],
      topic: '',
      username: username[0],
      description:'',
      name:'',
    };
  }

  render() {
    return(
        <View style={styles.container}>
          <Text>Conversation name:</Text>
          <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1, marginBottom:20}}
              onChangeText={(name) => this.setState({name})}
              value={this.state.name}
          />
          <Text>Conversation topic:</Text>
          <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1, marginBottom:20}}
              onChangeText={(topic) => this.setState({topic})}
              value={this.state.topic}
          />
          <Text>Conversation description:</Text>
          <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1, marginBottom:20}}
              onChangeText={(description) => this.setState({description})}
              value={this.state.description}
          />
          <View style={styles.toContainer}>
            <Text>TO:</Text>
            <TextInput
                style={{height: 40, borderColor: 'gray', borderWidth: 1, marginBottom:20}}
                onChangeText={(participants) => this.setState({participants})}
                value={this.state.participants}
            />
          </View>
          <Button onPress={()=> {xmpp.createConference(this.state.name, this.state.topic, this.state.description, this.state.participants, this.state.username); this.setState({topic:'', name:'', description:''}); Actions.group()} }>Create conference</Button>

        </View>
    );
  }

}
