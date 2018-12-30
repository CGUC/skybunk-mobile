import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ListItem, Thumbnail, Text } from 'native-base';

import _ from 'lodash';

import styles from './UserListItemStyle';
import ApiClient from '../../ApiClient';

export default class UserListItem extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      profilePicture: null
    }
  }

  /**
   * Limit re-rendering for optimisation
   */
  shouldComponentUpdate(nextProps, nextState) {
    var { profilePicture } = this.state;
    var currentProps = this.props;

    if (!_.isEqual(currentProps.user, nextProps.user)) return true;
    if (!profilePicture && nextState.profilePicture) return true;
    return false;
  }

  render() {
    var { user, showUserProfile } = this.props;
    var { profilePicture } = this.state;

    return (
      <ListItem>
        <TouchableOpacity
          hitSlop={{ top: 10, right: 300, bottom: 10, left: 0 }}
          onPress={() => showUserProfile(user)}
        >
          <View style={styles.rowContainer}>
          {/* This has critical performance issues so has been excluded for now (Neil) */}
            {/* <View>
              <Thumbnail style={styles.profilePicThumbnail} source={{ uri: `data:image/png;base64,${profilePicture}` }} />
            </View> */}
            <Text style={styles.userName}>
              {`${user.firstName} ${user.lastName}`}
            </Text>
          </View>
        </TouchableOpacity>
      </ListItem>
    )
  }
}