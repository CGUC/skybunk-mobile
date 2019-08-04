import { StyleSheet, Dimensions } from "react-native";
const { height, width } = Dimensions.get('window');
import defaultStyles from '../../styles/styles';

export default (styles = StyleSheet.create({
	card: {
    width: width-10,
    height: 200,
    backgroundColor: '#FFFFFF',
    paddingTop: 5,
    borderRadius: 4,
    borderWidth: 0.8,
    borderColor: '#d6d7da',
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
	},
  questionText: {
    marginLeft: 5,
    marginRight: 5,
  },
  options: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  hiddenContentText: {
    marginTop: 2,
    marginLeft: 5,
  },
  button: {
    margin: 5,
    height: 40,
    ...defaultStyles.primaryColor
  },
}));
