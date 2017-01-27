import React from 'react';
import {Alert, View, Text, Switch, ScrollView, TextInput}  from 'react-native';
import styles from './styles';
import Button from 'react-native-button';
import ActivityIndicator from './ActivityIndicator';
import xmpp from '../utils/XmppStore';
import {getDhisHeaderUser, dhisApiURL, realDhisApiURL} from '../utils/DhisUtils';

const dismissKeyboard = require('dismissKeyboard');

export default class Settings extends React.Component {
  constructor( props ) {
    super(props);
    this.state = {dirty: false};
    this.getDhisProfile();
  }

  getDhisProfile() {
    return fetch(realDhisApiURL + 'me?fields=firstName,surname,education,employer,jobTitle,email,phoneNumber, interests,languages', getDhisHeaderUser(xmpp.username, xmpp.password))
        .then(( response ) => response.json())
        .then(( responseJson ) => {
          console.log(responseJson);
          this.setState({
            firstname: responseJson.firstName,
            surname: responseJson.surname,
            education: responseJson.education,
            employer: responseJson.employer,
            jobtitle: responseJson.jobTitle,
            email: responseJson.email,
            phonenumber: responseJson.phoneNumber,
            interests: responseJson.interests,
            languages: responseJson.languages
          });
        })
        .catch(( error ) => {
          console.error(error);
        });
  }

  render() {
    return (
        <View style={styles.container}>
          <ScrollView automaticallyAdjustContentInsets={true} horizontal={false}>
            <View style={{flexDirection: 'row', paddingLeft: 20,justifyContent: 'space-between'}}>
              <Text>Offline mode: </Text>
              <Switch
                  onValueChange={(value) => xmpp.settingOfflineMode(value)}
                  style={{marginBottom: 10}}
                  value={xmpp.offlineMode}/>
            </View>

            <View>
              <Text>Profile</Text>

              <Text style={styles.rowLabel}>Firstname:</Text>
              <View style={styles.lastRow}>
                <TextInput style={styles.rowInput}
                           onChange={() => this.setState({dirty: true})}
                           autoCorrect={false}
                           autoCapitalize="none"
                           autoFocus={false}
                           placeholder="Firstname"
                           returnKeyType={'done'}
                           value={this.state.firstname}
                           onChangeText={(firstname)=>this.setState({firstname})}
                           blurOnSubmit={false}
                           onSubmitEditing={() => dismissKeyboard()}
                />
              </View>

              <Text style={styles.rowLabel}>Surname:</Text>
              <View style={styles.lastRow}>
                <TextInput style={styles.rowInput}
                           onChange={() => this.setState({dirty: true})}
                           autoCorrect={false}
                           autoCapitalize="none"
                           autoFocus={false}
                           placeholder="Surname"
                           value={this.state.surname}
                           onChangeText={(surname)=>this.setState({surname})}
                           blurOnSubmit={false}
                           onSubmitEditing={() => dismissKeyboard()}
                />
              </View>

              <Text style={styles.rowLabel}>Education:</Text>
              <View style={styles.lastRow}>
                <TextInput style={styles.rowInput}
                           onChange={() => this.setState({dirty: true})}
                           autoCorrect={false}
                           autoCapitalize="none"
                           autoFocus={false}
                           placeholder="Education"
                           value={this.state.education}
                           onChangeText={(education)=>this.setState({education})}
                           blurOnSubmit={false}
                           onSubmitEditing={() => dismissKeyboard()}
                />
              </View>

              <Text style={styles.rowLabel}>Employer:</Text>
              <View style={styles.lastRow}>
                <TextInput style={styles.rowInput}
                           autoCorrect={false}
                           autoCapitalize="none"
                           autoFocus={false}
                           placeholder="Employer"
                           returnKeyType={'done'}
                           value={this.state.employer}
                           onChangeText={(employer)=>this.setState({employer})}
                           blurOnSubmit={false}
                           onSubmitEditing={() => dismissKeyboard()}
                />
              </View>

              <Text style={styles.rowLabel}>Job title:</Text>
              <View style={styles.lastRow}>
                <TextInput style={styles.rowInput}
                           onChange={() => this.setState({dirty: true})}
                           autoCorrect={false}
                           autoCapitalize="none"
                           autoFocus={false}
                           placeholder="Job title"
                           returnKeyType={'done'}
                           value={this.state.jobtitle}
                           onChangeText={(jobtitle)=>this.setState({jobtitle})}
                           blurOnSubmit={false}
                           onSubmitEditing={() => dismissKeyboard()}
                />
              </View>

              <Text style={styles.rowLabel}>Email:</Text>
              <View style={styles.lastRow}>
                <TextInput style={styles.rowInput}
                           onChange={() => this.setState({dirty: true})}
                           autoCorrect={false}
                           autoCapitalize="none"
                           autoFocus={false}
                           keyboardType={'email-address'}
                           placeholder="Email"
                           returnKeyType={'done'}
                           value={this.state.email}
                           onChangeText={(email)=>this.setState({email})}
                           blurOnSubmit={false}
                           onSubmitEditing={() => dismissKeyboard()}
                />
              </View>

              <Text style={styles.rowLabel}>Phone number:</Text>
              <View style={styles.lastRow}>
                <TextInput style={styles.rowInput}
                           onChange={() => this.setState({dirty: true})}
                           autoCorrect={false}
                           autoCapitalize="none"
                           keyboardType={'phone-pad'}
                           autoFocus={false}
                           returnKeyType={'done'}
                           placeholder="Phone number"
                           value={this.state.phonenumber}
                           onChangeText={(phonenumber)=>this.setState({phonenumber})}
                           blurOnSubmit={false}
                           onSubmitEditing={() => dismissKeyboard()}
                />
              </View>

              <Text style={styles.rowLabel}>Interests:</Text>
              <View style={styles.lastRow}>
                <TextInput style={styles.rowInput}
                           onChange={() => this.setState({dirty: true})}
                           autoCorrect={false}
                           autoCapitalize="none"
                           autoFocus={false}
                           returnKeyType={'done'}
                           placeholder="Interests"
                           value={this.state.interests}
                           onChangeText={(interests)=>this.setState({interests})}
                           blurOnSubmit={false}
                />
              </View>

              <Text style={styles.rowLabel}>Languages:</Text>
              <View style={styles.lastRow}>
                <TextInput style={styles.rowInput}
                           onChange={() => this.setState({dirty: true})}
                           autoCorrect={false}
                           autoCapitalize="none"
                           autoFocus={false}
                           returnKeyType={'done'}
                           placeholder="Languages"
                           value={this.state.languages}
                           onChangeText={(languages)=>this.setState({languages})}
                           blurOnSubmit={false}
                           onSubmitEditing={() => dismissKeyboard()}
                />
              </View>
              <View style={[styles.button,{alignItems:'center'}]}><Button disabled={!this.state.dirty} onPress={()=>
                Alert.alert(
                  'DHIS 2',
                  'Update profile?',
                  [
                     {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                     {text: 'OK', onPress: () => console.log('OK Pressed!')},
                  ]
               )}>Update profile</Button></View>
            </View>

            <View style={[styles.button,{alignItems:'center'}]}><Button onPress={()=>xmpp.disconnect()}>Log out</Button></View>
            <ActivityIndicator active={xmpp.loading}/>
          </ScrollView>
        </View>
    )
  }
}
