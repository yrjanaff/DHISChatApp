import React from 'react';
import {Alert, View, Text, Switch, ScrollView, TextInput, ToastAndroid}  from 'react-native';
import styles from './styles';
import Button from 'react-native-button';
import ActivityIndicator from './ActivityIndicator';
import xmpp from '../utils/XmppStore';
import {getDhisHeaderUser, dhisApiURL, realDhisApiURL} from '../utils/DhisUtils';
var btoa = require('Base64').btoa;

const dismissKeyboard = require('dismissKeyboard');

class Profile {
  constructor( firstName, surname, education, employer, jobTitle, email, phoneNumber, interests, languages ) {
    this.firstName = firstName;
    this.surname = surname;
    this.education = education;
    this.employer = employer;
    this.jobTitle = jobTitle;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.interests = interests;
    this.languages = languages;
  }
}

export default class Settings extends React.Component {
  constructor( props ) {
    super(props);
    this.state = {dirty: false, updated: ''};
    this.getDhisProfile();
  }

  onDisconnect(){
    this.setState({firstName: '', surname: '', education: '', employer: '', jobTitle: '', email: '', phoneNumber: '', interests: '', languages: ''})
  }

  getDhisProfile() {
    console.log('inni getProfile!!')
    return fetch(realDhisApiURL + 'me?fields=firstName,surname,education,employer,jobTitle,email,phoneNumber, interests,languages', getDhisHeaderUser(xmpp.username, xmpp.password))
        .then(( response ) => response.json())
        .then(( responseJson ) => {
          this.setState({
            updated: '',
            username: xmpp.username,
            firstName: responseJson.firstName,
            surname: responseJson.surname,
            education: responseJson.education,
            employer: responseJson.employer,
            jobTitle: responseJson.jobTitle,
            email: responseJson.email,
            phoneNumber: responseJson.phoneNumber,
            interests: responseJson.interests,
            languages: responseJson.languages

          });
        })
        .catch(( error ) => {
          console.error(error);
        });
  }

  componentWillReceiveProps(nextProps){
    console.log('ny prop');
  }

  setDhisProfile() {
    this.setState({updated: ''});
    let profile = new Profile(this.state.firstName, this.state.surname, this.state.education, this.state.employer, this.state.jobTitle,
        this.state.email, this.state.phoneNumber, this.state.interests, this.state.languages);
    return fetch(realDhisApiURL + 'me/user-account', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(xmpp.username + ':' + xmpp.password)}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profile)
    })
        .then(( response ) => {
          if( response.status === 200 ) {
            ToastAndroid.show('Profile updated', ToastAndroid.SHORT)
          }
          else {
            ToastAndroid.show('Profile not updated', ToastAndroid.LONG)
          }
        })
        .catch(( error ) => {
          console.error(error);
        });

  }

  render() {
    console.log(xmpp.username);
    console.log(this.state.username);
    if(xmpp.username !== this.state.username){
      this.getDhisProfile();
    }
    return (
        <View style={[styles.container, {marginTop: 30}]}>
          <ScrollView>

            <Text style={styles.rowLabel}>Firstname:</Text>
            <View style={styles.lastRow}>
              <TextInput style={styles.rowInput}
                         onChange={() => this.setState({dirty: true})}
                         autoCorrect={false}
                         autoCapitalize="none"
                         autoFocus={false}
                         placeholder="Firstname"
                         returnKeyType={'done'}
                         value={ this.state.firstName}
                         onChangeText={(firstName)=>{this.setState({firstName})}}
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
                         value={ this.state.surname}
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
                         value={ this.state.education}
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
                         onChange={() => this.setState({dirty: true})}
                         placeholder="Employer"
                         returnKeyType={'done'}
                         value={ this.state.employer}
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
                         value={ this.state.jobTitle}
                         onChangeText={(jobTitle)=>this.setState({jobTitle})}
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
                         value={ this.state.email}
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
                         value={ this.state.phoneNumber}
                         onChangeText={(phoneNumber)=>this.setState({phoneNumber})}
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
                         value={ this.state.interests}
                         onChangeText={(interests)=>this.setState({interests})}
                         blurOnSubmit={false}
                         onSubmitEditing={() => dismissKeyboard()}
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
                         value={ this.state.languages}
                         onChangeText={(languages)=>this.setState({languages})}
                         blurOnSubmit={false}
                         onSubmitEditing={() => dismissKeyboard()}
              />
            </View>

            {this.state.dirty ?
                <View style={[styles.buttons,{alignItems:'center',marginBottom: 20}]}>
                  <Button style={{color: '#ffffff'}} disabled={!this.state.dirty} onPress={()=>
                Alert.alert(
                  'DHIS 2',
                  'Update profile?',
                  [
                     {text: 'Cancel', onPress: () => this.setState({dirty: false})},
                     {text: 'OK', onPress: () => {this.setState({dirty: false}); this.setDhisProfile();}}
                  ]
               )}>Update profile</Button></View>
                : null}
          </ScrollView>
          <ActivityIndicator active={xmpp.loading}/>
        </View>
    )
  }
}

