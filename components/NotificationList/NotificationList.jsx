import React from "react";
import { View, TouchableOpacity, FlatList } from "react-native";
import { Container, Text, Button} from 'native-base';
import { Font, AppLoading } from "expo";
import date from 'date-fns';
import defaultStyles from "../../styles/styles";

import styles from "./NotificationListStyle";

export default class NotificationList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true
    }
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ loading: false });
  }

  renderListItem = ({ item }) => {
    var createdAt;
    if(date.isPast(date.addWeeks(item.createdAt,1))){
      //If the post is more than a week old, display date
      createdAt = date.format(item.createdAt, 'ddd MMM Do');
    }else{
      //Display how long ago the post was made
      createdAt = date.distanceInWordsToNow(item.createdAt, {addSuffix: true});
    }
    return(
      <TouchableOpacity
        style={item.seen ? styles.notificationCardSeen : styles.notificationCardUnseen}
        onPress={() => { this.props.onPressNotif(item) }}
      >
        <Text numberOfLines={1} style={item.seen ? styles.notificationTitleSeen : styles.notificationTitleUnseen}>
          {item.title}
        </Text>
        <Text numberOfLines={2} style={item.seen ? styles.notificationBodySeen : styles.notificationBodyUnseen}>
          {item.body}
        </Text>
        <Text note>{createdAt}</Text>
      </TouchableOpacity>
    );
  }

  buildListItems() {
    //add key for FlatList
    items = this.props.notifications.map(notif => {
      if (!notif.data.post) {
        return;
      }
      notif.key = notif._id;
      return notif;
    });
    return items;
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
        <Container style={[defaultStyles.backgroundTheme, {"flex-wrap": "wrap-reverse"}]}>
          <FlatList 
            data={this.buildListItems()}
            renderItem={this.renderListItem}
            refreshing={false}
            onRefresh={this.props.refreshNotifications}/>
        </Container>
      );
    }
  }
}
