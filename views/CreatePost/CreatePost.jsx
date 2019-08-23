import React from 'react';
import PropTypes from 'prop-types';
import { View, Modal, TouchableOpacity, KeyboardAvoidingView, Keyboard, Platform } from 'react-native';
import { Text, Button, Textarea, Icon, Container } from 'native-base';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { ImagePicker, Permissions, Font } from 'expo';
import Toolbar from './Toolbar/Toolbar'
import styles from './CreatePost';

export default class CreatePost extends React.Component {

  constructor(props) {
    super(props);
    var existingText = props.existing;
    var existingPollData = props.existingPoll;

    this.state = {
      resourceText: existingText || "",
      image: null,
    };
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Make a Post',
      headerTitle: null,
      get headerRight() {
          return (
            <TouchableOpacity onPress={navigation.getParam('save')}>
              {
                <Text
                  style={styles.icon}
                >Post</Text>
              }
            </TouchableOpacity>
          )
      }
    }
  };

  saveResource = () => {
    const { saveResource, clearAfterSave } = this.props;
    if (clearAfterSave) this.setState({ resourceText: '', image: null, isPoll: false, pollData: null });
    return saveResource && saveResource({content: this.state.resourceText, image: this.state.image, poll: this.state.pollData});
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
    this.setState({
      isPoll: !this.state.isPoll,
    });
  }

  updatePoll = async (data) => {
    this.setState({
      isPoll: !!data,
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
      <Container
        animationType="slide"
        transparent={true}
        visible={isModalOpen}
        onRequestClose={onClose}
      >
        <View style={styles.postContentView}>
          <Textarea
            bordered
            placeholder="What's on your mind?" //TODO random rotation
            style={styles.textBox}
            onChangeText={this.textUpdate}
            value={this.state.resourceText}
          />
        </View>
        <View style={styles.selectChannelView}>
        
        </View>
        <View style={styles.ToolbarView}>
          {Toolbar({
            pickImage: this.pickImage,
            takeImage: this.takeImage,
            image: this.state.image,
          })}
        </View>
        <View style={styles.mediaPreviewView}>
        
        </View>
      </Container>
    )
  }
}
