import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Platform } from 'react-native';
import {
  Container, Header, Footer, Content, Card, CardItem, Thumbnail, Text, Button, Icon,
  Left, Label, Body, Right, Title, Form, Input, Item, Spinner, List
} from 'native-base';
import { Font, AppLoading } from "expo";

import Post from '../components/Post';
import Comment from '../components/Comment';
import NoData from '../components/NoData';
import ContentBar from '../components/ContentBar';

export default class CommentsView extends React.Component {

  static navigationOptions = ({ navigation }) => {
    var postData = navigation.getParam('postData')
    if (postData) {
      if (postData.author)
        title = `Comments on ${postData.author.firstName}'s post`;
      else
        title = "Comments"
    }

    return {
      title,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    }
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });

    const { navigation } = this.props;
    var postData = navigation.getParam('postData');

    var comments = postData.comments;

    this.setState({ comments, loading: false });
  }

  render() {
    const {
      loading,
    } = this.state;

    const {
      navigation
    } = this.props;

    const post = navigation.getParam('postData');
    var comments = post.comments;

    if (loading) {
      return (
        <Container>
          <Content>
            <Spinner color='#cd8500' />
          </Content>
        </Container>
      );
    } else if (comments.length) {
      return (
        <Container>
          <Content>
            <Post
              data={post}
            />
            <ScrollView>
              <List>
                {
                  _.map(_.orderBy(comments, comment => comment.createdAt.valueOf(), ['desc']),
                    (comment, key) => {
                      return (
                        <Comment
                          key={`comment${key}`}
                          data={comment}
                        />
                      )
                    })
                }
              </List>
            </ScrollView>
          </Content>
          <Footer>
            <ContentBar
            />
          </Footer>
        </Container>
      )
    } else {
      return (
        <NoData resourceName={'comments'} />
      )
    }
  }
}