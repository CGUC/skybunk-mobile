import React from 'react';
import { Dimensions, ImageBackground, View, AsyncStorage } from 'react-native';
import { Font, AppLoading } from "expo";
import styles from "../styles/styles";
import {
  Container, Header, Content, Footer, Card, CardItem, Thumbnail, Text, Button, Icon,
  Left, Label, Body, Right, Title, Form, Input, Item, Spinner
} from 'native-base';

import Banner from '../components/Banner'
import ApiClient from '../ApiClient'

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

  submitForm() {
    // Register the user
    if (this.state.registering) {
      this.setState({processing:true});
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
        console.log(err);
      });
    }
    // Login the user
    else {
      this.setState({processing:true});
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
            this.props.navigation.navigate('App');
          }).catch(error => {
            this.setState({
              errorMessage: 'Sorry, there was an error logging you in',
              successMessage: null,
              processing: false,
            });
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
    }
  }

  render() {
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

    if (this.state.loading) {
      return (
        <Container>
          <AppLoading />
        </Container>
      );
    } else {
      return (
        <ImageBackground
          style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
          source={require('../assets/login-bg.png')}
        >
          <Container>
            <Content contentContainerStyle={{ justifyContent: 'center', flex: 1, marginLeft: 50, marginRight: 50 }}>
              <Form>
                <Item regular style={styles.inputItem}>
                  <Input placeholder='Username' onChangeText={(this.updateFormStateFunc('username'))} />
                </Item>
                <Item regular style={styles.inputItem}>
                  <Input placeholder='Password' secureTextEntry onChangeText={(this.updateFormStateFunc('password'))} />
                </Item>
                {this.state.registering ? registerFields : null}
              </Form>

              {this.state.errorMessage ? <Banner error message={this.state.errorMessage} /> : null}
              {this.state.successMessage ? <Banner success message={this.state.successMessage} /> : null}
              {this.state.processing ? <Spinner color='blue' /> : null}

              <View>
                <Button onPress={this.submitForm.bind(this)}>
                  <Text>{this.state.registering ? 'Register' : 'Login'}</Text>
                </Button>
                <Button transparent dark onPress={this.toggleRegistering.bind(this)}>
                  <Text>{this.state.registering ? 'Already have an account?' : "Don't have an account?"}</Text>
                </Button>
              </View>

            </Content>
          </Container>
        </ImageBackground>
      );
    }
  }
}
