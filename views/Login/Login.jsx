import React from 'react';
import { ImageBackground, View, AsyncStorage, Image, KeyboardAvoidingView, Platform, Linking, StatusBar } from 'react-native';
import { Font, AppLoading } from "expo";
import { Container, Content, Text, Button, Input, Item, Spinner } from 'native-base';
import notificationToken from '../../helpers/notificationToken';
import Banner from '../../components/Banner/Banner';
import ApiClient from '../../ApiClient';
import styles from './LoginStyle';

export default class LoginView extends React.Component {
  static navigationOptions = { header: null };

  constructor(props) {
    super(props);
    this.state = {
      registering: false,
      username: null,
      password: null,
      firstName: null,
      lastName: null,
      goldenTicket: null,
      loading: true,
      processing: false,
    };
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ loading: false });
  }

  toggleRegistering() {
    this.setState({
      registering: !this.state.registering,
      errorMessage: null,
    });
  }

  updateFormStateFunc(key) {
    return (text) => {
      this.setState({
        [key]: text,
      });
    };
  }

  contactWebmasters() {
    Linking.openURL(`mailto:webmaster@grebelife.com?subject=Skybunk%20Help%20`)
  }

  submitForm() {
    // Register the user
    if (this.state.registering) {
      this.setState({ processing: true });
      ApiClient.post('/users', {}, {
        username: this.state.username,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        goldenTicket: this.state.goldenTicket,
      })
        .then(response => response.json())
        .then(jsonResponse => {
          if (jsonResponse.message) {
            this.setState({
              errorMessage: jsonResponse.message, // TODO: Fix error from server and update here
              processing: false,
              successMessage: null,
            });
          }
          else {
            this.setState({
              firstName: null,
              lastName: null,
              goldenTicket: null,
              registering: false,
              processing: false,
              errorMessage: null,
              successMessage: 'Account successfully created'
            });
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
    // Login the user
    else {
      this.setState({ processing: true });
      ApiClient.post('/users/login', {}, {
        username: this.state.username,
        password: this.state.password,
      })
        .then(response => response.json())
        .then(jsonResponse => {
          if (jsonResponse.err) {
            this.setState({
              errorMessage: jsonResponse.err.message,
              succesMessage: null,
              processing: false,
            });
          }
          else {
            AsyncStorage.setItem('@Skybunk:token', jsonResponse.token).then(() => {
              ApiClient.get('/users/loggedInUser').then(user => {
                notificationToken.registerForPushNotificationsAsync(user, jsonResponse.token);
                this.props.navigation.navigate('Home', {token: jsonResponse.token, user});
              })
              .catch(err => console.error(err));
            }).catch(error => {
              console.error(error);
              this.setState({
                errorMessage: 'Sorry, there was an error logging you in',
                successMessage: null,
                processing: false,
              });
            });
          }
        })
        .catch(err => {
          console.error(err);
          this.setState({
            errorMessage: err.message,
            successMessage: null,
            processing: false,
          });
        });
    }
  }

  render() {
    StatusBar.setBarStyle('dark-content', true);

    const registerFields =
      <View>
        <Item regular style={styles.inputItem}>
          <Input placeholder='First Name' onChangeText={(this.updateFormStateFunc('firstName'))} />
        </Item>
        <Item regular style={styles.inputItem}>
          <Input placeholder='Last Name' onChangeText={(this.updateFormStateFunc('lastName'))} />
        </Item>
        <Item regular style={styles.inputItem}>
          <Input placeholder='Golden Ticket #' onChangeText={(this.updateFormStateFunc('goldenTicket'))} />
        </Item>
      </View>;

      const logoIcon = 
        <View>
          <Image
            source={require('../../assets/login-logo.png')}
            style={styles.loginLogo}
          />
        </View>;


    if (this.state.loading) {
      return (
        <Container>
          <AppLoading />
        </Container>
      );
    } else {
      return (
        <ImageBackground
          style={styles.background}
          source={require('../../assets/login-bg.png')}
        >
          <Container>
            <Content contentContainerStyle={{ flex: 1, alignItems: 'center' }}>
              <KeyboardAvoidingView
                style={styles.loginInputGroup}
                flex={this.state.registering ? 0.70 : 0.75}
                behavior='padding'
                enabled
              >
                {this.state.registering ? null : logoIcon}

                <Text style={styles.loginTitle}>
                  {this.state.registering ? 'Register' : 'Sign In'}
                </Text>

                <Item regular last style={styles.inputItem}>
                  <Input
                    placeholder='Username'
                    onChangeText={(this.updateFormStateFunc('username'))}
                  />
                </Item>
                <Item regular style={styles.inputItem}>
                  <Input
                    placeholder='Password'
                    secureTextEntry
                    onChangeText={(this.updateFormStateFunc('password'))}
                  />
                </Item>

                {this.state.registering ? registerFields : null}
              </KeyboardAvoidingView>

              <View
                style={styles.loginButtonsGroup}
                flex={this.state.registering ? 0.2 : 0.35}
              >
                {this.state.errorMessage ? <Banner error message={this.state.errorMessage} /> : null}
                {this.state.successMessage ? <Banner success message={this.state.successMessage} /> : null}

                <Button
                  block
                  onPress={this.submitForm.bind(this)}
                  style={styles.loginButton}
                  disabled={this.state.processing}
                >
                  <Text>{this.state.registering ? 'Register' : 'Login'}</Text>
                </Button>
                { Platform.OS === 'ios' ? 
                  <Button
                    transparent
                    block
                    dark
                    onPress={() => Linking.openURL('https://www.grebelife.com/skybunk')}
                  >
                    <Text>{"Don't have an account?"}</Text>
                  </Button>
                 :
                  <Button
                    transparent
                    block
                    dark
                    onPress={this.toggleRegistering.bind(this)}
                  >
                    <Text>{this.state.registering ? 'Already have an account?' : "Don't have an account?"}</Text>
                  </Button>
                }
                <Button
                  transparent
                  block
                  dark
                  onPress={this.contactWebmasters.bind(this)}
                >
                  <Text>{"Contact the webmasters!"}</Text>
                </Button>

                {this.state.processing ? <Spinner color='blue' /> : null}
              </View>
            </Content>
          </Container>
        </ImageBackground>
      );
    }
  }
}
