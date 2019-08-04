import { StyleSheet, Dimensions } from "react-native";
const { height, width } = Dimensions.get('window');

export default (styles = StyleSheet.create({
  view: {
    margin: 5,
  },
  info: {
    flexDirection: 'row',
  },
  button: {
    width: 24,
    height: 24,
    margin: 2,
  },
  text: {
    flexGrow: 1,
  },
  count: {
    marginLeft: 10,
  }
}));
