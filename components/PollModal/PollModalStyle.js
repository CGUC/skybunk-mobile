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
    height: 420,
    backgroundColor: '#DDDDDD',
  },
  topViews: {
    width: width,
    height: 320,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  questionText: {
    height: 24,
    marginTop: 5,
    marginLeft: 5,
  },
  textBox: {
    width: width-10,
    height: 80,
    backgroundColor: '#FFFFFF',
    paddingTop: 5,
    borderRadius: 4,
    borderWidth: 0.8,
    borderColor: '#d6d7da',
    marginLeft: 5,
    marginRight: 5,
  },
  options: {
    width: width-10,
    height: 28,
    flexDirection: 'row',
    marginLeft: 5,
    marginTop: 5,
  },
  optionGroup: {
    width: width-10,
    height: 24,
    marginLeft: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  icon: {
    width: 24,
    height: 24,
    textAlign: 'center',
  },
  optionText: {
    flexGrow: 1,
    height: 20,
    marginLeft: 5,
  },
  buttonGroup: {
    height: 100,
    marginBottom: 5,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  button: {
    marginTop: 5,
    height: 40,
    marginLeft: 5,
    marginRight: 5,
    ...defaultStyles.primaryColor
  },
  gestureRecognizer: {
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
  }
}));
