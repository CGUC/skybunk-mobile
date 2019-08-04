import React from 'react';
import PropTypes from 'prop-types';
import { View, Modal, TouchableOpacity, KeyboardAvoidingView, Keyboard, Platform } from 'react-native';
import { Text, Button, Textarea, Icon } from 'native-base';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { ImagePicker, Permissions } from 'expo';
import Toolbar from './Toolbar/Toolbar'
import PollModal from '../PollModal/PollModal';
import PollPreview from '../PollPreview/PollPreview';
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
      isEditingPoll: false,
      pollData: existingPollData || null
    };
  }

  saveResource = () => {
    const { saveResource, clearAfterSave } = this.props;
    if (clearAfterSave) this.setState({ resourceText: '', image: null, isPoll: false, isEditingPoll: false, pollData: null });
    return saveResource && saveResource({content: this.state.resourceText, image: this.state.image, poll: this.state.pollData});
  }

  textUpdate = (text) => {
    this.setState({ resourceText: text })
  }

  onCancel = () => {
    const { onClose, clearAfterSave } = this.props;
    if (clearAfterSave) this.setState({ resourceText: '', image: null, isPoll: false, isEditingPoll: false, pollData: null });
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
    this.setState({
      isPoll: !this.state.isPoll,
      isEditingPoll: !this.state.isPoll,
    });
  }

  updatePoll = async (data) => {
    this.setState({
      isPoll: !!data,
      isEditingPoll: false,
      pollData: data,
    });
  }

  render() {
    var {
      onClose,
      isModalOpen,
      submitButtonText
    } = this.props;

    if (!submitButtonText) submitButtonText = 'Submit';

    let content;
    if (this.state.isPoll) {
      content = <PollPreview
                  data={this.state.pollData}
                  savePoll={this.updatePoll}
                  isEditing={this.state.isEditingPoll}
                  clearAfterSave={true} 
                />;
    } else {
      content = <Textarea
                    bordered
                    placeholder="What's on your mind?"
                    style={styles.textBox}
                    onChangeText={this.textUpdate}
                    value={this.state.resourceText}
                  />
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
              <View style={styles.view}>
                {this.props.showToolbar ? 
                  Toolbar({
                    pickImage: this.pickImage,
                    takeImage: this.takeImage,
                    togglePoll: this.togglePoll,
                    image: this.state.image,
                  }) : null}
                {/* A bit hacky, but we need another GestureRecognizer to register swipe over the text box */}
                <GestureRecognizer
                  onSwipeDown={this.hideKeyboard}
                  style={styles.gestureRecognizer}
                >
                  {content}
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