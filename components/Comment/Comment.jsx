import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions } from 'react-native';
import { Text, Thumbnail, ListItem } from 'native-base';
import _ from 'lodash';
import { Font, AppLoading } from "expo";
import date from 'date-fns';
import ApiClient from '../../ApiClient';
import style from "./CommentStyle";

export default class Comment extends React.Component {

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

    ApiClient.get(`/users/${this.props.data.author._id}/profilePicture`, {}).then(pic => {
      this.setState({
        profilePicture: pic,
      }); 
    }).catch(error => {
      console.log(error);
    });

    this.setState({ loading: false });
  }

  render() {
    const { data } = this.props;

    var {
      author,
      content,
      createdAt,
    } = data;

    var authorName;
    if (!author) authorName = "Ghost";
    else authorName = `${author.firstName} ${author.lastName}`;

    var authorPhoto = author.profilePicture;

    return (
      <ListItem>
        <Thumbnail small style={style.profilePicThumbnail} source={{uri: `data:image/png;base64,${this.state.profilePicture}`}} />
        <Text style={style.text}>
          {`${authorName}: ${content}`}
        </Text>
      </ListItem>
    )
  }
}