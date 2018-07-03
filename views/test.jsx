import React from 'react';
import { Container, Content, Text, Button } from 'native-base';
import { Font, AppLoading } from "expo";

export default class TestView extends React.Component {
  static navigationOptions = { title: 'TEST' };

  constructor(props) {
    super(props);
    this.state = { 
      loading: true,
    };
  }

  // This is just to avoid a bug with expo...
  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ loading: false });
  }

  next = () => {
    // How to pass props to specify which tags to view?
    this.props.navigation.navigate('Channel');
  }

  render() {
    if (this.state.loading) {
      return (
        <Container>
          <AppLoading/>
        </Container>
      );
    }
    else {
      return (
        <Container style={{ flex: 1, flexDirection: 'column', alignItems: 'center'}}>
          <Content contentContainerStyle={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
            <Button bordered dark onPress={this.next}>
              <Text>Go to all feed</Text>
            </Button>
          </Content>
        </Container>
      );
    }
  }
}
