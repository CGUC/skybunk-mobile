import React from 'react';
import { StyleSheet } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Font, AppLoading } from 'expo';
import { Container, Text, View } from 'native-base';
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
  // This junk is just to avoid a bug with expo fonts...
  constructor(props) {
    super(props);
    this.state = { 
      loading: true,
    };
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ loading: false });
  }

  render() {
    if (this.state.loading) {
      return (
        <Container>
          <AppLoading/>
        </Container>
      );
    }
    else {
      return <RootStack/>;
    }
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