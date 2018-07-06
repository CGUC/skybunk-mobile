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


export default class Post extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      likeGiven: false,
    }
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
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

    updatePost(postId, { content: newContent });
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
    var { onPressPost } = this.props;
    if (onPressPost) onPressPost();
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

    createdAt = date.format(createdAt, 'ddd MMM Do [at] h:ma');
    var numComments = comments ? comments.length : 0;
    var likes = likes ? likes : 0;
    if (likeGiven) likes++;

    var {
      firstName,
      lastName,
      username
    } = author;

    return (
      <Card style={{ flex: 0 }}>

        <CardItem>
          <Left>
            {/* <Thumbnail source={profilePic} /> */}
            <Body>
              <Text>{`${username} (${firstName})`}</Text>
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
            <Text>{content}</Text>
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
            <Text>{`${numComments} comments`}</Text>
            {/* <Button onPress={this.onPressPost}> <-- give this some slop
              <Icon name='comment' />
            </Button> */}
          </Right>
        </CardItem>

      </Card>
    )
  }
}