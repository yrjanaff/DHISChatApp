import React from 'react';
import {View, Text, ScrollView, TextInput, Keyboard, ListView, Dimensions, Image, TouchableHighlight}  from 'react-native';
import styles from './styles';
const height = Dimensions.get('window').height;
import Button from 'react-native-button';
import {Actions} from 'react-native-mobx';
var InvertibleScrollView = require('react-native-invertible-scroll-view');
import CameraRollPicker from 'react-native-camera-roll-picker';
import xmpp from '../utils/XmppStore';
const ds = new ListView.DataSource({rowHasChanged: ( r1, r2 ) => r1 !== r2});
import InterpretationPreview from './InterpretationPreview';
import {Icon } from 'react-native-material-design';


var RNGRP = require('react-native-get-real-path');

class Conversation extends React.Component {
  static title( props ) {
    if(!xmpp.group) {
      return xmpp.roster[xmpp.remote].displayName;
    }else{
      console.log(xmpp.remote);
      return xmpp.remote.split('@')[0];
    }

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

  getImage( props ) {
    this.setState({showImagePicker: false});
    this.setState({selectedImage: props[0].uri});
    xmpp.currentFileSent = false;

    RNGRP.getRealPathFromURI(props[0].uri).then(filePath =>
        xmpp.fileTransfer(filePath)
    );
    xmpp.sentFileinChat(props[0].uri);
  }

  retrySendImage( uri ) {
    xmpp.currentFileSent = false;
    xmpp.retryPicture = uri;
    RNGRP.getRealPathFromURI(uri).then(filePath =>
        xmpp.fileTransfer(filePath)
    );
  }

  render() {
    let dataSource = ds.cloneWithRows([], []);

    if( !xmpp.group && xmpp.conversation[xmpp.remote] ) {
      dataSource = ds.cloneWithRows(xmpp.conversation[xmpp.remote].chat.map(x => x));
    }
    if( xmpp.group && xmpp.mucConversation[xmpp.remote] ) {

      dataSource = ds.cloneWithRows(xmpp.mucConversation[xmpp.remote].chat.map(x => x));
    }
    let isSent = xmpp.currentFileSent;
    return (
        <View style={[styles.containerNoTabs,{paddingTop:50}]}>
         <InterpretationPreview />
          <View style={{flex:1}}>
            <ListView enableEmptySections
                      ref="messages"
                      renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
                      dataSource={dataSource}
                      renderRow={(row) => {
                        return !row.image ?
                              <View style={[styles.bubble, row.own ? styles.bubbleRight : styles.bubbleLeft]}>
                                <Text style={[styles.messageItem, {color: row.own ? '#ffffff' : 'black'}]}>{row.text}</Text><Text style={{fontSize: 10,marginTop: -10,color: row.own ? '#ffffff' : 'black', textAlign: row.own ? 'right' : 'left'}}>{row.from ? row.from.split('@')[0]:null}</Text>
                              </View> :

                            <TouchableHighlight style={styles.touch} underlayColor={'#ffffff'} key={row.text}
                                      onPress={isSent && row.text === this.state.selectedImage || row.sent ? () => Actions.conView({path: row.text, header:null }) : () => { this.retrySendImage(row.text); this.setState({selectedImage: row.text});}}>

                               <Image source={{
                                  uri: row.text
                                 }}
                                 style={{
                                          width: 200,
                                          height: 300,
                                          alignSelf: row.own ? 'flex-end':'flex-start',
                                          opacity: isSent && row.text === this.state.selectedImage || row.sent ?  1 : 0.4

                                 }}
                               />
                            </TouchableHighlight>

                       }}
            />
            { xmpp.sendFileError ? <Text style={[{color: 'red', textAlign:'right'}]}>{xmpp.sendFileError}</Text> : null}
          </View>
          <View style={styles.messageBar}>
            <View style={{flex:1}}>
              <TextInput ref='message'
                         value={this.state.message}
                         multiline = {true}
                         onChangeText={(message)=>this.setState({message})}
                         autoCapitalize={'sentences'}
                         returnKeyType={'done'}
                         style={styles.message} placeholder="Enter message..."/>
            </View>
            {
              xmpp.group ?  <View style={styles.sendButton}>
                    <Button  onPress={()=> {xmpp.sendMessage(this.state.message, xmpp.group);this.setState({message:''})}}
                             disabled={!this.state.message || !this.state.message.trim() && xmpp.offlineMode}
                             style={{color: !this.state.message || !this.state.message.trim() && xmpp.offlineMode ? '#1d528830' : '#1d5288'}}>send</Button>
                  </View> :
                  <View style={styles.sendButton}>
                    <Button  onPress={()=> this.setState({showImagePicker: this.state.showImagePicker ? false : true}) }
                             disabled={!xmpp.remoteOnline || xmpp.offlineMode}>
                      <Icon
                        name="local-see"
                        color={!xmpp.remoteOnline || xmpp.offlineMode ? '#5E5E5E50':'#5E5E5E'}
                        style={{marginLeft: 20}}
                        size={40}
                    /></Button>
                  </View>
            }
          </View>
          {
            this.state.showImagePicker
                ? <CameraRollPicker
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
