import React from 'react';
import {View, Text, TouchableHighlight, ScrollView}  from 'react-native';
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

let page = 1;

class InterpretationMeta {

  constructor( iId, userId, userName, iText, iType, typeId, comments ) {
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

  constructor(props) {
    super(props);

    this.state = {
      interpretations: []
    };

    this.getInterpretations = this.getInterpretations.bind(this);
  }

  componentDidMount(){
    this.getInterpretations();
  }

  async getInterpretations() {
    let interpretationsMeta = await this.fetchInterpretations();
  }

  setInterpret(list){
    //legge til i lista hvis den allerede eksisterer!
    this.setState({interpretations: list});
    console.log('satte state i setInterpret');
  }

  async fetchInterpretations() {
    let interpretations = new Array();
    return fetch('https://play.dhis2.org/demo/api/interpretations.json?page='+ page + '&pageSize=10', header)
        .then(( response ) => response.json())
        .then(async( responseJson ) => {

          for( let i = 0; i < responseJson.interpretations.length; i++ ) {
            fetch('https://play.dhis2.org/demo/api/interpretations/' + responseJson.interpretations[i].id, header)
                .then(( intResponse ) => intResponse.json())
                .then(async( intResponseJson ) => {

                  let type = intResponseJson.type.toLowerCase();
                  let typeId = '';

                  if( type === 'charts' ) {
                    typeId = intResponseJson.chart.id;
                  }
                  else if( type === 'maps' ) {
                    typeId = intResponseJson.map.id;
                  }
                  else if( type === 'report_table' ) {
                    typeId = intResponseJson.reportTable.id;
                    type = 'reportTables';
                  }

                  let username = await this.getUsername(intResponseJson.user.id);

                  interpretations.push(new InterpretationMeta(intResponseJson.id, intResponseJson.user.id, username, intResponseJson.text, type, typeId, intResponseJson.comments));

                  if(i + 1 == responseJson.interpretations.length){
                    this.setInterpret(interpretations);
                  }//console.log(interpretationMetadata);
                })
          }

          return interpretations;
        }).then( this.setInterpret(interpretations))
        .catch(( error ) => {
          console.error(error);
        });
  }

  async getUsername( userId ) {
    console.log('Inside getUsername!!!');
    const response = await fetch('https://play.dhis2.org/demo/api/users/' + userId, header);
    const json = await response.json();

    return json.displayName;
  }

  loadMore() {
    page++;
    this.fetchInterpretations();
  }

  render() {
    return (
        <View style={styles.container}>
          <ScrollView automaticallyAdjustContentInsets={true} horizontal={false}>
            {console.log(this.state.interpretations)}
            {this.state.interpretations.map(( interpretation, index ) => {
              return (
                  <TouchableHighlight style={styles.touch} underlayColor={'#d3d3d3'} key={index}>
                  <View key={index}>
                    <Text style={styles.bold}>{interpretation.userName}</Text>
                    <Text>
                      {interpretation.iText}
                    </Text>
                  </View>
              </TouchableHighlight>
              );
            })}
          </ScrollView>
        </View>
    )
  }
}
