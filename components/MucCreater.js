import React from 'react';
import {Text,View, TextInput,ScrollView, findNodeHandle, Keyboard}  from 'react-native';
import styles from './styles';
import xmpp from '../utils/XmppStore';
import Button from 'react-native-button';
import { Actions, ActionConst } from 'react-native-mobx';
import ListRoster from './ListRoster';

export default class MucCreater extends React.Component {
  updateParticipants(props){
    xmpp.newMucParticipants = xmpp.newMucParticipants.concat([props]);
    this.setState({participants: ' ',dataSource: []});
  }

  constructor( props ) {
    const username = xmpp.username.split("@");
    super(props);
    this.state = {
      height:0,
      roster: xmpp.roster,
      dataSource: [],
      participants: '',
      username: username[0],
      name:'',
    };
    this.updateParticipants = this.updateParticipants.bind(this);
  }

  componentWillMount () {
    Keyboard.addListener('keyboardDidShow', this.keyboardWillShow.bind(this));
    Keyboard.addListener('keyboardDidHide', this.keyboardWillHide.bind(this));
    this.mounted = true;
  }

  componentWillUnmount(){
    this.mounted = false;
    Keyboard.removeListener('keyboardDidShow');
    Keyboard.removeListener('keyboardDidHide');
  }
  keyboardWillShow (e) {
    if (this.mounted) this.setState({height: e.endCoordinates.height});
  }

  keyboardWillHide (e) {
   if (this.mounted)
     this.setState({height: 0});
  }

  foundMatch(text) {
    xmpp.group = true;
    const participantsString = xmpp.newMucParticipants.join(', ');
    let newUser = '';
    if(participantsString.length < text.length){
      newUser = participantsString.length == 0 ? text : text.substring(participantsString.length);
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
    const filteredRoster = this.state.roster.filter(value => value.username.indexOf(newUser.toLowerCase().trim()) >= 0 && participantsString.indexOf(value.username) < 0 );
    this.setState({
      participants: newUser,
      dataSource: filteredRoster
    });

  }

  setMucFill(){
    if(xmpp.createInterpretationMuc) {
      xmpp.mucSubject = xmpp.currentInterpretation.url;
    } else{
      xmpp.mucSubject = null;
    }
  }

  render() {
    this.setMucFill();

    let val = xmpp.newMucParticipants.length > 0 ? xmpp.newMucParticipants.join(', ') + this.state.participants: this.state.participants
    return(
        <View style={styles.container}>
          <Text>Conversation name:</Text>
          <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1, marginBottom:20}}
              onChangeText={(name) => this.setState({name})}
              value={this.state.name}
          />
          <View style={styles.toContainer}>
            <Text>TO:</Text>
            <TextInput
                style={{height: 40, borderColor: 'gray', borderWidth: 1, marginBottom:20}}
                onChangeText={(participants) => this.foundMatch(participants)}
                value={val}
            />
          </View>
          <View style={{flex:1}}>
            <ListRoster roster={this.state.dataSource} clicked={this.updateParticipants}/>
          </View>
          <Button disabled={
            xmpp.offlineMode || !this.state.name || !this.state.name.trim() || xmpp.newMucParticipants.length < 1
          } onPress={()=> {{xmpp.createInterpretationMuc = false} xmpp.createConference(this.state.name, xmpp.mucSubject, xmpp.newMucParticipants, this.state.username); this.setState({topic:'', name:''}); Actions.groupTab(); Actions.groupConversation()} }>Create conference</Button>

        </View>
    );
  }

}
