import React from 'react';
import styles from "./PollStyle";

export default class Poll extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    }
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
  }

  render() {
    const {
    } = this.state;

    const {
      data
    } = this.props;

    var {
      question,
      options
    } = data;

    return (
      <View>
      </View>
    )
  }
}