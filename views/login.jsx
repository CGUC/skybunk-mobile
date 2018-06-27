import React from 'react';
import { Dimensions, ImageBackground, View } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon,
  Left, Label, Body, Right, Title, Form, Input, Item } from 'native-base';
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
      goldenTicket: null
    };
  }

  toggleRegistering() {
    this.setState({
      ...this.state,
      registering: !this.state.registering,
      errorMessage: null,
    });
  }

  updateFormStateFunc(key) {
    return function(text) {
      this.setState({
        ...this.state,
        [key]: text,
      });
    }
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
          this.props.navigation.navigate('Test');
        }
      })
      .catch(err => {
        console.log(err);
      });
    }
  }

  render() {
    const updateUsername = this.updateFormStateFunc('username');
    const updatePassword = this.updateFormStateFunc('password');
    const updateFirstName = this.updateFormStateFunc('firstName');
    const updateLastName = this.updateFormStateFunc('lastName');
    const updateGoldenTicket = this.updateFormStateFunc('goldenTicket');

    const registerFields = 
      <View>
        <Item floatingLabel>
          <Label>First Name</Label>
          <Input onChangeText={updateUsername.bind(this)}/>
        </Item>
        <Item floatingLabel>
          <Label>Last Name</Label>
          <Input onChangeText={updateLastName.bind(this)}/>
        </Item>
        <Item floatingLabel>
          <Label>Golden Ticket #</Label>
          <Input onChangeText={updateGoldenTicket.bind(this)}/>
        </Item>
      </View>;

    return (
      <ImageBackground 
        style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height}}
        source={{uri: 'http://backgroundcheckall.com/wp-content/uploads/2017/12/tumblr-hipster-background-12.jpg'}}
      >
        <Container>
          <Content contentContainerStyle={{ justifyContent: 'center', flex: 0.8, marginLeft: 50, marginRight: 50 }}>
            <Title>Skybunk</Title>
            
            <Form>
              <Item floatingLabel>
                <Label>User Name</Label>
                <Input onChangeText={updateUsername.bind(this)}/>
              </Item>
              <Item floatingLabel>
                <Label>Password</Label>
                <Input secureTextEntry onChangeText={updatePassword.bind(this)}/>
              </Item>
              {this.state.registering ? registerFields : null}
            </Form>
            
            {this.state.errorMessage ? <Banner error message={this.state.errorMessage}/> : null}
            {this.state.successMessage ? <Banner error message={this.state.successMessage}/> : null}
            
            <View style={{marginTop:10}}>
              <Button style={{marginLeft:15, marginTop:5}} bordered light onPress={this.submitForm.bind(this)}>
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
