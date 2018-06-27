import React from 'react';
import { Text, View } from 'native-base';
import PropTypes from 'prop-types';

export default class Banner extends React.Component {
  bgStyle() {
    let bgColor = '#FEFEFE';
    if (this.props.success)
      bgColor = '#0C0';
    else if (this.props.error)
      bgColor = '#C00';

    return {
      backgroundColor: bgColor,
      marginTop: 10,
      paddingLeft: 10,
    }
  }

  textStyle() {
    let textColour = 'black';
    if (this.props.success || this.props.error)
      textColour = 'white';

    return {
      color: textColour,
    }
  }

  render() {
    return (
      <View style={this.bgStyle()}>
        <Text style={this.textStyle()}>{this.props.message}</Text>
      </View>
    );
  }
}

Banner.defaultProps = {
  neutral: true,
  success: false,
  error: false,
};

Banner.propTypes = {
  neutral: PropTypes.bool,
  success: PropTypes.bool,
  error: PropTypes.bool,
};
