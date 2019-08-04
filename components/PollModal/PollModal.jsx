import React from 'react';
import PropTypes from 'prop-types';
import { View, Modal, FlatList, TouchableOpacity, KeyboardAvoidingView, Keyboard, Platform } from 'react-native';
import { Text, Button, Textarea, Icon } from 'native-base';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { Font } from "expo";
import Option from './Option/Option';
import styles from "./PollModalStyle";

export default class PollModal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      question: this.props.question,
      options: this.props.options,
      newOption: '',
    }
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
  }

  onSave = () => {
    const { onSave } = this.props;
    return onSave && onSave({ question: this.state.question, options: this.state.options });
  }

  onCancel = () => {
    const { onCancel } = this.props;
    return onCancel && onCancel();
  }

  newOptionUpdate = async (text) => {
    this.setState({ newOption: text });
  }

  questionUpdate = async (text) => {
    this.setState({ question: text });
  }

  addOption = () => {
    var opts = this.state.options;
    console.log(`Trying to add new option with text ${this.state.newOption}`);
    opts.push({
      selected: false,
      text: this.state.newOption,
      count: 0,
    });
    this.setState({ options: opts });
  }

  render() {
    var {
      data,
      isModalOpen,
      submitButtonText
    } = this.props;

    if (!submitButtonText) submitButtonText = 'Submit';

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalOpen}
        onRequestClose={this.onCancel}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modal}
          onPress={this.onCancel}
        >
          <KeyboardAvoidingView
            behavior='padding'
            // Android already does this by default, so it doubles the padding when enabled
            enabled={Platform.OS !== 'android'}
          >
            <GestureRecognizer
              onSwipeDown={this.hideKeyboard}
              style={styles.gestureRecognizer}
            >
              <View style={styles.view}>
                <View style={styles.topViews}>
                  <Text style={styles.questionText}>Question</Text>
                  <Textarea
                      bordered
                      placeholder="Ask something..."
                      style={styles.textBox}
                      onChangeText={this.questionUpdate}
                      value={this.state.question}
                    />
                  <FlatList style={styles.options}
                    data={this.state.options}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) => 
                      <Option
                        onPress={this.toggleOption}
                        onLongPress={this.confirmDelete}
                        selected={item.selected}
                        text={item.text}
                        count={item.count}
                      />
                    }
                  />
                  <View style={styles.optionGroup}>
			              <TouchableOpacity onPress={this.addOption}>
		  	              <Icon name={Platform.OS === 'ios' ? "ios-add" : "md-add"} style={styles.icon}/>
		                </TouchableOpacity>
                    <Textarea
                      placeholder="Add an option..."
                      style={styles.optionText}
                      onChangeText={this.newOptionUpdate}
                      value={this.state.newOption}
                    />
                  </View>
                </View>
                <View style={styles.buttonGroup}>
                  <Button block style={styles.button} onPress={this.onSave}>
                    <Text>{submitButtonText}</Text>
                  </Button>
                  <Button block style={styles.button} onPress={this.onCancel}>
                    <Text>Cancel</Text>
                  </Button>
                </View>
              </View>
            </GestureRecognizer>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>
    )
  }
}