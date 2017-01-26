/**
 * Created by yrjanaff on 17.01.2017.
 */

import React from 'react';
import {View, Text, TouchableHighlight, ScrollView, Image, TextInput}  from 'react-native';
import Button from 'react-native-button';
import {Actions} from 'react-native-mobx';
import styles from './styles';
import xmpp from '../utils/XmppStore';
import { dhisApiURL, getDhisImageHeader, getDhisHeader, postDhisHeader } from '../utils/DhisUtils';
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
        'Authorization': `Basic ${btoa('admin:district')}`,
        'Content-Type': 'text/plain'
      },
      body: comment
    })
        .then(( response ) => response.json())
        .then(( responseJson ) => {
          if( responseJson.httpStatusCode === 201 ) {
            this.getComments();
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
            <Text style={styles.bold}>{xmpp.currentInterpretation.name}</Text>
            <Text>{xmpp.currentInterpretation.text}</Text>
            <TouchableHighlight onPress={() => Actions.intView({path: xmpp.currentInterpretation.imageURL, header: getDhisHeader })}>
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
            {this.props.isMuc ? null :
                <View style={styles.button}><Button onPress={() => {xmpp.createInterpretationMuc = true; Actions.newInterpretationMuc()}}>Chat about this!</Button></View>
            }

            <Text style={styles.bold}>Comments:</Text>
            {this.state.comments ? this.state.comments.map(( comment, index ) => {
              return (
                  <View key={index}>
                    <Text style={styles.bold}>{comment.user.name}</Text>
                    <Text>{comment.text}</Text>
                  </View>
              );
            }) : null}
            <View style={styles.messageBar}>
              <View style={{flex:1}}>
                <TextInput ref='newComment'
                           value={this.state.newComment}
                           onChangeText={(newComment)=>this.setState({newComment})}
                           style={styles.message} placeholder="Enter comment..."
                           onSubmitEditing={()=>{
                           if( this.state.newComment !== '')
                              this.submitComment(this.state.newComment);this.setState({newComment:''})}
                           }
                />
              </View>
            </View>
          </ScrollView>
        </View>
    )
  }
}
