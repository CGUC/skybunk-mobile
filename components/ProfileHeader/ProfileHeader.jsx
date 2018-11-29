import React from "react";
import { Alert, Text, View, Image, TouchableOpacity, ImageBackground, Platform, Linking } from "react-native";
import { Icon } from "native-base"
import { ImagePicker, Permissions } from 'expo';
import styles from "./ProfileHeaderStyle";
import ApiClient from '../../ApiClient';
import config from '../../config';

export default class ProfileHeader extends React.Component {
  static navigationOptions = { header: null };

  constructor(props) {
    super(props);
    this.state = {
      profilePicture: null,
    };
  }

  componentDidMount() {
    ApiClient.get(`/users/${this.props.user._id}/profilePicture`, {}).then(pic => {
      this.setState({
        profilePicture: pic,
      });
    }).catch(error => {
      this.props.navigation.navigate('Auth');
    });
  }

  render() {
    return (
      <ImageBackground
        style={styles.profileHeader}
        source={require('../../assets/Menu-Header.png')}
      >
        <TouchableOpacity onPress={() => { this.props.navigation.navigate('Settings', { user: this.props.user }) }}>
          <Image source={require('../../assets/settings-with-word-icon.png')} style={styles.settingsIcon} />
        </TouchableOpacity>
        <View>
          <TouchableOpacity onPress={this.pickImage}>
            <Image
              style={styles.profilePicture}
              source={{ uri: `data:image/png;base64,${this.state.profilePicture}` }}
            />
          </TouchableOpacity>
          <Text style={styles.profileNameText}>
            {this.props.user.firstName} {this.props.user.lastName}
          </Text>
        </View>
        <TouchableOpacity onPress={() => {Alert.alert(
            'Help',
            `Version: ${config.VERSION}`,
            [
              {text: 'Send feedback', onPress: () => Linking.openURL('https://grebelife.com/skybunk/feedback')},
              {text: 'Contact webmasters', onPress: () => Linking.openURL(`mailto:webmaster@grebelife.com?subject=Skybunk%20Question%20v${config.VERSION}`)},
              {text: 'Close', style: 'cancel'}
            ],
            { cancelable: true }
          ) }}>
          <Image source={require('../../assets/help-with-words-icon.png')} style={styles.helpIcon} />
        </TouchableOpacity>
      </ImageBackground>
    );
  }

  pickImage = async () => {
    /**
     * iOS needs permission for CAMERA_ROLL to launch ImagePicker
     */
    if (Platform.OS === 'ios') {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.CAMERA_ROLL
      );
      let finalStatus = existingStatus;

      // only ask if permissions have not already been determined, because
      // iOS won't necessarily prompt the user a second time.
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        finalStatus = status;
      }

      // Stop here if the user did not grant permissions
      if (finalStatus !== 'granted') {
        return null;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      base64: true,
      aspect: [1, 1],
      quality: 0.2,
    });

    if (!result.cancelled) {
      ApiClient.uploadPhoto(
        `/users/${this.props.user._id}/profilePicture`,
        {}, 
        result.uri,
        'profilePicture'
      )
        .then(pic => {
          this.setState({
            profilePicture: pic,
          });
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
}
