import React from 'react';
import PropTypes from 'prop-types';
import { View, Modal, TouchableOpacity, KeyboardAvoidingView, Keyboard, Platform } from 'react-native';
import { Text, Button, Textarea } from 'native-base';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import styles from './CreateResourceModalStyle';

export default class CreateResourceModal extends React.Component {

  constructor(props) {
    super(props);
    var existingText = props.existing;

    this.state = {
      resourceText: existingText || ""
    };
  }

  saveResource = () => {
    const { saveResource } = this.props;

    this.textUpdate("");

    return saveResource && saveResource(this.state.resourceText);
  }

  textUpdate = (text) => {
    this.setState({ resourceText: text })
  }

  onCancel = () => {
    const { onClose } = this.props;
    this.textUpdate("");
    onClose();
  }

  hideKeyboard = () => {
    Keyboard.dismiss();
  }

  render() {
    var {
      onClose,
      isModalOpen,
      submitButtonText
    } = this.props;

    if (!submitButtonText) submitButtonText = 'Submit';

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalOpen}
        onRequestClose={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modal}
          onPress={onClose}
        >
          <KeyboardAvoidingView
            behavior='padding'
            // Android already does this by default, so it doubles the padding when enabled
            enabled={Platform.OS !== 'android'}
          >
            <GestureRecognizer
              onSwipeDown={this.hideKeyboard}
              style={styles.gestureRecognizer}
            >
              <View style={styles.view}>
                {/* A bit hacky, but we need another GestureRecognizer to register swipe over the text box */}
                <GestureRecognizer
                  onSwipeDown={this.hideKeyboard}
                  style={styles.gestureRecognizer}
                >
                  <Textarea
                    bordered
                    placeholder="What's on your mind?"
                    style={styles.textBox}
                    onChangeText={this.textUpdate}
                    value={this.state.resourceText}
                  />
                </GestureRecognizer>
                <View style={styles.buttonGroup}>
                  <Button block style={styles.button} onPress={this.saveResource}>
                    <Text>{submitButtonText}</Text>
                  </Button>
                  <Button block style={styles.button} onPress={this.onCancel}>
                    <Text>Cancel</Text>
                  </Button>
                </View>
              </View>
            </GestureRecognizer>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>
    )
  }
}