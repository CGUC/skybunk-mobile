import { StyleSheet, Dimensions } from "react-native";
const { height, width } = Dimensions.get('window');
import defaultStyles from '../../../styles/styles';

export default (styles = StyleSheet.create({
	card: {
    width: '100%',
    maxHeight: 300,
	},
  questionText: {
		marginBottom: 5,
  },
  optionView: {
    marginTop: 5,
		justifyContent: 'flex-start',
  },
  optionInfo: {
    marginTop: 5,
    flexDirection: 'row',
		alignItems: 'flex-start',
  },
  optionText: {
		flex: 1,
		flexWrap: 'wrap',
		fontSize: 14,
  },
  optionCount: {
    marginLeft: 10,
    maxWidth: 50,
		fontSize: 14,
  },
	progressbar: {
		width: '100%',
    marginTop: 5,
	},
  moreContentText: {
		marginTop: 5,
		marginBottom: 5,
		fontSize: 12,
		color: '#808b96'
  },
  button: {
    margin: 5,
    height: 40,
		alignSelf: 'center',
    ...defaultStyles.primaryColor
  },
}));
