import React from 'react';
import {AppRegistry} from 'react-native';
import {Router, Switch, Scene} from 'react-native-mobx';
import Conversation from './components/Conversation';
import Login from './components/Login';
import Roster from './components/Roster';
import xmpp from './stores/XmppStore';
// Define all routes of the app
var XmppDemo = React.createClass({
  render: function() {
      return (
          <Router xmpp={xmpp}>
            <Scene key="main" tabs component={Switch} selector={()=>!xmpp.logged ? 'login' : 'roster'}>
              <Scene key="login" component={Login} title="Login"/>
              <Scene key="roster" component={Roster} title="Roster"/>
              <Scene key="conversation" component={Conversation}/>
            </Scene>
          </Router>
      );
  }
});

AppRegistry.registerComponent('XmppDemo', () => XmppDemo);
