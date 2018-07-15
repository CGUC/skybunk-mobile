/**
 * Screen to display a feed of relevant posts in a scrollable list.
 * TODO: This should probably be re-used for All Feed and My Subs, receiving specificity through props
*/

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { ScrollView, AsyncStorage } from 'react-native';
import { Container, Footer, Content, Spinner } from 'native-base';
import { Font, AppLoading } from "expo";
import ContentBar from '../../components/ContentBar/ContentBar';
import Post from '../../components/Post/Post';
import NoData from '../../components/NoData/NoData';
import api from '../../ApiClient';

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

  loadData = async () => {
    const {
      navigation,
    } = this.props;

    var channel = navigation.getParam('channel');
    const userId = navigation.getParam('userId');

    if (!channel) channel = { _id: 'all' };
    var channelId = channel._id;

    let uri;
    if ('all' === channelId) {
      uri = '/posts'
    }
    else if ('subs' === channelId) {
      uri = `/users/${userId}/subscribedChannels/posts`;
    }
    else uri = `/channels/${channelId}/posts`;

    await api.get(uri)
      .then(response => {
        // Track if each post has been liked by user
        var posts = _.map(response, post => {
          if (post.usersLiked.includes(userId)){
            post.isLiked = true;
          } else post.isLiked = false;
          return post;
        });

        this.setState({ posts });
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

    AsyncStorage.getItem('@Skybunk:token')
      .then(value => {

        if (type === 'toggleLike') {

          // Data should be post object

          /**
           * Toggle likes; if user has already liked post, this would be 'unliking' it.
           * TODO: set like icon to 'liked' state so user knows whether they have liked post
           */
          if (data.usersLiked.includes(userId)) {
            data.likes--;
            data.usersLiked = _.filter(data.usersLiked, user => user !== userId);
          } else {
            data.likes++;
            data.usersLiked.push(userId);
          }
        }

        if (data.likes < 0) data.likes = 0; // (Grebel's a positive community, come on!)

        api.put(`/posts/${postId}`, { 'Authorization': 'Bearer ' + value }, data)
          .then(() => {
            this.loadData();
          })
          .catch(err => {
            alert("Error updating post");
          });
      })
      .catch(error => {
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
          />
        </Footer>
      )
    }
    return null;
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
          <Content>
            <ScrollView>
              {
                _.map(_.orderBy(posts, post => post.createdAt.valueOf(), ['desc']),
                  (post, key) => {

                    // Allow editing/deleting if logged in user is author of post
                    var enableEditing = post.author._id === userId;

                    return (
                      <Post
                        key={`post${key}`}
                        data={post}
                        maxLines={10}
                        onPressPost={this.onPressPost}
                        updatePost={this.updatePost}
                        showTag={['all', 'subs'].includes(channelId)}
                        enableEditing={enableEditing}
                      />
                    )
                  })
              }
            </ScrollView>
          </Content>

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