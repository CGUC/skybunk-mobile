import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, TouchableOpacity, Platform, Alert } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { Text, Button, Textarea, Icon } from 'native-base';
import { Font } from "expo";
import { pollVote, pollOption } from '../../helpers/poll';
import styles from "./PollStyle";

export default class Poll extends React.Component {

  constructor(props) {
    super(props);

    let cleanTitle = this.props.data && this.props.data.title ? this.props.data.title : '';
    let cleanOpts = this.props.data && this.props.data.options ? this.props.data.options : [];
    let cleanMultiSelect = this.props.data && this.props.data.multiSelect === false ? false : true;
    let cleanOpen = this.props.data && this.props.data.open === true ? true : false;

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
          );
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
    var opts = this.state.options;
    var optIndex = opts.findIndex(opt => opt.key === item.key);
    if (optIndex === -1) {
      return;
    }
    if (!this.props.savePoll) {
      let userIndex = this.userVoteIndex(opts[optIndex]);
      pollVote(this.props.postId, { retract: userIndex >= 0, optionId: opts[optIndex]._id })
      .then((poll) => this.setState({ options: poll.options }))
      .catch((error) => alert("Error updating vote. Sorry about that!"));
    } else {
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
  }

  confirmDelete = async (item) => {
    // TODO - this needs server side changes as well
    // deletion should only be allowed if this is the option creator or admin
  }

  addOption = async () => {
    if (this.state.newOption.length == 0) {
      return;
    }
    let optionText = this.state.newOption;
    this.setState({ newOption: '' });
    if (!this.props.savePoll) {
      pollOption(this.props.postId, { option: optionText })
      .then((poll) => this.setState({ options: poll.options }))
      .catch((error) => alert("Error adding poll option. Sorry about that!"));
    } else {
      var opts = this.state.options;
      opts.push({
        key: `${this.state.options.length}`,
        text: optionText,
        usersVoted: [],
      });
      this.props.savePoll({
        title: this.state.title,
        multiSelect: this.state.multiSelect,
        open: this.state.open,
        options: opts,
      });
    }
  }

  buildListItems = () => {
    let items = this.state.options
            .sort((a, b) => b.usersVoted.length - a.usersVoted.length)
            .slice();
    var index = 0;
    items.forEach((item) => {
      if (!item.key) {
        item.key = item._id || `${index++}`;
      }
    });
    if (!!this.props.isAuthor || this.state.open) {
      items.push({ key: 'add_option_item' });
    }
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
          />
        </View>
      );
    }
    let selected = (this.userVoteIndex(item) !== -1);
    return(
  		<TouchableOpacity style={styles.fillWidth} onPress={this.toggleOption.bind(this, item)} onLongPress={this.confirmDelete.bind(this, item)}>
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
    // TODO fix: option text limit, options limit of 10
    let editing = !!this.props.savePoll;

    return (
      <View style={styles.view}>
        {!!this.props.isAuthor && editing ?
          <View style={styles.fillWidth}>
            <CheckBox
              style={styles.topCheckbox}
              containerStyle={styles.topCheckboxContainer}
              title={`${this.state.open ? 'Close' : 'Open'} Option Creation`}
              iconRight
              right
              iconType='material'
              checkedIcon='lock'
              uncheckedIcon='lock-open'
              checkedColor='red'
              uncheckedColor='green'
              checked={this.state.open}
              onPress={this.toggleOpen}
              onIconPress={this.toggleOpen}
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
          </View> : null}
        <Text style={styles.questionText}>Question</Text>
        <Textarea
            bordered
            placeholder="Ask something..."
            style={styles.textBox}
            onChangeText={this.titleUpdate}
            value={this.state.title}
            disabled={!this.props.isAuthor || !editing}
        />
        <FlatList
          style={styles.fillWidth}
          keyboardShouldPersistTaps={'handled'}
          showsVerticalScrollIndicator={false}
          data={this.buildListItems()}
          renderItem={this.renderListItem}
          extraData={this.state}
        />
      </View>
    )
  }
}
