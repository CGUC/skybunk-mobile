import { StyleSheet, Dimensions } from "react-native";
const { height, width } = Dimensions.get('window');

export default (styles = StyleSheet.create({
  profilePicThumbnail: {
    borderWidth: 1,
    borderColor: "#71d3d1",
    marginRight: 5,
  },
  text: {
  	paddingLeft: 5, 
  	width: width * 0.8,
  }
}));
