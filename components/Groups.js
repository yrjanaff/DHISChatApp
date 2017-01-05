import React from 'react';
import {View}  from 'react-native';
import Button from 'react-native-button';
import styles from './styles';

export default class Groups extends React.Component {
  constructor( props ) {
    super(props);
    this.state = {};
  }

  render() {
    return (
        <View style={styles.container}>
          <Button onPress={() => console.log("pressed")}>click here!</Button>
        </View>
    )
  }

}
