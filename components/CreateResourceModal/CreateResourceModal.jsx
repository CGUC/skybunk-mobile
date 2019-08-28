import React from 'react';
import PropTypes from 'prop-types';
import { View, Modal, ScrollView, TouchableOpacity, KeyboardAvoidingView, Keyboard, Platform, Dimensions } from 'react-native';
import { Text, Button, Textarea, Icon } from 'native-base';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import Toolbar from './Toolbar/Toolbar'
import Poll from '../Poll/Poll';
import styles from './CreateResourceModalStyle';

export default class CreateResourceModal extends React.Component {

  constructor(props) {
    super(props);
    var existingText = props.existing;
    var existingPollData = props.existingPoll;

    this.state = {
      resourceText: existingText || "",
      image: null,
      isPoll: !!existingPollData,
      pollData: existingPollData || null
    };
  }

  saveResource = () => {
    const { saveResource, clearAfterSave } = this.props;
    if (clearAfterSave) this.setState({ resourceText: '', image: null, isPoll: false, pollData: null });
    return saveResource && saveResource({
      content: this.state.resourceText,
      image: this.state.image,
      poll: this.state.isPoll ? this.state.pollData : null,
    });
  }

  textUpdate = (text) => {
    this.setState({ resourceText: text })
  }

  onCancel = () => {
    const { onClose, clearAfterSave } = this.props;
    if (clearAfterSave) this.setState({ resourceText: '', image: null, isPoll: false, pollData: null });
    onClose();
  }

  hideKeyboard = () => {
    Keyboard.dismiss();
  }

  takeImage = async() => {
    const { status: cameraPerm } = await Permissions.getAsync(
      Permissions.CAMERA
    );
    let cameraStatus = cameraPerm;

    if (cameraPerm !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      cameraStatus = status;
    }

    const { status: cameraRollPerm } = await Permissions.getAsync(
      Permissions.CAMERA_ROLL
    );
    let cameraRollStatus = cameraRollPerm;

    if (cameraRollPerm !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      cameraRollStatus = status;
    }

    if (cameraRollStatus !== 'granted' || cameraStatus !== 'granted') {
      return null;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      base64: true,
      quality: 0.5,
    });
    this.setState({
      image: result.uri,
    });
  }

  pickImage = async () => {
    if (Platform.OS === 'ios') {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.CAMERA_ROLL
      );
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return null;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      base64: true,
      quality: 0.5,
    });
    this.setState({
      image: result.uri,
    });
  }

  togglePoll = async () => {
    if (!this.state.isPoll) {
      if (this.state.pollData) {
        this.state.pollData.title = this.state.resourceText;
      } else {
        this.state.pollData = { title: this.state.resourceText };
      }
    }
    this.setState({
      isPoll: !this.state.isPoll,
    });
  }

  updatePoll = async (data) => {
    this.setState({
      resourceText: data ? data.title : this.state.resourceText,
      pollData: data,
    });
  }

  render() {
    var {
      onClose,
      isModalOpen,
      submitButtonText,
      loggedInUser,
      existingPoll
    } = this.props;

    if (!submitButtonText) submitButtonText = 'Submit';

    if (existingPoll && !this.state.pollData) {
      this.state.pollData = this.state.pollData || existingPoll;
      this.state.isPoll = !!this.state.pollData;
    }

    const { height, width } = Dimensions.get('window');
    let modalHeight;
    if (this.state.isPoll) {
      if (this.props.showToolbar) {
        modalHeight = height - 220;
      } else {
        modalHeight = height - 250;
      }
    } else {
      modalHeight = 330;
    }

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
              <View style={[styles.view, {height: modalHeight}]}>
                {this.props.showToolbar ?
                  Toolbar({
                    pickImage: this.pickImage,
                    takeImage: this.takeImage,
                    togglePoll: this.togglePoll,
                    image: this.state.image,
                  }) : null}
                {this.state.isPoll ?
                  <ScrollView
                  style={styles.poll}
                  keyboardShouldPersistTaps={'always'}
                  showsVerticalScrollIndicator={false}>
                    <Poll
                      data={this.state.pollData}
                      savePoll={this.updatePoll}
                      loggedInUser={loggedInUser}
                      isAuthor={this.props.isAuthor}
                    />
                  </ScrollView> :
                  /* A bit hacky, but we need another GestureRecognizer to register swipe over the text box */
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
                  </GestureRecognizer>}
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
