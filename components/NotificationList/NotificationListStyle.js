import { StyleSheet } from "react-native";

export default (styles = StyleSheet.create({
  notificationCardUnseen: {
    alignSelf: "stretch",
    justifyContent: "center",
    borderBottomColor: '#CCCCCC',
    borderBottomWidth: 1,
    padding: 10,
    backgroundColor: '#fff2f5',
  },
  notificationCardSeen: {
    alignSelf: "stretch",
    justifyContent: "center",
    borderBottomColor: '#CCCCCC',
    borderBottomWidth: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  notificationTitleSeen: {
    fontSize: 18,
    textAlign:'left',
  },
  notificationTitleUnseen: {
    fontSize: 18,
    textAlign:'left',
    fontWeight: 'bold',
  },
  notificationBodyUnseen: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  notificationBodySeen: {
    fontSize: 15,
  }
}));
