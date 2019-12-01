import React from 'react';
import { StatusBar, TouchableOpacity, Image } from 'react-native';
import { Container, Content, Footer, Thumbnail} from 'native-base';
import ChannelList from "../../components/ChannelList/ChannelList";
import NotificationList from "../../components/NotificationList/NotificationList";
import ChannelProfile from '../../components/ChannelProfile/ChannelProfile.jsx';
import HomeTabBar from "./HomeTabBar/HomeTabBar";
import styles from "./HomeStyle";
import ApiClient from '../../ApiClient';
import ImageCache from '../../helpers/imageCache'
import * as Font from 'expo-font';
import { Notifications } from 'expo';
import _ from 'lodash';
import Spinner from '../../components/Spinner/Spinner'

export default class HomeView extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      get headerRight() {
          return (
            <TouchableOpacity onPress={() => {navigation.navigate('Settings', { user: navigation.getParam('user') }) }}>
              <Image source={require('../../assets/settings.png')} style={styles.settingsIcon} />
            </TouchableOpacity>
          )
      },
      get headerLeft() {
        if(!navigation.getParam('profilePic')){
          return null;
        }
        return (
          <TouchableOpacity
            hitSlop={{ top: 10, bottom: 10, left: 0, right: 40 }}
            onPress={() => {navigation.navigate('MemberList', {user: navigation.getParam('user')}); }}>
            <Thumbnail
                  small
                  style={styles.profilePicThumbnail}
                  source={{ uri: `data:image/png;base64,${navigation.getParam('profilePic')}` }}
            />
          </TouchableOpacity>
        )
    }
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      channels: [],
      user: props.navigation.getParam('user'),
      notifications: props.navigation.getParam('user').notifications,
      currentTab: 'channels',
      channelDataToShow: undefined,
      showChannelModal: false
    }
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("../../node_modules/native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("../../node_modules/native-base/Fonts/Roboto_medium.ttf")
    });
    ApiClient.get('/channels',  {authorized: true})
    .then(response => {
      this.setState({ channels: response, loading: false });
    })
    .catch(err => console.error(err));

    ImageCache.getProfilePicture(this.state.user._id)
    .then(response => {
      this.props.navigation.setParams({
        'profilePic': response
      })
    })

    this.notificationSubscription = Notifications.addListener(this.handleNewNotification);
  }

  handleNewNotification = (notification) => {
    if(notification.origin == 'selected'){
      ApiClient.get(`/posts/${notification.data.post}`, {authorized: true})
      .then(postData => {
        const loggedInUser = this.state.user;
        updateParentState = () => ({});
        this.props.navigation.navigate('Home');
        this.props.navigation.navigate('Comments', { postData, loggedInUser, updateParentState });
      })
    }
    this.refreshNotifications()
  }

  refreshNotifications = () => {
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
    let channel = channels.find(channel => channel._id === channelId);
    this.props.navigation.navigate('Feed', { channel, loggedInUser: user });
  }

  onLongPressChannel = (channelId, channelName) => {
    const { channels, user } = this.state;
    let channel = channels.find(channel => channel._id === channelId);
    this.setState({
      channelDataToShow: channel,
      showChannelModal: true
    })
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

  closeChannelModal = () => {
    this.setState({
      channelDataToShow: undefined,
      showChannelModal: false
    })
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
    const { channels, loading, user, channelDataToShow, showChannelModal } = this.state;
    
    StatusBar.setBarStyle('dark-content', true);
    if (loading) {
      return (
        <Container>
          <Content contentContainerStyle={styles.contentContainer}>
            <Spinner/>
          </Content>
        </Container>
      );
    } else {
      const hasNewNotifications = this.hasNewNotifications()
      return (
        <Container>
          <Container>
              {this.state.currentTab === 'channels' ?
                <ChannelList
                  channels={channels}
                  onPressChannel={this.onPressChannel}
                  onLongPressChannel={this.onLongPressChannel}
                  user={user}
                /> :
                <NotificationList
                  notifications={this.state.notifications.slice(0, 30)}
                  onPressNotif={this.onPressNotif}
                  markNotifsSeen={this.markNotifsSeen}
                  refreshNotifications={this.refreshNotifications}
                  hasNewNotifications={hasNewNotifications}
                />
              }
          </Container>

          <ChannelProfile
            channel={channelDataToShow}
            onClose={this.closeChannelModal}
            isModalOpen={showChannelModal}
          />

          <Footer>
            <HomeTabBar
              onSwitchTab={ (tab) => {this.setState({currentTab: tab})} }
              currentTab={this.state.currentTab}
              newNotifications={hasNewNotifications}
            />
          </Footer>
        </Container>
      );
    }
  }
}
