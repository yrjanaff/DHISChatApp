import React from 'react';
import {Text,View, TextInput,Keyboard, Dimensions}  from 'react-native';
const height = Dimensions.get('window').height;
import styles from './styles';
import xmpp from '../stores/XmppStore';
import Button from 'react-native-button';
import { Actions } from 'react-native-mobx';
import ListRoster from './ListRoster';

export default class MucCreater extends React.Component {
  updateParticipants(props){
    console.log(props)
    xmpp.newMucParticipants = xmpp.newMucParticipants.concat([props]);
    this.setState({participants: '',dataSource: []});
    console.log(xmpp.newMucParticipants)
  }

  constructor( props ) {
    const username = xmpp.username.split("@");
    super(props);
    this.state = {
      height:0,
      roster: xmpp.roster,
      dataSource: [],
      participants: '',//['yrjanaff@yj-dev.dhis2.org', 'admin@yj-dev.dhis2.org'],
      topic: '',
      username: username[0],
      description:'',
      name:'',
    };
    this.updateParticipants = this.updateParticipants.bind(this);
  }

  componentWillMount () {
    console.log("is mounting")
    Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
    Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
    this.mounted = true;
  }

  componentWillUnmount(){
    this.mounted = false;
    Keyboard.removeListener('keyboardWillShow');
    Keyboard.removeListener('keyboardWillHide');
  }
  keyboardWillShow (e) {
    console.log("will show")
    if (this.mounted) this.setState({height: e.endCoordinates.height});
  }

  keyboardWillHide (e) {
    if (this.mounted) this.setState({height: 0});
  }

  foundMatch(text) {
    xmpp.group = true;
    const participantsString = xmpp.newMucParticipants.join(', ');
    let newUser = '';
    if(participantsString.length < text.length){
      newUser = participantsString.length == 0 ? text : text.substring(participantsString.length +1);
    }
    else{
      const splittedText = text.split(', ');
      for(let i = 0; i < xmpp.newMucParticipants.length; i++){
        if(xmpp.newMucParticipants[i] !== splittedText[i]){
          xmpp.newMucParticipants.splice(i, 1);
          break;
        }
      }
    }
    const filteredRoster = this.state.roster.filter(value => value.username.indexOf(newUser.toLowerCase()) >= 0 && participantsString.indexOf(value.username) < 0 );
    this.setState({
      participants: newUser,
      dataSource: filteredRoster
    });

  }

  render() {
    let val = xmpp.newMucParticipants.length > 0 ? xmpp.newMucParticipants.join(', ') + ' ' + this.state.participants : this.state.participants
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
                onChangeText={(participants) => this.foundMatch(participants)}
                value={val}
            />
          </View>
          <ListRoster roster={this.state.dataSource} clicked={this.updateParticipants}/>
          <Button onPress={()=> {xmpp.createConference(this.state.name, this.state.topic, this.state.description, xmpp.newMucParticipants, this.state.username); this.setState({topic:'', name:'', description:''}); Actions.group()} }>Create conference</Button>
          <View style={{height:this.state.height}}/>
        </View>
    );
  }

}
