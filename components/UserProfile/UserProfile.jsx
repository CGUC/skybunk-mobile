import React from 'react';
import { Modal, View, Image, TouchableOpacity } from 'react-native';
import { Text, Icon, Card, CardItem } from 'native-base';
import { Font, AppLoading } from "expo";
import _ from 'lodash';

import ApiClient from '../../ApiClient';
import styles from './UserProfileStyle';

export default class UserProfile extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      profilePicture: null
    }
  }

  async componentDidUpdate(prevProps) {
    var { user } = this.props;
    if (!user) return;

    if (prevProps.user && _.isEqual(prevProps.user, user)) return;

    ApiClient.get(`/users/${user._id}/profilePicture`, {}).then(pic => {
      this.setState({ profilePicture: pic });
    }).catch(error => {
      console.error(error);
    });
  }

  onClose = () => {
    const { onClose } = this.props;
    this.setState({
      profilePicture: null
    })

    onClose();
  }

  getCloseJSX() {
    return (
      <View style={styles.cancelRow}>
        <TouchableOpacity onPress={this.onClose}>
          <Icon
            type="EvilIcons"
            name='close'
            style={styles.cancelIcon}
          />
        </TouchableOpacity>
      </View>
    )
  }

  getProfilePicJSX() {
    const { profilePicture } = this.state;

    return (
      <Image
        style={styles.profilePicture}
        source={{ uri: `data:image/png;base64,${profilePicture}` }}
      />
    )
  }

  getInfoJSX() {
    let {
      program,
      address,
      affiliation,
    } = this.props.user.info;

    return (
      <View style={styles.infoBlock}>
        {program && <Text style={styles.infoText}>{program}</Text>}
        {address && <Text style={styles.infoText}>{address}</Text>}
        {affiliation && <Text style={styles.infoText}>{affiliation}</Text>}
      </View>
    )

  }

  getBioJSX() {
    let {
      bio
    } = this.props.user.info;

    return (
      <View style={styles.bioBlock}>
        <Text style={styles.infoText}>{bio}</Text>
      </View>
    )
  }

  render() {
    const {
      user: userData,
      isModalOpen,
    } = this.props;

    if (!userData) return null;

    let {
      firstName,
      lastName,
      info
    } = userData;

    if (!info) info = {}

    let {
      program,
      address,
      affiliation,
      bio
    } = info;

    var enableInfoBlock = program || address || affiliation;

    var cardHeightPreset = bio || enableInfoBlock ? styles.cardFull : styles.cardShort;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalOpen}
        onRequestClose={this.onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modal}
        >
          <View style={[styles.card, cardHeightPreset]}>

            {this.getCloseJSX()}

            {this.getProfilePicJSX()}

            <Text style={styles.name}>
              {`${firstName} ${lastName}`}
            </Text>

            {enableInfoBlock && this.getInfoJSX()}

            {bio && this.getBioJSX()}

          </View>
        </TouchableOpacity>
      </Modal>
    )
  }
}