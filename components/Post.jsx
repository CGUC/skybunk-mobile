import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import {
  Container, Left, Right, Body, Content, Card,
  CardItem, Text, Button, Thumbnail, Icon, Image
} from 'native-base';
import _ from 'lodash';
import { Font, AppLoading } from "expo";
import date from 'date-fns';
import ApiClient from '../ApiClient';
import styles from "../styles/styles";

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

  getImageJSX() {
    var {
      data
    } = this.props

    var image = data.image ? data.image : null;

    if (image) {
      // TODO: figure out how images work
      return <Image source={image} style={{ height: 200, width: 200, flex: 1 }} />
    } else {
      return null;
    }
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
      comments,
      createdAt,
      tags,
    } = data;

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
      <Card style={{ flex: 0, elevation: 0, marginTop: 0, marginBottom: 4 }}>

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

        <CardItem button onPress={this.onPressPost} style={{ marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}>
          <Body>
            {/* {this.getImageJSX()} */}
            <Text numberOfLines={this.props.maxLines} ellipsizeMode='tail'>{content}</Text>
          </Body>
        </CardItem>

        <CardItem style={{ marginTop: 3, marginBottom: 3 }}>
          <Left>
            <TouchableOpacity onPress={this.toggleLike}>
              <View style={{ flexDirection: 'row', marginRight: 20 }}>
                <Thumbnail small square source={require('../assets/cookie-icon.png')}
                  style={{ width: 25, height: 25, marginRight: 0, paddingRight: 0 }}
                />
                <Text>{`${likes}`}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onPressPost}>
              <View style={{ flexDirection: 'row' }}>
                <Thumbnail small square source={require('../assets/comments-icon.png')}
                  style={{ width: 25, height: 25, marginRight: 0, paddingRight: 0 }}
                />
                <Text>{`${numComments}`}</Text>
              </View>
            </TouchableOpacity>
          </Left>
        </CardItem>

      </Card>
    )
  }
}