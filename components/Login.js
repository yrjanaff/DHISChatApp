import React from 'react';
import {View, Text, ScrollView, TextInput, ListView, Dimensions}  from 'react-native';
import styles from './styles';
import Button from 'react-native-button';
import ActivityIndicator from './ActivityIndicator';
import xmpp from '../stores/XmppStore';

export default class Login extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  render(){
    return (
      <View style={[styles.container,{alignItems:'center'}]}>
        {xmpp.loginError && <Text style={{color:'red'}}>{xmpp.loginError}</Text>}
        <Text style={styles.categoryLabel}>Please enter username and password</Text>
        <View style={styles.row}>
          <TextInput style={styles.rowInput}
                     autoCorrect={false}
                     autoCapitalize="none"
                     autoFocus={true}
                     placeholder="Username"
                     value={this.state.username}
                     onChangeText={(username)=>this.setState({username})}
          />
        </View>
        <View style={styles.lastRow}>
          <TextInput style={styles.rowInput}
                     secureTextEntry={true}
                     autoCorrect={false}
                     autoCapitalize="none"
                     placeholder="Password"
                     value={this.state.password}
                     onChangeText={(password)=>this.setState({password})}
          />
        </View>
        <View style={styles.button}><Button onPress={()=>xmpp.login(this.state)}>Login</Button></View>
        <ActivityIndicator active={xmpp.loading}/>

      </View>
    )
  }
}
