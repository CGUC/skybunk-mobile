import React from 'react';
import { AsyncStorage, FlatList, Text } from 'react-native';
import { Container, Content, Spinner } from 'native-base';
import { Font } from "expo";
import UserProfile from '../../components/UserProfile/UserProfile.jsx';
import DonStatusCard from '../../components/DonStatusCard/DonStatusCard';
import styles from './DonInfoStyle';
import api from '../../ApiClient';

export default class DonInfo extends React.Component {
  static navigationOptions = {
    title: 'Don Info',
    headerTintColor: '#FFFFFF',
    headerStyle: {
      backgroundColor: '#fc4970'
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      members: [],
      loading: true,
      userDataToShow: undefined,
      showProfileModal: false,
    }
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    await this.loadDons();
  }

  filterDons(users){
    var dons = []
    users.forEach(user =>{
      //1st bit of role is for dons
      if((user.role & 0x1)==1){
        dons.push(user);
      }
    });
    return dons;
  }
  sortDons(dons) {
    sorted = dons.sort((m1, m2) => {
      //Put yourself at the top
      if(m1._id == this.props.navigation.getParam('user')._id) return -1
      if(m2._id == this.props.navigation.getParam('user')._id) return 1

      //Put late supper dons next
      if (m1.donInfo.isOnLateSupper && !m2.donInfo.isOnLateSupper) return -1;
      if (m2.donInfo.isOnLateSupper && !m1.donInfo.isOnLateSupper) return 1;

      //Put on dons next
      if (m1.donInfo.isOn && !m2.donInfo.isOn) return -1;
      if (m2.donInfo.isOn && !m1.donInfo.isOn) return 1;

      //Alphabetically sort the rest
      if (m1.firstName < m2.firstName) return -1;
      if (m1.firstName > m2.firstName) return 1;
      return 0;
    });
    return dons;
  }

  loadDons = async () => {
    this.setState({
      loading: true,
    });

    await AsyncStorage.getItem('@Skybunk:token')
      .then(token => {
        api.get('/users')
          .then(users => {
            this.setState({
              members: this.sortDons(this.filterDons(users)),
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

  clearFilter = () => {
    this.setState({
      filteredMembers: [],
      filter: undefined,
      useFiltered: false,
      page: 1,
      loadedLastPage: false
    });
  }

  buildListItems() {

    items = this.state.members.map(member => {
      member.key = member._id;
      return member;
    });
    return items;
  }

  renderListItem = ({ item }) => {
    //if the current user is the don, enable editting
    const userIsThisDon = this.props.navigation.getParam('user')._id == item._id
    const userIsDon = (this.props.navigation.getParam('user').role & 1) == 1
    console.log(this.props.navigation.getParam('user').role)
    return (
      <DonStatusCard
        don={item}
        togglable= {userIsDon}
        editable = {userIsThisDon}
        save = {false}
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
  render() {
    const {
      loading,
      filter,
      userDataToShow,
      showProfileModal
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
            refreshing={this.state.loading}
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