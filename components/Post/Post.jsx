import React from 'react';
import Autolink from 'react-native-autolink';
import { View, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Modal, Alert, KeyboardAvoidingView, Keyboard, Platform, Dimensions } from 'react-native';
import Image from 'react-native-scalable-image';
import { Body, Card, CardItem, Text, Thumbnail, Button, Icon } from 'native-base';
import { Font } from "expo";
import date from 'date-fns';
import Popover from 'react-native-popover-view';
import {getProfilePicture, getPostPicture} from "../../helpers/imageCache";
import { getPoll, createPoll } from '../../helpers/poll';
import PollPreview from '../Poll/PollPreview/PollPreview';
import Poll from '../Poll/Poll';
import styles from "./PostStyle";

export default class Post extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      profilePicture: null,
      showEditButtons: false,
      editing: false,
      image: null,
      poll: null,
      pollCopy: null,
      updateKey: 0,
    }
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });

    getProfilePicture(this.props.data.author._id).then(pic => {
      this.setState({
        profilePicture: pic,
      });
    }).catch(error => {
      console.error(error);
    });
    if (this.props.data.image) {
      getPostPicture(this.props.data._id).then(pic => {
        this.setState({
          image: pic,
        });
      }).catch(error => {
        console.error(error);
      });
    }
    if (this.props.data.media) {
      getPoll(this.props.data._id).then(poll => {
        this.setState({
          poll: poll,
          pollCopy: this.copyPollData(poll),
        });
      }).catch(error => {
        console.error(error);
      });
    }
  }

  onPressOptions = () => {
    this.setState({ showEditButtons: true });
  }

  hideEditButtons = () => {
    this.setState({ showEditButtons: false });
  }

  onPressEdit = () => {
    this.hideEditButtons();
    const {data} = this.props
    const {pollCopy, image} = this.state
    this.props.navigation.navigate("CreatePost",  {data, poll: pollCopy, image})
  }

  saveEdited = (newContent) => {
    let { updatePost, data } = this.props;
    var postId = data._id;
    data = {
      ...data,
      content: newContent.content,
      image: newContent.image || data.image
    }
    this.closeEditingModal();

    if (this.state.poll) {
      createPoll(postId, newContent.poll).then(poll => {
        updatePost && updatePost(postId, data, 'editPoll');
      })
      .catch(err => {
        alert("Error updating post. Sorry about that!")
      });
    } else {
      updatePost && updatePost(postId, data, 'editPost');
    }
  }

  closeEditingModal = () => {
    this.setState({ editing: false });
  }

  onPressDelete = () => {
    Alert.alert(
      'Hold Up!',
      'Removing this post will also delete all comments associated with it.\nAre you sure you want to proceed?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: this.onConfirmDelete },
      ],
    )
  }

  onConfirmDelete = () => {
    const { deletePost, data } = this.props;

    var postId = data._id;

    this.hideEditButtons();

    deletePost && deletePost(postId);
  }

  onPressPost = () => {
    // Call parent to navigate
    var { onPressPost, data } = this.props;
    if (onPressPost) onPressPost(data);
  }

  onPressFlagInappropriate = () => {
    Alert.alert(
      'Hold Up!',
      'Are you sure you want to flag this post as inappropriate?\nDoing so will notify the webmasters.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: this.notifyWebmasters },
      ],
    )
  }

  onPressBlock = () => {
    Alert.alert(
      'Hold Up!',
      'Are you sure you want to report this user?\nDoing so will notify the webmasters, who can block their account.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: this.notifyWebmasters },
      ],
    )
  }

  notifyWebmasters = () => {
    Alert.alert(
      'Wemasters alerted',
      'The webmasters have been notified about your request.',
      [
        { text: 'Continue', style: 'cancel' },
      ],
    )
  }

  copyPollData = (source) => {
    if (!source) {
      return null;
    }
    return JSON.parse(JSON.stringify(source));
  }

  updatePoll = async (data) => {
    this.setState({
      updateKey: (this.state.updateKey + 1) % 10,
      poll: data,
      pollCopy: this.copyPollData(data),
    });
  }

  toggleLike = () => {
    const {
      updatePost,
      data,
      loggedInUser,
    } = this.props;

    if (data.usersLiked.find((user) => user._id === loggedInUser._id)) {
      data.likes--;
      data.usersLiked = data.usersLiked.filter(user => user._id !== loggedInUser._id);
    } else {
      data.likes++;
      data.usersLiked.push({
        _id: loggedInUser._id,
        firstname: loggedInUser.firstName,
        lastName: loggedInUser.lastName
      });
    }

    if (data.likes < 0) data.likes = 0; // (Grebel's a positive community, come on!)

    updatePost && updatePost(data._id, data, 'toggleLike');
  }

  generateLikesList = () => {
    let {
      usersLiked
    } = this.props.data;

    if (usersLiked.filter(e => e._id == this.props.loggedInUser._id).length) {
      usersLiked = usersLiked.filter(user => user._id !== this.props.loggedInUser._id);
      usersLiked.unshift({ firstName: 'You' }); // a wee hack
    }

    return (
      <ScrollView contentContainerStyle={styles.likedList}>
        <Thumbnail small square source={require('../../assets/liked-cookie.png')} style={styles.likedListIcon} />
        <View style={styles.line} />
          {usersLiked.map((user, i) => {
            return (
              <Text key={i} style={styles.likedListItem}>{user.firstName} {user.lastName || ''}</Text>
            )
          })}
      </ScrollView>
    )
  }

  getMenuOptions() {
    if (this.props.enableEditing || this.props.enableDeleting) {
      return (
        <View style={styles.view}>
          {this.props.enableEditing && <Button block style={styles.editButton} onPress={this.onPressEdit}>
            <Text>Edit Post</Text>
          </Button>}
          <Button block style={styles.deleteButton} onPress={this.onPressDelete}>
            <Text>Delete Post</Text>
          </Button>
        </View>
      );
    }
    else {
      return (
        <View style={styles.view}>
          <Button block style={styles.deleteButton} onPress={this.onPressFlagInappropriate}>
            <Text>Flag as inappropriate</Text>
          </Button>
          <Button block style={styles.deleteButton} onPress={this.onPressBlock}>
            <Text>Report/block user</Text>
          </Button>
        </View>
      );
    }
  }

  render() {
    const {
      showEditButtons,
      editing,
      showLikedList,
      poll,
      pollCopy
    } = this.state;

    const {
      data,
      showUserProfile,
      loggedInUser
    } = this.props;

    var {
      author,
      content,
      usersLiked,
      comments,
      createdAt,
      tags,
      media,
    } = data;
    const isLiked = usersLiked.filter(e => e._id == this.props.loggedInUser._id).length > 0;
    var likeIcon = isLiked ? require('../../assets/liked-cookie.png') : require('../../assets/cookie-icon.png');
    let isAuthor = (author._id === loggedInUser._id);

    if (isLiked) {
      usersLiked = usersLiked.filter(user => user._id !== this.props.loggedInUser._id);
      usersLiked.unshift({ firstName: 'You' });
    }
    var likesDialog;
    var likes = usersLiked.length;
    if (likes === 0) {
      likesDialog = "No cookies yet";
    } else if (likes === 1) {
      likesDialog = `${usersLiked[0].firstName}`;
    } else if (likes === 2) {
      likesDialog = `${usersLiked[0].firstName} and ${usersLiked[1].firstName}`;
    } else {
      likesDialog = `${usersLiked[0].firstName},\n${usersLiked[1].firstName} and ${likes - 2} ${likes === 3 ? 'other' : 'others'}`;
    }

    // In case author account is deleted
    var authorName;
    if (!author) authorName = "Ghost";
    else authorName = `${author.firstName} ${author.lastName}`;

    // TODO: implement
    var authorPhoto = author.profilePicture;

    if(this.props.showFullDate){
      //If in comment view, view full date including timestamp
      createdAt = date.format(createdAt, 'ddd MMM Do [at] h:mma');
    }else if(date.isPast(date.addWeeks(createdAt,1))){
      //If the post is more than a week old, display date
      createdAt = date.format(createdAt, 'ddd MMM Do');
    }else{
      //Display how long ago the post was made
      createdAt = date.distanceInWordsToNow(createdAt, {addSuffix: true});
    }

    var numComments = comments ? comments.length : 0;

    return (
      <View>
        <KeyboardAvoidingView
          behavior='position'
          keyboardVerticalOffset={Platform.OS === 'android' ? 30 : 0}
          enabled={poll && this.props.onPressPost}
        >
          <Card style={styles.card}>

            <CardItem>
              {/* Using flexbox here because NativeBase's Left/Body/Right isn't as customizable */}
              <View style={styles.headerContainer}>

                <View style={styles.headerLeft}>
                  <View>
                    <TouchableOpacity onPress={() => showUserProfile(author)}>
                      <Thumbnail
                        style={styles.profilePicThumbnail}
                        source={{ uri: `data:image/png;base64,${this.state.profilePicture}` }}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.headerBody}>
                    <View style={styles.authorDetails}>
                      <Text>{authorName}</Text>
                      <Text>{this.props.showTag ? ` ►  ${tags[0]}` : null}</Text>
                    </View>
                    <Text note>{createdAt}</Text>
                  </View>
                </View>

                <View style={styles.headerRight}>
                  <TouchableOpacity onPress={this.onPressOptions} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                    <Icon style={styles.icon} type='MaterialIcons' name='more-vert' />
                  </TouchableOpacity>
                </View>
              </View>
            </CardItem>

            <CardItem button onPress={this.onPressPost} style={styles.postContent}>
              <Body>
              <Autolink text={content} numberOfLines={this.props.maxLines} ellipsizeMode='tail' />
                {poll ?
                  (this.props.onPressPost ?
                  <PollPreview data={poll} loggedInUser={loggedInUser} />
                  : <Poll data={poll} postId={data._id} updatePoll={this.updatePoll} loggedInUser={loggedInUser} isAuthor={isAuthor} />)
                : null}
              </Body>
            </CardItem>

            {this.state.image ? <CardItem style={styles.imageContainer}>
              <TouchableWithoutFeedback onPress={this.onPressPost}>
                <Image
                  style={styles.image}
                  width={Dimensions.get('window').width}
                  source={{ uri: `data:image/png;base64,${this.state.image}` }}
                />
              </TouchableWithoutFeedback>
            </CardItem> : null}

            <CardItem style={styles.postFooter}>
              <View style={styles.footerContainer}>
                <View style={styles.iconContainer}>
                  <TouchableOpacity onPress={this.toggleLike}>
                    <Thumbnail small square source={likeIcon} style={styles.icon} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.setState({ showLikedList: true })}
                    ref={ref => this.dialogRef = ref}
                    hitSlop={{ top: 10, bottom: 10, left: 0, right: 40 }}
                  >
                    <Text style={styles.likesDialog}>{`${likesDialog}`}</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={this.onPressPost}>
                  <View style={styles.commentsContainer}>
                    <Thumbnail small square source={require('../../assets/comments-icon.png')} style={styles.icon} />
                    <Text style={styles.commentsDialog}>{`${numComments}`}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </CardItem>

            <Popover
              fromView={this.dialogRef}
              isVisible={showLikedList}
              onClose={() => this.setState({ showLikedList: false })}
            >
              {this.generateLikesList()}
            </Popover>

          </Card>
        </KeyboardAvoidingView>

        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={showEditButtons}
            onRequestClose={this.hideEditButtons}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={styles.editButtonsContainer}
              onPress={this.hideEditButtons}
            >
              {this.getMenuOptions()}
            </TouchableOpacity>
          </Modal>
        </View>
      </View>
    )
  }
}
