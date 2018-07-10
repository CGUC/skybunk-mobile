import React from 'react';
import { AsyncStorage, ImageBackground, Dimensions } from 'react-native';
import { Spinner, Container, Content } from 'native-base';
import api from '../ApiClient';

export default class SplashScreen extends React.Component {

  static navigationOptions = { header: null };

  componentWillMount() {
    AsyncStorage.getItem('@Skybunk:token').then(value => {
      if (!value) this.props.navigation.navigate('Auth');
      api.get('/users/loggedInUser', { 'Authorization': 'Bearer ' + value}).then(user => {
        if (user._id) {
          this.props.navigation.navigate('App');
        }
        else {
          this.props.navigation.navigate('Auth');
        }
      }).catch(err => this.props.navigation.navigate('Auth'));
    })
    .catch(err => {
      console.error(err);
      this.props.navigation.navigate('Auth');
    });
  }

  render() {
    return (
      <ImageBackground
        style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
        source={require('../assets/login-bg.png')}
      >
        <Container>
          <Content contentContainerStyle={{flex: 1, justifyContent:'center'}}>
            <Spinner color='#cd8500' />
          </Content>
        </Container>
      </ImageBackground>
    );
  }
}