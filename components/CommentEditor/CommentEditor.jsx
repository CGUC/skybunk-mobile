import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, Thumbnail, Card, CardItem, Textarea, Icon } from 'native-base';
import _ from 'lodash';
import { Font, AppLoading } from "expo";

import styles from "./CommentEditorStyle";
import {getProfilePicture} from "../../helpers/imageCache"

export default class CommentEditor extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      profilePicture: null,
      commentText: ''
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

  textUpdate = (text) => {
    this.setState({commentText: text})
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
              <View style={{flex:1}}>
                <View style={styles.title}>
                  <Text style={styles.textAuthor}>
                    {`${authorName} `}
                  </Text>
                </View>
                <View style={styles.editorView}>
                  <Textarea 
                    style={styles.textContent} 
                    placeholder={"Join the discussion!"}
                    onChangeText={this.textUpdate}
                    value={this.state.commentText}
                  />
                  {this.state.commentText ? 
                  <View style={styles.editIconView}>
                    <TouchableOpacity>
                      <Icon style={[styles.iconStyle, {color: 'green', paddingBottom: 8}]} type='Feather' name='save' />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Icon style={[styles.iconStyle, {color: 'red'}]} type='Feather' name='trash-2' />
                    </TouchableOpacity>
                  </View>
                  : null}
                </View>
              </View>
            </View>
          </CardItem>
        </Card>
      </View>
    )
  }
}