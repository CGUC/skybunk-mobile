import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Container, Header, Content, Text, Spinner, Footer } from 'native-base';
import styles from './HomeTabBarButtonStyle';

export default class HomeView extends React.Component {
  showNotice = () => {
    if (this.props.showNotice) return <View style={styles.notice}/>;
    return null;
  }

  render() {
    return (
      <TouchableOpacity 
        style={this.props.selected ? styles.buttonSelected : styles.buttonUnselected}
        activeOpacity={this.props.selected ? 1.0 : 0.5}
        onPress={this.props.onPress}
      >
        <View>
          <Text style={styles.text}>{this.props.text}</Text>
          {this.showNotice()}
        </View>
      </TouchableOpacity>
    );
  }
}