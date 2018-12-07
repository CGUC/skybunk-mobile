import React from 'react';
import { AsyncStorage, ImageBackground, Dimensions } from 'react-native';
import { Spinner, Container, Content } from 'native-base';
import api from '../../ApiClient';
import style from './SplashStyle';
import notificationToken from '../../helpers/notificationToken';

export default class SplashScreen extends React.Component {

  static navigationOptions = { header: null };

  componentWillMount() {
    api.get('/users/loggedInUser').then(user => {
      if (user._id) {
        notificationToken.registerForPushNotificationsAsync(user);
        this.props.navigation.navigate('Home', {user: user});
      }
      else {
        this.props.navigation.navigate('Auth');
      }
    }).catch(err => this.props.navigation.navigate('Auth'));
  }

  render() {
    return (
      <ImageBackground
        style={style.background}
        source={require('../../assets/splash.png')}
      >
        <Container>
          <Content contentContainerStyle={style.contentContainer}>
            <Spinner color='#cd8500' />
          </Content>
        </Container>
      </ImageBackground>
    );
  }
}