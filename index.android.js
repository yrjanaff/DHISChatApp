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
import Groups from './components/Groups';
import TabIcon from './components/TabIcon';
import InterpretationList from './components/InterpretationList';
import Settings from './components/Settings';
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
                <Scene key="chat" title="Chat" icon={TabIcon} component={Chats} initial={true} hideBackImage onBack={() => console.log("tried to go back")}
                       onRight={() => Actions.newChat()} rightTitle="new"/>
                <Scene key="contacts" title="Contacts" icon={TabIcon} component={Roster}  hideBackImage onBack={() => console.log("tried to go back")}/>
                <Scene key="group" title="Groups" icon={TabIcon} component={Groups} hideBackImage onBack={() => console.log("tried to go back")}
                       onRight={() => Actions.newMuc()}
                       rightTitle="new"/>
                <Scene key="interpretationList" title="Interpretations" icon={TabIcon} component={InterpretationList} hideBackImage onBack={() => console.log("tried to go back")}/>
                <Scene key="setting" title="Settings" icon={TabIcon} component={Settings} hideBackImage onBack={() => console.log("tried to go back")}/>
                <Scene key="newChat" component={ChatCreater} hideTabBar duration={1} title="Create a new chat" onLeft={() => Actions.chat()} leftTitle="back" />
                <Scene key="newMuc" component={MucCreater} hideTabBar duration={1} title="Create a new conference" onLeft={() => Actions.group()} leftTitle="back"/>
                <Scene key="interpretation" component={Interpretation} hideTabBar title="Interpretation" duration={1} onLeft={() => Actions.interpretationList()} leftTitle="back"/>
                <Scene key="conversation" component={Conversation} hideTabBar duration={1} onLeft={() => xmpp.group ? Actions.group() : Actions.chat()} leftTitle="back"/>
              </Scene>
              </Scene>
            </Scene>
          </Router>
      );
  }
});


AppRegistry.registerComponent('XmppDemo', () => XmppDemo);









