import { StyleSheet, Dimensions } from "react-native";
const { height, width } = Dimensions.get('window');

export default (styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    marginLeft: 5,
    marginTop: 2,
  },
  icon: {
    marginRight: 5,
  },
  image: {
    marginTop: 5,
    height:20,
    width:20,
  }
}));
