// import { createStackNavigator, createSwitchNavigator } from 'react-navigation';
// import LoginView from './views/login';
// import TestView from './views/test';
// import ChannelView from './views/Channel';
// //import PostView from './view/Post';

// const AppStack = createStackNavigator(
//   {
//     Test: TestView,
//     Channel: ChannelView,
//   }
// )

// export default createSwitchNavigator(
//   {
//     Auth: LoginView,
//     App: AppStack,
//     //Post: PostView,
//   },
//   { initialRouteName: 'Auth' }
// )
import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

import Navbar from './components/Navbar';
import ProfileHeader from "./components/ProfileHeader";
import UserChannels from "./components/UserChannels";
import styles from "./styles/styles";

export default class App extends React.Component {
  render() {
    return (
      <ScrollView>
        <ProfileHeader />
        <UserChannels />
      </ScrollView>
    );
  }
}
