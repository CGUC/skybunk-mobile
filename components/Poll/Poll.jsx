import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, TouchableOpacity, Platform, Alert } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { Text, Button, Textarea, Icon } from 'native-base';
import { Font } from "expo";
import styles from "./PollStyle";

export default class Poll extends React.Component {

  constructor(props) {
    super(props);

    let cleanTitle = this.props.data && this.props.data.title ? this.props.data.title : '';
    let cleanOpts = this.props.data && this.props.data.options ? this.props.data.options : [];
    let cleanMultiSelect = this.props.data && this.props.data.multiSelect === false ? false : true;
    let cleanOpen = this.props.data && this.props.data.open === false ? false : true;

    this.state = {
      title: cleanTitle,
      multiSelect: cleanMultiSelect,
      open: cleanOpen,
      options: cleanOpts,
      newOption: '',
    }
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
  }

  onSave = async () => {
    const { onSave } = this.props;
    return onSave && onSave({
      title: this.state.title,
      multiSelect: this.state.multiSelect,
      open: this.state.open,
      options: this.state.options,
    });
  }

  onCancel = async () => {
    const { onCancel } = this.props;
    return onCancel && onCancel();
  }

  newOptionUpdate = async (text) => {
    this.setState({ newOption: text });
  }

  titleUpdate = async (text) => {
    this.state.title = text;
    this.props.savePoll({
      title: text,
      multiSelect: this.state.multiSelect,
      open: this.state.open,
      options: this.state.options,
    });
  }

  toggleMultiSelect = async () => {
    if (!this.state.open) {
      return;
    }
    if (this.state.multiSelect) {
      for (var i = 0; i < this.state.options.length; i++) {
        let allUsersVoted = this.state.options.reduce((acc, option) => acc.concat(option.usersVoted), []);
        let hasDuplicates = ((new Set(allUsersVoted)).size !== allUsersVoted.length);
        if (hasDuplicates) {
          Alert.alert(
            'Sorry',
            'Single selection is not allowed because users have selected multiple options in this poll.',
            [{text: 'OK'}],
            {cancelable: true},
          ); //, onPress: () => this.setState({ multiSelect: !value })
          return;
        }
      }
    }
    this.state.multiSelect = !this.state.multiSelect;
    this.props.savePoll({
      title: this.state.title,
      multiSelect: this.state.multiSelect,
      open: this.state.open,
      options: this.state.options,
    });
  }

