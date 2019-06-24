import { StyleSheet, Dimensions } from "react-native";
const { height, width } = Dimensions.get('window');
import defaultStyles from '../../styles/styles';

export default (styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#00000050'
  },
  view: {
    width: width,
    height: 330,
    backgroundColor: '#DDDDDD',
  },
  gestureRecognizer: {
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
  }
}));
