import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Platform, Dimensions } from 'react-native';
import {
  Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon,
  Left, Label, Body, Right, Title, Form, Input, Item, Spinner
} from 'native-base';
import { StyleSheet } from "react-native";

import CreateResourceModal from './CreateResourceModal';

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  bar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gainsboro',
    height: height/8,
    width: width
  }
})

export default class ContentBar extends React.Component {

  async componentWillMount() {
    this.setState({ isModalOpen: false});
  }

  openModal = () => {
    this.setState({ isModalOpen: true })
  }

  closeModal = () => {
    this.setState({ isModalOpen: false })
  }

  saveResource = () => {
    this.closeModal()
  }

  textUpdate = (text) => {
    this.setState({ newText: text})
  }

  render() {
    return (
      <View style={styles.asdf}>
        <View style={styles.bar}>
          <Button transparent onPress={this.openModal}>
            <Icon type='Feather' name='plus-square' />
          </Button>
        </View>
        <CreateResourceModal 
          isModalOpen={this.state.isModalOpen} 
          addResource={this.props.addResource}
        />
      </View>
    )
  }
}