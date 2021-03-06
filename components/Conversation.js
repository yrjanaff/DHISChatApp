import React from 'react';
import {View, Text, ScrollView, TextInput, Keyboard, ListView, Dimensions, Image, TouchableHighlight, Alert}  from 'react-native';
import styles from './styles';
const height = Dimensions.get('window').height;
import Button from 'react-native-button';
import {Actions} from 'react-native-mobx';
var InvertibleScrollView = require('react-native-invertible-scroll-view');
import CameraRollPicker from 'react-native-camera-roll-picker';
import xmpp from '../utils/XmppStore';
const ds = new ListView.DataSource({rowHasChanged: ( r1, r2 ) => r1 !== r2});
import InterpretationPreview from './InterpretationPreview';
import {Icon} from 'react-native-material-design';
import ActivityIndicator from './ActivityIndicator';

const dismissKeyboard = require('dismissKeyboard');

var RNGRP = require('react-native-get-real-path');
let nextDate = null;
let lastTime = null;
class Conversation extends React.Component {
  static title( props ) {
    if( !xmpp.group ) {
      return xmpp.roster[xmpp.remote].displayName;
    } else {
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

    Alert.alert(
        'DHIS Chat',
        'Send selected image?',
        [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
          {text: 'Send', onPress: () => {
            xmpp.currentFileSent = false;

            RNGRP.getRealPathFromURI(props[0].uri).then(filePath =>
                xmpp.fileTransfer(filePath)
            );
            xmpp.sentFileinChat(props[0].uri);}}
        ]
    );
  }

  retrySendImage( uri ) {
    xmpp.currentFileSent = false;
    xmpp.retryPicture = uri;
    RNGRP.getRealPathFromURI(uri).then(filePath =>
        xmpp.fileTransfer(filePath)
    );
  }

  prettifyUsername( username ) {
    if( xmpp.roster[username] ) {
      return xmpp.roster[username].displayName;
    }
    var name = username.split('@')[0];
    if(name === xmpp.username){
      return 'You';
    }
    return name;
  }

  updateDate( date ) {
    nextDate = date;
  }

  upDateTime( time ) {
    lastTime = time;
  }

  renderHeader( currentDate, numRows, currentRow, nextDate ) {
    if( nextDate !== currentDate ) {
      return <Text style={{textAlign: 'center', marginBottom:3, marginTop:3 }}>{currentDate}</Text>
    }
    else if( currentRow === numRows - 1 ) {
      return <Text style={{textAlign: 'center', marginBottom:3, marginTop:3 }}>{currentDate}</Text>
    }
    else {
      return null;
    }
  }

  shouldImageBeSent(props){
    Alert.alert(
        'Send selected image?',
        alertMessage,
        [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
          {text: 'Send', onPress: () => this.getImage(props)}
        ]
    )
}

  render() {
    let numRows = 0;
    let conversations = null;
    let dataSource = ds.cloneWithRows([], []);

    if( !xmpp.group && xmpp.conversation[xmpp.remote] ) {
      numRows = xmpp.conversation[xmpp.remote].chat.length;
      nextDate = numRows > 1 ? xmpp.conversation[xmpp.remote].chat[1].date : null;
      conversations = xmpp.conversation;
      dataSource = ds.cloneWithRows(xmpp.conversation[xmpp.remote].chat.map(x => x));
    }
    if( xmpp.group && xmpp.mucConversation[xmpp.remote] ) {
      numRows = xmpp.mucConversation[xmpp.remote].chat.length;
      nextDate = numRows > 1 ? xmpp.mucConversation[xmpp.remote].chat[1].date : null;
      conversations = xmpp.mucConversation;
      dataSource = ds.cloneWithRows(xmpp.mucConversation[xmpp.remote].chat.map(x => x));
    }

    let currentRow = -1;
    let isSent = xmpp.currentFileSent;

    return (
        <View style={[styles.containerNoTabs,{paddingTop: xmpp.group ? 1 : 50}]}>
          <InterpretationPreview />
          <View style={{flex:1}}>
            <ListView enableEmptySections
                      ref="messages"
                      renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
                      dataSource={dataSource}
                      renderRow={(row, index) => {
                        currentRow++;
                        currentRow < numRows-1 ? this.updateDate(conversations[xmpp.remote].chat[currentRow +1].date) : this.updateDate(row.date)
                        return (!row.image ?
                            <View>
                                {this.renderHeader(row.date, numRows, currentRow, nextDate)}
                              <View style={styles.bubble}>
                                <View style={row.own ? styles.bubbleRight : styles.bubbleLeft}>

                                   <Text style={[styles.messageItem, {color: row.own ? '#ffffff' : 'black'}]}>{row.text}</Text><Text style={{fontSize: 10,marginTop: -10,color: row.own ? '#ffffff' : 'black', textAlign: row.own ? 'right' : 'left'}}>{row.from ? this.prettifyUsername(row.from):null}</Text>
                                </View>
                                {lastTime === row.time ?null:<Text style={{textAlign: row.own ? 'right' : 'left', marginBottom: 5}}>{row.time}</Text>}
                              </View>
                              {this.upDateTime(row.time)}
                            </View>:

                            <TouchableHighlight style={styles.touch} underlayColor={'transparent'} key={row.text}
                                      onPress={isSent && row.text === this.state.selectedImage || row.sent ? () => Actions.conView({path: row.text, header:null }) : () => { this.retrySendImage(row.text); this.setState({selectedImage: row.text});}}>
                              <View>
                              {this.renderHeader(row.date, numRows, currentRow, nextDate)}
                               <Image source={{
                                  uri: row.text
                                 }}
                                 style={{
                                          width: 200,
                                          height: 300,
                                          alignSelf: row.own ? 'flex-end':'flex-start',
                                          opacity: isSent && row.text === this.state.selectedImage || row.sent ?  1 : 0.4

                                 }}
                               ><ActivityIndicator active={isSent && row.text === this.state.selectedImage || row.sent ? false : true}/></Image>
                                { lastTime === row.time ? null: <Text style={{textAlign: row.own ? 'right' : 'left'}}>{row.time}</Text>}
                               {this.upDateTime(row.time)}
                              </View>
                            </TouchableHighlight>

                        )
                         }}
            />
            { xmpp.sendFileError ? <Text style={[{color: 'red', textAlign:'right'}]}>{xmpp.sendFileError}</Text> : null}
          </View>
          <View style={styles.messageBar}>
            <View style={{flex:1}}>
              <TextInput ref='message'
                         value={this.state.message}
                         multiline={true}
                         onChangeText={(message)=>this.setState({message})}
                         autoCapitalize={'sentences'}
                         returnKeyType={'done'}
                         style={styles.message} placeholder="Enter message..."/>
            </View>
            <View style={styles.sendButton}>
              <Button onPress={()=> {xmpp.sendMessage(this.state.message, xmpp.group);this.setState({message:''})}}
                      disabled={!this.state.message || !this.state.message.trim() && xmpp.offlineMode}
                      style={{color: !this.state.message || !this.state.message.trim() && xmpp.offlineMode ? '#1d528830' : '#1d5288'}}>Send</Button>
            </View>
            {
              xmpp.group ? null :
                  <View style={{ justifyContent: 'center'}}>
                    <Button onPress={()=> {this.setState({showImagePicker: !this.state.showImagePicker}); dismissKeyboard();}}
                            disabled={!xmpp.remoteOnline || xmpp.offlineMode}>
                      <Icon
                          name="local-see"
                          color={!xmpp.remoteOnline || xmpp.offlineMode ? '#5E5E5E50':'#5E5E5E'}
                          style={{marginRight: 10}}
                          size={20}
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
