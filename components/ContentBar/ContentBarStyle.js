import { Dimensions, StyleSheet } from "react-native";

const { height, width } = Dimensions.get('window');
export default (styles = StyleSheet.create({
	bar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: height/8,
    width: width,
  }
}));