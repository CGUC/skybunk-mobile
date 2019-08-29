/**
 * Screen to display a feed of relevant posts in a scrollable list.
 * TODO: This should probably be re-used for All Feed and My Subs, receiving specificity through props
*/

import React from 'react';
import _ from 'lodash';
import { FlatList} from 'react-native';
import { Container, Content, Text, Button, View } from 'native-base';
import { Font } from "expo";
import UserProfile from '../../components/UserProfile/UserProfile.jsx';
import Post from '../../components/Post/Post';
import ApiClient from '../../ApiClient';
import styles from './FeedStyle';
import defaultStyles from '../../styles/styles';
import Spinner from '../../components/Spinner/Spinner'

export default class FeedView extends React.Component {

  static navigationOptions = ({ navigation }) => {
    var channel = navigation.getParam('channel')
    if (channel) title = channel.name;
    else title = 'Feed';

    return {
      title: title,
      headerTitle: null,
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

    //refresh data when returning from CreatePost
    this.props.navigation.addListener(
      'willFocus',
      payload => {
        this.loadData()
      }
    );
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

    await ApiClient.get(this.getUri(), {authorized: true})
      .then(response => {
        this.setState({
          posts: response,
          loading: false,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  deletePost = async (postId) => {
    return ApiClient.delete(`/posts/${postId}`, {authorized: true})
      .then(() => {
        this.updateState('deletePost', postId);
      })
      .catch(err => {
        console.error(err);
        alert("Error deleting post. Sorry about that!")
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
    } else if (type === 'updatePoll') {
      this.setState({
        posts: this.state.posts.map(post => {
          if (post._id === data._id) return data;
          return post;
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

  createPost = () => {
    var channel = this.props.navigation.getParam('channel');
    const loggedInUser = this.props.navigation.getParam('loggedInUser');

    if(['all', 'subs', 'myPosts'].includes(channel._id)){
      channel = null;
    }
    this.props.navigation.navigate("CreatePost", {channel , loggedInUser});
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
        showTag={['all', 'subs', 'myPosts'].includes(channelId)}
        enableEditing={enableEditing}
        enableDeleting={loggedInUser.role && loggedInUser.role.includes("admin")}
        showUserProfile={this.showUserProfile}
        showFullDate={false}
        navigation={this.props.navigation}
        deletePost={this.deletePost}
      />
    );
  }

  loadNextPage = async () => {
    if (this.state.loadingPage || this.state.loadedLastPage) return;
    this.setState({
      page: this.state.page + 1,
      loadingPage: true,
    }, state =>
        ApiClient.get(this.getUri(), {authorized: true, headers: { 'page': this.state.page }}).then(response => {

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
      return <Spinner />;
    }
    else if (this.state.loadedLastPage) {
      return <Text style={styles.noMorePosts}>No more posts!</Text>;
    }
    else return null;
  }

  getContentJSX = () => {
    if(this.state.posts.length == 0){
      var message;
      const channelId = this.props.navigation.getParam('channel')._id;
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
        <View style={styles.noDataView}>
          <Text style={styles.noDataText}>{message}</Text>
        </View>
      )
    }
    return (
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
    )
  }

  render() {
    const {
      loading,
      userDataToShow,
      showProfileModal
    } = this.state;

    if (loading) {
      return (
        <Container style={defaultStyles.backgroundTheme}>
          <Content>
            <Spinner/>
          </Content>
        </Container>
      );
    } else {
      return (
        <Container style={defaultStyles.backgroundTheme}>
          {this.getContentJSX()}

          <Button style={styles.newPostButton} onPress={this.createPost}>
            <Text>Make A Post</Text>
          </Button>
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
