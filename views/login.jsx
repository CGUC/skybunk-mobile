import React from 'react';
import { Dimensions, ImageBackground, View } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Label, Body, Right, Title, Form, Input, Item } from 'native-base';
import { Font, AppLoading } from "expo";

export default class LoginView extends React.Component {
  static navigationOptions = { header: null };

  constructor(props) {
    super(props);
    this.state = { 
      loading: true,
      registering: false,
      username: null,
      password: null,
      firstName: null,
      lastName: null,
      goldenTicket: null
    };
  }

  // This is just to avoid a bug with expo...
  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ loading: false });
  }

  toggleRegistering() {
    this.setState({
      ...this.state,
      registering: !this.state.registering,
      errorMessage: null,
    });
  }

  updateLastName(text) {
    this.setState({
      ...this.state,
      lastName: text,
    });
  }

  updateFirstName(text) {
    this.setState({
      ...this.state,
      firstName: text,
    });
  }

  updateUsername(text) {
    this.setState({
      ...this.state,
      username: text,
    });
  }

  updateGoldenTicket(text) {
    this.setState({
      ...this.state,
      goldenTicket: text,
    });
  }

  updatePassword(text) {
    this.setState({
      ...this.state,
      password: text,
    });
  }

  submitForm() {
    if (this.state.registering) {
      fetch('http://api.grebelife.com/users/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          goldenTicket: this.state.goldenTicket,
        }),
      })
      .then(response => response.json())
      .then(jsonResponse => {
        console.log(jsonResponse);
        if (jsonResponse.message) {
          this.setState({
            ...this.state,
            errorMessage: jsonResponse.message
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
    else {
      fetch('http://api.grebelife.com/users/login/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
        }),
      })
      .then(response => response.json())
      .then(jsonResponse => {
        console.log(jsonResponse);
        if (jsonResponse.err) {
          this.setState({
            ...this.state,
            errorMessage: jsonResponse.err.message
          });
        }
        else {
          this.props.navigation.navigate('Test');
        }
      })
      .catch(err => {
        console.log(err);
      });
    }
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
      const registerFields = 
        <View>
          <Item floatingLabel>
            <Label>First Name</Label>
            <Input onChangeText={this.updateFirstName.bind(this)}/>
          </Item>
          <Item floatingLabel>
            <Label>Last Name</Label>
            <Input onChangeText={this.updateLastName.bind(this)}/>
          </Item>
          <Item floatingLabel>
            <Label>Golden Ticket #</Label>
            <Input onChangeText={this.updateGoldenTicket.bind(this)}/>
          </Item>
        </View>;

      // Put these in own component
      const errorBanner = 
        <View style={{backgroundColor: '#C00', marginTop: 10}}>
          <Text style={{paddingLeft: 10, color: 'white'}}>{this.state.errorMessage}</Text>
        </View>;
      const successBanner = 
        <View style={{backgroundColor: '#0C0', marginTop: 10}}>
          <Text style={{paddingLeft: 10, color: 'white'}}>{this.state.successMessage}</Text>
        </View>;

      return (
        <ImageBackground 
          style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height}}
          source={{uri: 'http://backgroundcheckall.com/wp-content/uploads/2017/12/tumblr-hipster-background-12.jpg'}}
        >
          <Container>
            <Content contentContainerStyle={{ justifyContent: 'center', flex: 0.8, marginLeft: 50, marginRight: 50 }}>
              <Title>Grapp</Title>
              <Form>
                <Item floatingLabel>
                  <Label>User Name</Label>
                  <Input onChangeText={this.updateUsername.bind(this)}/>
                </Item>
                <Item floatingLabel>
                  <Label>Password</Label>
                  <Input secureTextEntry onChangeText={this.updatePassword.bind(this)}/>
                </Item>
                {this.state.registering ? registerFields : null}
              </Form>
              {this.state.errorMessage ? errorBanner : null}
              {this.state.successMessage ? successBanner : null}
              <View style={{marginTop: 10}}>
                <Button transparent dark onPress={this.submitForm.bind(this)}>
                  <Text>{this.state.registering ? 'Register' : 'Login'}</Text>
                </Button>
                <Button transparent light onPress={this.toggleRegistering.bind(this)}>
                  <Text>{this.state.registering ? 'Login' : 'Register'}</Text>
                </Button>
              </View>
            </Content>
          </Container>
        </ImageBackground>
      );
    }
  }
}
