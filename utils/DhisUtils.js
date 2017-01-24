/**
 * Created by yrjanaff on 24.01.2017.
 */
import InterpretationMeta from './InterpretationMeta';
import xmpp from './XmppStore';



export const fetchInterpretation = (url , conversation) => {
    return fetch(url + '?fields=*,!dataSet,!period,!organisationUnit,!lastUpdated,!created,!name,!displayName,!externalAccess,' +
        '!likes,!likedBy,!publicAccess,!translations,!userGroupAccesses,!attributeValues,!comments,user[name]', getDhisHeader())
        .then((response) => response.json())
        .then((interpretation) =>{
          console.log('inni fhisutil');
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
            xmpp.saveInterpretation(new InterpretationMeta(interpretation.id, interpretation.user.name, interpretation.text,
                'https://play.dhis2.org/demo/api/interpretations/' + interpretation.id, 'https://play.dhis2.org/demo/api/' + type + 's/' + typeId + '/data', conversation));
          }
        })
        .catch(( error ) => {
          console.error(error);
        });
  };

export const getDhisHeader = () =>
  {
    return {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${btoa('admin:district')}`,
        'Content-Type': 'application/json'
      }
    }
  };
