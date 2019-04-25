import { StyleSheet } from "react-native";

export default (StyleSheet.create({
	contentContainer: {
		flex: 1,
		justifyContent:'center',
	},
	markAllSeen: {
		flex: 1,
		flexDirection: 'row',
		padding: 20,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FFF',
		borderBottomColor: '#CCCCCC',
    borderBottomWidth: 1,
		marginBottom: 1
	},
	markAllSeenText: {
		marginLeft: 6,
		fontWeight: 'bold',
		fontSize: 18
	},
	settingsIcon: {
		width: 50,
		height: 50,
	  },
}));
