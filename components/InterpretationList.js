import React from 'react';
import {View, Text, TouchableHighlight, ScrollView}  from 'react-native';
import Button from 'react-native-button';
import {Actions} from 'react-native-mobx';
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

  constructor( id, name, text, type, typeId, comments ) {
    this.id = id;
    this.name = name;
    this.text = text;
    this.type = type;
    this.typeId = typeId;
  }
}

export default class InterpretationList extends React.Component {

  constructor( props ) {
    super(props);

    this.state = {
      interpretations: []
    };

    this.getInterpretations = this.getInterpretations.bind(this);
  }

  componentDidMount() {
    this.getInterpretations();
  }

  getInterpretations() {
    this.fetchInterpretations();
  }

  setInterpret( list ) {
    //legge til i lista hvis den allerede eksisterer!
    if( this.state.interpretations === [] ) {
      this.setState({interpretations: list});
    }
    else {
      this.setState({interpretations: this.state.interpretations.concat(list)});
    }
    console.log('satte state i setInterpret');
  }

  fetchInterpretations() {
    console.log('Inni fetch interpretations');
    let interpretations = new Array();
    return fetch('https://play.dhis2.org/demo/api/interpretations.json?page=' + page + '&pageSize=10', header)
        .then(( response ) => response.json())
        .then(( responseJson ) => {

          for( let i = 0; i < responseJson.interpretations.length; i++ ) {
            fetch('https://play.dhis2.org/demo/api/interpretations/' + responseJson.interpretations[i].id +
                '?fields=*,!lastUpdated,!created,!name,!displayName,!userGroupAccesses,!attributeValues,!publicAccess,!externalAccess,!likes,!likedBy,!translations,!comments,user[name]', header)
                .then(( intResponse ) => intResponse.json())
                .then(( intResponseJson ) => {
                  console.log('inni siste fetch');
                  console.log(intResponseJson);
                  let type = intResponseJson.type.toLowerCase();
                  let typeId = '';

                  if( type === 'chart' ) {
                    typeId = intResponseJson.chart.id;
                  }
                  else if( type === 'map' ) {
                    typeId = intResponseJson.map.id;
                  }
                  else if( type === 'report_table' ) {
                    typeId = intResponseJson.reportTable.id;
                    type = 'reportTables';
                  }
                  else if( type === 'event_chart' ) {
                    typeId = intResponseJson.eventChart.id;
                    type = 'eventChart';
                  }

                  if( type != 'reportTables' && type != 'dataset_report' ) {
                    interpretations.push(new InterpretationMeta(intResponseJson.id, intResponseJson.user.name, intResponseJson.text, type, typeId));
                  }

                  if( i + 1 == responseJson.interpretations.length ) {
                    //this.setInterpret(interpretations);
                    if( this.state.interpretations === [] ) {
                      this.setState({interpretations: interpretations});
                    }
                    else {
                      this.setState({interpretations: this.state.interpretations.concat(interpretations)});
                    }
                  }
                })
          }
          return interpretations;
        })
        .catch(( error ) => {
          console.error(error);
        });
  }

  loadMore() {
    console.log('Inside loadMore');
    page++;
    this.fetchInterpretations(page);
  }

  render() {
    return (
        <View style={styles.container}>
          <ScrollView automaticallyAdjustContentInsets={true} horizontal={false}>
            <View style={styles.button}><Button onPress={() => this.loadMore()}>Load More</Button></View>
            {console.log(this.state.interpretations)}
            {this.state.interpretations.map(( interpretation, index ) => {
              return (
                  <TouchableHighlight style={styles.touch} underlayColor={'#d3d3d3'} key={index}
                                      onPress={() => {Actions.interpretation({interpretation: interpretation}); xmpp.setCurrentInterpretation(interpretation)}}>
                    <View key={index}>
                      <Text style={styles.bold}>{interpretation.name}</Text>
                      <Text>
                        {interpretation.text}
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
