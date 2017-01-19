import React, {PropTypes} from 'react';
import {Text, View} from 'react-native';
import {Icon } from 'react-native-material-design';
const propTypes = {
  selected: PropTypes.bool,
  title: PropTypes.string,
};

const TabIcon = (props) => (

    <View style={{flex:1, flexDirection: 'column'}}>
      <Icon
          name={getIcon(props.title, props.selected)}
          style={{justifyContent: 'flex-start', padding:0, alignSelf: 'center'}}
          color={props.selected ? '#276696' : '#5E5E5E' }
      />

      <Text style={{justifyContent: 'flex-end', fontSize: 10, color: props.selected ? '#276696' : 'black' }}>

        {props.title}
      </Text>
    </View>
);

const getIcon = (tabtitle, selected)  => {
  switch(tabtitle){
    case 'Chats': return 'chat-bubble';
    case 'Contacts': return 'contact-mail';
    case 'Groups': return  'forum';
    case 'Interpretations': return 'insert-chart';
    case 'Settings': return 'brightness-5';
  }
}

TabIcon.propTypes = propTypes;

export default TabIcon;
