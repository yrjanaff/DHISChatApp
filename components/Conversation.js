import React from 'react';
import {View, Text, ScrollView, TextInput, Keyboard, ListView, Dimensions}  from 'react-native';
import styles from './styles';
const height = Dimensions.get('window').height;
import Button from 'react-native-button';
import {Actions} from 'react-native-mobx';
var InvertibleScrollView = require('react-native-invertible-scroll-view');
import xmpp from '../stores/XmppStore';
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class Conversation extends React.Component {
    static title(props){
      const username = xmpp.remote.split("@");
      return username[0];
    }
    constructor(props) {
        super(props);
        this.state = {
        group: props.group};

    }

    render() {
      //xmpp.sendMessage(this.state.message, xmpp.group);this.setState({message:''})}} disabled={!this.state.message || !this.state.message.trim()
      let dataSource = ds.cloneWithRows([],[]);

      if( !xmpp.group && xmpp.conversation[xmpp.remote] ){
        dataSource = ds.cloneWithRows(xmpp.conversation[xmpp.remote].chat.map(x => x));
      }
      if( xmpp.group && xmpp.mucConversation[xmpp.remote] ){
        dataSource = ds.cloneWithRows(xmpp.mucConversation[xmpp.remote].chat.map(x => x));
      }

        return (
            <View style={styles.containerNoTabs}>
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
                                   onSubmitEditing={() => {xmpp.sendMessage(this.state.message, xmpp.group);this.setState({message:''})}} disabled={!this.state.message || !this.state.message.trim()}/>
                    </View>
                    <View style={styles.sendButton}>
                        <Button onPress={()=> xmpp.fileTransfer() }>Send</Button>
                    </View>
                </View>
            </View>
        )
    }
}

module.exports = Conversation;
