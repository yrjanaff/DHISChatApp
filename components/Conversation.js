import React from 'react';
import {View, Text, ScrollView, TextInput, Keyboard, ListView, Dimensions, Image}  from 'react-native';
import styles from './styles';
const height = Dimensions.get('window').height;
import Button from 'react-native-button';
import {Actions} from 'react-native-mobx';
var InvertibleScrollView = require('react-native-invertible-scroll-view');
import xmpp from '../stores/XmppStore';
const ds = new ListView.DataSource({rowHasChanged: ( r1, r2 ) => r1 !== r2});
import CameraRollPicker from 'react-native-camera-roll-picker';

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
    this.setState({selectedImage: props[0].uri})
    //CameraRollPicker.

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

    return (
        <View style={styles.containerNoTabs}>
          <Image source={{
                          uri: this.state.selectedImage
                        }}
                 style={{
                          width: 200,
                          height: 300,
                          alignSelf: 'center'
                 }}
          />
          <View style={{flex:1}}>
            <ListView enableEmptySections
                      ref="messages"
                      renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
                      dataSource={dataSource}
                      renderRow={(row) =>
                            <Text style={[styles.messageItem, {textAlign:row.own ? 'right':'left' }]}>{row.text}</Text>}
            />
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
            <View style={styles.sendButton}>
              <Button onPress={()=> this.setState({showImagePicker: this.state.showImagePicker ? false : true}) }>Image</Button>
            </View>
          </View>
          {
            this.state.showImagePicker
                ? <CameraRollPicker
                // callback={this.setState({selectedImage: this.getSelectedImages})}
                callback={this.getImage}
                maximum={1}
                selected={null}
                assetType='All'

            />
                : null
          }
        </View>
    )
  }
}

module.exports = Conversation;
