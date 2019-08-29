import React from 'react';
import PropTypes from 'prop-types';
import { View, Modal, TouchableOpacity, KeyboardAvoidingView, Keyboard, Platform, ScrollView, Image  } from 'react-native';
import { Text, Button, Textarea, Icon, Container } from 'native-base';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { ImagePicker, Permissions, Font } from 'expo';
import Toolbar from './Toolbar/Toolbar'
import MediaPreview from './MediaPreview/MediaPreview'
import styles from './CreatePostStyle';
import RNPickerSelect from 'react-native-picker-select';
import ApiClient from '../../ApiClient';
import _ from 'lodash';

export default class CreatePost extends React.Component {

  constructor(props) {
    super(props);
    var existingText = props.existing;
    var existingPollData = props.existingPoll;

    const channel = props.navigation.getParam('channel');
    var selectedChannel = channel ? channel._id: '';

    this.state = {
      resourceText: existingText || "",
      image: null,
      isPoll: false, 
      pollData: null,
      loadingChannels: true,
      selectedChannel: selectedChannel,
      channels: null
    };
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });

    ApiClient.get('/channels',  {authorized: true})
    .then(response => {
      var channelList = _.map(response, channel => {
        return {
          label: channel.name,
          value: channel._id
        }
      });
      this.setState({ channels: channelList, loadingChannels: false });
    })
    .catch(err => console.error(err));
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Make a Post',
      headerTitle: null,
      get headerRight() {
          return (
            <TouchableOpacity onPress={navigation.getParam('save')}>
              {
                <Text style={styles.headerText}
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
    return !!result.uri;
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
    return !!result.uri;
  }

  addPoll = async () => {
    this.setState({
      isPoll: true,
      image: null
    });
    return true;
  }

  clearMedia = async () => {
    this.setState({
      isPoll: false,
      image: null
    });
  }

  updatePoll = async (data) => {
    this.setState({
      isPoll: !!data,
      pollData: data,
    });
  }

  updateChannel = (value) => {
    this.setState({
      selectedChannel: value
    })
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

    const displayToolbar = !this.state.isPoll && !this.state.image

    return (
      <Container
        animationType="slide"
        transparent={true}
        visible={isModalOpen}
        onRequestClose={onClose}
      >
      { /* Hack to dismiss keyboard when text isn't focused */}
      <ScrollView keyboardShouldPersistTaps='handled' scrollEnabled={false}>
        <View style={styles.selectChannelView}>
          <RNPickerSelect
            placeholder={{label: "Select a channel...", value: null}}
            value={this.state.selectedChannel}
            items={
              this.state.channels || []
            }
            onValueChange={this.updateChannel}
            style={{ //uses inputAndroid and inputiOS style from the stylesheet
              ...styles,
              iconContainer: {
                top: 10,
                left: 12,
              },
            }}
            Icon={() => {
              return <Image source={require('../../assets/channel-list.png')} style={styles.channelImage}/>
            }}
          />
        </View>
        <View style={styles.postContentView}>
          <Textarea
            bordered
            placeholder="What's on your mind?" //TODO random rotation
            style={styles.textBox}
            onChangeText={this.textUpdate}
            value={this.state.resourceText}
          />
        </View>
        
        <View style={styles.ToolbarView}>
          <Toolbar
            pickImage = {this.pickImage}
            takeImage = {this.takeImage}
            addPoll = {this.addPoll}
            clearMedia = {this.clearMedia}
            image = {this.state.image}
            mediaSelected = {displayToolbar}
          />
        </View>
        <View style={styles.mediaPreviewView}>
          <MediaPreview 
            image={this.state.image}
            poll={this.state.poll}
            isPoll={this.state.isPoll}
            removeMedia={this.clearMedia}/>
        </View>
        </ScrollView>
      </Container>
    )
  }
}
