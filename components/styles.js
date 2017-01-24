'use strict';
var React = require('react-native');
var {StyleSheet, PixelRatio, Platform} = React;
var styles = StyleSheet.create({
    container: {
        flex:1,
        paddingTop: 70,
        backgroundColor: '#F7F7F7',
        paddingBottom:50

    },
    containerNoTabs: {
      flex:1,
      paddingTop: 70,
      backgroundColor: '#F7F7F7'
    },
    centercontainer: {
        flex:1,
        paddingTop: 70,
        backgroundColor: '#F7F7F7',
        justifyContent: 'center',
        alignItems: 'center'
    },
    row: {
        flexDirection: 'row',
        backgroundColor:'white',
        borderRadius: 0,
        borderWidth: 0,
        borderTopWidth: 1 / PixelRatio.get(),
        borderColor: '#d6d7da',
        padding:10,
        alignItems: 'center'
    },
    categoryLabel: {
        fontSize: 15,
        textAlign: 'left',
        left: 10,
        padding:10,
        fontWeight:'bold',
    },
    lastRow: {
        flexDirection: 'row',
        backgroundColor:'white',
        borderRadius: 0,
        borderWidth: 0,
        borderTopWidth: 1 / PixelRatio.get(),
        borderBottomWidth: 1 / PixelRatio.get(),
        borderColor: '#d6d7da',
        padding:10,
        alignItems: 'center'
    },
    rowLabel: {
        left:10,
        flex:1,
        fontSize:15,
    },
    rowInput: {
        fontSize:15,
        flex:1,
        height:(Platform.OS=='ios') ? 30 : 50
    },
    messageItem: {
        padding:10,
        paddingRight:20,
        fontSize:15
    },
    messageBar: {
        backgroundColor:'white',
        flexDirection:'row',
        left:0,
        right:0,
        height:55
    },
    message: {
        left:10,
        right:10,
        fontSize:15,
        flex:1,
        height:30
    },
    button: {
        backgroundColor: 'white',
        padding: 15,
        borderColor: '#eeeeee',
        borderWidth:1,
        borderBottomWidth: 1 / PixelRatio.get(),
        marginTop:20,
        borderRadius:10,
        width:300,
        marginRight:20,
        marginLeft:20,
        alignSelf: 'center'
    },
    sendButton: {
        justifyContent: 'center',
        width:80
    },
    navBar: {
        backgroundColor: '#0db0d9'
    },
    loadingContainer: {
        position: 'absolute',
        top:0,
        bottom:0,
        left:0,
        right:0,
        backgroundColor:'black',
        opacity:0.7,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loading: {
        width:70,
        borderRadius: 6,
        height:70,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'white'
    },
    touch: {
        alignSelf: 'stretch',
        marginLeft: 10,
        marginBottom: 10
    },
    bold:{
      fontWeight: 'bold'
    },
    toContainer: {
      justifyContent: 'space-between'
    },
    dateColor: {
      color: '#c3c3c3',
      fontSize: 11
    },

    online: {
      marginTop: 7,
      marginLeft: 10,
      marginRight: 7,
      borderRadius: 100,
      width: 12,
      height: 12,
      backgroundColor:"#57B061"
    },
    unavailable: {
      marginTop: 7,
      marginLeft: 10,
      marginRight: 7,
      borderRadius: 100,
      width: 12,
      height: 12,
      backgroundColor:"#778899"
    },
    idle: {
      marginTop: 7,
      marginLeft: 10,
      marginRight: 7,
      borderRadius: 100,
      width: 12,
      height: 12,
      backgroundColor:"#ffea00"
    },
    badgeView: {
      alignSelf: 'center',
      position:'absolute',
      top:0,
      right:-9,
      backgroundColor:'#CC0000',
      width:15,
      height:15,
      borderRadius:100,
    },
    badge: {
      fontSize: 10,
      color:'white',
      textAlign:'center',
      fontWeight: 'bold',
      lineHeight:15,
    },


});


module.exports = styles;
