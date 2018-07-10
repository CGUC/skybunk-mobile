import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Platform, Dimensions, Modal, TextInput, TouchableOpacity } from 'react-native';
import {
  Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon,
  Left, Label, Body, Right, Title, Form, Input, Item, Spinner, Textarea
} from 'native-base';
import { StyleSheet } from "react-native";

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#00000050'
  },
  view: {
    width: width,
    height: 300,
    backgroundColor: '#DDDDDD',
  },
  textBox: {
    width: width-10,
    height: 200,
    backgroundColor: '#FFFFFF',
    paddingTop: 5,
    borderRadius: 4,
    borderWidth: 0.8,
    borderColor: '#d6d7da',
    marginLeft: 5,
    marginRight: 5,
  },
  buttonGroup: {
    height: 100,
    flex: 1
  },
  button: {
    marginTop: 5,
    height: 40,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: '#71d3d1',
  }
})

export default class CreateResourceModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      resourceText: ""
    };
  }

  saveResource = () => {
    const { saveResource } = this.props;

    // If changing the parameter to this function, make sure to update it upstream
    return saveResource && saveResource(this.state.resourceText);
  }

  textUpdate = (text) => {
    this.setState({ resourceText: text })
  }

  render() {
    const {
      onClose,
      isModalOpen
    } = this.props;

    return (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalOpen}
          onRequestClose={onClose}
        >
          <TouchableOpacity 
            activeOpacity={1}
            style={styles.modal} 
            onPress={onClose}
          >
            <View style={styles.view}>
              <Textarea
                bordered 
                placeholder="What's on your mind?"
                style={styles.textBox}
                onChangeText={this.textUpdate}
              />
              <View style={styles.buttonGroup}>
                <Button block style={styles.button} onPress={this.saveResource}>
                  <Text>Post</Text>
                </Button>
                <Button block style={styles.button} onPress={onClose}>
                  <Text>Cancel</Text>
                </Button>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    )
  }
}