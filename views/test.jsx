import React from 'react';
import { Container, Content, Text } from 'native-base';
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
        <Container>
          <Content contentContainerStyle={{ justifyContent: 'center', flex: 1, marginLeft: 50, marginRight: 50 }}>
            <Text>HELLOO</Text>
          </Content>
        </Container>
      );
    }
  }
}
