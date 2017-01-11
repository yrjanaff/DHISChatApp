import React from 'react';
import {AppRegistry} from 'react-native';
import { Scene, Router, Reducer, Switch } from 'react-native-mobx';
import Conversation from './components/Conversation';
import Login from './components/Login';
import { Actions, ActionConst } from 'react-native-router-flux';
import Roster from './components/Roster';
import Chats from './components/Chats';
import ChatCreater from './components/ChatCreater';
import MucCreater from './components/MucCreater';
import TabIcon from './components/TabIcon';
import xmpp from './stores/XmppStore';
// Define all routes of the app
var XmppDemo = React.createClass({

  render: function() {

     const reducerCreate = params=>{
         const defaultReducer = Reducer(params);
         return (state, action)=>{
             return defaultReducer(state, action);
         }
     };

      return (
          <Router xmpp={xmpp} createReducer={reducerCreate}>
            <Scene key="main" component={Switch} tabs selector={()=>!xmpp.logged ? 'login' : 'tabs'}>
              <Scene key="login" component={Login} title="Login"/>
              <Scene key="tabs" tabs={true} hideNavBar>
                <Scene key="chat" title="Chats" groups={false} component={Chats}  hideBackImage icon={TabIcon}  onLeft={()=>alert("Left button!")} leftTitle="Left" />
                <Scene key="contacts" title="Contacts" icon={TabIcon}>
                  <Scene key="roster" component={Roster}  hideBackImage  initial={true} title="Roster" onLeft={()=>alert("Left button!")} leftTitle="Left"/>
                  <Scene key="conversation" component={Conversation} hideTabBar duration={1}/>
                  <Scene key="newChat" component={ChatCreater} hideTabBar duration={1} title="Create a new chat"/>
                </Scene>
                <Scene key="group" title="Groups" groups={true} component={Chats} hideBackImage icon={TabIcon} onLeft={()=>alert("Left button!")} leftTitle="Left"  />
                <Scene key="newMuc" component={MucCreater} hideTabBar duration={1} title="Create a new conference"/>
              </Scene>
            </Scene>
          </Router>
      );
  }
});


AppRegistry.registerComponent('XmppDemo', () => XmppDemo);






