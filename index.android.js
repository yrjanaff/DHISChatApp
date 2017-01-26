import React from 'react';
import {AppRegistry} from 'react-native';
import { Scene, Router, Route, Reducer, Switch } from 'react-native-mobx';
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
import ImageViewer from './components/ImageViewer';
import xmpp from './utils/XmppStore';
import {Icon } from 'react-native-material-design';
// Define all routes of the app
var DhisChat = React.createClass({

  render: function() {
    return (
        <Router>
          <Scene key="root" component={Switch} type={ActionConst.RESET}  tabs selector={()=>!xmpp.logged ? 'login' : 'tabbar'}>
            <Scene key="login" component={Login} title="Login" hideNavBar={true}/>

            <Scene key="tabbar" tabs={true} >
              <Scene key="chatTab" title="Chats" icon={TabIcon}>
                <Scene key="chat" title="Chats" icon={TabIcon} component={Chats} initial={true} hideBackImage onBack={() => null}
                       onRight={() => Actions.newChat()} rightTitle={
                  <Icon
                      name='add-box'
                      color='#ffffff'
                  />
                } duration={0}  titleStyle={{color: 'white', fontSize: 20}} navigationBarStyle={ {
                  backgroundColor: '#1d5288',
                  borderColor: '#4c4c4c',
                  borderBottomWidth: 3,
                }}/>
                <Scene key="newChat" component={ChatCreater} hideTabBar duration={0} title="Create a new chat"/>
                <Scene key="conversation" component={Conversation} hideTabBar duration={0} onBack={() => {Actions.chat({type:ActionConst.RESET})}}/>
                <Scene key="conView" component={ImageViewer} hideTabBar duration={0} title="Zoom"/>
              </Scene>

              <Scene key="contactsTab" title="Contacts" icon={TabIcon}>
                <Scene key="contacts" title="Contacts" duration={0} component={Roster}  hideBackImage
                       onBack={() => null}/>
                <Scene key="contactsConversation" component={Conversation} hideTabBar duration={0} onBack={() => {Actions.contacts({type:ActionConst.RESET})}}/>
              </Scene>

              <Scene key="groupTab" title="Groups" icon={TabIcon}>
                <Scene key="group" title="Groups" component={Groups} hideBackImage duration={0}
                       onBack={() => null}
                       onRight={() => {Actions.newMuc();}}
                       rightTitle="new"/>
                <Scene key="groupConversation" component={Conversation} hideTabBar duration={0} onBack={() => {Actions.group({type:ActionConst.RESET})}}/>
                <Scene key="mucInterpretation" component={Interpretation} hideTabBar title="Interpretation" duration={0}/>
                <Scene key="newMuc" component={MucCreater} hideTabBar duration={0} title="Create a new conference"/>
              </Scene>

              <Scene key="interpretationTab" title="Interpretations" icon={TabIcon} >
                <Scene key="interpretationList" title="Interpretations" duration={0} component={InterpretationList} hideBackImage onBack={() => null}/>
                <Scene key="interpretation" component={Interpretation} hideTabBar title="Interpretation" duration={0}/>
                <Scene key="newInterpretationMuc" component={MucCreater} hideTabBar duration={0} title="Create a new conference" onBack={() => {xmpp.createInterpretationMuc = false; Actions.pop()}}/>
                <Scene key="intView" component={ImageViewer} hideTabBar duration={0} title="Zoom"/>
              </Scene>

              <Scene key="settings" title="Settings" component={Settings} icon={TabIcon} hideBackImage onBack={() => null}/>

            </Scene>

          </Scene>

        </Router>



    );
  }
});


AppRegistry.registerComponent('DhisChat', () => DhisChat);








