import React from 'react';
import {View, Text, TouchableHighlight, ScrollView, TextInput}  from 'react-native';
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
      interpretations: [],
      search: ''
    };

    this.getInterpretations = this.getInterpretations.bind(this);
  }

  componentDidMount() {
    this.getInterpretations();
  }

  getInterpretations() {
    this.fetchInterpretations('fields=*,!dataSet,!period,!organisationUnit,!lastUpdated,!created,!name,!displayName,!externalAccess,' +
        '!likes,!likedBy,!publicAccess,!translations,!userGroupAccesses,!attributeValues,!comments,user[name]', true);
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

  fetchInterpretations(args, concat) {
    console.log('Inni fetch interpretations');
    let interpretations = new Array();
    return fetch('https://play.dhis2.org/demo/api/interpretations.json?page=' + page + '&pageSize=10&' + args, header)
        .then(( response ) => response.json())
        .then(( responseJson ) => {

          for( let i = 0; i < responseJson.interpretations.length; i++ ) {
            let interpretation = responseJson.interpretations[i];
                  console.log('inni siste fetch');
                  console.log(interpretation);
                  let type = interpretation.type.toLowerCase();
                  let typeId = '';

                  if( type === 'chart' ) {
                    typeId = interpretation.chart.id;
                  }
                  else if( type === 'map' ) {
                    typeId = interpretation.map.id;
                  }
                  else if( type === 'report_table' ) {
                    typeId = interpretation.reportTable.id;
                    type = 'reportTables';
                  }
                  else if( type === 'event_chart' ) {
                    typeId = interpretation.eventChart.id;
                    type = 'eventChart';
                  }

                  if( type != 'reportTables' && type != 'dataset_report' ) {
                    interpretations.push(new InterpretationMeta(interpretation.id, interpretation.user.name, interpretation.text, type, typeId));
                  }

                  if( i + 1 == responseJson.interpretations.length ) {
                    //this.setInterpret(interpretations);
                    if( this.state.interpretations === [] || !concat) {
                      this.setState({interpretations: interpretations});
                    }
                    else {
                      this.setState({interpretations: this.state.interpretations.concat(interpretations)});
                    }

                  }
        }})
        .catch(( error ) => {
          console.error(error);
        });
  }

  loadMore() {
    console.log('Inside loadMore');
    page++;
    this.getInterpretations();
  }

  search(search){
    console.log('inni search!');
    console.log(search);
    page = 1;

    this.fetchInterpretations('filter=text:ilike:' + search +
        '&fields=*,!dataSet,!period,!organisationUnit,!lastUpdated,!created,!name,!displayName,!externalAccess,' +
        '!likes,!likedBy,!publicAccess,!translations,!userGroupAccesses,!attributeValues,!comments,user[name]', false);
  }

  reset(){
    page = 1;
    this.fetchInterpretations('fields=*,!dataSet,!period,!organisationUnit,!lastUpdated,!created,!name,!displayName,!externalAccess,' +
        '!likes,!likedBy,!publicAccess,!translations,!userGroupAccesses,!attributeValues,!comments,user[name]', false);
  }

  render() {
    return (
        <View style={styles.container}>
          <ScrollView automaticallyAdjustContentInsets={true} horizontal={false}>
            <View style={styles.messageBar}>
              <View style={{flex:1}}>
                <TextInput ref='newComment'
                           value={this.state.search}
                           onChangeText={(search)=>this.setState({search})}
                           style={styles.message} placeholder="Search interpretation"/>
              </View>
              <View style={styles.sendButton}>
                <Button onPress={()=>{this.search(this.state.search);this.setState({search:''})}}
                        disabled={!this.state.search || !this.state.search.trim()}>Submit</Button>
              </View>
              </View>
            <View style={styles.button}><Button onPress={() => this.reset()}>Reset</Button></View>
            <View style={styles.button}><Button onPress={() => this.loadMore()}>Load More</Button></View>
            {console.log(this.state.interpretations)}
            {this.state.interpretations.map(( interpretation, index ) => {
              return (
                  <TouchableHighlight style={styles.touch} underlayColor={'#d3d3d3'} key={index}
                                      onPress={() => {Actions.interpretation({interpretation: interpretation});
                                      xmpp.setCurrentInterpretation(interpretation)}}>
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
