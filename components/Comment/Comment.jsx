import React from 'react';
import PropTypes from 'prop-types';
import Autolink from 'react-native-autolink';
import { Dimensions, TouchableOpacity, View, Modal } from 'react-native';
import {
  Text, Thumbnail, ListItem, Card, CardItem,
  Container, Content, Left, Icon, Button
} from 'native-base';
import _ from 'lodash';
import { AppLoading } from "expo";
import * as Font from 'expo-font';
import date from 'date-fns';

import styles from "./CommentStyle";
import {getProfilePicture} from "../../helpers/imageCache"
import CommentEditor from '../CommentEditor/CommentEditor';

export default class Comment extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      profilePicture: null,
      showEditButtons: false,
      editing: false,
    }

    this.FIRST_NAMES = [
      "Twinkle",
      "Pooks",
      "Fire",
      "Woodsy",
      "Gandalf",
      "Tim",
      "Winter",
      "Shadow",
      "Giggly",
      "Spooks",
      "Thunder",
      "Grebel",
      "Footsie",
      "Dagger",
      "Toothless",
      "Fairy",
      "Harry",
      "Elfenstine",
      "Floofer",
      "Sandwhich",
      "Moon",
      "Ned",
      "Kitty",
      "Mindlord",
      "Youtube",
      "Shadow"
    ]

    this.LAST_NAMES = [
      "Firehazard",
      "Toast",
      "Salamander",
      "Dragontongue",
      "Sunlapper",
      "Queereye",
      "Earthshaker",
      "Tim",
      "Fluffer",
      "Summerwand",
      "Snuggles",
      "Treehugger",
      "Cuddles",
      "Magichands",
      "Hands",
      "Wolf",
      "Cow",
      "Crow",
      "Merlin",
      "Troll",
      "Shairaships",
      "Wingear",
      "Dancer",
      "Imp",
      "Potty",
      "Kitten"
    ]

    this.MIDDLE = [
      "Mc",
      "Von",
      "Vander",
      "St",
      "Mac"
    ]

    this.PICTURES = [
      "https://a.wattpad.com/useravatar/Kitten6416.256.440418.jpg",
      "https://i.pinimg.com/originals/e2/1c/61/e21c610b3078c665b06348af7b4535f0.jpg",
      "https://a.wattpad.com/useravatar/Kitten6416.256.440418.jpg",
      "https://a.wattpad.com/useravatar/ShyKitten13.256.435525.jpg",
      "https://a.thumbs.redditmedia.com/aZgT3brFyzKwCh6synQ395042guv7XxNBbt3vwHIBk4.png",
      "https://pbs.twimg.com/profile_images/422121203440955392/Ma_alVbk.jpeg",
      "https://a.wattpad.com/useravatar/kittychan_atsumi.256.149618.jpg",
      "https://images.pexels.com/users/avatars/1001118/phil-goulson-177.jpeg?w=256&h=256&fit=crop&crop=faces&auto=compress",
      "https://is3-ssl.mzstatic.com/image/thumb/Purple6/v4/0d/82/aa/0d82aa05-1f50-bb1b-5d65-160c46962362/source/256x256bb.jpg",
      "https://pbs.twimg.com/profile_images/594104592335446017/XXPHjAU3.jpg",
      "https://i.pinimg.com/originals/7d/c3/2e/7dc32e6daee17e8919340fe962ec1067.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQBkrJHl2kF4dIPeT1BvAXaK0blSl20TLJhY32sOwzMEwWP_eYI&usqp=CAU",
      "https://static.wixstatic.com/media/7770f1_ed5ef8b7496741bba3032d5064ec8162~mv2.jpg/v1/fill/w_256,h_256,al_c,lg_1,q_80/7770f1_ed5ef8b7496741bba3032d5064ec8162~mv2.webp",
      "https://is3-ssl.mzstatic.com/image/thumb/Purple128/v4/a2/8a/3c/a28a3ce2-f2af-652c-c27f-9a959f193f56/source/256x256bb.jpg",
      "https://cdn163.picsart.com/222702403000202.jpg?type=webp&to=crop&r=256",
      "https://i.pinimg.com/474x/b5/e1/be/b5e1bef76b2058910f556c85c1040b79.jpg",
      "https://i.pinimg.com/originals/1b/e4/94/1be494c3c065c9c97da3231f7303ee85.jpg",
      "https://pbs.twimg.com/profile_images/2819857246/57340e8a6924c086162be0e0211525c1.jpeg",
      "https://i.pinimg.com/originals/81/39/0d/81390dfb8ad297c7abd5e0179a0f8486.jpg",
      "https://pbs.twimg.com/media/BRtfYmQCIAI89-r.jpg:large"
    ]
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("../../node_modules/native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("../../node_modules/native-base/Fonts/Roboto_medium.ttf")
    });

    getProfilePicture(this.props.data.author._id).then(pic => {
      this.setState({
        profilePicture: pic,
      });
    }).catch(error => {
      console.error(error);
    });

    this.setState({ loading: false });
  }

  onPressComment = () => {
    if (this.props.enableEditing || this.props.enableDeleting) {
      this.setState({ showEditButtons: true });
    }
  }

  hideEditButtons = () => {
    this.setState({ showEditButtons: false });
  }

  onPressEdit = () => {
    this.setState({ editing: true })
    this.hideEditButtons();
  }

  saveEdited = (commentId, newComment, type) => {
    const { updateComment, data } = this.props;

    var commentId = data._id;
    data.content = newComment.content;

    this.closeEditingModal();

    updateComment && updateComment(commentId, data, "updateComment");
  }

  closeEditingModal = () => {
    this.setState({ editing: false });
  }

  onPressDelete = () => {
    const { updateComment, data } = this.props;

    var commentId = data._id;

    this.hideEditButtons();

    updateComment && updateComment(commentId, {}, "deleteComment");
  }

  render() {
    const {
      showEditButtons,
      editing
    } = this.state;

    const {
      data,
      showUserProfile,
      enableEditing
    } = this.props;

    var {
      author,
      content,
      createdAt,
    } = data;

    var authorName;
    if (!author) authorName = "Ghost";
    // else authorName = `${author.firstName} ${author.lastName}`;
    else authorName = `${this.FIRST_NAMES[Math.floor(Math.random() * 25)]} ${this.MIDDLE[Math.floor(Math.random() * 5)]}${this.LAST_NAMES[Math.floor(Math.random() * 25)]}`;

    if(date.isPast(date.addWeeks(createdAt,1))){
      //If the post is more than a week old, display date
      createdAt = date.format(createdAt, 'ddd MMM Do');
    }else{
      //Display how long ago the post was made
      createdAt = date.distanceInWordsToNow(createdAt, {addSuffix: true});
    }

    if(editing){
      return (
        <CommentEditor
          author={author}
          updateResource={this.saveEdited}
          commentData={content}
        />
      )
    }

    return (
      <View>
        <Card style={styles.card}>
          <CardItem style={styles.cardItem}>
            <View style={styles.textContainer}>
              <TouchableOpacity onPress={() => showUserProfile(author)}>
                <Thumbnail
                  small
                  style={styles.profilePicThumbnail}
                  // source={{ uri: `data:image/png;base64,${this.state.profilePicture}` }}
                  source={{ uri: this.PICTURES[Math.floor(Math.random() * 20)] }}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{flex:1}} onPress={this.onPressComment} hitSlop={{ top: 15, bottom: 15, left: 10, right: 10 }}>
                <View style={styles.title}>
                  <Text style={styles.textAuthor}>
                    {`${authorName} `}
                  </Text>
                  <Text note>
                    {`${createdAt} `}
                  </Text>
                </View>
                <Autolink text={content} style={styles.textContent}/>
              </TouchableOpacity>
            </View>
          </CardItem>
        </Card>

        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={showEditButtons}
            onRequestClose={this.hideEditButtons}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={styles.editButtonsContainer}
              onPress={this.hideEditButtons}
            >
              <View style={styles.view}>
                {enableEditing && <Button block style={styles.editButton} onPress={this.onPressEdit}>
                  <Text>Edit Comment</Text>
                </Button>}
                <Button block style={styles.deleteButton} onPress={this.onPressDelete}>
                  <Text>Delete Comment</Text>
                </Button>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      </View>
    )
  }
}
