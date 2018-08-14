import { Dimensions, StyleSheet } from "react-native";

export default (styles = StyleSheet.create({
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  profilePicThumbnail: {
		borderWidth: 2,
		borderColor: "#71d3d1"
  },
  userName: {
    marginLeft: 20
  }
}))