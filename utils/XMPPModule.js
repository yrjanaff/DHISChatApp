'use strict';
/**
 * This exposes the native rnxmpp module as a JS module.
 * The module uses aSmack to connect and communicate with a Openfire server
 *
 * See the source code for mor information
 */
import {NativeModules} from 'react-native';
module.exports = NativeModules.XMPP;