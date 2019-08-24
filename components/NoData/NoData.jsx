import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Container, Content, Footer, Text } from 'native-base';
import styles from './NoDataStyle'
import ContentBar from '../ContentBar/ContentBar';


export default class NoDataCell extends React.Component {
  render() {
    var { message, addResource, loggedInUser } = this.props;

    return (
      <Container>
        <Content>
          <View style={styles.view}>
            <Text style={styles.text}>{message}</Text>
          </View>
        </Content>
        {!this.props.hideFooter ?
        <Footer>
          <ContentBar addResource={addResource} showModalToolbar={true} loggedInUser={loggedInUser}/>
        </Footer> : null}
      </Container>
    )
  }
}
