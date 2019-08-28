import React from 'react';
import { Image } from 'react-native';
import styles from './SpinnerStyle';

export default class Spinner extends React.Component {
  render() {
    return (
        <Image source={require('../../assets/spinner.gif')} style={[styles.image, this.props.style]}/>
    );
  }
}