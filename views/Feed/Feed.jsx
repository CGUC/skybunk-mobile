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
    var channel = this.props.navigation.getParam('channel');
    if (!channel) channel = { _id: 'all' };

    if ('all' === channel._id) {
      return '/posts'
    }
    else if ('subs' === channel._id) {
      return `/users/${this.props.navigation.getParam('userId')}/subscribedChannels/posts`;
    }
    return `/channels/${channel._id}/posts`;
  }

  loadData = async () => {
    this.setState({loading: true});
    await api.get(this.getUri())
    .then(response => {
      var posts = _.map(response, post => {
        if (post.usersLiked.includes(this.props.navigation.getParam('userId'))) {
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

    const userId = navigation.getParam('userId');

    var channel = navigation.getParam('channel');
    if (['all', 'subs'].includes(channel._id)) return console.error(`Can't add post to ${channel._id} feed`);

    var tags = channel.tags;

    AsyncStorage.getItem('@Skybunk:token')
      .then(value => {
        var postContent = {
          author: userId,
          content: data,
          tags: tags
        }
        api.post('/posts', { 'Authorization': 'Bearer ' + value }, postContent).then(() => this.loadData());
      })
      .catch(error => {
        this.props.navigation.navigate('Auth');
      });
  }

  updatePost = async (postId, data, type) => {

    const {
      navigation,
    } = this.props;

    const userId = navigation.getParam('userId');

    if (type === 'toggleLike') {

      // Data should be post object

      /**
       * Toggle likes; if user has already liked post, this would be 'unliking' it.
       * TODO: set like icon to 'liked' state so user knows whether they have liked post
       */
      if (data.usersLiked.includes(userId)) {
        data.likes--;
        data.usersLiked = _.filter(data.usersLiked, user => user !== userId);
        data.isLiked = false;
      } else {
        data.likes++;
        data.usersLiked.push(userId);
        data.isLiked = true;
      }

      if (data.likes < 0) data.likes = 0; // (Grebel's a positive community, come on!)

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
              this.setState({
                posts: this.state.posts.filter(post => {
                  return post._id !== postId;
                })
              });
            })
            .catch(err => {
              alert("Error deleting post. Sorry about that!")
            });
        }
        else if (type === 'editPost') {
          this.setState({
            posts: this.state.posts.map(post => {
              if (post._id === postId) 
                post.content = data.content;
              return post;
            })
          });
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
        console.log(error);
        this.props.navigation.navigate('Auth');
      });
  }

  onPressPost = (postData) => {
    const { navigation } = this.props;
    const userId = navigation.getParam('userId');

    var reloadParent = this.loadData;
    this.props.navigation.navigate('Comments', { postData, reloadParent, userId });
  }

  getFooterJSX() {
    const {
      navigation,
    } = this.props;

    var channel = navigation.getParam('channel');

    if (!['all', 'subs'].includes(channel._id)) {
      return (
        <Footer>
          <ContentBar
            addResource={this.addPost}
            submitButtonText='Post'
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

  renderListItem = ({item}) => {
    const enableEditing = item.author._id === this.props.navigation.getParam('userId');
    const channelId = this.props.navigation.getParam('channel')._id;

    return (
      <Post
        data={item}
        maxLines={10}
        key={item._id}
        onPressPost={this.onPressPost}
        updatePost={this.updatePost}
        showTag={channelId === 'all' || channelId === 'subs'}
        enableEditing={enableEditing}
      />
    );
  }

  loadNextPage = async () => {
    if (this.state.loadingPage || this.state.loadedLastPage) return;
    this.setState({
      page: this.state.page+1,
      loadingPage: true,
    }, state =>
      api.get(this.getUri(), {'page': this.state.page}).then(response => {
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
      return <Spinner color='#cd8500'/>;
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
    } = this.state;

    const {
      navigation,
    } = this.props;

    const userId = navigation.getParam('userId');
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
          />

          {this.getFooterJSX()}

        </Container>
      )
    } else {
      var message = channelId === 'subs' ?
        'Nothing here - try subscribing to a channel!'
        : 'No posts yet - you could be the first!';

      return (
        <NoData
          message={message}
          addResource={this.addPost}
          hideFooter={channelId === 'subs'}
        />
      );
    }
  }
}