  onPressClose = () => {
    Alert.alert(
      'Just Checking',
      `Are you sure you want to ${this.state.open ? 'close' : 'open'} this poll?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: `${this.state.open ? 'Close' : 'Open'}`, onPress: this.toggleOpen },
      ],
    )
  }

  toggleOpen = () => {
    this.state.open = !this.state.open;
    this.props.savePoll({
      title: this.state.title,
      multiSelect: this.state.multiSelect,
      open: this.state.open,
      options: this.state.options,
    });
  }

  userVoteIndex = (option) => {
    return option.usersVoted.findIndex(voter => voter === this.props.loggedInUser._id);
  }

  updateOptionVoters = (option) => {
    let userIndex = this.userVoteIndex(option);
    if (userIndex === -1) {
      option.usersVoted.push(this.props.loggedInUser._id);
    } else {
      option.usersVoted.splice(userIndex, 1);
    }
  }

  toggleOption = async (item) => {
    if (!this.state.open) {
      return;
    }
    var opts = this.state.options;
    var optIndex = opts.findIndex(opt => opt.key === item.key);
    if (optIndex === -1) {
      return;
    }
    if (this.state.multiSelect) {
      this.updateOptionVoters(opts[optIndex]);
    } else {
      for (var i = 0; i < opts.length; i++) {
        if (i === optIndex) {
          this.updateOptionVoters(opts[optIndex]);
        } else {
          let userIndex = this.userVoteIndex(opts[i]);
          if (userIndex >= 0) {
            opts[i].usersVoted.splice(userIndex, 1);
          }
        }
      }
    }
    this.props.savePoll({
      title: this.state.title,
      multiSelect: this.state.multiSelect,
      open: this.state.open,
      options: opts,
    });
  }

  confirmDelete = async (item) => {
    // TODO - note this needs server side changes as well
    // deletion should only be allowed if this is the option creator or admin
  }

  addOption = async () => {
    if (!this.state.open || this.state.newOption.length == 0) {
      return;
    }
    var opts = this.state.options;
    opts.push({
      key: `${this.state.options.length}`,
      text: this.state.newOption,
      creator: this.props.loggedInUser._id,
      usersVoted: [],
    });
    this.setState({ newOption: '' });
    this.props.savePoll({
      title: this.state.title,
      multiSelect: this.state.multiSelect,
      open: this.state.open,
      options: opts,
    });
  }

  buildListItems = () => {
    let items = this.state.options
            .sort((a, b) => b.usersVoted.length - a.usersVoted.length)
            .slice();
    items.push({ key: 'add_option_item' });
    return items;
  }

  renderListItem = ({ item }) => {
    if (item.key === 'add_option_item') {
      return (
        <View style={styles.optionGroup}>
          <TouchableOpacity style={styles.addContainingView} onPress={this.addOption}>
            <Icon name={Platform.OS === 'ios' ? "ios-add" : "md-add"} style={styles.addView}/>
          </TouchableOpacity>
          <Textarea
            placeholder="Add an option..."
            style={styles.addOptionText}
            onChangeText={this.newOptionUpdate}
            value={this.state.newOption}
            disabled={!this.state.open}
          />
        </View>
      );
    }
    let selected = (this.userVoteIndex(item) !== -1);
    return(
  		<TouchableOpacity onPress={this.toggleOption.bind(this, item)} onLongPress={this.confirmDelete.bind(this, item)}>
        <View style={styles.optionView}>
          {this.state.multiSelect ?
            <CheckBox
              style={styles.optionButton}
              containerStyle={styles.optionButtonContainer}
              checked={selected}
              onIconPress={this.toggleOption.bind(this, item)}
              onLongIconPress={this.confirmDelete.bind(this, item)}
            /> :
            <CheckBox
              style={styles.optionButton}
              containerStyle={styles.optionButtonContainer}
              checkedIcon='dot-circle-o'
              uncheckedIcon='circle-o'
              checked={selected}
              onIconPress={this.toggleOption.bind(this, item)}
              onLongIconPress={this.confirmDelete.bind(this, item)}
            />}
  			  <Text style={styles.optionText}>{item.text}</Text>
  			  <Text style={styles.optionCount}>{`${item.usersVoted.length}`}</Text>
        </View>
  		</TouchableOpacity>
    );
  }

  render() {
    // TODO fix: option text limit, options limit of 10, multiSelect and open
    // states of editing vs. creating poll (isEditing prop?)
    return (
      <View style={styles.view}>
        <CheckBox
          style={styles.topCheckbox}
          containerStyle={styles.topCheckboxContainer}
          title={`${this.state.open ? 'Close' : 'Open'} Poll`}
          iconRight
          right
          iconType='material'
          checkedIcon='lock'
          uncheckedIcon='lock-open'
          checkedColor='red'
          uncheckedColor='green'
          checked={this.state.open}
          onPress={this.onPressClose}
          onIconPress={this.onPressClose}
        />
        <CheckBox
          style={styles.topCheckbox}
          containerStyle={styles.topCheckboxContainer}
          title='Allow Multiple Selection'
          iconRight
          right
          checked={this.state.multiSelect}
          onPress={this.toggleMultiSelect}
          onIconPress={this.toggleMultiSelect}
        />
        <Text style={styles.questionText}>Question</Text>
        <Textarea
            bordered
            placeholder="Ask something..."
            style={styles.textBox}
            onChangeText={this.titleUpdate}
            value={this.state.title}
            disabled={!this.state.open}
        />
        <FlatList
          keyboardShouldPersistTaps={'handled'}
          data={this.buildListItems()}
          renderItem={this.renderListItem}
          extraData={this.state}
        />
      </View>
    )
  }
}
