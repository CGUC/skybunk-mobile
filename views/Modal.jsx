import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import {
  Container, Header, Content, Text, Spinner
} from 'native-base';

export default class Modal extends React.Component {

  static navigationOptions = { title: 'Modal' };

  render() {
    return (
      // <Modal visible={true}
      //   onRequestClose={() => this.setState({ isModalOpen: false })} animationType={"slide"}
      //   transparent={false}>
        <View>
          <Text>Modal!</Text>
        </View>
      // </Modal>
    )
  }
}