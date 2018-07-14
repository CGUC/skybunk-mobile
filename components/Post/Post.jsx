import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform, TouchableOpacity } from 'react-native';
import {
  Container, Left, Right, Body, Content, Card,
  CardItem, Text, Thumbnail
} from 'native-base';
import _ from 'lodash';
import { Font, AppLoading } from "expo";
import date from 'date-fns';
import ApiClient from '../../ApiClient';
import styles from "./PostStyle";

export default class Post extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      profilePicture: null,
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
  }

  // TODO: implement editing
  editPost = (newContent) => {
    const { updatePost, data } = this.props;
    var postId = data._id;

    updatePost && updatePost(postId, { content: newContent });
  }

  getEditJSX() {
    const { enableEditing } = this.props;

    if (enableEditing) return (
      <Right>
        <Text>Edit Me!</Text>
      </Right>
    )
    return null;
  }

  onPressPost = () => {
    // Call parent to navigate
    var { onPressPost, data } = this.props;
    if (onPressPost) onPressPost(data);
  }

  toggleLike = () => {
    const {
      updatePost,
      data: postData
    } = this.props;

    updatePost && updatePost(postData._id, postData, 'toggleLike');
  }

  render() {
    const {
      data
    } = this.props;

    var {
      author,
      content,
      likes,
      isLiked,
      comments,
      createdAt,
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
      <Card style={styles.card}>

        <CardItem>
          <Left>
            <Thumbnail style={styles.profilePicThumbnail} source={{ uri: `data:image/png;base64,${this.state.profilePicture}` }} />
            <Body>
              <Text>{authorName} {this.props.showTag ? ` ►  ${tags[0]}` : null}</Text>
              <Text note>{createdAt}</Text>
            </Body>
          </Left>
          {/* {this.getEditJSX()} */}
        </CardItem>

        <CardItem button onPress={this.onPressPost} style={styles.postContent}>
          <Body>
            {/* {this.getImageJSX()} */}
            <Text numberOfLines={this.props.maxLines} ellipsizeMode='tail'>{content}</Text>
          </Body>
        </CardItem>

        <CardItem style={styles.postFooter}>
          <Left>
            <TouchableOpacity onPress={this.toggleLike}>
              <View style={styles.iconContainer}>
                <Thumbnail small square source={likeIcon} style={styles.icon}/>
                <Text>{`${likes}`}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={this.onPressPost}>
              <View style={styles.iconContainer}>
                <Thumbnail small square source={require('../../assets/comments-icon.png')} style={styles.icon}/>
                <Text>{`${numComments}`}</Text>
              </View>
            </TouchableOpacity>
          </Left>
        </CardItem>

      </Card>
    )
  }
}