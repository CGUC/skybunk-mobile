import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList } from 'react-native';
import { Text, Button, Textarea } from 'native-base';
import { Font } from "expo";
import * as Progress from 'react-native-progress';
import styles from "./PollPreviewStyle";

export default class PollPreview extends React.Component {

  constructor(props) {
    super(props);

    let cleanTitle = this.props.data && this.props.data.title ? this.props.data.title : '';
    let cleanOpts = this.props.data && this.props.data.options ? this.props.data.options : [];

    this.state = {
      title: cleanTitle,
      options: cleanOpts,
    }
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
  }

  getTotal = (options) => {
    var total = 0;
    options.forEach(opt => { total += opt.usersVoted.length; });
    return total;
  }

  buildListItems = () => {
    let items = this.state.options
            .sort((a, b) => b.usersVoted.length - a.usersVoted.length)
            .slice(0, 3)
            .map(item => {
              if (item._id) {
                item.key = item._id;
              }
              return item;
            });
    return items;
  }

  renderListItem = ({ item }) => {
    let userIndex = item.usersVoted.findIndex(voter => voter === this.props.loggedInUser._id);
    var countText;
    if (userIndex >= 0) {
      if (item.usersVoted.length > 1) {
        countText = `You + ${item.usersVoted.length - 1}`
      } else {
        countText = 'You'
      }
    } else {
      countText = `${item.usersVoted.length}`
    }
    let totalCount = this.getTotal(this.state.options);

    return(
  		<View style={styles.optionView}>
        <View style={styles.optionInfo}>
  			  <Text style={styles.optionText}>{item.text}</Text>
  			  <Text style={styles.optionCount}>{countText}</Text>
        </View>
        <View style={styles.progressbar}>
          <View style={[styles.filler, { width: `${totalCount === 0 ? 0 : item.usersVoted.length / totalCount * 100}%` }]} />
        </View>
  		</View>
    );
  }

  render() {
    let moreContent;
    let moreCount = this.state.options.length - 3;
    if (moreCount > 0) {
      moreContent = <Text style={styles.moreContentText}>{`${moreCount} more option${moreCount > 1 ? 's' : ''}...`}</Text>;
    } else {
      moreContent = null;
    }

    return (
      <View style={styles.card}>
        <Text style={styles.questionText}>{this.state.title}</Text>
        <FlatList
          data={this.buildListItems()}
          renderItem={this.renderListItem}
          extraData={this.state}
        />
        {moreContent}
      </View>
    )
  }
}
