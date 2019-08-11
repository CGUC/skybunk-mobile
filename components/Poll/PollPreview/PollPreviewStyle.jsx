import { StyleSheet, Dimensions } from "react-native";
const { height, width } = Dimensions.get('window');
import defaultStyles from '../../../styles/styles';

export default (styles = StyleSheet.create({
	card: {
    width: width-10,
    height: 300,
    backgroundColor: '#DDDDDD',
    margin: 5,
	},
  questionText: {
    width: width-10,
  },
  optionView: {
    width: width-10,
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
		justifyContent: 'flex-start',
  },
  optionInfo: {
    width: width-20,
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    flexDirection: 'row',
		alignItems: 'center',
  },
  optionText: {
		flex: 1,
		flexWrap: 'wrap',
  },
  optionCount: {
    marginLeft: 10,
    maxWidth: 50,
  },
	progressbar: {
		width: width-20,
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
	},
  moreContentText: {
    width: width-10,
		marginLeft: 5,
		marginTop: 5,
  },
  button: {
    margin: 5,
    height: 40,
		alignSelf: 'center',
    ...defaultStyles.primaryColor
  },
}));
