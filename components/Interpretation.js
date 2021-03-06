/**
 * Created by yrjanaff on 17.01.2017.
 */

import React from 'react';
import {View, Text, TouchableHighlight, ScrollView, Image, TextInput, ToastAndroid}  from 'react-native';
import Button from 'react-native-button';
import {Actions} from 'react-native-mobx';
import styles from './styles';
import xmpp from '../utils/XmppStore';
import {dhisApiURL, getDhisImageHeader, getDhisHeader, postDhisHeader} from '../utils/DhisUtils';
var btoa = require('Base64').btoa;

let intId = null;

export default class Interpretation extends React.Component {

  constructor( props ) {
    super(props);

    this.state = {
      newComment: '',
      comments: []
    };
  }

  componentWillMount() {

    this.getComments();
  }

  submitComment( comment ) {
    return fetch(dhisApiURL + 'interpretations/' + xmpp.currentInterpretation.id + '/comments', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(xmpp.username + ':' + xmpp.password)}`,
        'Content-Type': 'text/plain'
      },
      body: comment
    })
        .then(( response ) => response.json())
        .then(( responseJson ) => {
          if( responseJson.httpStatusCode === 201 ) {
            ToastAndroid.show('Comment was posted', ToastAndroid.SHORT)
            this.getComments();
          }
          else {
            console.log("ERROR!");
            console.log(responseJson);
            ToastAndroid.show('Access denied', ToastAndroid.SHORT)
          }
        })
        .catch(( error ) => {
          console.error(error);
        });
  }

  getComments() {
    let url = dhisApiURL + 'interpretations/' + xmpp.currentInterpretation.id + '/comments?fields=text,user[name]';
    return fetch(url, getDhisHeader)
        .then(( response ) => response.json())
        .then(( responseJson ) => {
          xmpp.updateInterpretationComments(responseJson.comments, xmpp.currentInterpretation.url);

          this.setState({comments: responseJson.comments});
        })
        .catch(( error ) => {
          console.error(error);
        });
  }

  render() {
    if( intId != xmpp.currentInterpretation.id ) {
      intId = xmpp.currentInterpretation.id;
      this.getComments();
    }

    return (
        <View style={styles.containerNoTabs}>
          <ScrollView automaticallyAdjustContentInsets={true} horizontal={false}>
            <View style={{flex:1, flexDirection: 'column', borderColor: 'lightgray', borderBottomWidth: 1, marginBottom: 20}}>
              <Text
                  style={{textAlign: 'center', fontSize: 17, marginBottom: 5, fontWeight: 'bold'}}>{xmpp.currentInterpretation.name}</Text>
              <Text
                  style={{textAlign: 'center', fontSize: 17, marginBottom: 10, marginRight: 10, marginLeft: 10}}>{xmpp.currentInterpretation.text}</Text>
            </View>
            <TouchableHighlight onPress={() => {this.props.isMuc ? Actions.mucIntView({path: xmpp.currentInterpretation.imageURL, header: getDhisHeader }) 
                : Actions.intView({path: xmpp.currentInterpretation.imageURL, header: getDhisHeader })}}>
              <Image
                  source={{
                          uri: xmpp.currentInterpretation.imageURL,
                          headers: getDhisImageHeader
                        }}
                  style={{
                          width: 300,
                          height: 300,
                          alignSelf: 'center'
                 }}
              />
            </TouchableHighlight>
            <View style={{margin: 10}}>
              <Text style={[styles.bold,{fontSize: 18, marginBottom: 10, marginTop: 10}]}>Comments:</Text>
              {
                this.state.comments && this.state.comments.length !== 0 ?
                    this.state.comments.map(( comment, index ) => {
                      return (
                          <View key={index} style={{marginBottom: 20}}>
                            <Text style={styles.bold}>{comment.user.name}</Text>
                            <Text>{comment.text}</Text>
                          </View>
                      );
                    })
                    : <Text style={[styles.emptyResult]}>No comments</Text>
              }

            </View>
          </ScrollView>

          <View style={[styles.messageBar]}>
            <View style={{flex:1}}>
              <TextInput ref='newComment'
                         multiline={true}
                         value={this.state.newComment}
                         onChangeText={(newComment)=>this.setState({newComment})}
                         returnKeyType={'send'}
                         autoCapitalize={'sentences'}
                         style={styles.message} placeholder="Enter comment..."
              />
            </View>
            <View style={styles.sendButton}>
              <Button onPress={()=> {
                    if( this.state.newComment !== '')
                      this.submitComment(this.state.newComment);this.setState({newComment:''})
                    }}
                      disabled={!this.state.newComment || !this.state.newComment.trim() && xmpp.offlineMode}
                      style={{color: !this.state.newComment || !this.state.newComment.trim() && xmpp.offlineMode ? '#1d528830' : '#1d5288'}}>Post</Button>
            </View>

          </View>

        </View>
    )
  }
}
