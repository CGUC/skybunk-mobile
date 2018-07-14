import React from 'react';
import { AsyncStorage, ImageBackground, Dimensions, Text } from 'react-native';
import { Container, Content, List, ListItem } from 'native-base';
import api from '../../ApiClient';

export default class SettingsView extends React.Component {

  static navigationOptions = {
    title: 'Settings',
    headerTintColor: '#FFFFFF',
    headerStyle: {
      backgroundColor: '#fc4970'
    },
  };

  logout = () => {
    console.log('Pressed');
    AsyncStorage.removeItem('@Skybunk:token').then(() => {
      this.props.navigation.navigate('Auth');
    })
    .catch(error => {
      console.log(error);
    });
  }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={{flex: 1}}>
          <List>
            <ListItem>
              <Text onPress={() => {this.logout()}}>Logout</Text>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}