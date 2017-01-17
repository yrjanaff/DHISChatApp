/**
 * Created by yrjanaff on 17.01.2017.
 */

import React from 'react';
import {View, Text, TouchableHighlight, ScrollView, Image, TextInput}  from 'react-native';
import Button from 'react-native-button';
import styles from './styles';
import xmpp from '../stores/XmppStore';
var btoa = require('Base64').btoa;

let header = {
  method: 'GET',
  headers: {
    'Authorization': `Basic ${btoa('admin:district')}`,
    'Content-Type': 'application/json'
  }
};

let intId = '';

export default class Interpretation extends React.Component {

  constructor( props ) {
    super(props);

    this.state = {
      newComment: '',
      comments: []
    };
  }

  componentWillMount () {
    this.getComments();
  }

  componentWillUnmount(){
    console.log('component will unmount!!');
  }

  submitComment(comment){
    console.log('inni submitComment!');
    console.log(comment);
    
    return fetch('https://play.dhis2.org/demo/api//interpretations/'+ xmpp.currentInterpretation.id +'/comments', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa('admin:district')}`,
        'Content-Type': 'text/plain'
      },
      body: comment
    })
        .then((response) => response.json())
        .then((responseJson) => {
          if( responseJson.httpStatusCode === 201){
            this.getComments();
          }
        })
        .catch((error) => {
          console.error(error);
        });
  }

  getComments(){
    console.log('inni getComments!!!');
    return fetch('https://play.dhis2.org/demo/api/interpretations/'+ xmpp.currentInterpretation.id +'/comments?fields=text,user[name]', header)
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson.comments);
          this.setState({comments: responseJson.comments});
        })
        .catch((error) => {
          console.error(error);
        });
  }

  render() {
    console.log(xmpp.currentInterpretation);
    if(intId != xmpp.currentInterpretation.id){
      intId = xmpp.currentInterpretation.id;
      this.getComments();
    }
    
    return (
        <View style={styles.centercontainer}>
          <ScrollView automaticallyAdjustContentInsets={true} horizontal={false}>
            <Text style={styles.bold}>{xmpp.currentInterpretation.name}</Text>
            <Text>{xmpp.currentInterpretation.text}</Text>
            <Image
                source={{
                          uri: 'https://play.dhis2.org/demo/api/' + xmpp.currentInterpretation.type + 's/' + xmpp.currentInterpretation.typeId + '/data',
                          headers: header
                        }}
                style={{
                          width: 300,
                          height: 300,
                          alignSelf: 'center'
                 }}
            />
            <View style={styles.button}><Button>Chat about this!</Button></View>
            <Text style={styles.bold}>Comments:</Text>
            {this.state.comments.map(( comment, index ) => {
              return (
                  <View key={index}>
                    <Text style={styles.bold}>{comment.user.name}</Text>
                    <Text>{comment.text}</Text>
                  </View>
              );
            })}
            <View style={styles.messageBar}>
              <View style={{flex:1}}>
                <TextInput ref='newComment'
                           value={this.state.newComment}
                           onChangeText={(newComment)=>this.setState({newComment})}
                           style={styles.message} placeholder="Enter comment..."/>
              </View>
              <View style={styles.sendButton}>
                <Button onPress={()=>{this.submitComment(this.state.newComment);this.setState({newComment:''})}} disabled={!this.state.newComment || !this.state.newComment.trim()}>Submit</Button>
              </View>
            </View>
          </ScrollView>
        </View>
    )
  }
}
