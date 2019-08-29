import { StyleSheet, Dimensions } from "react-native";
const { height, width } = Dimensions.get('window');

export default (styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    marginTop: 5,
  },
  icon: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  }
}));
