import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 0};
  }

  componentDidMount() {
    fetch('http://localhost:3000/examples/Mark').then(res => {
      this.setState({
        count: res.counter
      });
    })
    .catch(err => {
      if (err) throw err;
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.count}</Text>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
