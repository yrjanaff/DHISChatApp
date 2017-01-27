import React, {PropTypes} from 'react';
import {Text, View} from 'react-native';
import {Icon } from 'react-native-material-design';
import styles from './styles';
import xmpp from '../utils/XmppStore';

export default class TabIcon extends React.Component {
  constructor( props ) {
    super(props);
    this.state = {
      title: props.title,
      selected: props.selected
    }
  }

  componentWillReceiveProps(nexProps){
    this.setState({selected: nexProps.selected})
  }

  getIcon(tabtitle) {
    switch(tabtitle){
      case 'Chats': return 'chat-bubble';
      case 'Contacts': return 'contact-mail';
      case 'Groups': return  'forum';
      case 'Interpretations': return 'insert-chart';
      case 'Profile': return 'person';
    }
  }

  render() {
    let view = null;
    if( xmpp.unSeenNotifications[this.state.title] ) {
      xmpp.unSeenNotifications[this.state.title].length > 0 ?
          view = <View style={styles.badgeView}><Text style={styles.badge}>{xmpp.unSeenNotifications[this.state.title].length}</Text></View> :
          view = null
    }

    return (

        <View style={{flex: 1, flexDirection: 'column'}}>
          <Icon
              name={this.getIcon(this.state.title)}
              style={{justifyContent: 'flex-start', padding: 0, alignSelf: 'center'}}
              color={this.state.selected ? '#1d5288' : '#5E5E5E' }
          />
          {
            view
          }
          <Text style={{justifyContent: 'flex-end', fontSize: 10, color: this.state.selected ? '#1d5288' : 'black'}}>

            {this.state.title}
          </Text>
        </View>
    );
  }


}
