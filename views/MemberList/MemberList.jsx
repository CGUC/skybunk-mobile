import React from 'react';
import { FlatList, Text, TouchableOpacity } from 'react-native';
import { Container, Content, Spinner, Item, Button, Input, Icon, Header } from 'native-base';
import { Font } from "expo";

import UserListItem from '../../components/UserListItem/UserListItem';
import UserProfile from '../../components/UserProfile/UserProfile.jsx';
import styles from './MemberListStyle';
import ApiClient from '../../ApiClient';
import _ from 'lodash';

/**
 * Searchable list of all members on the app to provide quick access to profiles
*/

//Will only render a small number of user cards at a time for better performance
const chunk_limit = 15;

export default class MemberList extends React.Component {

  static navigationOptions = {
    title: 'Member List',
    headerTintColor: '#FFFFFF',
    headerStyle: {
      backgroundColor: '#fc4970'
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      members: [],
      filteredMembers: [],
      filter: undefined,
      useFiltered: false,
      page: 1,
      loading: true,
      loadingPage: false,
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

    await this.loadMembers();
  }

  sortAlphabetically(members) {
    sorted = members.sort((m1, m2) => {
      if (m1.firstName < m2.firstName) return -1;
      if (m1.firstName > m2.firstName) return 1;
      if (m1.lastName < m2.lastName) return -1;
      if (m1.lastName > m2.lastName) return 1;
      return 0;
    });
    return sorted;
  }

  loadMembers = async () => {
    this.setState({
      loading: true,
      page: 1,
      loadedLastPage: false,
      filteredMembers: [],
      filter: undefined,
      useFiltered: false,
    });

    ApiClient.get('/users',  {authorized: true})
      .then(users => {
        this.setState({
          members: this.sortAlphabetically(users),
          loading: false
        });
      })
      .catch((err) => {
        console.error(err);
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

  searchMembers = () => {
    const { filter, members } = this.state;
    var filtered = _.filter(members, member => {
      var name = member.firstName + member.lastName;
      name = name.toLowerCase();
      return name.match(new RegExp(filter));
    });

    this.setState({
      useFiltered: true,
      filteredMembers: filtered,
      page: 1,
      loadedLastPage: false
    });
  }

  clearFilter = () => {
    this.setState({
      filteredMembers: [],
      filter: undefined,
      useFiltered: false,
      page: 1,
      loadedLastPage: false
    });
  }

  loadNextChunk = async () => {
    let {
      page,
      members,
      useFiltered,
      filteredMembers
    } = this.state;

    var membersToShow = useFiltered ? filteredMembers : members;

    if (page * chunk_limit < membersToShow.length) {
      this.setState({ page: page + 1 });
    } else {
      this.setState({ loadedLastPage: true });
    }
  }

  chunkItemsToRender() {
    let {
      members,
      page,
      useFiltered,
      filteredMembers
    } = this.state;

    var membersToShow = useFiltered ? filteredMembers : members;

    var startIndex = 0;
    var endIndex = Math.min(page * chunk_limit, membersToShow.length)

    return _.slice(membersToShow, startIndex, endIndex);
  }

  buildListItems() {
    var membersToRender = this.chunkItemsToRender();

    var items = _.map(membersToRender, (user, index) => {
      user.key = `user-${index}`;
      return user;
    });

    return items;
  }

  renderListItem = ({ item }) => {
    return (
      <UserListItem
        user={item}
        showUserProfile={this.showUserProfile}
      />
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

  getSearchAdornmentJSX() {
    const {
      useFiltered,
      filter,
    } = this.state;
    
    if (!filter) {
      return (
        <Icon name='ios-people' />
      )
    } else if (useFiltered) {
      return (
        <TouchableOpacity
          onPress={this.clearFilter}
        >
          <Icon name='ios-close-circle-outline' />
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity
          onPress={this.searchMembers}
        >
          <Icon name='arrow-forward' />
        </TouchableOpacity>
      )
    }
  }

  render() {
    const {
      loading,
      filter,
      userDataToShow,
      showProfileModal
    } = this.state;

    var searchAdornmentJSX = this.getSearchAdornmentJSX();

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
          <Header
            searchBar
            rounded
            transparent
            style={{
              paddingTop: 0
            }}
          >
            <Item>
              <Icon name='ios-search' style={{ marginBottom: 2 }}/>
              <Input
                {...(filter ? {} : { value: '' })}
                placeholder="search"
                autoCorrect={false}
                onChangeText={(text) => this.setState({ filter: text.toLowerCase() })}
                onSubmitEditing={this.searchMembers}
              />
              {searchAdornmentJSX}
            </Item>
          </Header>

          <FlatList
            data={this.buildListItems()}
            renderItem={this.renderListItem}
            onEndReached={this.loadNextChunk}
            refreshing={this.state.loading}
            onRefresh={this.loadMembers}
            onEndReachedThreshold={0.5}
            ListFooterComponent={this.listFooter()}
          />

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