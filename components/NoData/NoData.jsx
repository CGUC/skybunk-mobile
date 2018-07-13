import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Container, Content, Footer, Text } from 'native-base';
import { styles } from './NoDataStyle'
import ContentBar from '../ContentBar/ContentBar';


export default class NoDataCell extends React.Component {
  render() {
    var { resourceName, addResource } = this.props;

    return (
      <Container>
        <Content>
          <View style={styles.view}>
            <Text style={styles.text}>No {resourceName} yet - you could be the first!</Text>
          </View>
        </Content>
        {!this.props.hideFooter ?
        <Footer>
          <ContentBar addResource={addResource} />
        </Footer> : null}
      </Container>
    )
  }
}