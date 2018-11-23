import { StyleSheet, Dimensions } from "react-native";
const { height, width } = Dimensions.get('window');

export default (styles = StyleSheet.create({
	profilePicThumbnail: {
		borderWidth: 2,
		borderColor: "#71d3d1"
	},
	card: {
		flex: 1,
		elevation: 0,
		marginTop: 0,
		marginBottom: 4,
  },
  inputItem: {
		backgroundColor: "white",
    marginBottom: 10,
    height: 40,
		width: width * 0.9,
  },
  button: {
    marginTop: 5,
    height: 40,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: '#71d3d1',
  },
	headerContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
	},
	headerLeft: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
	},
	headerBody: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'flex-start',
		paddingLeft: 5,
		paddingRight: 5,
	},
	headerRight: {
    alignItems: 'center',
    flexDirection: 'row',
	},
}));
