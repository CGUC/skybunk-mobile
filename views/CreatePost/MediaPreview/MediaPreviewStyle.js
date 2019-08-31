import { StyleSheet, Dimensions } from "react-native";
const { height, width } = Dimensions.get('window');

export default (styles = StyleSheet.create({
  view: {
    alignSelf: 'center',
    borderColor: '#d6d7da',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10
  },
  pollView: {
    width: width- 10
  },
  image: {
    width: 300,
    height: 300,
    alignSelf: 'center'
  }
}));
