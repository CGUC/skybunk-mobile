import React from 'react';
import PropTypes from 'prop-types';
import Autolink from 'react-native-autolink';
import { View, FlatList, TouchableOpacity, Platform, Alert } from 'react-native';
import { CheckBox, Icon } from 'react-native-elements';
import { Text, Button, Textarea } from 'native-base';
import { Font } from "expo";
import { pollVote, pollOption, pollDeleteOption } from '../../helpers/poll';
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
      isAdmin: this.props.loggedInUser && this.props.loggedInUser.role && this.props.loggedInUser.role.includes("admin"),
    }
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("../../node_modules/native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("../../node_modules/native-base/Fonts/Roboto_medium.ttf")
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.options && !nextState.options) {
      nextState.options = this.state.options;
    }
    return true;
  }

  getTotal = (options) => {
    var total = 0;
    options.forEach(opt => { total += opt.usersVoted.length; });
    return total;
  }

  newOptionUpdate = async (text) => {
    var match = /\r|\n/.exec(text);
    if (match) {
      this.addOption();
      return;
    }
    if (text.length >= 200) {
      return;
    }
    this.setState({ newOption: text });
  }

  titleUpdate = async (text) => {
    if (text.length >= 1000) {
      return;
    }
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

  serverVote = (option, retract) => {
    pollVote(this.props.postId, { retract: retract, optionId: option._id })
    .then((poll) => {
      if (!poll.options) {
        return;
      }
      this.setState({ options: poll.options });
      this.props.updatePoll && this.props.updatePoll({
        title: this.state.title,
        multiSelect: this.state.multiSelect,
        open: this.state.open,
        options: poll.options,
      });
    })
    .catch((error) => alert("Error updating vote. Sorry about that!"));
  }

  updateOptionVoters = (option) => {
    let userIndex = this.userVoteIndex(option);
    if (!this.props.savePoll) {
      this.serverVote(option, userIndex >= 0);
    } else {
      if (userIndex === -1) {
        option.usersVoted.push(this.props.loggedInUser._id);
      } else {
        option.usersVoted.splice(userIndex, 1);
      }
    }
  }

  toggleOption = async (item) => {
    if (!this.state.options) {
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
      if (!this.props.savePoll) {
        var selectedIndex = opts.findIndex(opt => this.userVoteIndex(opt) >= 0);
        if (selectedIndex === optIndex) {
          this.serverVote(opts[optIndex], true);
        } else if (selectedIndex >= 0) {
          pollVote(this.props.postId, { retract: true, optionId: opts[selectedIndex]._id })
          .then((poll) => {
            this.serverVote(opts[optIndex], false);
          })
          .catch((error) => alert("Error updating vote. Sorry about that!"));
        } else {
          this.serverVote(opts[optIndex], false);
        }
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
    }
    this.props.savePoll && this.props.savePoll({
      title: this.state.title,
      multiSelect: this.state.multiSelect,
      open: this.state.open,
      options: opts,
    });
  }

  confirmDelete = async (item) => {
    if (!this.props.isAuthor && !this.state.isAdmin && item.creator !== this.props.loggedInUser._id) {
      return;
    }
    Alert.alert(
      'Hold Up!',
      `Are you sure you want to remove this option?\nOption: ${item.text}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: this.deleteOption.bind(this, item) },
      ],
    );
  }

  deleteOption = (item) => {
    if (this.props.savePoll) {
      var opts = this.state.options;
      var optIndex = opts.findIndex(opt => opt.key === item.key);
      if (optIndex === -1) {
        return;
      }
      opts.splice(optIndex, 1);
      this.props.savePoll({
        title: this.state.title,
        multiSelect: this.state.multiSelect,
        open: this.state.open,
        options: opts,
      });
    } else {
      pollDeleteOption(this.props.postId, item)
      .then((poll) => {
        if (!poll.options) {
          return;
        }
        this.setState({ options: poll.options });
        this.props.updatePoll && this.props.updatePoll({
          title: this.state.title,
          multiSelect: this.state.multiSelect,
          open: this.state.open,
          options: poll.options,
        });
      })
      .catch((error) => alert("Error removing option. Sorry about that!"));
    }
  }

  addOption = async () => {
    if (this.state.newOption.length == 0) {
      return;
    }
    if (this.state.options.length >= 10) {
      alert("Cannot have more than 10 options on a poll. Sorry about that!");
      return;
    }
    let optionText = this.state.newOption;
    if (!this.props.savePoll) {
      pollOption(this.props.postId, { option: optionText })
      .then((poll) => {
        if (!poll.options) {
          return;
        }
        this.setState({ options: poll.options, newOption: '' });
        this.props.updatePoll && this.props.updatePoll({
          title: this.state.title,
          multiSelect: this.state.multiSelect,
          open: this.state.open,
          options: poll.options,
        });
      })
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
      this.setState({ newOption: '' });
    }
  }

  buildListItems = () => {
    if (!this.state.options) {
      return;
    }
    let items = this.state.options
            .sort((a, b) => b.usersVoted.length - a.usersVoted.length)
            .slice()
            .map(item => {
              if (item._id) {
                item.key = item._id;
              }
              return item;
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
            <Icon name="add" style={styles.addView}/>
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
    let totalCount = this.getTotal(this.state.options);
    let percentage = totalCount === 0 ? 0 : (item.usersVoted.length / totalCount * 100).toFixed();
    let canDelete = this.props.isAuthor || this.state.isAdmin || item.creator === this.props.loggedInUser._id;
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
  			  <Autolink style={styles.optionText} text={item.text}/>
  			  <Text style={styles.optionCount}>{`${item.usersVoted.length}: ${percentage}%`}</Text>
          {canDelete ?
            <TouchableOpacity style={styles.optionDeleteContainer} onPress={this.confirmDelete.bind(this, item)}>
              <Icon
                name="delete"
                style={styles.optionDelete}
              />
            </TouchableOpacity> : null}
        </View>
  		</TouchableOpacity>
    );
  }

  render() {
    // TODO fix: so many security vulnerabilities from unsanitized user input of option text and poll title
    let editing = !!this.props.savePoll;

    return (
      <View style={styles.view}>
        {!!this.props.isAuthor && editing ?
          <View style={styles.fillWidth}>
            <CheckBox
              style={styles.topCheckbox}
              containerStyle={styles.topCheckboxContainer}
              title='Allow Option Creation'
              iconRight
              right
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
        {this.props.isAuthor && editing ?
          <View style={styles.fillWidth}>
            <Text style={styles.questionText}>Question</Text>
            <Textarea
              bordered
              placeholder="Ask something..."
              style={styles.textBox}
              onChangeText={this.titleUpdate}
              value={this.state.title}
              disabled={!this.props.isAuthor || !editing}
            />
          </View> :
          <Autolink
              style={styles.finalQuestion}
              text={this.state.title}
          />}
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
