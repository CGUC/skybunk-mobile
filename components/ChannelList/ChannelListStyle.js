import { StyleSheet } from "react-native";

export default (styles = StyleSheet.create({
  channelCard: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "stretch",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: '#CCCCCC',
    borderBottomWidth: 1,
    height: 50,
    paddingLeft: 5,
  },
  channelListButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10,
  },
  channelText: {
    fontSize: 20,
    textAlign:'left',
  },
  notificationBell: {
    width: 60,
    height: 60,
  },
  rightArrow: {
    width: 50,
    height: 50,
  },
}));
