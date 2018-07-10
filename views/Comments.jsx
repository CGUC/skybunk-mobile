import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Platform, AsyncStorage } from 'react-native';
import {
  Container, Header, Footer, Content, Card, CardItem, Thumbnail, Text, Button, Icon,
  Left, Label, Body, Right, Title, Form, Input, Item, Spinner, List
} from 'native-base';
import { Font, AppLoading } from "expo";

import Post from '../components/Post';
import Comment from '../components/Comment';
import NoData from '../components/NoData';
import ContentBar from '../components/ContentBar';
import api from '../ApiClient';

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
      headerStyle: {
        backgroundColor: '#fc4970'
      },
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      comments: [],
    }
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });

    await this.loadData();

    this.setState({ loading: false });
  }

  async loadData() {

    let postData = this.props.navigation.getParam('postData');

    var uri = `/posts/${postData._id}/comments`;

    await api.get(uri)
      .then(response => {
        this.setState({ comments: response });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  addComment = (data) => {
    const {
      navigation,
    } = this.props;

    var reloadParent = navigation.getParam('reloadParent');
    var postData = navigation.getParam('postData');

    AsyncStorage.getItem('@Skybunk:token')
      .then(value => {
        api.get('/users/loggedInUser', { 'Authorization': 'Bearer ' + value }).then(user => {
          var commentContent = {
            author: user._id,
            content: data,
          }

          api.post(`/posts/${postData._id}/comment`, { 'Authorization': 'Bearer ' + value }, commentContent)
            .then(() => {
              this.loadData();
              reloadParent();
            });
        });
      })
      .catch(error => {
        console.error(error);
        this.props.navigation.navigate('Auth');
      });
  }

  render() {
    const {
      loading,
      comments,
    } = this.state;

    var postData = this.props.navigation.getParam('postData');

    var previewPostData = {
      ...postData,
      comments: comments
    }

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
          <Content>
            <Post
              data={previewPostData}
              maxLines={1000}
            />
            <ScrollView>
              {comments.length ? 
                <List>
                  {
                    _.map(_.orderBy(comments, comment => comment.createdAt.valueOf()),
                      (comment, key) => {
                        return (
                          <Comment
                            key={`comment${key}`}
                            data={comment}
                          />
                        )
                      })
                  }
                </List> :
                <Text style={{
                  flex: 1,
                  flexDirection: "row",
                  fontSize: 18,
                  fontStyle: 'italic',
                  marginTop: 20,
                  marginBottom: 20,
                  textAlign: 'center' 
                }}>
                  No comments yet - You could be the first!
                </Text>
              }
            </ScrollView>
          </Content>
          <Footer>
            <ContentBar
              addResource={this.addComment}
            />
          </Footer>
        </Container>
      )
    }
  }
}