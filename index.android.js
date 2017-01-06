import React from 'react';
import {AppRegistry} from 'react-native';
import { Scene, Router, Reducer, Switch } from 'react-native-mobx';
import Conversation from './components/Conversation';
import Login from './components/Login';
import { Actions } from 'react-native-router-flux';
import Roster from './components/Roster';
import Groups from './components/Groups';
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
                <Scene key="contacts" title="Contacts"  initial={true} icon={TabIcon}>
                  <Scene key="roster" component={Roster}  hideBackImage title="Roster"/>
                  <Scene key="conversation" component={Conversation} hideTabBar title={xmpp.remote} duration={1}/>
                </Scene>
                <Scene key="group" title="Groups" component={Groups} hideBackImage icon={TabIcon} />
              </Scene>
            </Scene>
          </Router>
      );
  }
});


AppRegistry.registerComponent('XmppDemo', () => XmppDemo);






