import React from "react";
import { View } from "react-native";
import styles from "../styles/styles";
import ChannelCard from "./ChannelCard";
import ApiClient from "../ApiClient"

export default class UserChannels extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      channels: [
        {name: "All Channels", _id: -1},
        {name: "My Subscriptions", _id: -2},
      ]
    };
  }

  componentWillMount() {
    let self = this;
    ApiClient.get('/channels', {}).then(response => {
      self.setState(previousState => {
        return { channels: previousState.channels.concat(response) };
      });
    }).catch(err => {
      console.log("err:", err)
    })
  }

  render() {
    let channelCards = this.state.channels.map(chan => {
      return <ChannelCard key={chan._id} channel={chan} />;
    });

    return (
      <View>
        {channelCards}
      </View>
    );
  }
}
