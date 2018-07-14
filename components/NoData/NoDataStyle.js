import { StyleSheet } from "react-native";
import { Dimensions } from 'react-native';
const { height } = Dimensions.get('window');

export default (styles = StyleSheet.create({
	view: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: height / 3
  },
  text: {
    fontSize: 18,
    fontStyle: 'italic',
  }
}));
