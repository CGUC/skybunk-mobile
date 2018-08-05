import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Container, Text, Button } from 'native-base';
import { Font, AppLoading } from "expo";
import date from 'date-fns';

import styles from "./NotificationListStyle";

export default class NotificationList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {}
  }

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
          <AppLoading />
        </Container>
      );
    } else {
      return (
        this.props.notifications.map((notif, key) => {
          const createdAt = date.format(notif.createdAt, 'ddd MMM Do [at] h:mma');
          
          return (
            <TouchableOpacity 
              key={key}
              style={notif.seen ? styles.notificationCardSeen : styles.notificationCardUnseen}
              onPress={() => { this.props.onPressNotif(notif) }}
            >
              <Text numberOfLines={1} style={notif.seen ? styles.notificationTitleSeen : styles.notificationTitleUnseen}>
                {notif.title}
              </Text>
              <Text numberOfLines={2} style={notif.seen ? styles.notificationBodySeen : styles.notificationBodyUnseen}>
                {notif.body}
              </Text>
              <Text note>{createdAt}</Text>
            </TouchableOpacity>
          );
        })
      );
    }
  }
}
