/**
 * Screen to display a feed of relevant posts in a scrollable list.
 * TODO: This should probably be re-used for All Feed and My Subs, receiving specificity through props
*/

import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Platform } from 'react-native';
import {
  Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon,
  Left, Label, Body, Right, Title, Form, Input, Item, Spinner
} from 'native-base';
import { Font, AppLoading } from "expo";

import _ from 'lodash';

import NavBar from '../components/Navbar';
import Post from '../components/Post';
import api from '../ApiClient';

export default class FeedView extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('channelName', 'Feed'),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loading: true,
    }
  }

  async componentWillMount() {

    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });

    const {
      navigation,
    } = this.props;

    const channelId = navigation.getParam('channelId', 'all');

    // TODO: implement method of fetching posts for subscribed channels
    var uri;
    if (['all', 'subs'].includes(channelId)) uri = '/posts';
    else uri = `/channels/${channelId}/posts`;

    await api.get(uri)
      .then(response => {
        this.setState({ posts: response });
      })
      .catch((err) => {
        console.error(err);
      });

    this.setState({ loading: false });
  }

  updatePost = async (postId, data) => {
    await api.put(`/posts/${postId}`, {}, data)
      .then(() => {
        alert("Post updated");
      })
      .catch(err => {
        alert("Error updating post");
      });
  }

  onPressPost = (postId) => {
    //this.props.navigation.navigate('Post', { postId: postId });
    alert('Post pressed')
  }

  render() {
    const {
      posts,
      loading
    } = this.state;

    if (loading) {
      return (
        <Container>
          <Content>
            <Spinner color='#cd8500' />
          </Content>
        </Container>
      );
    } else {
      return (
        <Container>
          {/* <Header>
            <NavBar />
          </Header> */}
          <Content>
            <ScrollView>
              {
                _.map(_.sortBy(posts, post => post.createdAt.valueOf()),
                  (post, key) => {
                    return (
                      <Post
                        key={`post${key}`}
                        data={post}
                        onPressPost={this.onPressPost}
                        updatePost={this.updatePost}
                      />
                    )
                  })
              }
            </ScrollView>
          </Content>
          {/* <Footer>
            <ContentBar />
          </Footer> */}
        </Container>
      )
    }
  }
}

FeedView.propTypes = {
  channelId: PropTypes.string // should be 'all', 'subs' or channel id
}