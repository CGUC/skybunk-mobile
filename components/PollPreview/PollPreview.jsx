import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList } from 'react-native';
import { Text, Button, Textarea, Icon } from 'native-base';
import { Font } from "expo";
import Option from './Option/Option';
import PollModal from '../PollModal/PollModal';
import styles from "./PollPreviewStyle";

export default class PollPreview extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      question: this.props.data ? this.props.data.question : '',
      options: this.props.data ? this.props.data.options : [],
      total: this.getTotal(this.props.data ? this.props.data.options : []),
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

  openModal = async (data) => {
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
    return this.props.savePoll && this.props.savePoll({ question: this.state.question, options: this.state.options });
  }

  render() {
    var shownOptions = this.state.options.slice(0, 3);
    var hiddenCount = this.state.options.length - shownOptions.length;
    var hiddenContent = null;
    if (hiddenCount > 0) {
      hiddenContent = <Text style={styles.hiddenContentText}>{`${hiddenCount} more option${hiddenCount > 1 ? 's' : ''}...`}</Text>
    }

    return (
      <View style={styles.card}>
        <Text style={styles.questionText}>{this.state.question}</Text>
        <FlatList style={styles.options}
          data={shownOptions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => 
            <Option
              selected={item.selected}
              text={item.text}
              count={item.count}
              total={this.state.total}
            />
          }
        />
        {hiddenContent}
        <Button block style={styles.button} onPress={this.openModal}>
          <Text>CHANGE VOTE</Text>
        </Button>
        <PollModal
          question={this.state.question}
          options={this.state.options}
          onSave={this.onModalSave}
          onCancel={this.onModalCancel}
          isModalOpen={this.state.isEditing}
          clearAfterSave={true}
        />
      </View>
    )
  }
}