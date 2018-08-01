import React from 'react';
import { AsyncStorage, FlatList, Text } from 'react-native';
import { Container, Content, Spinner } from 'native-base';
import { Font } from "expo";

import UserListItem from '../../components/UserListItem/UserListItem';
import styles from './MemberListStyle';
import api from '../../ApiClient';

/**
 * Searchable list of all members on the app to provide quick access to profiles
*/

//Will only render a small number of user cards at a time for better performance
const chunk_limit = 15;

export default class MemberList extends React.Component {

  static navigationOptions = {
    title: 'Settings',
    headerTintColor: '#FFFFFF',
    headerStyle: {
      backgroundColor: '#fc4970'
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      page: 1,
      loading: true,
      loadingPage: false,
      loadedLastPage: false,
    }
  }


  async componentWillMount() {

    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });

    await this.loadUsers();
  }

  sortAlphabetically(users) {
    sorted = users.sort((u1, u2) => {
      if (u1.firstName < u2.firstName) return -1;
      if (u1.firstName > u2.firstName) return 1;
      return 0;
    });
    return sorted;
  }

  loadUsers = async () => {
    /**
     * TODO
     *  Implement searching
     *  Add profile pictures / clean up list entries
     *  Implement with profiles
     *  Require auth to access all user accounts? (backend implementation)
     */
    this.setState({
      loading: true,
      page: 1,
      loadedLastPage: false
    });

    await AsyncStorage.getItem('@Skybunk:token')
      .then(token => {
        api.get('/users')
          .then(users => {
            this.setState({
              users: this.sortAlphabetically(users),
              loading: false
            });
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch(error => {
        this.props.navigation.navigate('Auth');
      });
  }

  chunkItemsToRender() {
    let {
      users,
      page
    } = this.state;

    console.log(`page: ${page}`)

    //var startIndex = Math.max(0, page - chunk_limit);
    var startIndex = 0;
    var endIndex = Math.min(page * chunk_limit, users.length)

    console.log(`startIndex: ${startIndex}`)
    console.log(`endIndex: ${endIndex}`)

    return _.slice(users, startIndex, endIndex);
  }

  loadNextChunk = async () => {
    let {
      page,
      users
    } = this.state;

    console.log("End reached")

    if (page * chunk_limit < users.length) {
      console.log('incrementing renderStartIndex')
      this.setState({ page: page + 1 });
    } else {
      this.setState({ loadedLastPage: true });
    }
  }

  buildListItems() {
    var usersToRender = this.chunkItemsToRender();

    var items = _.map(usersToRender, (user, index) => {
      user.key = `user-${index}`;
      return user;
    });

    return items;
  }

  renderListItem = ({ item }) => {
    return (
      <UserListItem user={item} />
    )
  }

  listFooter = () => {
    let { loadedLastPage } = this.state;

    if (!loadedLastPage) {
      return <Spinner color='#cd8500' />;
    } else return (
      <Text style={styles.noMoreUsers}>
        That's everyone!
      </Text>
    );
  }

  render() {
    const {
      loading,
    } = this.state;

    if (loading) {
      return (
        <Container>
          <Content>
            <Spinner color='#cd8500' />
          </Content>
        </Container>
      )
    } else {
      return (
        <Container>
          <FlatList
            data={this.buildListItems()}
            renderItem={this.renderListItem}
            onEndReached={this.loadNextChunk}
            refreshing={this.state.loading}
            onRefresh={this.loadUsers}
            onEndReachedThreshold={0.5}
            ListFooterComponent={this.listFooter()}
          />
        </Container>
      )
    }
  }
}