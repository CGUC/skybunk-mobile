import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList } from 'react-native';
import { Text, Button, Textarea } from 'native-base';
import { Font } from "expo";
import * as Progress from 'react-native-progress';
import PollModal from '../PollModal/PollModal';
import styles from "./PollPreviewStyle";

export default class PollPreview extends React.Component {

  constructor(props) {
    super(props);

    let cleanTitle = this.props.data && this.props.data.title ? this.props.data.title : '';
    let cleanOpts = this.props.data && this.props.data.options ? this.props.data.options : [];

    this.state = {
      title: cleanTitle,
      options: cleanOpts,
      total: this.getTotal(cleanOpts),
      isEditing: this.props.isEditing
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
    options.forEach(opt => { total += opt.count; });
    return total;
  }

  /*openModal = async (data) => {
    this.setState({
      isEditing: true,
    });
  }

  onModalSave = async (data) => {
    this.setState({
      question: data.question,
      options: data.options,
      total: this.getTotal(data.options),
      isEditing: false,
    });
    return this.props.savePoll && this.props.savePoll(data);
  }

  onModalCancel = async () => {
    this.setState({
      isEditing: false,
    });
    return this.props.savePoll && this.props.savePoll(null);
  }*/

  buildListItems = () => {
    let items = this.state.options
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);
    return items;
  }

  renderListItem = ({ item }) => {
    var countText;
    if (item.selected) {
      if (item.count > 1) {
        countText = `You + ${item.count - 1}`
      } else {
        countText = 'You'
      }
    } else {
      countText = `${item.count}`
    }

    return(
  		<View style={styles.optionView}>
        <View style={styles.optionInfo}>
  			  <Text style={styles.optionText}>{item.text}</Text>
  			  <Text style={styles.optionCount}>{countText}</Text>
        </View>
        <Progress.Bar style={styles.progressbar} progress={this.state.total === 0 ? 0 : item.count / this.state.total * 100} />
  		</View>
    );
  }

  render() {
    // TODO fixes: make height variable based on contents, make question text prettier (gray? centered?), add border
    let moreContent;
    let moreCount = this.state.options.length - 3;
    if (moreCount > 0) {
      moreContent = <Text style={styles.moreContentText}>{`${moreCount} more option${moreCount > 1 ? 's' : ''}...`}</Text>;
    } else {
      moreContent = null;
    }

    /*

    <Button style={styles.button} onPress={this.openModal}>
      <Text>CHANGE VOTE</Text>
    </Button>
    <PollModal
      question={this.state.question}
      options={this.state.options}
      onSave={this.onModalSave}
      onCancel={this.onModalCancel}
      isModalOpen={this.state.isEditing}
    />

    */

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
