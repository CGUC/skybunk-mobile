import { Dimensions, StyleSheet } from "react-native";

const { height, width } = Dimensions.get('window');
export default (styles = StyleSheet.create({
  noMoreUsers: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  icon: {
    marginRight: 20,
    color: "white"
  },
}));