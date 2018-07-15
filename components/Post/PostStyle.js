import { StyleSheet } from "react-native";

export default (styles = StyleSheet.create({
	profilePicThumbnail: {
		borderWidth: 2,
		borderColor: "#71d3d1"
	},
	card: {
		flex: 0,
		elevation: 0,
		marginTop: 0,
		marginBottom: 4,
	},
	postContent: {
		marginTop: 0,
		marginBottom: 0,
		paddingTop: 0,
		paddingBottom: 0,
	},
	postFooter: {
		marginTop: 3,
		marginBottom: 3
	},
	iconContainer: {
		flexDirection: 'row',
		marginRight: 20
	},
	icon: {
		width: 25,
		height: 25,
		marginRight: 0,
		paddingRight: 0
	},
	moreIconContainer: {
		marginRight: 5,
		marginLeft: 5,
		marginTop: 10,
		marginBottom: 10
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
	authorDetails: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		flexWrap: 'wrap'
	},
	headerRight: {
		alignSelf: 'flex-start',
		paddingTop: 6
	}
}));
