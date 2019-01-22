import React from 'react';
import { View, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { Container, Header, Content, Text, Spinner, Footer, Icon } from 'native-base';
import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";
import ChannelList from "../../components/ChannelList/ChannelList";
import NotificationList from "../../components/NotificationList/NotificationList";
import HomeTabBar from "./HomeTabBar/HomeTabBar";
import style from "./HomeStyle";
import ApiClient from '../../ApiClient';
import { Font} from "expo";
import { Notifications } from 'expo';
import _ from 'lodash';

export default class HomeView extends React.Component {

  static navigationOptions = { header: null };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      channels: [],
      user: props.navigation.getParam('user'),
      notifications: props.navigation.getParam('user').notifications,
      currentTab: 'channels'
    }
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    ApiClient.get('/channels',  {authorized: true})
    .then(response => {
      this.setState({ channels: response, loading: false });
    })
    .catch(err => console.error(err));

    this.notificationSubscription = Notifications.addListener(this.handleNewNotification);
  }

  handleNewNotification = () => {
    ApiClient.get(
      '/users/loggedInUser',  {authorized: true}
    )
    .then(user => {
      if (user._id) {
        this.setState({notifications: user.notifications});
      }
    }).catch(err => console.error(err));
  }

  onPressChannel = (channelId, channelName) => {
    const { channels, user } = this.state;
    var channel;

    if (['all', 'subs', 'myPosts'].includes(channelId)) channel = { _id: channelId, name: channelName };
    else channel = _.head(_.filter(channels, { _id: channelId }));

    this.props.navigation.navigate('Feed', { channel, loggedInUser: user });
  }

  onPressNotif = (notif) => {
    this.updateNotificationState(notif);
    this.props.navigation.navigate(
      'Comments', 
      { 
        postData: notif.data.post,
        updateParentState: () => {}, 
        loggedInUser: this.state.user,
      }
    );
  }

  updateNotificationState = (notif) => {
    ApiClient.post(
      `/notifications/${notif._id}/markSeen`, {}, {authorized: true}
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

  markNotifsSeen = () => {
    ApiClient.post(
      `/users/${this.state.user._id}/markNotifsSeen`, {}, {authorized: true}
    )
    .then(res => {
      this.setState({
        notifications: this.state.notifications.map(notif => {
          notif.seen = true;
          return notif;
        })
      });
    })
    .catch(err => console.error(err));
  }

  render() {
    const { channels, loading, user } = this.state;
    
    StatusBar.setBarStyle('dark-content', true);
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
              <ProfileHeader user={user} navigation={this.props.navigation}/>
              {this.state.currentTab === 'channels' ? 
                <ChannelList
                  channels={channels}
                  onPressChannel={this.onPressChannel}
                  user={user}
                /> :
              <View>
                <TouchableOpacity style={style.markAllSeen} onPress={this.markNotifsSeen}>
                  <Text style={style.markAllSeenText}>Mark all as seen</Text>
                </TouchableOpacity>
                <NotificationList
                  notifications={this.state.notifications.slice(0, 30)}
                  onPressNotif={this.onPressNotif}
                />
              </View>
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