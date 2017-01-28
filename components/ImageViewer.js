import React from 'react';
import {View, AppRegistry, StyleSheet,}  from 'react-native';
import PhotoView from 'react-native-photo-view';
import styles from './styles';

export default class ImageViewer extends React.Component {

  constructor( props ) {
    super(props);
    this.state = {
      path: props.path,
      header: props.header
    };
  }

  componentWillReceiveProps( nextProps ) {
    this.setState({
      path: nextProps.path,
      header: nextProps.header
    })
  }

  render() {
    return (
        <View style={styles.photoContainer}>
          <PhotoView
              source={{uri: this.state.path, header: this.state.header}}
              scale={1.0}
              minimumZoomScale={0.5}
              maximumZoomScale={5}
              androidScaleType="fitCenter"
              onLoad={() => console.log("Image loaded!")}
              style={styles.photo}/>
        </View>
    )
  }
}