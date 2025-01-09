/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
// import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
  NavigationContainer
} from '@react-navigation/native';
import 'react-native-gesture-handler'; // Place at the very top of your App.js
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// import {PrimaryNav} from './AppNavigation'
import PrimaryNav from './AppNavigation';

/** Static Pattern */
// const Navigation = createStaticNavigation(PrimaryNav);
// function App(){


//   return (<GestureHandlerRootView><Navigation /></GestureHandlerRootView>);
// }
/** Static Pattern */

function App(){


  return (<GestureHandlerRootView><NavigationContainer><PrimaryNav /></NavigationContainer></GestureHandlerRootView>);
}

export default App;
