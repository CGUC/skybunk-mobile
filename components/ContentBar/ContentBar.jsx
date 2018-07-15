import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Platform, Dimensions } from 'react-native';
import {
  Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon,
  Left, Label, Body, Right, Title, Form, Input, Item, Spinner
} from 'native-base';
import { StyleSheet } from "react-native";

import CreateResourceModal from '../CreateResourceModal/CreateResourceModal';

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  bar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: height/8,
    width: width
  }
})

export default class ContentBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
    }
  }

  async componentWillMount() {
    this.setState({ isModalOpen: false});
  }

  openModal = () => {
    this.setState({ isModalOpen: true })
  }

  closeModal = () => {
    this.setState({ isModalOpen: false })
  }

  saveResource = (data) => {
    const { addResource } = this.props;
    addResource && addResource(data);

    this.closeModal();
  }

  textUpdate = (text) => {
    this.setState({ newText: text})
  }

  render() {
    return (
      <View style={styles.asdf}>
        <View style={styles.bar}>
          <Button transparent onPress={this.openModal}>
            <Icon style={{color: '#fc4970'}} type='Feather' name='plus-square' />
          </Button>
        </View>
        <CreateResourceModal
          onClose={this.closeModal}
          isModalOpen={this.state.isModalOpen} 
          saveResource={this.saveResource}
          submitButtonText={this.props.submitButtonText}
        />
      </View>
    )
  }
}