import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Platform, Image, TextInput  } from 'react-native';
import { Text, Textarea, Container } from 'native-base';
import { ImagePicker, Permissions, Font } from 'expo';
import Toolbar from './Toolbar/Toolbar'
import MediaPreview from './MediaPreview/MediaPreview'
import styles from './CreatePostStyle';
import RNPickerSelect from 'react-native-picker-select';
import ApiClient from '../../ApiClient';
import _ from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {setPostPicture, deletePostPicture} from '../../helpers/imageCache';
import { createPoll, removePoll } from '../../helpers/poll';
import Spinner from '../../components/Spinner/Spinner'

export default class CreatePost extends React.Component {

  constructor(props) {
    super(props);

    const channel = props.navigation.getParam('channel');
    const data = props.navigation.getParam('data');
    const image = props.navigation.getParam('image');
    const poll = props.navigation.getParam('poll');

    const existingText = data  ? data.content : '';
    var selectedChannel = channel ? channel._id: '';

    this.state = {
      resourceText: existingText || "",
      image: image ? `data:image/png;base64,${image}`: null,
      imageUpdated: false,
      isPoll: !!poll,
      pollData: poll,
      pollUpdated: false,
      loadingChannels: true,
      selectedChannel: selectedChannel,
      channels: null
    };
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("../../node_modules/native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("../../node_modules/native-base/Fonts/Roboto_medium.ttf")
    });

