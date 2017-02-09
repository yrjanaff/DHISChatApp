import React from 'react';
import {View, Text, ScrollView, TextInput, ListView, Dimensions, Image, AsyncStorage, Switch}  from 'react-native';
import styles from './styles';
import Button from 'react-native-button';
import ActivityIndicator from './ActivityIndicator';
import xmpp from '../utils/XmppStore'
import CheckBox from 'react-native-checkbox';

const dismissKeyboard = require('dismissKeyboard');

export default class Login extends React.Component {
  constructor( props ) {
    super(props);
    this.state = {savePassword: true};

    this.getCredentials();
  }

  async getCredentials() {
    try {
      const username = await AsyncStorage.getItem('username');
      const password = await AsyncStorage.getItem('password');
      if( username !== null && password !== null && username !== '' && password !== '' ) {
        this.setState({username: username, password: password});
      }
    } catch( error ) {
      console.log("getCredentials error: " + error);
    }

  }

  async saveCredentials() {
    if( this.state.savePassword ) {
      try {
        await AsyncStorage.setItem('username', this.state.username);
        await AsyncStorage.setItem('password', this.state.password);
      } catch( error ) {
        console.log('Async storage: ' + error)
      }
    }
    else {
      try {
        await AsyncStorage.setItem('username', '');
        await AsyncStorage.setItem('password', '');
        this.setState({username: '', password: ''});
      } catch( error ) {
        console.log('Async storage: ' + error)
      }
    }
  }

  render() {
    if( this.state.username === '' && this.state.password === '' && this.state.savePassword )
      this.getCredentials();

    return (
        <View style={[styles.container,{alignItems:'center', backgroundColor: '#1d5288'}]}>
          <Image
              source={require('../image/logo_promo1.png')}
              style={{
                height: 100,
                width:300,
                alignSelf: 'center',
                justifyContent: 'flex-start'
              }}
          />
          {xmpp.loginError && <Text style={{color:'white'}}>{xmpp.loginError}</Text>}
          <View style={styles.row}>
            <TextInput style={styles.rowInput}
                       autoCorrect={false}
                       autoCapitalize="none"
                       autoFocus={!this.state.savePassword}
                       returnKeyType={'next'}
                       placeholder="Username"
                       value={this.state.username}
                       onChangeText={(username)=>this.setState({username})}
                       onSubmitEditing={(event) => {
                        this.refs.Password.focus();
                     }}
                       blurOnSubmit={false}
            />
          </View>
          <View style={styles.lastRow}>
            <TextInput style={styles.rowInput}
                       ref='Password'
                       secureTextEntry={true}
                       autoCorrect={false}
                       autoCapitalize="none"
                       placeholder="Password"
                       returnKeyType={'go'}
                       value={this.state.password}
                       onChangeText={(password)=>this.setState({password})}
                       blurOnSubmit={true}
                       onSubmitEditing={()=> {dismissKeyboard(); this.saveCredentials(); xmpp.selfDisconnect = false; xmpp.login(this.state)}}
            />
          </View>
          <CheckBox //Kan evt byttes ut med switch: https://facebook.github.io/react-native/docs/switch.html
              label='Save credentials'
              checked={this.state.savePassword}
              onChange={(checked) => {this.setState({savePassword: !checked});}}
              underlayColor={'transparent'}
              checkboxStyle={{tintColor: 'white'}}
              labelStyle={{color: 'white'}}
          />

          <View style={styles.loginButton}><Button style={{color: 'white'}}
                                                   onPress={()=> {dismissKeyboard(); this.saveCredentials(); xmpp.selfDisconnect = false; xmpp.login(this.state)}}>Login</Button></View>
          <ActivityIndicator active={xmpp.loading}/>
        </View>
    )
  }
}
