import React from 'react';
import {View, Text, TouchableHighlight, ScrollView, TextInput}  from 'react-native';
import Button from 'react-native-button';
import {Actions, ActionConst} from 'react-native-mobx';
import styles from './styles';
import xmpp from '../utils/XmppStore';
import { getDhisHeader, dhisApiURL } from '../utils/DhisUtils';
var btoa = require('Base64').btoa;
import InterpretationMeta from '../utils/InterpretationMeta';

let page = 1;

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
  }

  fetchInterpretations( args, concat ) {
    let interpretations = new Array();
    return fetch(dhisApiURL + 'interpretations.json?page=' + page + '&pageSize=10&' + args, getDhisHeader)
        .then(( response ) => response.json())
        .then(( responseJson ) => {
          for( let i = 0; i < responseJson.interpretations.length; i++ ) {
            let interpretation = responseJson.interpretations[i];
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
              let tempInterpret = new InterpretationMeta(interpretation.id, interpretation.user.name, interpretation.text, dhisApiURL + 'interpretations/' + interpretation.id,
                  dhisApiURL + type + 's/' + typeId + '/data', null)
              interpretations.push(tempInterpret);
              xmpp.saveInterpretation(tempInterpret);
            }
            if( i + 1 == responseJson.interpretations.length ) {
              if( this.state.interpretations === [] || !concat ) {
                this.setState({interpretations: interpretations});
              }
              else {
                this.setState({interpretations: this.state.interpretations.concat(interpretations)});
              }

            }
          }
        })
        .catch(( error ) => {
          console.error(error);
        });
  }

  loadMore() {
    page++;
    this.getInterpretations();
  }

  search( search ) {
    console.log('inni serach');
    page = 1;
    this.setState({interpretations: []});
    this.fetchInterpretations('filter=text:ilike:' + search +
        '&fields=*,!dataSet,!period,!organisationUnit,!lastUpdated,!created,!name,!displayName,!externalAccess,' +
        '!likes,!likedBy,!publicAccess,!translations,!userGroupAccesses,!attributeValues,!comments,user[name]', false);
  }

  reset() {
    page = 1;
    this.fetchInterpretations('fields=*,!dataSet,!period,!organisationUnit,!lastUpdated,!created,!name,!displayName,!externalAccess,' +
        '!likes,!likedBy,!publicAccess,!translations,!userGroupAccesses,!attributeValues,!comments,user[name]', false);
  }

  render() {
    return (
        <View style={styles.container}>
          <ScrollView automaticallyAdjustContentInsets={true} horizontal={false}>
            <View  style={{flex:1, flexDirection: 'row', borderColor: 'lightgray', borderBottomWidth: 5, marginBottom: 10}}>

                <TextInput ref='newComment'
                           value={this.state.search}
                           onChangeText={(search)=>this.setState({search})}
                           style={{height: 50,width: 400}} placeholder="Search for interpretation"
                           underlineColorAndroid="lightgray"
                           onSubmitEditing={()=>{
                              if(this.state.search !== '')
                                this.search(this.state.search);this.setState({search:''})}
                           }
                />
            </View>
            <View style={{flex: 1, flexDirection: 'row',justifyContent: 'space-around', borderColor: 'lightgray', borderBottomWidth: 7, marginBottom: 10}}>
            <View><Button style={{color: '#1d5288'}} onPress={() => this.reset()}>End search</Button></View>
            <View><Button style={{color: '#1d5288'}} onPress={() => this.loadMore()}>Load More</Button></View>
            </View>
            {this.state.interpretations.length === 0 ? <Text style={styles.emptyResult}>No results</Text> :
              this.state.interpretations.map(( interpretation, index ) => {
              return (
                  <TouchableHighlight style={styles.touch} underlayColor={'#d3d3d3'} key={index}
                                      onPress={() => {Actions.interpretation();
                                        xmpp.interpratationHasMuc = false;
                                      xmpp.setCurrentInterpretation(interpretation)}}>
                    <View key={index}>
                      <Text style={[styles.bold,{fontSize: 18}]}>{interpretation.name}</Text>
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
