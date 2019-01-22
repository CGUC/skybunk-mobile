import React from 'react';
import { FlatList, TouchableOpacity, Text, View } from 'react-native';
import { Container, Content, Spinner, Icon } from 'native-base';
import { Font} from "expo";
import UserProfile from '../../components/UserProfile/UserProfile.jsx';
import DonStatusCard from '../../components/DonStatusCard/DonStatusCard';
import styles from './DonInfoStyle';
import ApiClient from '../../ApiClient';

export default class DonInfo extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Find a Don',
      headerTintColor: '#FFFFFF',
      headerStyle: {
        backgroundColor: '#fc4970'
      },
      get headerRight() {
        var state = navigation.getParam('saveState');
        if (!state || state === 'disabled') return null;
        else if (state === 'hasChanges') {
          return (
            <TouchableOpacity onPress={navigation.getParam('save')}>
              {
                <Icon
                  type="MaterialIcons"
                  name="save"
                  style={styles.icon}
                />
              }
            </TouchableOpacity>
          )
        } else if (state === 'saving') {
          return (
            <View style={{ marginRight: 20 }}>
              <Spinner
                size='small'
                color='white'
              />
            </View>
          )
        } else if (state === 'saved') {
          return (
            <Icon
              type="MaterialIcons"
              name="check"
              style={styles.icon}
            /> 
          )
        }
      }
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      dons: [],
      loading: true,
      userDataToShow: undefined,
      showProfileModal: false
    }
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    await this.loadDons();
  }

  componentDidMount() {
    this.props.navigation.setParams({
      save: this.onSave,
      saveState: 'disabled'
    });
  }

  filterDons(users){
    var dons = []
    users.forEach(user =>{
      if(user.role && (user.role.includes("don") || user.role.includes("superintendent"))){
        //enter default data is don data isn't initilaized
        if(!user.donInfo) user.donInfo = {}
        dons.push(user);
      }
    });
    return dons;
  }
  sortDons(dons) {
    dons.sort((m1, m2) => {
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

    ApiClient.get('/users', {authorized: true})
      .then(users => {
        this.setState({
          dons: this.sortDons(this.filterDons(users)),
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

  buildListItems() {
    items = this.state.dons.map(member => {
      member.key = member._id;
      return member;
    });
    return items;
  }

  onSave = async () => {
    this.props.navigation.setParams({ saveState: 'saving' });

    try {
      const dons = this.state.dons;

      for(var i=0; i<dons.length; i++){
        await ApiClient.post(`/users/${dons[i]._id}/doninfo`, dons[i].donInfo, {authorized: true});
      }

      this.props.navigation.setParams({ saveState: 'saved' });
    } catch (err) {
      alert('Error updating don information. Sorry about that!');
      console.error(err);
    }
  }

  handleCardChanged = () => {
    this.props.navigation.setParams({ saveState: 'hasChanges' });
  }

  renderListItem = ({ item }) => {
    const user = this.props.navigation.getParam('user')

    //If item is superintendent, there is nothing to edit
    if(item.role && item.role.includes("superintendent")){
      return (
        <DonStatusCard
          isSuperintendent={true}
          don={item}
          onOpenProfile = {this.showUserProfile}
        />
      );
    }

    //if the current user is the don, enable editting
    const userIsThisDon = user._id == item._id
    const userIsDon = user.role && user.role.includes("don")
    return (
      <DonStatusCard
        don={item}
        togglable= {userIsDon}
        editable = {userIsThisDon}
        onChange = {this.handleCardChanged}
        onOpenProfile = {this.showUserProfile}
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
            onRefresh={this.loadDons}
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