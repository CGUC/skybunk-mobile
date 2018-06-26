import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import LoginView from './views/login';
import TestView from './views/test';

const RootStack = createStackNavigator({
    Login: LoginView,
    Test: TestView,
  },
  {
    initialRouteName: 'Login',
  }
);

export default class App extends React.Component {
  
  render() {
    return <RootStack/>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});