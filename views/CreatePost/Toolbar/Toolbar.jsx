import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Icon, Thumbnail } from 'native-base';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import styles from './ToolbarStyle';

export default class Toolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedMedia:  "clearMedia"
    };
  }

  takeImage = () => {
    const { takeImage } = this.props;
    if(takeImage()){
      this.setState({
        selectedMedia: "takeImage"
      });
    }
    
  }

  pickImage = () => {
    const { pickImage } = this.props;
    if(pickImage()){
      this.setState({
        selectedMedia: "pickImage"
      });
    }
  }

  addPoll = () => {
    const { addPoll } = this.props;
    if(addPoll()){
        this.setState({
        selectedMedia: "addPoll"
      });
    }
  }

  clearMedia = () => {
    const { clearMedia } = this.props;
    clearMedia();
    this.setState({
      selectedMedia: "clearMedia"
    });
  }

  render () {
    const selectedColor = "#999";
    const unselectedColor = "#DEDEDE";
    const iconSize = 33;

    const {selectedMedia} = this.state;

    const takeImageColor = selectedMedia==="takeImage" ? selectedColor : unselectedColor;
    const pickImageColor = selectedMedia==="pickImage" ? selectedColor : unselectedColor;
    const addPollColor = selectedMedia==="addPoll" ? selectedColor : unselectedColor;
    const clearMediaColor = selectedMedia==="clearMedia" ? selectedColor : unselectedColor;

    return (
      <View style={styles.view}>
        <TouchableOpacity onPress={this.clearMedia}>
          <MaterialIcon 
            name="clear" 
            size={iconSize} 
            style={[styles.icon, {backgroundColor: clearMediaColor}]}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.takeImage}>
        <MaterialIcon 
          name="camera-alt" 
          size={iconSize} 
          style={[styles.icon, {backgroundColor: takeImageColor}]}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.pickImage}>
        <MaterialIcon 
          name="image" 
          size={iconSize} 
          style={[styles.icon, {backgroundColor: pickImageColor}]}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.addPoll}>
          <MaterialIcon 
            name="poll" 
            size={iconSize} 
            style={[styles.icon, {backgroundColor: addPollColor}]}/>
        </TouchableOpacity>
      </View>
    );
  }
}
