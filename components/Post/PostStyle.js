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
 		width:25,
 		height:25,
 		marginRight: 0,
 		paddingRight: 0
 	}
}));
