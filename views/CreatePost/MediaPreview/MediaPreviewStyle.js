import { StyleSheet, Dimensions } from "react-native";
const { height, width } = Dimensions.get('window');

export default (styles = StyleSheet.create({
  view: {
    alignSelf: 'center',
  },
  image: {
    marginTop: 5,
    width: 300,
    height: 300,
    alignSelf: 'center'
  }
}));
