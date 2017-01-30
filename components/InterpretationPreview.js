import React from 'react';
import {View, Text, TouchableHighlight, ScrollView, Image, TextInput}  from 'react-native';
import styles from './styles';
import {Icon } from 'react-native-material-design';
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
    if(xmpp.remote === xmpp.remoteMuc[0] && xmpp.remoteMuc[2].indexOf(xmpp.currentInterpretation.id) != -1){
      return (
        <TouchableHighlight onPress={() => {xmpp.interpratationHasMuc = true; Actions.mucInterpretation({isMuc: true})}} style={{borderBottomColor:'lightgray', borderBottomWidth: 4, paddingBottom:20}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 20}}>
            <Image
                source={{
                            uri: xmpp.currentInterpretation.imageURL,
                            headers: getDhisHeader()
                          }}
                style={{
                            width: 100,
                            height: 100,
                            alignSelf: 'flex-end',
                            backgroundColor: '#f3f3f3',
                            marginLeft: 10,
                            marginRight: 10
                   }}
            />
            <Text style={{flex: 1, marginRight: 10}}>{xmpp.currentInterpretation.text.length > 240 ? xmpp.currentInterpretation.text.slice(0,260).concat('...') : xmpp.currentInterpretation.text}</Text>
            <Icon
                name={'keyboard-arrow-right'}
                style={{justifyContent: 'flex-start', padding: 0, alignSelf: 'center'}}
                color={this.state.selected ? '#1d5288' : '#5E5E5E' }
            />
          </View>
        </TouchableHighlight>
      )
    }else{
      return null;
    }
  }
}