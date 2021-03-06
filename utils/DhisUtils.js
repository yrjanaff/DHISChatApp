/**
 * Created by yrjanaff on 24.01.2017.
 */
import InterpretationMeta from './InterpretationMeta';
import xmpp from './XmppStore';
var btoa = require('Base64').btoa;


export const fetchInterpretation = ( url, conversation ) => {
  return fetch(url + '?fields=*,!dataSet,!period,!organisationUnit,!lastUpdated,!created,!name,!displayName,!externalAccess,' +
      '!likes,!likedBy,!publicAccess,!translations,!userGroupAccesses,!attributeValues,!comments,user[name]', getDhisHeader())
      .then(( response ) => response.json())
      .then(( interpretation ) => {
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
          xmpp.saveInterpretation(new InterpretationMeta(interpretation.id, interpretation.user.name, interpretation.text,
              dhisApiURL + 'interpretations/' + interpretation.id, dhisApiURL + type + 's/' + typeId + '/data', conversation));
        }
      })
      .catch(( error ) => {
        console.error(error);
      });
};

export const getDhisHeader = () => {
  console.log(xmpp.username);
  console.log(xmpp.password);
  return {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${btoa(xmpp.username + ':' + xmpp.password)}`,
      'Content-Type': 'application/json'
    }
  }
};

export const getDhisHeaderUser = ( username, password ) => {
  return {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${btoa(username + ':' + password)}`,
      'Content-Type': 'application/json'
    }
  }
};

export const getDhisImageHeader = () => {
  return {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${btoa(xmpp.username + ':' + xmpp.password)}`,
      'Content-Type': 'image/png;charset=UTF-8'
    }
  }
};

export const postDhisHeader = () => {
  return {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(xmpp.username + ':' + xmpp.password)}`,
      'Content-Type': 'text/plain'
    }
  }
};


//export const dhisApiURL = 'https://197.243.37.125/hmis/api/';
//export const dhisApiURL = 'https://play.dhis2.org/demo/api/';
//export const realDhisApiURL = 'https://yj-dev.dhis2.org/dhis/api/';

export const dhisApiURL = 'https://hmis.moh.gov.rw/hmis/api/';