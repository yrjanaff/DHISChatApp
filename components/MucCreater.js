import React from 'react';
import {Text, View, TextInput, ScrollView, findNodeHandle, Keyboard, ToastAndroid, TouchableHighlight}  from 'react-native';
import styles from './styles';
import xmpp from '../utils/XmppStore';
import Button from 'react-native-button';
import {Actions, ActionConst} from 'react-native-mobx';
import ListRoster from './ListRoster';

export default class MucCreater extends React.Component {
  updateParticipants( props ) {
    xmpp.newMucParticipants = xmpp.newMucParticipants.concat([props]);
    this.setState({participants: ' ', dataSource: []});
  }

  constructor( props ) {
    const username = xmpp.username.split("@");
    super(props);
    this.state = {
      height: 0,
      roster: xmpp.roster,
      dataSource: [],
      participants: '',
      username: username[0],
      name: '',
    };
    this.updateParticipants = this.updateParticipants.bind(this);
  }

  componentWillMount() {
    Keyboard.addListener('keyboardDidShow', this.keyboardWillShow.bind(this));
    Keyboard.addListener('keyboardDidHide', this.keyboardWillHide.bind(this));
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
    Keyboard.removeListener('keyboardDidShow');
    Keyboard.removeListener('keyboardDidHide');
  }

  keyboardWillShow( e ) {
    if( this.mounted ) this.setState({height: e.endCoordinates.height});
  }

  keyboardWillHide( e ) {
    if( this.mounted )
      this.setState({height: 0});
  }

  foundMatch( text ) {
    xmpp.group = true;
    const participantsString = xmpp.newMucParticipants.join(', ');
    let newUser = '';
    if( participantsString.length < text.length ) {
      newUser = participantsString.length == 0 ? text : text.substring(participantsString.length);
    }
    else {
      const splittedText = text.split(', ');
      for( let i = 0; i < xmpp.newMucParticipants.length; i++ ) {
        if( xmpp.newMucParticipants[i] !== splittedText[i] ) {
          xmpp.newMucParticipants.splice(i, 1);
          break;
        }
      }
    }

    let filteredRoster = [];
    for( let k in this.state.roster ) {
      if( this.state.roster[k].displayName.toLowerCase().indexOf(newUser.toLowerCase().trim()) >= 0 && participantsString.indexOf(this.state.roster[k].username) < 0 )
        filteredRoster.unshift(this.state.roster[k]);
    }

    this.setState({
      participants: newUser,
      dataSource: filteredRoster
    });

  }

  onClick() {
    if( xmpp.mucConversation[this.state.name] ) {
      ToastAndroid.show('Group already exist', ToastAndroid.LONG)
    } else {
      xmpp.createInterpretationMuc = false
      xmpp.createConference(this.state.name.trim(), xmpp.mucSubject, xmpp.newMucParticipants, this.state.username);
      this.setState({topic: '', name: ''});
      Actions.pop();
      Actions.groupTab();
      Actions.groupConversation()
    }
  }

  setMucFill(){
    if( xmpp.createInterpretationMuc ) {
      xmpp.mucSubject = xmpp.currentInterpretation.url;
    } else {
      xmpp.mucSubject = null;
    }
  }

  render() {
    this.setMucFill();

    let val = xmpp.newMucParticipants.length > 0 ? xmpp.newMucParticipants.join(', ') + this.state.participants : this.state.participants
    return (
        <View style={styles.container}>
          <View style={{flex:0, flexDirection: 'row', borderColor: 'lightgray', marginTop: 10,borderBottomWidth: 3}}>
            <Text style={{fontSize: 16, color: 'darkgray', marginTop:10 }}>NAME:</Text>
            <TextInput
                style={{height: 40, flex:1, borderColor: 'gray', borderWidth: 1}}
                onChangeText={(name) => this.setState({name})}
                value={this.state.name}
                underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.toContainer}>
            <View style={{flex:0, flexDirection: 'row', borderColor: 'lightgray', borderBottomWidth: 7, marginBottom: 10}}>
              <Text style={{fontSize: 16, color: 'darkgray', marginTop:20 }}>TO:</Text>
              <TextInput
                  style={{height: 60,flex:1,borderColor: 'gray', borderWidth: 1}}
                  onChangeText={(participants) => this.foundMatch(participants)}
                  value={val}
                  underlineColorAndroid="transparent"
              />
            </View>
          </View>
          <View style={{flex:1}}>
            <ListRoster style={{color:'black'}} roster={this.state.dataSource} clicked={this.updateParticipants}/>
          </View>
          <TouchableHighlight underlayColor='transparent' disabled={
            xmpp.offlineMode || !this.state.name || !this.state.name.trim() || xmpp.newMucParticipants.length < 1
          } onPress={()=> this.onClick()}>
          <View
              style={[{ flex: 0, height: 35, flexDirection: 'column', justifyContent: 'center'},xmpp.offlineMode || !this.state.name || !this.state.name.trim() || xmpp.newMucParticipants.length < 1 ? styles.disabled :styles.buttons]}>
            <Button style={{color: '#ffffff'}} disabled={
            xmpp.offlineMode || !this.state.name || !this.state.name.trim() || xmpp.newMucParticipants.length < 1
          } onPress={()=> this.onClick()}>Create group</Button>
          </View></TouchableHighlight>
        </View>
    );
  }
}
