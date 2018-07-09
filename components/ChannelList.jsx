import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Container, Text, Button } from 'native-base';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Font, AppLoading } from "expo";
import ApiClient from '../ApiClient';

import styles from "../styles/styles";

const DEFAULT_CHANNELS = [
  { name: 'All Feed', id: 'all' },
  { name: 'My Subscriptions', id: 'subs' },
]

export default class ChannelList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      subscribedChannels: props.user.subscribedChannels,
      user: props.user,
    }
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ loading: false });
  }

  onPressChannel = (id, name) => {
    if (this.props.onPressChannel) this.props.onPressChannel(id, name);
  }

  updateSubscription = (id, index) => {
    if (id === 'all' && id === 'subs') return;

    return () => {
      if (index === -1) {
        this.setState({
          subscribedChannels: [...this.state.subscribedChannels, id]
        }, this.updateUserRequest);
      }
      else {
        let subs = this.state.subscribedChannels;
        subs.splice(index, 1);
        this.setState({
          subscribedChannels: subs,
        }, this.updateUserRequest);
      }
    }
  }

  updateUserRequest = () => {
    let user = this.state.user;
    user.subscribedChannels = this.state.subscribedChannels;
    console.log(user);
    ApiClient.put(
      `/users/${user._id}`, 
      { 'Authorization': 'Bearer ' + this.props.token },
      user
    ).catch(err => console.error(err));
  }

  getChannelCardJSX(channels) {

    return (
      _.map(channels, (channel, key) => {
        let icon = require('../assets/bell-OFF.png');
        let opacity = 1;
        const subIndex = this.state.subscribedChannels.indexOf(channel.id);
        if (channel.id === 'subs') {
          icon = require('../assets/my-subs-bell-Icon.png');
        }
        else if (channel.id === 'all') {
          opacity = 0;
        }
        else if (subIndex !== -1) {
          icon = require('../assets/Bell-ON.png');
        }
        
        return (
          <View style={styles.channelCard} key={`channel${key}`}>
            <TouchableOpacity onPress={this.updateSubscription(channel.id, subIndex)} activeOpacity={0.5}>
              <Image opacity={opacity} source={icon} style={styles.notificationBell}/>
            </TouchableOpacity>
            <Button block transparent dark onPress={() => this.onPressChannel(channel.id, channel.name)}>
              <Text style={styles.channelText}>{channel.name}</Text>
            </Button>
            <Image source={require('../assets/arrowright.png')} style={styles.rightArrow}/>
          </View>
        )
      })
    )
  }

  render() {
    const { channels } = this.props;

    var channelList = _.map(channels, channel => {
      return {
        name: channel.name,
        id: channel._id
      }
    });

    channelList = DEFAULT_CHANNELS.concat(channelList);

    let channelCards = this.getChannelCardJSX(channelList);

    if (this.state.loading) {
      return (
        <Container>
          <AppLoading />
        </Container>
      );
    } else {
      return (
        <View marginTop={10}>
          {channelCards}
        </View>
      );
    }
  }
}

ChannelList.propTypes = {
  onPressChannel: PropTypes.func,
  channels: PropTypes.array,
}
