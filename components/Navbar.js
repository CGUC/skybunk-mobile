import React from "react";
import { StyleSheet, Text, View } from "react-native";

import styles from "../styles/styles";

export default class Navbar extends React.Component {
  render() {
    return (
      <View style={styles.navbar}>
        <Text style={styles.paragraph}>
          Local files ands assets can be imported by dragging and dropping them into the editor
        </Text>
      </View>
    );
  }
}
