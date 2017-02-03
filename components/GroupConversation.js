import React from 'react'
import { View, Dimensions, Text } from 'react-native'
import Conversation from './Conversation'
import xmpp from '../utils/XmppStore'
var {height} = Dimensions.get('window');
import Drawer from 'react-native-drawer'
import MucOccupant from './MucOccupants'
import styles from './styles';


export default class GroupConversation extends React.Component {
  static title( props ) {
    if(!xmpp.group) {
      return xmpp.roster[xmpp.remote].displayName;
    }else{
      return xmpp.remote.split('@')[0];
    }

  }
  constructor( props ) {
    super(props);
  }

  render() {
    let open = xmpp.drawerOpen;
    return(
       <View style={[styles.containerNoTabs,{paddingTop: 50}] }>
         <Drawer
             type="overlay"
             open={open}
             content={<MucOccupant roster={xmpp.roster} remote={xmpp.mucRemote}/>}
             tapToClose={false}
             openDrawerOffset={0.4} // 20% gap on the right side of drawer
             panCloseMask={0.2}
             closedDrawerOffset={-3}
             side="right"
             styles={{
               shadowColor: '#000000',
               shadowOpacity: 1,
               shadowRadius: 3,

             }}
             tweenHandler={(ratio) => ({
               main: { opacity:(2-ratio)/2 }
             })}
         >
           <Conversation/>
         </Drawer>
       </View>

    );
  }

}
