import React from 'react';
import PropTypes from 'prop-types';
import { View, Modal, TouchableOpacity, KeyboardAvoidingView, Keyboard, Platform } from 'react-native';
import { Text, Button, Textarea, Icon } from 'native-base';
import styles from "./PollPreviewStyle";

export default class PollPreview extends React.Component {

  constructor(props) {
    super(props);
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
  }

  render() {
    return (
      <View>
        <Text style={styles.card}>{`This is a poll preview component`}</Text>
      </View>
    )
  }
}