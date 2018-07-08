import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Platform, Dimensions, Modal, TextInput } from 'react-native';
import {
  Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon,
  Left, Label, Body, Right, Title, Form, Input, Item, Spinner
} from 'native-base';
import { StyleSheet } from "react-native";

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  modal: {
    marginTop: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBox: {
    width: width * 0.8,
    height: height * 0.6,
    borderRadius: 4,
    borderWidth: 0.8,
    borderColor: '#d6d7da',
  }
})

export default class CreateResourceModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: props.isModalOpen,
      resourceText: ""
    };
  }

  async componentWillReceiveProps(nextProps) {
    this.setState({ isModalOpen: nextProps.isModalOpen });
  }

  openModal = () => {
    this.setState({ isModalOpen: true })
  }

  closeModal = () => {
    this.setState({ isModalOpen: false })
  }

  saveResource = () => {
    const { addResource } = this.props;
    this.closeModal()

    // If changing the parameter to this function, make sure to update it upstream
    return addResource && addResource(this.state.resourceText);
  }

  textUpdate = (text) => {
    this.setState({ resourceText: text })
  }

  render() {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.isModalOpen}
          onRequestClose={this.closeModal}>
          <View style={styles.modal}>
            <View>
              <TextInput
                style={styles.textBox}
                onChangeText={this.textUpdate}
                multiline={true}
              />

              <Button onPress={this.saveResource}>
                <Text>Save</Text>
              </Button>
              <Button onPress={this.closeModal}>
                <Text>Cancel</Text>
              </Button>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}