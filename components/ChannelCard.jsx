import React from "react";
import { Text, View, Image } from "react-native";
import styles from "../styles/styles";

export default class ChannelCard extends React.Component {
  render() {
    return (
      <View style={styles.channelCard}>
        <Text style={styles.channelText}>{this.props.channel.name}</Text>
      </View>
    );
  }
}
