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
    console.log(xmpp.remote)
    console.log(xmpp.currentInterpretation)

    console.log(xmpp.remoteMuc);
    let intUrl = xmpp.remoteMuc[1];

    if(xmpp.remote === xmpp.remoteMuc[0] && xmpp.remoteMuc[1].indexOf(xmpp.currentInterpretation.id) != -1){
      console.log('kom gjennom iffen!');
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
            <Text style={{flex: 1, marginRight: 10}}>{xmpp.currentInterpretation.text.slice(0,240).concat('...')}</Text>
          </View>
        </TouchableHighlight>
      )
    }else{
      return null;
    }
  }
}