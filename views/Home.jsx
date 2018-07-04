import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import {
  Container, Header, Content, Text, Spinner
} from 'native-base';

import NavBar from '../components/Navbar';
import ProfileHeader from "../components/ProfileHeader";
import ChannelList from "../components/ChannelList";
import styles from "../styles/styles";
import api from '../ApiClient';

export default class HomeView extends React.Component {

  static navigationOptions = { title: 'Home' };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      channels: [],
    }
  }

  async componentWillMount() {
    await api.get('/channels')
      .then(response => {
        this.setState({ channels: response });
      })
      .catch(err => console.error(err));

    this.setState({ loading: false });
  }

  onPressChannel = (channelId, channelName) => {
    this.props.navigation.navigate('Feed', { channelId, channelName });
  }

  render() {
    const { channels, loading } = this.state;

    if (loading) {
      return (
        <Container>
          <Content>
            <ProfileHeader />
            <Spinner color='#cd8500' />
          </Content>
        </Container>
      );
    } else {
      return (
        <Container>
          <Content>
            <ScrollView>
              <ProfileHeader />
              <ChannelList
                channels={channels}
                onPressChannel={this.onPressChannel}
              />
            </ScrollView>
          </Content>
        </Container>
      );
    }
  }
}