/**
 * Screen to display a feed of relevant posts in a scrollable list.
 * TODO: This should probably be re-used for All Feed and My Subs, receiving specificity through props
*/

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FlatList, AsyncStorage, View } from 'react-native';
import { Container, Footer, Content, Spinner, Text } from 'native-base';
import { Font, AppLoading } from "expo";
import ContentBar from '../../components/ContentBar/ContentBar';
import UserProfile from '../../components/UserProfile/UserProfile.jsx';
import Post from '../../components/Post/Post';
import NoData from '../../components/NoData/NoData';
import api from '../../ApiClient';
import styles from './FeedStyle';

export default class FeedView extends React.Component {

  static navigationOptions = ({ navigation }) => {
    var channel = navigation.getParam('channel')
    if (channel) title = channel.name;
    else title = 'Feed';

    return {
      title,
      headerTintColor: '#FFFFFF',
      headerStyle: {
        backgroundColor: '#fc4970'
      },
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loading: true,
      user: {},
      loadingPage: false,
      page: 1,
      loadedLastPage: false,
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

  getUri() {
    const loggedInUser = this.props.navigation.getParam('loggedInUser');
    
    var channel = this.props.navigation.getParam('channel');
    if (!channel) channel = { _id: 'all' };

    if ('all' === channel._id) {
      return '/posts'
    }
    else if ('subs' === channel._id) {
      return `/users/${loggedInUser._id}/subscribedChannels/posts`;
    }
    else if ('myPosts' === channel._id) {
      return `/posts/user/${loggedInUser._id}`;
    }
    return `/channels/${channel._id}/posts`;
  }

  loadData = async () => {
    this.setState({ 
      loading: true,
      page: 1,
      loadedLastPage: false
    });
    const loggedInUser = this.props.navigation.getParam('loggedInUser');
    await api.get(this.getUri())
      .then(response => {
        // This doesn't look like it does anything, but it does. ¯\_(ツ)_/¯
        var posts = _.map(response, post => {
          if (post.usersLiked.find((user) => user._id === loggedInUser._id)) {
            post.isLiked = true;
          } else post.isLiked = false;
          return post;
        });

        this.setState({
          posts: response,
          loading: false,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  addPost = (data) => {
    /**
     * Currently data is just a string of text
     */
    const {
      navigation,
    } = this.props;

    const loggedInUser = navigation.getParam('loggedInUser');

    var channel = navigation.getParam('channel');
    if (['all', 'subs'].includes(channel._id)) return console.error(`Can't add post to ${channel._id} feed`);

    var tags = channel.tags;

    AsyncStorage.getItem('@Skybunk:token')
      .then(value => {
        var postContent = {
          author: loggedInUser._id,
          content: data.content,
          tags: tags
        }
        api.post('/posts', { 'Authorization': 'Bearer ' + value }, postContent)
        .then(response => response.json())
        .then(post => {
          if (data.image) {
            api.uploadPhoto(
              `/posts/${post._id}/image`,
              { 'Authorization': 'Bearer ' + value },
              data.image,
              'image',
              'POST'
            ).then(() => this.loadData());
          }
          else {
            this.loadData();
          }
        });
      })
      .catch(error => {
        this.props.navigation.navigate('Auth');
      });
  }

  updatePost = async (postId, data, type) => {

    const {
      navigation,
    } = this.props;

    if (type === 'toggleLike') {
      this.setState({
        posts: this.state.posts.map(post => {
          if (post._id === postId) return data;
          return post;
        })
      });
    }

    AsyncStorage.getItem('@Skybunk:token')
      .then(value => {

        if (type === 'deletePost') {
          return api.delete(`/posts/${postId}`, { 'Authorization': 'Bearer ' + value })
            .then(() => {
              this.updateState('deletePost', postId);
            })
            .catch(err => {
              alert("Error deleting post. Sorry about that!")
            });
        }
        else if (type === 'editPost') {
          this.updateState('updatePost', data);
        }

        api.put(`/posts/${postId}`, { 'Authorization': 'Bearer ' + value }, data)
          .then(() => {
            //this.loadData();
          })
          .catch(err => {
            alert("Error updating post. Sorry about that!");
          });
      })
      .catch(error => {
        console.error(error);
        this.props.navigation.navigate('Auth');
      });
  }

  /**
   * Allows sub views to update feed data
   */
  updateState = (type, data) => {
    if (type === 'updatePost') {
      this.setState({
        posts: this.state.posts.map(post => {
          if (post._id === data._id) return data;
          return post;
        })
      });
    } else if (type === 'deletePost') {
      this.setState({
        posts: this.state.posts.filter(post => {
          return post._id !== data;
        })
      });
    }
  }

  onPressPost = (postData) => {
    const { navigation } = this.props;
    const loggedInUser = navigation.getParam('loggedInUser');

    var updateParentState = this.updateState;
    this.props.navigation.navigate('Comments', { postData, updateParentState, loggedInUser });
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

  getFooterJSX() {
    const {
      navigation,
    } = this.props;

    var channel = navigation.getParam('channel');

    if (!['all', 'subs', 'myPosts'].includes(channel._id)) {
      return (
        <Footer>
          <ContentBar
            addResource={this.addPost}
            submitButtonText='Post'
            showModalToolbar={true}
          />
        </Footer>
      )
    }
    return null;
  }

  buildListItems() {
    items = this.state.posts.map(post => {
      post.key = post._id;
      return post;
    });
    return items;
  }

  renderListItem = ({ item }) => {
    const loggedInUser = this.props.navigation.getParam('loggedInUser')
    // Concept of editing includes deleting; deleting does not include editing.
    const enableEditing = item.author._id === loggedInUser._id;
    const channelId = this.props.navigation.getParam('channel')._id;

    return (
      <Post
        loggedInUser={loggedInUser}
        data={item}
        maxLines={10}
        key={item._id}
        onPressPost={this.onPressPost}
        updatePost={this.updatePost}
        showTag={['all', 'subs', 'myPosts'].includes(channelId)}
        enableEditing={enableEditing}
        enableDeleting={loggedInUser.isAdmin}
        showUserProfile={this.showUserProfile}
        showFullDate={false}
      />
    );
  }

  loadNextPage = async () => {
    if (this.state.loadingPage || this.state.loadedLastPage) return;
    this.setState({
      page: this.state.page + 1,
      loadingPage: true,
    }, state =>
        api.get(this.getUri(), { 'page': this.state.page }).then(response => {
          this.setState({
            posts: [...this.state.posts, ...response],
            loadingPage: false,
            loadedLastPage: response.length < 15
          });
        })
          .catch((err) => {
            console.error(err);
          })
    );
  }

  listFooter = () => {
    if (this.state.loadingPage) {
      return <Spinner color='#cd8500' />;
    }
    else if (this.state.loadedLastPage) {
      return <Text style={styles.noMorePosts}>No more posts!</Text>;
    }
    else return null;
  }

  render() {
    const {
      posts,
      loading,
      userDataToShow,
      showProfileModal
    } = this.state;

    const {
      navigation,
    } = this.props;

    const channelId = navigation.getParam('channel')._id;

    if (loading) {
      return (
        <Container>
          <Content>
            <Spinner color='#cd8500' />
          </Content>
        </Container>
      );
    } else if (posts.length) {
      return (
        <Container>
          <FlatList
            data={this.buildListItems()}
            renderItem={this.renderListItem}
            onEndReached={this.loadNextPage}
            ListFooterComponent={this.listFooter()}
            refreshing={this.state.loading}
            onRefresh={this.loadData}
            onEndReachedThreshold={0.8}
            removeClippedSubviews
          />

          {this.getFooterJSX()}

          <UserProfile
            user={userDataToShow}
            onClose={this.closeProfileModal}
            isModalOpen={showProfileModal}
          />

        </Container>
      )
    } else {
      var message;
      switch (channelId) {
        case 'subs':
          message = 'Nothing here - try subscribing to a channel!';
          break;
        case 'myPosts':
          message = 'Looks like you haven`t made any posts yet!';
          break;
        default:
          message = 'No posts yet - you could be the first!';
      }

      return (
        <NoData
          message={message}
          addResource={this.addPost}
          hideFooter={['all', 'subs', 'myPosts'].includes(channelId)}
        />
      );
    }
  }
}