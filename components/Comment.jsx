import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Platform } from 'react-native';
import {
  Container, Left, Right, Body, Content, Card,
  CardItem, Text, Button, Thumbnail, Icon, Image, ListItem
} from 'native-base';
import _ from 'lodash';
import { Font, AppLoading } from "expo";
import date from 'date-fns';

export default class Comment extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    }
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
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
        <Text>
          {`${authorName}: ${content}`}
        </Text>
      </ListItem>
    )
  }
}