import React from 'react';
import { Dimensions, ImageBackground, View } from 'react-native';
import { Font, AppLoading } from "expo";
import {
  Container, Header, Content, Footer, Card, CardItem, Thumbnail, Text, Button, Icon,
  Left, Label, Body, Right, Title, Form, Input, Item
} from 'native-base';

import config from '../config';
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
      loading: true
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
              ...this.state,
              errorMessage: jsonResponse.message // TODO: Fix error from server and update here
            });
          }
          else {
            this.setState({
              firstName: null,
              lastName: null,
              password: null,
              goldenTicket: null,
              registering: false,
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
      ApiClient.post('/users/login', {}, {
        username: this.state.username,
        password: this.state.password,
      })
        .then(response => response.json())
        .then(jsonResponse => {
          if (jsonResponse.err) {
            this.setState({
              ...this.state,
              errorMessage: jsonResponse.err.message
            });
          }
          else {
            // TODO: Save jsonResponse.token
            this.props.navigation.navigate('App');
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  getBypassJSX() {
    if (config.exposeLoginBypass) {
      return (
        <Footer>
          <View style={{ paddingBottom: 30 }}>
            <Button danger onPress={() => { this.props.navigation.navigate('App') }}>
              <Text>Bypass Login</Text>
            </Button>
          </View>
        </Footer>
      )
    } else {
      return null;
    }
  }

  render() {
    const registerFields =
      <View>
        <Item floatingLabel>
          <Label>First Name</Label>
          <Input onChangeText={(this.updateFormStateFunc('firstName'))} />
        </Item>
        <Item floatingLabel>
          <Label>Last Name</Label>
          <Input onChangeText={(this.updateFormStateFunc('lastName'))} />
        </Item>
        <Item floatingLabel>
          <Label>Golden Ticket #</Label>
          <Input onChangeText={(this.updateFormStateFunc('goldenTicket'))} />
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
          source={{ uri: 'http://backgroundcheckall.com/wp-content/uploads/2017/12/tumblr-hipster-background-12.jpg' }}
        >
          <Container>
            <Content contentContainerStyle={{ justifyContent: 'center', flex: 0.8, marginLeft: 50, marginRight: 50 }}>
              <Title>Skybunk</Title>

              <Form>
                <Item floatingLabel>
                  <Label>User Name</Label>
                  <Input onChangeText={(this.updateFormStateFunc('username'))} />
                </Item>
                <Item floatingLabel>
                  <Label>Password</Label>
                  <Input secureTextEntry onChangeText={(this.updateFormStateFunc('password'))} />
                </Item>
                {this.state.registering ? registerFields : null}
              </Form>

              {this.state.errorMessage ? <Banner error message={this.state.errorMessage} /> : null}
              {this.state.successMessage ? <Banner error message={this.state.successMessage} /> : null}

              <View style={{ marginTop: 10 }}>
                <Button style={{ marginLeft: 15, marginTop: 5 }} bordered light onPress={this.submitForm.bind(this)}>
                  <Text>{this.state.registering ? 'Register' : 'Login'}</Text>
                </Button>
                <Button transparent dark onPress={this.toggleRegistering.bind(this)}>
                  <Text>{this.state.registering ? 'Already have an account?' : "Don't have an account?"}</Text>
                </Button>
              </View>

            </Content>

            {this.getBypassJSX()}

          </Container>
        </ImageBackground>
      );
    }
  }
}
