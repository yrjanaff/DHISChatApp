import React from 'react';
import {View, Text, TouchableHighlight, ScrollView, Image, TextInput}  from 'react-native';
import styles from './styles';
import xmpp from '../utils/XmppStore';
import {Actions} from 'react-native-mobx';
import { getDhisHeader } from '../utils/DhisUtils';

export default class InterpretationPreview extends React.Component {
  
  constructor(props){
    super(props);
    this.state= {
      test: '',
    }
  }
  
  render(){
    if(xmpp.remote === xmpp.currentInterpretation.conversationName){
      return (
          <View>
        <TouchableHighlight onPress={() => {xmpp.interpratationHasMuc = true; Actions.mucInterpretation({isMuc: true})} }>
          <View>
            <Image
                source={{
                            uri: xmpp.currentInterpretation.imageURL,
                            headers: getDhisHeader()
                          }}
                style={{
                            width: 100,
                            height: 100,
                            alignSelf: 'center'
                   }}
            />
            <Text>{ xmpp.currentInterpretation.text}</Text>
          </View>
        </TouchableHighlight>
      </View>)
    }else{
      return null;
    }
  }
}