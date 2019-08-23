import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Platform, Dimensions } from 'react-native';
import {
  Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon,
  Left, Label, Body, Right, Title, Form, Input, Item, Spinner
} from 'native-base';
import styles from "./ContentBarStyle";

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
      <View>
        <View style={styles.bar}>
          <Button transparent onPress={this.openModal}>
            <Icon style={{color: '#000000'}} type='Feather' name='plus-square' />
          </Button>
        </View>
        <CreateResourceModal
          onClose={this.closeModal}
          isModalOpen={this.state.isModalOpen} 
          saveResource={this.saveResource}
          submitButtonText={this.props.submitButtonText}
          showToolbar={this.props.showModalToolbar}
          clearAfterSave={true}
          loggedInUser={this.props.loggedInUser}
          isAuthor={true}
        />
      </View>
    )
  }
}
