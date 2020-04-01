import React from 'react';
import Autolink from 'react-native-autolink';
import { View, ScrollView, TouchableOpacity, TouchableWithoutFeedback, Modal, Alert, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import Image from 'react-native-scalable-image';
import { Body, Card, CardItem, Text, Thumbnail, Button, Icon } from 'native-base';
import * as Font from 'expo-font';
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

    this.FIRST_NAMES = [
      "Twinkle",
      "Pooks",
      "Fire",
      "Woodsy",
      "Gandalf",
      "Tim",
      "Winter",
      "Shadow",
      "Giggly",
      "Spooks",
      "Thunder",
      "Grebel",
      "Footsie",
      "Dagger",
      "Toothless",
      "Fairy",
      "Harry",
      "Elfenstine",
      "Floofer",
      "Sandwhich",
      "Moon",
      "Ned",
      "Kitty",
      "Mindlord",
      "Youtube",
      "Shadow"
    ]

    this.LAST_NAMES = [
      "Firehazard",
      "Toast",
      "Salamander",
      "Dragontongue",
      "Sunlapper",
      "Queereye",
      "Earthshaker",
      "Tim",
      "Fluffer",
      "Summerwand",
      "Snuggles",
      "Treehugger",
      "Cuddles",
      "Magichands",
      "Hands",
      "Wolf",
      "Cow",
      "Crow",
      "Merlin",
      "Troll",
      "Shairaships",
      "Wingear",
      "Dancer",
      "Imp",
      "Potty",
      "Kitten"
    ]

    this.MIDDLE = [
      "Mc",
      "Von",
      "Vander",
      "St",
      "Mac"
    ]

    this.PICTURES = [
      "https://a.wattpad.com/useravatar/Kitten6416.256.440418.jpg",
      "https://i.pinimg.com/originals/e2/1c/61/e21c610b3078c665b06348af7b4535f0.jpg",
      "https://a.wattpad.com/useravatar/Kitten6416.256.440418.jpg",
      "https://a.wattpad.com/useravatar/ShyKitten13.256.435525.jpg",
      "https://a.thumbs.redditmedia.com/aZgT3brFyzKwCh6synQ395042guv7XxNBbt3vwHIBk4.png",
      "https://pbs.twimg.com/profile_images/422121203440955392/Ma_alVbk.jpeg",
      "https://a.wattpad.com/useravatar/kittychan_atsumi.256.149618.jpg",
      "https://images.pexels.com/users/avatars/1001118/phil-goulson-177.jpeg?w=256&h=256&fit=crop&crop=faces&auto=compress",
      "https://is3-ssl.mzstatic.com/image/thumb/Purple6/v4/0d/82/aa/0d82aa05-1f50-bb1b-5d65-160c46962362/source/256x256bb.jpg",
      "https://pbs.twimg.com/profile_images/594104592335446017/XXPHjAU3.jpg",
      "https://i.pinimg.com/originals/7d/c3/2e/7dc32e6daee17e8919340fe962ec1067.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQBkrJHl2kF4dIPeT1BvAXaK0blSl20TLJhY32sOwzMEwWP_eYI&usqp=CAU",
      "https://static.wixstatic.com/media/7770f1_ed5ef8b7496741bba3032d5064ec8162~mv2.jpg/v1/fill/w_256,h_256,al_c,lg_1,q_80/7770f1_ed5ef8b7496741bba3032d5064ec8162~mv2.webp",
      "https://is3-ssl.mzstatic.com/image/thumb/Purple128/v4/a2/8a/3c/a28a3ce2-f2af-652c-c27f-9a959f193f56/source/256x256bb.jpg",
      "https://cdn163.picsart.com/222702403000202.jpg?type=webp&to=crop&r=256",
      "https://i.pinimg.com/474x/b5/e1/be/b5e1bef76b2058910f556c85c1040b79.jpg",
      "https://i.pinimg.com/originals/1b/e4/94/1be494c3c065c9c97da3231f7303ee85.jpg",
      "https://pbs.twimg.com/profile_images/2819857246/57340e8a6924c086162be0e0211525c1.jpeg",
      "https://i.pinimg.com/originals/81/39/0d/81390dfb8ad297c7abd5e0179a0f8486.jpg",
      "https://pbs.twimg.com/media/BRtfYmQCIAI89-r.jpg:large"
    ]
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("../../node_modules/native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("../../node_modules/native-base/Fonts/Roboto_medium.ttf")
    });

    getProfilePicture(this.props.data.author._id).then(pic => {
      this.setState({
        profilePicture: pic,
      });
    }).catch(error => {
      console.error(error);
    });
    const { media }= this.props.data
    if (media && media.type==='image') {
      getPostPicture(this.props.data._id).then(pic => {
        this.setState({
          image: pic,
        });
      }).catch(error => {
        console.error(error);
      });
    }
    if (media && media.type==='poll') {
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
    const {data, loggedInUser} = this.props
    const {pollCopy, image} = this.state
    this.props.navigation.navigate("CreatePost",  {data, poll: pollCopy, image, loggedInUser})
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
        data.poll = poll;
        data.content = poll.title;
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
    const { updatePost, data } = this.props;

    var postId = data._id;

    this.hideEditButtons();

    updatePost && updatePost(postId, {}, "deletePost");
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

  updatePoll = async (poll) => {
    let { updatePost, data } = this.props;
    let postId = this.props.data._id;
    data = {
      ...data,
      content: poll.title,
      poll: poll,
    }

    this.setState({
      updateKey: (this.state.updateKey + 1) % 10,
      poll: poll,
      pollCopy: this.copyPollData(poll),
    });

    updatePost && updatePost(postId, data, 'votePoll');
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
    // else authorName = `${author.firstName} ${author.lastName}`;
    else authorName = `${this.FIRST_NAMES[Math.floor(Math.random() * 25)]} ${this.MIDDLE[Math.floor(Math.random() * 5)]}${this.LAST_NAMES[Math.floor(Math.random() * 25)]}`;

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

    if(!tags || !tags[0]){
      console.warn(`Post by ${author} does not have tags: ${content}`)
      return null;
    }

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
                        // source={{ uri: `data:image/png;base64,${this.state.profilePicture}` }}
                        source={{ uri: this.PICTURES[Math.floor(Math.random() * 20)] }}
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
