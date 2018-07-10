import React from 'react';
import { StyleSheet, View, ScrollView, AsyncStorage } from 'react-native';
import {
  Container, Header, Content, Text, Spinner
} from 'native-base';

import ProfileHeader from "../components/ProfileHeader";
import ChannelList from "../components/ChannelList";
import styles from "../styles/styles";
import api from '../ApiClient';

export default class HomeView extends React.Component {

  static navigationOptions = { header: null };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      channels: [],
      user: {},
      token: null,
    }
  }

  componentWillMount() {
    Promise.all(
    [
      api.get('/channels')
      .then(response => {
        this.setState({ channels: response });
      })
      .catch(err => console.error(err)),

      AsyncStorage.getItem('@Skybunk:token').then(value => {
        this.setState({
          token: value,
        });
        return api.get('/users/loggedInUser', { 'Authorization': 'Bearer ' + value}).then(user => {
          this.setState({
            user: user,
          });
        });
      })
      .catch(err => console.error(err))
    ])
    .then(() => {
      this.setState({ loading: false });
    });
  }

  onPressChannel = (channelId, channelName) => {
    const { channels, user } = this.state;
    var channel;

    if (['all', 'subs'].includes(channelId)) channel = { _id: channelId, name: channelName };
    else channel = _.head(_.filter(channels, { _id: channelId }));

    this.props.navigation.navigate('Feed', { channel, userId: user._id });
  }

  render() {
    const { channels, loading, user, token } = this.state;
    if (loading) {
      return (
        <Container>
          <Content contentContainerStyle={{flex: 1, justifyContent:'center'}}>
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
              <ChannelList
                channels={channels}
                onPressChannel={this.onPressChannel}
                user={user}
                token={token}
              />
            </ScrollView>
          </Content>
        </Container>
      );
    }
  }
}