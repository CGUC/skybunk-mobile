import React from 'react';
import Autolink from 'react-native-autolink';
import {TouchableOpacity, View, Modal } from 'react-native';
import { Text, Thumbnail, Card, CardItem, Button } from 'native-base';
import _ from 'lodash';
import { Font, AppLoading } from "expo";
import date from 'date-fns';

import CreateResourceModal from '../CreateResourceModal/CreateResourceModal';
import styles from "./CommentEditorStyle";
import {getProfilePicture} from "../../helpers/imageCache"

export default class CommentEditor extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      profilePicture: null,
    }
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });

    getProfilePicture(this.props.loggedInUser._id).then(pic => {
      this.setState({
        profilePicture: pic,
      });
    }).catch(error => {
      console.error(error);
    });

    this.setState({ loading: false });
  }

  saveEdited = (newContent) => {
    const { updateComment, data } = this.props;

    var commentId = data._id;
    var newComment = {
      ...data,
      ...newContent
    }
  }

  render() {
    const {
      showEditButtons,
      editing
    } = this.state;

    const {
      loggedInUser
    } = this.props;

    var authorName;
    if (!loggedInUser) authorName = "Ghost";
    else authorName = `${loggedInUser.firstName} ${loggedInUser.lastName}`;

    return (
      <View>
        <Card style={styles.card}>
          <CardItem style={styles.cardItem}>
            <View style={styles.textContainer}>
              <View>
                <Thumbnail
                  small
                  style={styles.profilePicThumbnail}
                  source={{ uri: `data:image/png;base64,${this.state.profilePicture}` }}
                />
              </View>
              <View style={{flex:1}} hitSlop={{ top: 15, bottom: 15, left: 10, right: 10 }}>
                <View style={styles.title}>
                  <Text style={styles.textAuthor}>
                    {`${authorName} `}
                  </Text>
                </View>
                <Textarea style={styles.textContent}/>
              </View>
            </View>
          </CardItem>
        </Card>
      </View>
    )
  }
}