import React from 'react';
import {View, Text, Switch, ScrollView, TextInput}  from 'react-native';
import styles from './styles';
import Button from 'react-native-button';
import ActivityIndicator from './ActivityIndicator';
import xmpp from '../utils/XmppStore';
import {getDhisHeaderUser, dhisApiURL, realDhisApiURL} from '../utils/DhisUtils';

export default class Settings extends React.Component {
  constructor( props ) {
    super(props);
    this.state = {};
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
                           autoCorrect={false}
                           autoCapitalize="none"
                           autoFocus={false}
                           placeholder="Firstname"
                           value={this.state.firstname}
                           onChangeText={(firstname)=>this.setState({firstname})}
                           blurOnSubmit={false}
                />
              </View>
              
              <Text style={styles.rowLabel}>Surname:</Text>
              <View style={styles.lastRow}>
                <TextInput style={styles.rowInput}
                           autoCorrect={false}
                           autoCapitalize="none"
                           autoFocus={false}
                           placeholder="Surname"
                           value={this.state.surname}
                           onChangeText={(surname)=>this.setState({surname})}
                           blurOnSubmit={false}
                />
              </View>
            </View>

            <View style={[styles.button,{alignItems:'center'}]}><Button onPress={()=>xmpp.disconnect()}>Log out</Button></View>
            <ActivityIndicator active={xmpp.loading}/>
          </ScrollView>
        </View>
    )
  }
}
