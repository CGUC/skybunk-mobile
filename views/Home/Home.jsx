import React from 'react';
import { View, ScrollView, AsyncStorage, TouchableOpacity } from 'react-native';
import { Container, Header, Content, Text, Spinner, Footer } from 'native-base';
import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";
import ChannelList from "../../components/ChannelList/ChannelList";
import NotificationList from "../../components/NotificationList/NotificationList";
import HomeTabBar from "./HomeTabBar/HomeTabBar";
import style from "./HomeStyle";
import api from '../../ApiClient';

export default class HomeView extends React.Component {

  static navigationOptions = { header: null };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      channels: [],
      user: props.navigation.getParam('user'),
      token: props.navigation.getParam('token'),
      notifications: props.navigation.getParam('user').notifications,
      currentTab: 'channels'
    }
  }

  componentWillMount() {
    api.get('/channels')
    .then(response => {
      this.setState({ channels: response, loading: false });
    })
    .catch(err => console.error(err));
  }

  onPressChannel = (channelId, channelName) => {
    const { channels, user } = this.state;
    var channel;

    if (['all', 'subs', 'myPosts'].includes(channelId)) channel = { _id: channelId, name: channelName };
    else channel = _.head(_.filter(channels, { _id: channelId }));

    this.props.navigation.navigate('Feed', { channel, userId: user._id });
  }

  onPressNotif = (notif) => {
    this.updateNotificationState(notif);
    this.props.navigation.navigate(
      'Comments', 
      { 
        postData: notif.data.post,
        updateParentState: () => {}, 
        userId: this.state.user._id 
      }
    );
  }

  updateNotificationState = (notif) => {
    api.post(
      `/notifications/${notif._id}/markSeen`,
      { Authorization: `Bearer ${this.state.token}`},
      {}
    ).catch(err => console.error(err));

    this.setState({
      notifications: this.state.notifications.map(curNotif => {
        if (notif._id === curNotif._id) {
          curNotif.seen = true;
        }
        return curNotif;
      })
    });
  }

  hasNewNotifications = () => {
    for (let i = 0; i < this.state.notifications.length; i++) {
      if (!this.state.notifications[i].seen) {
        return true;
      }
    }
    return false;
  };

  render() {
    const { channels, loading, user, token } = this.state;

    if (loading) {
      return (
        <Container>
          <Content contentContainerStyle={style.contentContainer}>
            <Spinner color='#cd8500' />
          </Content>
        </Container>
      );
    } else {
      return (
        <Container>
          <Content>
            <ScrollView>
              <ProfileHeader user={user} token={token} navigation={this.props.navigation}/>
              {this.state.currentTab === 'channels' ? 
                <ChannelList
                  channels={channels}
                  onPressChannel={this.onPressChannel}
                  user={user}
                  token={token}
                /> :
                <NotificationList
                  notifications={this.state.notifications}
                  onPressNotif={this.onPressNotif}
                />
              }
            </ScrollView>
          </Content>
          <Footer>
            <HomeTabBar 
              onSwitchTab={ (tab) => {this.setState({currentTab: tab})} }
              currentTab={this.state.currentTab}
              newNotifications={this.hasNewNotifications()}
            />
          </Footer>
        </Container>
      );
    }
  }
}