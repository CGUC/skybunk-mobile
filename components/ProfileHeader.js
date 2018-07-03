import React from "react";
import { Text, View, Image } from "react-native";
import styles from "../styles/styles";

export default class ProfileHeader extends React.Component {
  render() {
    return (
      <View style={styles.profileHeader}>
        <Text style={styles.profileText}>⚙</Text>
        <Image style={styles.profilePicture} source={require("../assets/profile.jpg")} />
        <Text style={styles.profileText}>?</Text>
      </View>
    );
  }
}
