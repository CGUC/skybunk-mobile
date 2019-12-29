import React from 'react';
import PropTypes from 'prop-types';
import Autolink from 'react-native-autolink';
import { ScrollView, TouchableOpacity, View, Modal } from 'react-native';
import {
  Text, Thumbnail, ListItem, Card, CardItem,
  Container, Content, Left, Icon, Button
} from 'native-base';
import _ from 'lodash';
import { AppLoading } from "expo";
import * as Font from 'expo-font';
import date from 'date-fns';
import Popover from 'react-native-popover-view';

import styles from "./CommentStyle";
import {getProfilePicture} from "../../helpers/imageCache"
import CommentEditor from '../CommentEditor/CommentEditor';

export default class Comment extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      profilePicture: null,
      showEditButtons: false,
      editing: false,
      showLikedList: false
    }
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

    this.setState({ loading: false });
  }

  onPressComment = () => {
    if (this.props.enableEditing || this.props.enableDeleting) {
      this.setState({ showEditButtons: true });
    }
  }

  hideEditButtons = () => {
    this.setState({ showEditButtons: false });
  }

  onPressEdit = () => {
    this.setState({ editing: true })
    this.hideEditButtons();
  }

  saveEdited = (commentId, newComment, type) => {
    const { updateComment, data } = this.props;

    var commentId = data._id;
    data.content = newComment.content;

    this.closeEditingModal();

    updateComment && updateComment(commentId, data, "updateComment");
  }

  closeEditingModal = () => {
    this.setState({ editing: false });
  }

  onPressDelete = () => {
    const { updateComment, data } = this.props;

    var commentId = data._id;

    this.hideEditButtons();

    updateComment && updateComment(commentId, {}, "deleteComment");
  }

  toggleLike = () => {
    const {
      data,
      loggedInUser,
      updateComment
    } = this.props;

    if (data.usersLiked.find((user) => user._id === loggedInUser._id)) {
      data.usersLiked = data.usersLiked.filter(user => user._id !== loggedInUser._id);
    } else {
      console.log("pushing")
      data.usersLiked.push({
        _id: loggedInUser._id,
        firstname: loggedInUser.firstName,
        lastName: loggedInUser.lastName
      });
    }

    if (data.likes < 0) data.likes = 0; // (Grebel's a positive community, come on!)
    console.log("Updating resource")
    updateComment && updateComment(data._id, data, 'toggleCommentLike');
    console.log("Updating resource")
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

  render() {
    const {
      showEditButtons,
      editing,
      showLikedList
    } = this.state;

    const {
      data,
      showUserProfile,
      enableEditing
    } = this.props;

    var {
      author,
      content,
      createdAt,
      usersLiked,
    } = data;

    var authorName;
    if (!author) authorName = "Ghost";
    else authorName = `${author.firstName} ${author.lastName}`;

    if(date.isPast(date.addWeeks(createdAt,1))){
      //If the post is more than a week old, display date
      createdAt = date.format(createdAt, 'ddd MMM Do');
    }else{
      //Display how long ago the post was made
      createdAt = date.distanceInWordsToNow(createdAt, {addSuffix: true});
    }

    if(editing){
      return (
        <CommentEditor
          author={author}
          updateResource={this.saveEdited}
          commentData={content}
        />
      )
    }

    const isLiked = usersLiked.filter(e => e._id == this.props.loggedInUser._id).length > 0;

    var likeIcon = isLiked ? require('../../assets/liked-cookie.png') : require('../../assets/cookie-icon.png');
    var likesDialog = usersLiked.length > 0 ? usersLiked.length : '';

    return (
      <View>
        <Card style={styles.card}>
          <CardItem style={styles.cardItem}>
            <View style={styles.textContainer}>
              <TouchableOpacity onPress={() => showUserProfile(author)}>
                <Thumbnail
                  small
                  style={styles.profilePicThumbnail}
                  source={{ uri: `data:image/png;base64,${this.state.profilePicture}` }}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{flex:1}} onPress={this.onPressComment} hitSlop={{ top: 15, bottom: 15, left: 10, right: 10 }}>
                <View style={styles.title}>
                  <Text style={styles.textAuthor}>
                    {`${authorName} `}
                  </Text>
                  <Text note>
                    {`${createdAt} `}
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Autolink text={content} style={styles.textContent}/>
                  <View style={styles.iconContainer}>
                    <TouchableOpacity
                      onPress={() => this.setState({ showLikedList: true })}
                      ref={ref => this.dialogRef = ref}
                      hitSlop={{ top: 40, bottom: 10, left: 30, right: 40 }}
                    >
                      <Text style={styles.likesDialog}>{`${likesDialog}`}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.toggleLike}>
                      <Thumbnail small square source={likeIcon} style={styles.icon} />
                    </TouchableOpacity>
                  </View>
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
              <View style={styles.view}>
                {enableEditing && <Button block style={styles.editButton} onPress={this.onPressEdit}>
                  <Text>Edit Comment</Text>
                </Button>}
                <Button block style={styles.deleteButton} onPress={this.onPressDelete}>
                  <Text>Delete Comment</Text>
                </Button>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      </View>
    )
  }
}
