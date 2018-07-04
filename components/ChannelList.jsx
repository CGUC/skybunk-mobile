import React from "react";
import { View } from "react-native";
import { Container, Text, Button } from 'native-base';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Font, AppLoading } from "expo";

import styles from "../styles/styles";

const DEFAULT_CHANNELS = [
  { name: 'All Feed', id: 'all' },
  { name: 'My Subscriptions', id: 'subs' },
]

export default class ChannelList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true
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

  getChannelCardJSX(channels) {
    var that = this;

    return (
      _.map(channels, (channel, key) => {
        // This is ugly, make it better
        return (
          <View style={styles.channelCard} key={`channel${key}`}>
            <Button block transparent dark onPress={() => this.onPressChannel(channel.id, channel.name)}>
              <Text style={styles.channelText}>{channel.name}</Text>
            </Button>
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
        <View>
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
