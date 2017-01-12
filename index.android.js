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
import Interpretation from './components/Interpretation';
import xmpp from './stores/XmppStore';
// Define all routes of the app
var XmppDemo = React.createClass({

  render: function() {
      return (
          <Router xmpp={xmpp}>
            <Scene key="main" component={Switch} tabs selector={()=>!xmpp.logged ? 'login' : 'content'}>
              <Scene key="login" component={Login} title="Login"/>
              <Scene key="content" title="her er det en tittel">
              <Scene key="tabs" tabs={true} hideNavBar>
                <Scene key="chat" title="Chats" icon={TabIcon} groups={false} component={Chats}  initial={true} hideBackImage onBack={() => console.log("tried to go back")}
                       onRight={() => Actions.newChat()} rightTitle="new"/>
                <Scene key="contacts" title="Contacts" icon={TabIcon} component={Roster}  hideBackImage onBack={() => console.log("tried to go back")}/>
                <Scene key="group" title="Groups" icon={TabIcon}  groups={true} component={Chats}  hideBackImage onLeft={()=>xmpp.getAllJoinedMucs(xmpp.mucUsername)} leftTitle="get MUCs"
                       onRight={() => Actions.newMuc()}
                       rightTitle="new"/>
                <Scene key="interpretation" title="Interpretations" icon={TabIcon} component={Interpretation} hideBackImage />
                <Scene key="newChat" component={ChatCreater} hideTabBar duration={1} title="Create a new chat" onLeft={() => Actions.chat()} leftTitle="back" />
                <Scene key="newMuc" component={MucCreater} hideTabBar duration={1} title="Create a new conference" onLeft={() => Actions.group()} leftTitle="back"/>
                <Scene key="conversation" component={Conversation} hideTabBar duration={1} onLeft={() => Actions.chat()} leftTitle="back"/>
              </Scene>
              </Scene>
            </Scene>
          </Router>
      );
  }
});


AppRegistry.registerComponent('XmppDemo', () => XmppDemo);









