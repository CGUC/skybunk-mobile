import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Platform } from 'react-native';
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
      likeGiven: false,
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

  componentWillUnmount() {
    /**
     * Update likes only when component unmounts to prevent excessive
     * network calls from spamming the like button
    */
    const { likeGiven } = this.state;
    const { updatePost, data } = this.props;

    var postId = data._id;
    var currentLikes = data.likes || 0;

    //if (likeGiven) updatePost(postId, { likes: currentLikes + 1 });
  }

  // TODO: implement editing
  editPost = (newContent) => {
    const { updatePost, data } = this.props;
    var postId = data._id;

    updatePost && updatePost(postId, { content: newContent });
  }

  toggleLike = () => {
    const { likeGiven } = this.state;
    this.setState({ likeGiven: !likeGiven });
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

  onPressPost = () => {
    // Call parent to navigate
    var { onPressPost, data } = this.props;
    if (onPressPost) onPressPost(data);
  }

  render() {
    const {
      likeGiven
    } = this.state;

    const {
      data
    } = this.props;

    var {
      author,
      content,
      likes,
      comments,
      createdAt,
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
    if (likeGiven) likes++;

    return (
      <Card style={{ flex: 0 }}>

        <CardItem>
          <Left>
            <Thumbnail style={styles.profilePicThumbnail} source={{uri: `data:image/png;base64,${this.state.profilePicture}`}} />
            <Body>
              <Text>{authorName}</Text>
              <Text note>{createdAt}</Text>
            </Body>
          </Left>
          {/* <Right> */}
          {/* Three dots to edit */}
          {/* </Right> */}
        </CardItem>

        <CardItem button onPress={this.onPressPost}>
          <Body>
            {/* {this.getImageJSX()} */}
            <Text numberOfLines={this.props.maxLines} ellipsizeMode='tail'>{content}</Text>
          </Body>
        </CardItem>

        <CardItem>
          <Left>
            {/* <Button transparent onPress={this.toggleLike}>
              <Icon name='give-cookie-icon' />
            </Button> */}
            <Text>{`${likes} likes`}</Text>
          </Left>
          <Right>
            <Button transparent onPress={this.onPressPost}>
              <Text>{`${numComments} ${numComments !== 1 ? 'comments' : 'comment'}`}</Text>
            </Button>
          </Right>
        </CardItem>

      </Card>
    )
  }
}