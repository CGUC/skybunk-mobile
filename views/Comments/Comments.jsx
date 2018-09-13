import React from 'react';
import { ScrollView, AsyncStorage } from 'react-native';
import { Container, Footer, Content, Text, Spinner } from 'native-base';
import { Font } from "expo";

import Post from '../../components/Post/Post';
import Comment from '../../components/Comment/Comment';
import ContentBar from '../../components/ContentBar/ContentBar';
import UserProfile from '../../components/UserProfile/UserProfile.jsx';
import api from '../../ApiClient';
import style from './CommentsStyle';

export default class CommentsView extends React.Component {

  static navigationOptions = ({ navigation }) => {
    var postData = navigation.getParam('postData')
    var title;
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
      userDataToShow: undefined,
      showProfileModal: false
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

    if (!postData) return;

    const userId = navigation.getParam('userId');
    const updateParentState = navigation.getParam('updateParentState');

    var postUri = `/posts/${postData._id}`;

    await api.get(postUri)
      .then(response => {
        if (response.usersLiked.includes(userId)) {
          response.isLiked = true;
        } else response.isLiked = false;

        this.setState({ postData: response });

        // Ensure feed view is up-to-date with current:
        updateParentState('updatePost', response);
      })
      .catch(err => {
        console.error(err);
      });
  }

  updateResource = async (id, data, type) => {

    const {
      navigation,
    } = this.props;

    const {
      postData
    } = this.state;

    const userId = this.props.navigation.getParam('userId');
    const updateParentState = navigation.getParam('updateParentState');

    AsyncStorage.getItem('@Skybunk:token')
      .then(value => {

        if (['toggleLike', 'editPost'].includes(type)) {
          api.put(`/posts/${postData._id}`, { 'Authorization': 'Bearer ' + value }, data)
            .then(() => {
              this.setState({ postData: data });
              updateParentState('updatePost', data);
            })
            .catch(err => {
              console.log(err);
              alert("Error updating post. Sorry about that!");
            });
        }

        else if (type === 'deletePost') {
          api.delete(`/posts/${postData._id}`, { 'Authorization': 'Bearer ' + value })
            .then(() => {
              updateParentState('deletePost', postData._id);
            })
            .catch(err => {
              alert("Error deleting post. Sorry about that!")
            });
          navigation.goBack();
        }

        else if (type === 'addComment') {
          var commentContent = {
            author: userId,
            content: data.content,
          }
          api.post(`/posts/${postData._id}/comment`, { 'Authorization': 'Bearer ' + value }, commentContent)
            .then(() => {
              this.loadData();
            })
            .catch(err => {
              alert("Error adding comment. Sorry about that!")
            });
        }

        else if (type === 'updateComment') {
          var commentContent = {
            author: userId,
            content: data.content,
          }
          api.put(`/posts/${postData._id}/comment/${id}`, { 'Authorization': 'Bearer ' + value }, commentContent)
            .then(() => {
              var updatedPost = {
                ...postData,
                comments: postData.comments.map(comment => {
                  if (comment._id === id) return data;
                  return comment;
                })
              };
              this.setState({ postData: updatedPost });
              updateParentState('updatePost', updatedPost);
            })
            .catch(err => {
              alert("Error updating comment. Sorry about that!");
            });
        }

        else if (type === 'deleteComment') {
          api.delete(`/posts/${postData._id}/comment/${id}`, { 'Authorization': 'Bearer ' + value })
            .then(() => {
              var updatedPost = {
                ...postData,
                comments: postData.comments.filter(comments => {
                  return comments._id !== id;
                })
              };
              this.setState({ postData: updatedPost });
              updateParentState('updatePost', updatedPost);
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

  showUserProfile = (user) => {
    this.setState({
      userDataToShow: user,
      showProfileModal: true
    })
  }

  closeProfileModal = () => {
    this.setState({
      userDataToShow: undefined,
      showProfileModal: false
    })
  }

  render() {
    const {
      loading,
      postData,
      userDataToShow,
      showProfileModal
    } = this.state;

    if (!postData) {
      return (
        <Container>
          <Content>
            <Text style={style.noDataText}>This post doesn't seem to exist :/</Text>
          </Content>
        </Container>
      )
    }

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
              userId={userId}
              showUserProfile={this.showUserProfile}
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
                        showUserProfile={this.showUserProfile}
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
              addResource={(content) => this.updateResource(undefined, content, 'addComment')}
              submitButtonText='Comment'
            />
          </Footer>

          <UserProfile
            user={userDataToShow}
            onClose={this.closeProfileModal}
            isModalOpen={showProfileModal}
          />
        </Container>
      )
    }
  }
}