import React from 'react';
import {View,Text, TouchableHighlight, ScrollView}  from 'react-native';
import styles from './styles';
import xmpp from '../stores/XmppStore';
var btoa = require('Base64').btoa;


let header = {
  method: 'GET',
  headers: {
    'Authorization': `Basic ${btoa('admin:district')}`,
    'Content-Type': 'application/json'
  }
};

class InterpretationMeta{

  constructor( iId, userId, userName, iText, iType, typeId, comments ){
    this.iId = iId;
    this.userId = userId;
    this.userName = userName;
    this.iText = iText;
    this.iType = iType;
    this.typeId = typeId;
    this.comments = comments;
  }

}

export default class Interpretation extends React.Component {

  getInterpretations() {
    this.fetchInterpretations();
  }

  fetchInterpretations() {
    return fetch('https://play.dhis2.org/demo/api/interpretations.json?page=1&pageSize=10', header)
        .then((response) => response.json())
        .then((responseJson) => {
          console.log("Inside fetchInterpretations");
          console.log(responseJson);
          console.log(responseJson.interpretations);
          console.log("skal inn i for!");
          for(let i = 0; i < responseJson.interpretations.length; i++){
             fetch('https://play.dhis2.org/demo/api/interpretations/' + responseJson.interpretations[i].id, header)
                 .then((intResponse) => intResponse.json())
                 .then((intResponseJson) => {
                   console.log(intResponseJson);
                   let id = intResponseJson.id;
                   let userId = intResponseJson.user.id;
                   let text = intResponseJson.text;
                   let comments = intResponseJson.comments;

                   let type = intResponseJson.type.toLowerCase();
                   let typeId = '';
                   let metaList = [];
                   if(type === 'chart'){
                      typeId = intResponseJson.chart.id;
                   }
                   else if(type === 'map'){
                     typeId = intResponseJson.map.id;
                   }
                   else if(type === 'report_table'){
                     typeId = intResponseJson.reportTable.id;
                     type = 'reporTable';
                   }
                   let displayname = '';
                   fetch('https://play.dhis2.org/demo/api/users/' + userId, header)
                       .then((userRes) => userRes.json())
                       .then((userResJson) => {
                         displayname = userResJson.displayName;
                         return displayname;
                         
                       });

                   const interpretationMetadata = new InterpretationMeta(id, userId, displayname, text, type, typeId, comments);
                   console.log(interpretationMetadata);
                 })
          }

          return responseJson.interpretations;
        })
        .catch((error) => {
          console.error(error);
        });
  }

  render() {
    this.getInterpretations();
    return (
        <View style={styles.container}>
          <ScrollView  automaticallyAdjustContentInsets={true} horizontal={false} >

          </ScrollView>
        </View>
    )
  }
}