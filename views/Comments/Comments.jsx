import React from 'react';
import { ScrollView} from 'react-native';
import { Container, Footer, Content, Text, Spinner } from 'native-base';
import { Font } from "expo";

import Post from '../../components/Post/Post';
import Comment from '../../components/Comment/Comment';
import ContentBar from '../../components/ContentBar/ContentBar';
import UserProfile from '../../components/UserProfile/UserProfile.jsx';
import ApiClient from '../../ApiClient';
import style from './CommentsStyle';
import defaultStyles from "../../styles/styles";
import _ from 'lodash'

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

    const loggedInUser = navigation.getParam('loggedInUser');
    const updateParentState = navigation.getParam('updateParentState');

    var postUri = `/posts/${postData._id}`;

    await ApiClient.get(postUri, {authorized: true})
      .then(response => {
        if (response.usersLiked.find(user => user._id === loggedInUser._id)) {
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

    const loggedInUser = this.props.navigation.getParam('loggedInUser');
    const updateParentState = navigation.getParam('updateParentState');

    if (['toggleLike', 'editPost'].includes(type)) {
      ApiClient.put(`/posts/${postData._id}`, data, {authorized: true})
        .then(() => {
          this.setState({ postData: data });
          updateParentState('updatePost', data);
        })
        .catch(err => {
          console.error(err);
          alert("Error updating post. Sorry about that!");
        });
    }

    else if (type === 'deletePost') {
      ApiClient.delete(`/posts/${postData._id}`, {authorized: true})
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
        author: loggedInUser._id,
        content: data.content,
      }
      ApiClient.post(`/posts/${postData._id}/comment`, commentContent, {authorized: true})
        .then(() => {
          this.loadData();
        })
        .catch(err => {
          alert("Error adding comment. Sorry about that!")
        });
    }

    else if (type === 'updateComment') {
      var commentContent = {
        author: loggedInUser._id,
        content: data.content,
      }
      ApiClient.put(`/posts/${postData._id}/comment/${id}`, commentContent, {authorized: true})
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
      ApiClient.delete(`/posts/${postData._id}/comment/${id}`, {authorized: true})
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
          console.error(err)
          alert("Error deleting comment. Sorry about that!")
        });
    }
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
        <Container style={defaultStyles.backgroundTheme}>
          <Content>
            <Text style={style.noDataText}>This post doesn't seem to exist :/</Text>
          </Content>
        </Container>
      )
    }

    const loggedInUser = this.props.navigation.getParam('loggedInUser');
    var enablePostEditing = postData.author._id === loggedInUser._id;

    var comments = postData.comments;

    if (loading) {
      return (
        <Container style={defaultStyles.backgroundTheme}>
          <Content>
            <Spinner color='#cd8500' />
          </Content>
        </Container>
      );
    } else {
      return (
        <Container style={defaultStyles.backgroundTheme}>
          <Content>
            <Post
              data={postData}
              maxLines={1000}
              updatePost={this.updateResource}
              enableEditing={enablePostEditing}
              enableDeleting={ loggedInUser.role && loggedInUser.role.includes("admin")}
              loggedInUser={loggedInUser}
              showUserProfile={this.showUserProfile}
              showFullDate={true}
            />
            <ScrollView>
              {comments.length ?
                _.map(_.orderBy(comments, comment => comment.createdAt.valueOf()),
                  (comment, key) => {
                    var enableCommentEditing = comment.author._id === loggedInUser._id;

                    return (
                      <Comment
                        key={`comment${key}`}
                        data={comment}
                        updateComment={this.updateResource}
                        enableEditing={enableCommentEditing}
                        enableDeleting={ loggedInUser.role && loggedInUser.role.includes("admin")}
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