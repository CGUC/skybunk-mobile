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
	},
	editButtonsContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#00000050'
  },
  view: {
    width: width,
    height: 100
  },
  editButton: {
    marginTop: 5,
    height: 40,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: '#71d3d1',
  },
  deleteButton: {
    marginTop: 5,
    height: 40,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: 'red',
  },
  imageContainer: {
  	flexDirection: 'row',
  	alignItems: 'center',
  	justifyContent: 'center'
  },
  image: {
  	borderWidth: 2,
  	borderColor: '#AAAAAA',
  }
}));
