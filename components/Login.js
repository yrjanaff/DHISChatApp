import React from 'react';
import {View, Text, ScrollView, TextInput, ListView, Dimensions,Image}  from 'react-native';
import styles from './styles';
import Button from 'react-native-button';
import ActivityIndicator from './ActivityIndicator';
import xmpp from '../utils/XmppStore'

const dismissKeyboard = require('dismissKeyboard');

export default class Login extends React.Component {
  constructor( props ) {
    super(props);
    this.state = {};
  }

  render() {
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
                       autoFocus={true}
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
                       value={this.state.password}
                       onChangeText={(password)=>this.setState({password})}
                       blurOnSubmit={true}
                       onSubmitEditing={() => xmpp.login(this.state)}
            />
          </View>
          <View style={styles.loginButton}><Button style={{color: 'white'}} onPress={()=> {dismissKeyboard(); xmpp.login(this.state)}}>Login</Button></View>
          <ActivityIndicator active={xmpp.loading}/>

        </View>
    )
  }
}
