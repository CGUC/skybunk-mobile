import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Platform, AsyncStorage } from 'react-native';
import { Container, Footer, Content, Text, Spinner, List } from 'native-base';
import { Font, AppLoading } from "expo";
import Post from '../../components/Post/Post';
import Comment from '../../components/Comment/Comment';
import NoData from '../../components/NoData/NoData';
import ContentBar from '../../components/ContentBar/ContentBar';
import api from '../../ApiClient';
import style from './CommentsStyle';

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
      headerTintColor: '#FFFFFF',
      headerStyle: {
        backgroundColor: '#fc4970',
      },
    };
  };

  constructor(props) {
    super(props);

    const postData = props.navigation.getParam('postData');

    this.state = {
      loading: true,
      postData,
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

    const { navigation } = this.props;
    const { postData } = this.state;

    const userId = navigation.getParam('userId');

    var postUri = `/posts/${postData._id}`;

    await api.get(postUri)
      .then(response => {
        if (response.usersLiked.includes(userId)) {
          response.isLiked = true;
        } else response.isLiked = false;
        this.setState({ postData: response });
      })
      .catch(err => {
        console.error(err);
      });
  }

  updateResource = async (id, data, type) => {

    const {
      navigation,
    } = this.props;

    const userId = navigation.getParam('userId');
    const reloadParent = navigation.getParam('reloadParent');
    const postData = navigation.getParam('postData');

    AsyncStorage.getItem('@Skybunk:token')
      .then(value => {

        if (type === 'toggleLike') {

          if (data.usersLiked.includes(userId)) {
            data.likes--;
            data.usersLiked = _.filter(data.usersLiked, user => user !== userId);
          } else {
            data.likes++;
            data.usersLiked.push(userId);
          }

          if (data.likes < 0) data.likes = 0;

          api.put(`/posts/${id}`, { 'Authorization': 'Bearer ' + value }, data)
            .then(() => {
              this.loadData();
              reloadParent();
            })
            .catch(err => {
              alert("Error updating post. Sorry about that!");
            });

        } else if (type === 'updateComment') {
          api.put(`/posts/${postData._id}/comment/${id}`, { 'Authorization': 'Bearer ' + value }, data)
            .then(() => {
              this.loadData();
              reloadParent();
            })
            .catch(err => {
              alert("Error updating comment. Sorry about that!");
            });

        } else if (type === 'deleteComment') {
          api.delete(`/posts/${postData._id}/comment/${id}`,  { 'Authorization': 'Bearer ' + value })
            .then(() => {
              this.loadData();
              reloadParent();
            })
            .catch(err => {
              alert("Error deleting comment. Sorry about that!")
            });
        }
      })
      .catch(error => {
        this.props.navigation.navigate('Auth');
      });
  }

  addComment = (data) => {
    const {
      navigation,
    } = this.props;

    var reloadParent = navigation.getParam('reloadParent');
    var postData = navigation.getParam('postData');
    var userId = navigation.getParam('userId');

    AsyncStorage.getItem('@Skybunk:token')
      .then(value => {
        var commentContent = {
          author: userId,
          content: data,
        }

        api.post(`/posts/${postData._id}/comment`, { 'Authorization': 'Bearer ' + value }, commentContent)
          .then(() => {
            this.loadData();
            reloadParent();
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
      postData,
    } = this.state;

    const userId = this.props.navigation.getParam('userId');
    var enablePostEditing = postData.author._id === userId;

    var comments = postData.comments;

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
              data={postData}
              maxLines={1000}
              updatePost={this.updateResource}
              enableEditing={enablePostEditing}
            />
            <ScrollView>
              {comments.length ?
                _.map(_.orderBy(comments, comment => comment.createdAt.valueOf()),
                  (comment, key) => {
                    var enableCommentEditing = comment.author._id === userId;

                    return (
                      <Comment
                        key={`comment${key}`}
                        data={comment}
                        updateComment={this.updateResource}
                        enableEditing={enableCommentEditing}
                      />
                    )
                  })
                :
                <Text style={style.noDataText}>
                  No comments yet - You could be the first!
                </Text>
              }
            </ScrollView>
          </Content>
          <Footer>
            <ContentBar
              addResource={this.addComment}
              submitButtonText='Comment'
            />
          </Footer>
        </Container>
      )
    }
  }
}