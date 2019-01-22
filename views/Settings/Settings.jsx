import React from 'react';
import {TouchableOpacity, ImageBackground, Dimensions, Text } from 'react-native';
import { Container, Content, View, List, ListItem } from 'native-base';

import styles from './SettingsStyle';
import ApiClient from '../../ApiClient';
import {clearCache} from '../../helpers/imageCache'

export default class SettingsView extends React.Component {

  static navigationOptions = {
    title: 'Settings',
    headerTintColor: '#FFFFFF',
    headerStyle: {
      backgroundColor: '#fc4970'
    },
  };

  showUserProfile = () => {
    const user = this.props.navigation.getParam('user');
    this.props.navigation.navigate('EditProfile', { user });
  }
  
  showMemberList = () => {
    this.props.navigation.navigate('MemberList');
  }

  showDonInfo = () => {
    const user = this.props.navigation.getParam('user');
    this.props.navigation.navigate('DonInfo', { user });
  }
  
  logout = () => {
    clearCache();
    ApiClient.clearAuthToken().then(() => {
      this.props.navigation.navigate('Auth');
    })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={styles.contentContainer}>
          <List>

            <ListItem style={{ margin: 0 }}>
              <TouchableOpacity style={styles.itemContainer} onPress={this.showUserProfile}>
                <Text style={styles.itemText}>My Profile</Text>
              </TouchableOpacity>
            </ListItem>

            <ListItem style={{ margin: 0 }}>
              <TouchableOpacity style={styles.itemContainer} onPress={this.showMemberList}>
                <Text style={styles.itemText}>Members</Text>
              </TouchableOpacity>
            </ListItem>

            <ListItem style={{ margin: 0 }}>
              <TouchableOpacity style={styles.itemContainer} onPress={this.showDonInfo}>
                <Text style={styles.itemText}>Find A Don</Text>
              </TouchableOpacity>
            </ListItem>

            <ListItem style={{ margin: 0 }}>
              <TouchableOpacity style={styles.itemContainer} onPress={this.logout}>
                <Text style={styles.itemText}>Logout</Text>
              </TouchableOpacity>
            </ListItem>

          </List>
        </Content>
      </Container>
    );
  }
}