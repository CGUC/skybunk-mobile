import { StyleSheet, Dimensions } from "react-native";
const { height, width } = Dimensions.get('window');

export default (styles = StyleSheet.create({
  view: {
    width: width-10,
    height: 28,
    flexDirection: 'row',
    marginLeft: 5,
    marginTop: 5,
  },
  button: {
    width: 24,
    height: 24,
    margin: 2,
  },
  text: {
    flexGrow: 1,
    height: 24,
    margin: 2,
  },
  count: {
    width: 24,
    height: 24,
    margin: 2,
  }
}));
