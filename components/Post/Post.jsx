import React from 'react';
import PropTypes from 'prop-types';
import Autolink from 'react-native-autolink';
import { View, Platform, TouchableOpacity, Modal, Alert, Dimensions } from 'react-native';
import Image from 'react-native-scalable-image';
import {
  Container, Left, Right, Body, Content, Card,
  CardItem, Text, Thumbnail, Button, Icon
} from 'native-base';
import _ from 'lodash';
import { Font, AppLoading } from "expo";
import date from 'date-fns';

import CreateResourceModal from '../CreateResourceModal/CreateResourceModal';
import ApiClient from '../../ApiClient';
import styles from "./PostStyle";

export default class Post extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      profilePicture: null,
      showEditButtons: false,
      editing: false,
      isLiked: this.props.data.isLiked,
      image: null,
    }
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });

    ApiClient.get(`/users/${this.props.data.author._id}/profilePicture`, {}).then(pic => {
      this.setState({
        profilePicture: pic,
      });
    }).catch(error => {
      console.log(error);
    });
    if (this.props.data.image) {
      ApiClient.get(`/posts/${this.props.data._id}/image`, {}).then(pic => {
        this.setState({
          image: pic,
        });
      }).catch(error => {
        console.log(error);
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
    this.setState({ editing: true })
    this.hideEditButtons();
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

    updatePost && updatePost(postId, data, 'editPost');
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

  toggleLike = () => {
    const {
      updatePost,
      data,
      userId,
    } = this.props;

    if (data.usersLiked.includes(userId)) {
      data.likes--;
      data.usersLiked = _.filter(data.usersLiked, user => user !== userId);
      data.isLiked = false;
    } else {
      data.likes++;
      data.usersLiked.push(userId);
      data.isLiked = true;
    }

    if (data.likes < 0) data.likes = 0; // (Grebel's a positive community, come on!)

    this.setState({isLiked: data.isLiked});
    updatePost && updatePost(data._id, data, 'toggleLike');
  }

  getMenuOptions() {
    if (this.props.enableEditing) {
      return(
        <View style={styles.view}>
          <Button block style={styles.editButton} onPress={this.onPressEdit}>
            <Text>Edit Post</Text>
          </Button>
          <Button block style={styles.deleteButton} onPress={this.onPressDelete}>
            <Text>Delete Post</Text>
          </Button>
        </View>
      );
    }
    else {
      return(
        <View style={styles.view}>
          <Button block style={styles.deleteButton} onPress={this.hideEditButtons}>
            <Text>Flag as innapropriate</Text>
          </Button>
        </View>
      );
    }
  }

  render() {
    const {
      showEditButtons,
      editing
    } = this.state;

    const {
      data,
      showUserProfile
    } = this.props;

    var {
      author,
      content,
      likes,
      isLiked,
      comments,
      createdAt,
      isLiked,
      tags,
    } = data;

    var likeIcon = isLiked ? require('../../assets/liked-cookie.png') : require('../../assets/cookie-icon.png');

    // In case author account is deleted
    var authorName;
    if (!author) authorName = "Ghost";
    else authorName = `${author.firstName} ${author.lastName}`;

    // TODO: implement
    var authorPhoto = author.profilePicture;

    createdAt = date.format(createdAt, 'ddd MMM Do [at] h:mma');
    var numComments = comments ? comments.length : 0;
    var likes = likes ? likes : 0;

    return (
      <View>
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
              <Autolink text={content} numberOfLines={this.props.maxLines} ellipsizeMode='tail'/>
            </Body>
          </CardItem>

          {this.state.image ? <CardItem style={styles.imageContainer}>
            <Image
              style={styles.image}
              width={Dimensions.get('window').width}
              source={{ uri: `data:image/png;base64,${this.state.image}` }}
            />
          </CardItem> : null}

          <CardItem style={styles.postFooter}>
            <Left>
              <TouchableOpacity onPress={this.toggleLike}>
                <View style={styles.iconContainer}>
                  <Thumbnail small square source={likeIcon} style={styles.icon} />
                  <Text>{`${likes}`}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={this.onPressPost}>
                <View style={styles.iconContainer}>
                  <Thumbnail small square source={require('../../assets/comments-icon.png')} style={styles.icon} />
                  <Text>{`${numComments}`}</Text>
                </View>
              </TouchableOpacity>
            </Left>
          </CardItem>

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
              {this.getMenuOptions()}
            </TouchableOpacity>
          </Modal>
        </View>

        <CreateResourceModal
          onClose={this.closeEditingModal}
          isModalOpen={editing}
          saveResource={this.saveEdited}
          existing={content}
          submitButtonText='Save'
          clearAfterSave={false}
        />
      </View>
    )
  }
}