'use strict';
var React = require('react-native');
var {StyleSheet, PixelRatio, Platform} = React;
import Dimensions from 'Dimensions';
var styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingTop: 70,
    backgroundColor: '#F7F7F7',
    paddingBottom: 50

  },
  containerNoTabs: {
    flex: 1,
    paddingTop: 70,
    backgroundColor: '#F7F7F7'
  },
  photoContainer: {
    flex: 1,
    paddingTop: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
  },
  photo: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centercontainer: {
    flex: 1,
    paddingTop: 70,
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center'
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center'
  },
  categoryLabel: {
    fontSize: 15,
    textAlign: 'left',
    left: 10,
    padding: 10,
    fontWeight: 'bold',
  },
  lastRow: {
    flexDirection: 'row',
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center'
  },
  rowLabel: {
    left: 10,
    flex: 1,
    fontSize: 15,
  },
  rowInput: {
    borderRightWidth: 1 / PixelRatio.get(),
    borderBottomWidth: 1 / PixelRatio.get(),
    borderRadius: 10,
    fontSize: 15,
    flex: 1,
    backgroundColor: '#ffffff',
    height: (Platform.OS == 'ios') ? 30 : 50,

  },
  messageItem: {
    paddingTop: 10,
    paddingBottom: 0,
    paddingRight: 20,
    fontSize: 15
  },
  messageBar: {
    backgroundColor: 'white',
    flexDirection: 'row',
    left: 0,
    right: 0,
    height: 55
  },
  message: {
    left: 10,
    right: 10,
    fontSize: 15,
    flex: 1,
    height: 30
  },
  button: {
    backgroundColor: '#14395F',
    padding: 15,
    borderColor: '#e3e3e3',
    borderRightWidth: 1 / PixelRatio.get(),
    borderBottomWidth: 1 / PixelRatio.get(),
    marginTop: 20,
    borderRadius: 10,
    width: 300,
    marginRight: 20,
    marginLeft: 20,
    alignSelf: 'center',

  },
  sendButton: {
    justifyContent: 'center',
    width: 80
  },
  navBar: {
    backgroundColor: '#0db0d9'
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    opacity: 0.7,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loading: {
    width: 70,
    borderRadius: 6,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  touch: {
    marginLeft: 10,
    marginBottom: 10
  },
  bold: {
    fontWeight: 'bold'
  },
  toContainer: {
    justifyContent: 'space-between'
  },
  dateColor: {
    color: '#a3a3a3',
    fontSize: 16,
    paddingRight: 5
  },

  online: {
    marginTop: 7,
    marginLeft: 10,
    marginRight: 7,
    borderRadius: 100,
    width: 12,
    height: 12,
    backgroundColor: "#57B061"
  },
  unavailable: {
    marginTop: 7,
    marginLeft: 10,
    marginRight: 7,
    borderRadius: 100,
    width: 12,
    height: 12,
    backgroundColor: "#778899"
  },
  idle: {
    marginTop: 7,
    marginLeft: 10,
    marginRight: 7,
    borderRadius: 100,
    width: 12,
    height: 12,
    backgroundColor: "#ffea00"
  },
  badgeView: {
    alignSelf: 'center',
    position: 'absolute',
    top: 0,
    right: -9,
    backgroundColor: '#CC0000',
    width: 15,
    height: 15,
    borderRadius: 100,
  },
  badge: {
    fontSize: 10,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: 15,
  },

  talkBubble: {
    margin: 40,
    position: 'relative',
    width: 200,
    backgroundColor: 'lightyellow',
  }


});


module.exports = styles;
