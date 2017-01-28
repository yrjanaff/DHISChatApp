import React from 'react';
import {View, Text, TouchableHighlight, ScrollView, TextInput, RefreshControl}  from 'react-native';
import Button from 'react-native-button';
import {Actions, ActionConst} from 'react-native-mobx';
import styles from './styles';
import xmpp from '../utils/XmppStore';
import { getDhisHeader, dhisApiURL } from '../utils/DhisUtils';
import InterpretationMeta from '../utils/InterpretationMeta';

let page = 1;

export default class InterpretationList extends React.Component {

  constructor( props ) {
    super(props);

    this.state = {
      interpretations: [],
      search: '',
      isRefreshing: false,
      isSearching: false
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

  fetchInterpretations( args, concat ) {
    let interpretations = new Array();
    return fetch(dhisApiURL + 'interpretations.json?page=' + page + '&pageSize=15&' + args, getDhisHeader)
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
                  dhisApiURL + type + 's/' + typeId + '/data', null);
              interpretations.unshift(tempInterpret);
              xmpp.saveInterpretation(tempInterpret);
            }
            if( i + 1 == responseJson.interpretations.length ) {
              if( this.state.interpretations === [] || !concat ) {
                this.setState({isRefreshing: false});
                this.setState({interpretations: interpretations});
              }
              else {
                this.setState({isRefreshing: false});
                this.setState({interpretations: interpretations.concat(this.state.interpretations)});
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

  onRefresh(){
    this.setState({isRefreshing: true});
    this.loadMore();
  }

  render() {
    return (
        <View style={styles.container}>
          <ScrollView
              style={{flex: 1}}
              contentInset={{bottom:49}}
              automaticallyAdjustContentInsets={false}
              refreshControl={
                <RefreshControl
                    refreshing={this.state.isRefreshing}
                    onRefresh={() => this.onRefresh()}
                    title="Loading interpretations..."
                    titleColor="#00ff00"
                    colors={['#1d5288', '#3383d4', '#215f9d']}
                    tintColor="#EBEBEB"
                    progressBackgroundColor="#EBEBEB"
                />
               }
          >
            <View  style={{flex:1, flexDirection: 'row', borderColor: 'lightgray', borderBottomWidth: 5, marginBottom: 10}}>

                <TextInput ref='newComment'
                           value={this.state.search}
                           onChangeText={(search)=>{this.setState({search}); this.setState({isSearching: true})}}
                           returnKeyType={'search'}
                           style={{height: 50, width: 340}} placeholder="Search for interpretation"
                           underlineColorAndroid="transparent"
                           onSubmitEditing={()=>{
                              if(this.state.search !== '')
                                this.search(this.state.search);}
                           }
                  />
              <View style={styles.sendButton}>
                <Button  onPress={()=> {
                    if( this.state.search !== '')
                      this.search(this.state.search);
                    }}
                         disabled={!this.state.search || !this.state.search.trim() && xmpp.offlineMode}
                         style={{color: !this.state.search || !this.state.search.trim() && xmpp.offlineMode ? '#1d528830' : '#1d5288'}}>Search</Button>
              </View>
              
            </View>
            { this.state.search !== '' ?
              <View
                  style={{flex: 1, flexDirection: 'row',justifyContent: 'space-around', borderColor: 'lightgray', borderBottomWidth: 5, marginBottom: 10}}>
                <View><Button style={{color: '#1d5288'}} onPress={() => {this.reset(); this.setState({search:''});}}>End search</Button></View>
              </View> : null
            }
            {this.state.interpretations.length === 0 ? <Text style={styles.emptyResult}>No results</Text> :
              this.state.interpretations.map(( interpretation, index ) => {
              return (
                  <TouchableHighlight style={styles.touch} underlayColor={'#d3d3d3'} key={index}
                                      onPress={() => {
                                        xmpp.interpratationHasMuc = false;
                                      xmpp.setCurrentInterpretation(interpretation);
                                      Actions.interpretation();}}>
                    <View key={index} style={{flex:1, flexDirection: 'column', borderBottomColor: 'lightgray', borderBottomWidth: 0.5, marginBottom: 10 }}>
                      <Text style={[styles.bold,{fontSize: 18}]}>{interpretation.name}</Text>
                      <Text style={{marginBottom: 10}}>
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
