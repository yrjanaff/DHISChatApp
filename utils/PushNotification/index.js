import React from 'react';

import PushNotification from 'react-native-push-notification';

export default class PushController extends React.Component {

  constructor( props ) {
    super(props);
    this.state = {};
  }

  componentDidMount(){
    console.log("push did mount");
    PushNotification.configure({

      // (optional) Called when Token is generated (iOS and Android)
      // onRegister: function(token) {
      //  console.log( 'TOKEN:', token );
      // },

      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
        console.log( 'NOTIFICATION:');
        console.log(notification);
      },

      // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
      //senderID: "YOUR GCM SENDER ID",

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

    });
  }

  render(){
    return null;
  }

}


