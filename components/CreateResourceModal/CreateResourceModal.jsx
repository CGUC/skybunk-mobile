import React from 'react';
import PropTypes from 'prop-types';
import { View, Modal, TouchableOpacity } from 'react-native';
import { Text, Button, Textarea } from 'native-base';
import styles from './CreateResourceModalStyle';

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