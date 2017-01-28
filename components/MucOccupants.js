import React from 'react';
import {View, Text,TouchableHighlight } from 'react-native';
import Button from 'react-native-button';
import xmpp from '../utils/XmppStore'
import styles from './styles'
import { Icon } from 'react-native-material-design';


export default class MucOccupants extends React.Component {
  constructor( props ) {
    super(props);
  }


  render() {
    return(
        <View style={[styles.containerNoTabs,{paddingTop:50, backgroundColor: '#1d528890'}]}>
          <TouchableHighlight>
            <View style={{flex:1, flexDirection: 'row', justifyContent:'center', borderColor: 'lightgray', borderBottomWidth: 4, marginBottom: 10}}>
              <Text style={{color:'white', marginRight:5, fontSize: 16}} >Add participant</Text>
              <Icon
                name='group-add'
                color='#ffffff'
                style={{marginBottom: 20}}
              />
            </View>
          </TouchableHighlight>
          <Button  style={{color: 'white'}}onPress={()=> xmpp.drawerOpen = false }>
            close
          </Button>
        </View>
    );
  }

}
// style={{height: height-20}}>