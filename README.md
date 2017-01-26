# DHISChatApp
React Native XMPP chat application **(Android only)** for DHIS 2 using a [custom Openfire server](https://github.com/yrjanaff/DHISOpenfire).

To run the app:

1. Clone the repo and use npm to install node_modules:
`
npm install
`

2. Then, locate this file: `  node_modules/react-native-photo-view/android/src/main/java/com/reactnative/photoview/ImageEvent.java`

3. And add `eventType` to the code, as shown below:
```javascript
public ImageEvent(int viewId, @ImageEventType int eventType) {
      super(viewId, eventType); //<-- Add eventType
      mEventType = eventType;
      mMap = null;
}
```

4. Clone, build and start the Openfire server. It can be found [here](https://github.com/yrjanaff/DHISOpenfire).

5. Start android emulator and run `react-native run-android`