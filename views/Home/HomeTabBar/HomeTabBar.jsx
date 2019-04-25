import React from 'react';
import { View } from 'react-native';
import { Container, Header, Content, Text, Spinner, Footer } from 'native-base';
import HomeTabBarButton from './HomeTabBarButton/HomeTabBarButton';

export default class HomeView extends React.Component {

  static navigationOptions = { header: null };

  constructor(props) {
    super(props);
    this.state = {
      selected: 'channels'
    }
  }

  render() {
    return (
      <View style={{flex: 1, flexDirection: 'row', backgroundColor:'#FFF'}}>
        <HomeTabBarButton
          text='Channels'
          image = {require('../../../assets/cookie-icon.png')}
          selected={this.props.currentTab === 'channels'}
          onPress={ () => {this.props.onSwitchTab('channels')} }
        />
        <HomeTabBarButton
          text='Notifications'
          image = {require('../../../assets/bell-OFF.png')}
          selected={this.props.currentTab === 'notifs'}
          onPress={ () => {this.props.onSwitchTab('notifs')} }
          showNotice={this.props.newNotifications}
        />
        <HomeTabBarButton
          text='Widgets'
          image = {require('../../../assets/small-logo.png')}
          selected={this.props.currentTab === 'widgets'}
          onPress={ () => {this.props.onSwitchTab('widgets')} }
        />
      </View>
    );
  }
}