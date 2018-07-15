import React from 'react';
import PropTypes from 'prop-types';
import { View, Modal, TouchableOpacity } from 'react-native';
import { Text, Button, Textarea } from 'native-base';
import styles from './CreateResourceModalStyle';

export default class CreateResourceModal extends React.Component {

  constructor(props) {
    super(props);
    var existingText = props.existing;

    this.state = {
      resourceText: existingText || ""
    };
  }

  saveResource = () => {
    const { saveResource } = this.props;

    this.textUpdate("");

    return saveResource && saveResource(this.state.resourceText);
  }

  textUpdate = (text) => {
    this.setState({ resourceText: text })
  }

  onCancel = () => {
    const { onClose } = this.props;
    this.textUpdate("");
    onClose();
  }

  render() {
    var {
      onClose,
      isModalOpen,
      submitButtonText
    } = this.props;

    if (!submitButtonText) submitButtonText = 'Submit';

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
                value={this.state.resourceText}
              />
              <View style={styles.buttonGroup}>
                <Button block style={styles.button} onPress={this.saveResource}>
                  <Text>{submitButtonText}</Text>
                </Button>
                <Button block style={styles.button} onPress={this.onCancel}>
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