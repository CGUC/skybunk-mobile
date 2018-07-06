import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Platform, Dimensions } from 'react-native';
import {
  Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon,
  Left, Label, Body, Right, Title, Form, Input, Item, Spinner
} from 'native-base';
import { StyleSheet } from "react-native";

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  bar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gainsboro',
    height: height/8
  }
})

// TODO: Add modal-type input that will call saveResource with the entered data when the user saves.
// Will likely only use this for writing posts, but could potentially be an expansion for commenting as well.

export default class ContentBar extends React.Component {

  saveResource = (data) => {
    const { addResource } = this.props;
    return addResource && addResource(data);
  }

  render() {
    return (
      <View style={styles.bar}>
        <Button transparent>
          <Icon type='Feather' name='plus-square' />
        </Button>
      </View>
    )
  }
}