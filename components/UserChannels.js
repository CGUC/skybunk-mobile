import React from "react";
import { View } from "react-native";
import styles from "../styles/styles";
import ChannelCard from "./ChannelCard";

export default class UserChannels extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      channels: [
        {name: "All Channels"},
        {name: "My Subscriptions"}
      ]
    };
  }

  componentWillMount() {
    let currentUserId = "5b2ffdd7d95b1260014b28a1";
    let self = this;
    // fetch(`http://localhost:3000/users/user/${currentUserId}`).then(user => {
    fetch(`http://google.com`).then(response => {
      // let channels = user.subscribedChannels;
      let channels = [
        {name: "Pizza"},
        {name: "Board Games"},
        {name: "Kerp"},
        {name: "Pool"},
        {name: "Foos"},
        {name: "Veebs"},
        {name: "Associates"},
        {name: "Choir"},
      ]

      self.setState(previousState => {
        return { channels: previousState.channels.concat(channels) };
      });
    }).catch(err => {
      console.log("err:", err)
    })
  }

  render() {
    let channelCards = this.state.channels.map(chan => {
      return <ChannelCard channel={chan} />;
    });

    return (
      <View>
        {channelCards}
      </View>
    );
  }
}
