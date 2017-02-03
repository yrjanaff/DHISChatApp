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
    this.state = {adding: false, occupantsName:[],mucRemote: xmpp.mucRemote}
    this.occupantToAdd = this.occupantToAdd.bind(this);
    this.occupantsList = this.occupantsList.bind(this);


  }
  componentDidMount(){
    this.setState({occupants:  this.occupantsList(xmpp.roster)})
  }
  occupantsList(roster){
    let filteredRoster = [];
    let occupantsName = [];

    for(let i = 0; i < this.state.mucRemote[3]; i++ ){
      if(roster[this.state.mucRemote[4][i].split('/')[1]]) {
        filteredRoster.push(roster[this.state.mucRemote[4][i].split('/')[1]])
        occupantsName.push(roster[this.state.mucRemote[4][i].split('/')[1]].username.toLowerCase())
      }
    }
    this.setState({occupantsName})
    return filteredRoster;
  }

  foundMatch(text) {
    let filteredRoster =[];
    for (let k in xmpp.roster) {
      if(xmpp.roster[k].displayName.toLowerCase().indexOf(text) >= 0 || xmpp.roster[k].username.toLowerCase().indexOf(text) >= 0) {
        filteredRoster.unshift(xmpp.roster[k]);
      }
    }
    this.setState({
      text,
      occupants: filteredRoster
    });

  }

  occupantToAdd(username){
    if(this.state.occupantsName.indexOf(username) > -1){
      ToastAndroid.show('User is already in group', ToastAndroid.LONG);
    }
    else{
      ToastAndroid.show('User added', ToastAndroid.LONG);
      xmpp.addUserToGroup(username, this.state.mucRemote[1], this.state.mucRemote[2] )
      this.setState({adding: false})

      this.setState({occupants:  this.occupantsList(xmpp.roster)})
      xmpp.drawerOpen = false
      this.setState({text: ''})
    }
  }

  componentWillReceiveProps(props){ this.setState({mucRemote:props.remote}); this.setState({occupants:  this.occupantsList(props.roster) }); console.log("will receive"); console.log(this.state.mucRemote); console.log(this.state.roster)}


  render() {
    return(
        <View style={[{backgroundColor: '#1d5288', flex: 1}]}>
          <TouchableHighlight onPress={() => this.setState({adding: true})} underlayColor="transparent">
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
                  <Text style={{color:'white', marginRight:5, fontSize: 16, marginTop: 25}} >Add participant</Text>
                  <Icon
                    name='group-add'
                    color='#ffffff'
                    style={{marginBottom: 20, marginTop: 25}}
                  />
                </View>
          }
          </TouchableHighlight>
          <ListRoster style={{color:'white'}} roster={this.state.occupants} clicked={this.occupantToAdd}/>

        </View>
    );
  }

}
// style={{height: height-20}}>