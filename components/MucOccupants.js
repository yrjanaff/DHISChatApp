import React from 'react';
import {View, Text,TouchableHighlight, TextInput, ToastAndroid } from 'react-native';
import Button from 'react-native-button';
import xmpp from '../utils/XmppStore'
import styles from './styles'
import { Icon } from 'react-native-material-design';
import ListRoster from './ListRoster'


export default class MucOccupants extends React.Component {
  constructor( props ) {
    super(props);

    this.state = {adding: false, occupantsName:[]}

    this.occupantToAdd = this.occupantToAdd.bind(this);

  }
  componentWillMount(){
    this.setState({occupants:  this.occupantsList(xmpp.roster)})
  }
  occupantsList(roster){
    let filteredRoster = [];
    let occupantsName = [];
    console.log(roster)

    for(let i = 0; i < xmpp.mucRemote[3]; i++ ){
      console.log(xmpp.mucRemote[4]);
      if(roster[xmpp.mucRemote[4][i].split('/')[1]]) {
        filteredRoster.push(roster[xmpp.mucRemote[4][i].split('/')[1]])
        occupantsName.push(roster[xmpp.mucRemote[4][i].split('/')[1]].username.toLowerCase())
      }
    }

    this.setState({occupantsName})
    return filteredRoster;
  }

  foundMatch(text) {
    console.log(this.state.occupantsName)
    console.log(this.state.occupantsName.indexOf(text))
    let filteredRoster =[];
    for (let k in xmpp.roster) {
      if(xmpp.roster[k].displayName.toLowerCase().indexOf(text) >= 0)
        filteredRoster.unshift(xmpp.roster[k]);
    }
console.log(filteredRoster)
    this.setState({
      text,
      occupants: filteredRoster
    });

  }

  occupantToAdd(username){
    console.log(username)
    console.log(xmpp.mucRemote)
    if(this.state.occupantsName.indexOf(username) > -1){
      ToastAndroid.show('User is already in group', ToastAndroid.LONG);
    }
    else{
      xmpp.addUserToGroup(username, xmpp.mucRemote[1], xmpp.mucRemote[2] )
      this.setState({adding: false})
    }
  }

  componentWillReceiveProps(props){this.setState({occupants:  this.occupantsList(props.roster)})}

  render() {
    return(
        <View style={[styles.containerNoTabs,{backgroundColor: '#1d5288'}]}>
          <TouchableHighlight onPress={() => this.setState({adding: true})}>
          {
            this.state.adding ?
                <View style={{flex:1, flexDirection: 'row', justifyContent:'center', borderColor: 'lightgray', borderBottomWidth: 4, marginBottom: 10}}>
                  <TextInput
                      style={{height:40, flex:1, color: 'white'}}
                      onChangeText={(text) => {this.setState({text});this.foundMatch(text)}}
                      value={this.state.text}
                      underlineColorAndroid="#1d5288"
                      placeholder="Search"
                      placeholderTextColor={"white"}
                  />
                </View>:
                <View style={{flex:1, flexDirection: 'row', justifyContent:'center', borderColor: 'lightgray', borderBottomWidth: 4, marginBottom: 10}}>
                  <Text style={{color:'white', marginRight:5, fontSize: 16}} >Add participant</Text>
                  <Icon
                    name='group-add'
                    color='#ffffff'
                    style={{marginBottom: 20}}
                  />
                </View>
          }
          </TouchableHighlight>
          <ListRoster style={{color:'white'}} roster={this.state.occupants} clicked={this.occupantToAdd}/>
          <Button  style={{color: 'white'}} onPress={()=> xmpp.drawerOpen = false }>
            close
          </Button>
        </View>
    );
  }

}
// style={{height: height-20}}>