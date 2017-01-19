import React from 'react';
import {View, Text, ScrollView, TextInput, Keyboard, ListView, Dimensions, Image}  from 'react-native';
import styles from './styles';
const height = Dimensions.get('window').height;
import Button from 'react-native-button';
import {Actions} from 'react-native-mobx';
var InvertibleScrollView = require('react-native-invertible-scroll-view');
import CameraRollPicker from 'react-native-camera-roll-picker';
import xmpp from '../utils/XmppStore';
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var RNGRP = require('react-native-get-real-path');

class Conversation extends React.Component {
  static title( props ) {
    const username = xmpp.remote.split("@");
    return username[0];
  }

  constructor( props ) {
    super(props);
    this.state = {
      group: props.group,
      showImagePicker: false,
      selectedImage: ''
    };
    this.getImage = this.getImage.bind(this);
  }

  getImage(props){
    this.setState({showImagePicker: false});
    console.log("inni vår egen metode");
    console.log(props);
    this.setState({selectedImage: props[0].uri});
    xmpp.currentFileSent = false;
 
    RNGRP.getRealPathFromURI(props[0].uri).then(filePath =>
        xmpp.fileTransfer(filePath)
    )
    xmpp.sentFileinChat(props[0].uri);
  }

  render() {
    //xmpp.sendMessage(this.state.message, xmpp.group);this.setState({message:''})}} disabled={!this.state.message || !this.state.message.trim()
    let dataSource = ds.cloneWithRows([], []);

    if( !xmpp.group && xmpp.conversation[xmpp.remote] ) {
      dataSource = ds.cloneWithRows(xmpp.conversation[xmpp.remote].chat.map(x => x));
    }
    if( xmpp.group && xmpp.mucConversation[xmpp.remote] ) {
      dataSource = ds.cloneWithRows(xmpp.mucConversation[xmpp.remote].chat.map(x => x));
    }
    let isSent = xmpp.currentFileSent;
    return (
        <View style={styles.containerNoTabs}>
          <View style={{flex:1}}>
            <ListView enableEmptySections
                      ref="messages"
                      renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
                      dataSource={dataSource}
                      renderRow={(row) =>
                            !row.image ? <Text style={[styles.messageItem, {textAlign:row.own ? 'right':'left' }]}>{row.text}</Text> :
                            <Image source={{
                              uri: row.text
                             }}
                             style={{
                                      width: 200,
                                      height: 300,
                                      alignSelf: row.own ? 'flex-end':'flex-start',
                                      opacity: !isSent && row.text === this.state.selectedImage ? 0.4: 1
                             }}
                              />
                       }
            />
            { xmpp.sendFileError ? <Text style={[{color: 'red', textAlign:'right'}]}>{xmpp.sendFileError}</Text>: null}
          </View>

          <View style={styles.messageBar}>
            <View style={{flex:1}}>
              <TextInput ref='message'
                         value={this.state.message}
                         onChangeText={(message)=>this.setState({message})}
                         style={styles.message} placeholder="Enter message..."
                         onSubmitEditing={() => {xmpp.sendMessage(this.state.message, xmpp.group);this.setState({message:''})}}
                         disabled={!this.state.message || !this.state.message.trim()}/>
            </View>
            {
                xmpp.group ? null :
              <View style={styles.sendButton}>
                <Button onPress={()=> this.setState({showImagePicker: this.state.showImagePicker ? false : true}) }>Image</Button>
              </View>
            }
          </View>
          {
            this.state.showImagePicker
                ? <CameraRollPicker
                // callback={this.setState({selectedImage: this.getSelectedImages})}
                callback={this.getImage}
                maximum={1}
                selected={[]}
                assetType='All'

            />
                : null
          }
        </View>
    )
  }
}

module.exports = Conversation;
