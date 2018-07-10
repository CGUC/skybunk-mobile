import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import {
  Container, Left, Right, Body, Content, Card,
  CardItem, Text, Button, Thumbnail, Icon, Image, ListItem
} from 'native-base';
import _ from 'lodash';
import { Font, AppLoading } from "expo";
import date from 'date-fns';
import ApiClient from '../ApiClient';
import styles from "../styles/styles";

const { height, width } = Dimensions.get('window');

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
        <Thumbnail small style={styles.profilePicThumbnailComment} source={{uri: `data:image/png;base64,${this.state.profilePicture}`}} />
        <Text style={{paddingLeft: 5, width: width * 0.8}}>
          {`${authorName}: ${content}`}
        </Text>
      </ListItem>
    )
  }
}