    ApiClient.get('/channels',  {authorized: true})
    .then(response => {
      var channelList = _.map(response, channel => {
        return {
          label: channel.name,
          tags: channel.tags,
          value: channel._id
        }
      });

      sortedChannels = channelList.sort((c1, c2) => {
        if (c1.name < c2.name) return -1;
        return 1;
      });

      var newState =  { channels: channelList, loadingChannels: false };

      //if editting a post, display the correct channel
      const data = this.props.navigation.getParam('data');
      if(data && data.tags){
        var selectedChannel = channelList.filter( channel => channel.label==data.tags[0])[0];
        selectedChannel = selectedChannel ? selectedChannel.value : null;
        newState = {...newState, selectedChannel}
      }
      this.setState(newState);
    })
    .catch(err => console.error(err));
  }

  
  async componentDidMount() {
    const { navigation } = this.props;
    navigation.setParams({
      saveResource: this.saveResource,
      state: 'editting'
    })
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('data') ? 'Edit Post' : 'Make a Post',
      headerTitle: null,
      get headerRight() {
        const state = navigation.getParam('state');
        const isEditting = !!navigation.getParam('data');
        if(state==='posting'){
          return (
            <View style={{ marginRight: 20 }}>
              <Spinner
                size='small'
                color='white'
              />
            </View>
          )
        }else if(isEditting){
          return (
            <TouchableOpacity onPress={navigation.getParam('saveResource')}>
              {
                <Text style={styles.headerText}>
                  Save
                </Text>
              }
            </TouchableOpacity>
          )
        }
          return (
            <TouchableOpacity onPress={navigation.getParam('saveResource')}>
              {
                <Text style={styles.headerText}>
                  Post
                </Text>
              }
            </TouchableOpacity>
          )
      }
    }
  };

  saveResource = () => {
    this.props.navigation.setParams({state: 'posting'});
    const {resourceText, image, pollData, isPoll} = this.state
    const data = this.props.navigation.getParam('data');

    //if updating post
    if(data){
      this.updatePost({
        ...data,
        content: resourceText, 
        image: image, 
        poll: isPoll ? pollData : null
      })
    }else{
      this.addPost({
        content: resourceText, 
        image: image, 
        poll: isPoll ? pollData : null
      })
    }
    
  }

  addPost = (data) => {
    const {
      navigation,
    } = this.props;

    const {
      selectedChannel,
      channels
    } = this.state;

    const loggedInUser = navigation.getParam('loggedInUser');

    var channel = channels.filter( channel => channel.value==selectedChannel);
    if(channel[0]){
      channel = channel[0]
    }else{
      this.props.navigation.setParams({state: 'editting'});
      alert("Please select a channel.");
      return;
    }

    var tags = channel.tags[0];

    var postContent = {
      author: loggedInUser._id,
      content: data.content,
      tags: tags
    }

    ApiClient.post('/posts', postContent, {authorized: true})
    .then(response => response.json())
    .then(post => {
      if (data.poll) {
        createPoll(post._id, data.poll).then(poll => {
          if (data.image) {
            setPostPicture(
              post._id,
              data.image
            ).then(() => navigation.goBack());
          }
          else {
            navigation.goBack();
          }
        })
        .catch((err) => {
          console.error(err);
          this.props.navigation.setParams({state: 'editting'});
          alert("Error creating poll. Sorry about that!")
        });
      } else if (data.image) {
        setPostPicture(
          post._id,
          data.image
        ).then(() => navigation.goBack());
      }
      else {
        navigation.goBack();
      }
    });
  }

  updatePost = async (data) => {
    postId = data._id;
    const {navigation} = this.props;
    const {pollUpdated, isPoll, pollData, imageUpdated, image, channels, selectedChannel} = this.state

    var channel = channels.filter( channel => channel.value==selectedChannel);
    if(channel[0]){
      data.tags = [channel[0].label]
    }else{
      this.props.navigation.setParams({state: 'editting'});
      alert("Please select a channel.");
      return;
    }

    ApiClient.put(`/posts/${postId}`, _.pick(data, ['content', 'tags']), {authorized: true})
      .then(() => {
        if(pollUpdated){
          if(!isPoll){
            removePoll(postId).then(() => {
              navigation.goBack();
            });
          }else{
            createPoll(postId, pollData).then(() => {
              navigation.goBack();
            });
          }
        }
        if(imageUpdated){
          if(!image){
            deletePostPicture(postId).then(() => {
              navigation.goBack();
            });
          }else{
            setPostPicture(postId, image).then(() => {
              navigation.goBack();
            });
          }
        }else{
          //no media updated, so just go back
          navigation.goBack();
        }
      })
      .catch(err => {
        console.error(err);
        alert("Error updating post. Sorry about that!");
      });
  }

  textUpdate = (text) => {
    this.setState({ resourceText: text })
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
      imageUpdated: true,
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
      imageUpdated: true,
    });
  }

  addPoll = async () => {
    this.setState({
      isPoll: true,
      image: null,
      pollUpdated: true
    });
  }

  clearMedia = async () => {
    this.setState({
      isPoll: false,
      image: null,
      imageUpdated: !!this.state.image,
      pollUpdated: this.state.isPoll
    });
  }

  updatePoll = async (data) => {
    this.setState({
      isPoll: !!data,
      pollData: data,
      pollUpdated: true
    });
  }

  updateChannel = (value) => {
    this.setState({
      selectedChannel: value
    })
  }

  render() {
    const displayToolbar = !this.state.isPoll && !this.state.image

    var postPlaceholder = "Write, post, recieve community..."
    if(this.state.isPoll){
      postPlaceholder = "What questions do you have?"
    }

    return (
      <Container>
      { /* Hack to dismiss keyboard when text isn't focused */}
      <KeyboardAwareScrollView keyboardShouldPersistTaps='handled' scrollEnabled={false}>
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
            <TextInput
              bordered
              placeholder={postPlaceholder}
              style={styles.textBox}
              onChangeText={this.textUpdate}
              value={this.state.resourceText}
              multiline={true}
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
              poll={this.state.pollData}
              isPoll={this.state.isPoll}
              updatePoll={this.updatePoll}
              removeMedia={this.clearMedia}
              loggedInUser={this.props.navigation.getParam('loggedInUser')}/>
          </View>
      </KeyboardAwareScrollView>
      </Container>
    )
  }
}
