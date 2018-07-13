import { StyleSheet } from "react-native";

export default (styles = StyleSheet.create({
  loginLogo: {
    width: 300,
    height: 200,
    marginTop: 20,
    marginBottom: 20,
  },
  loginInputGroup: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  loginButtonsGroup: {
    flex:0.4,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  loginButton: {
    width: 300,
    backgroundColor: "#71d3d1",
  },
  loginTitle: {
    fontSize: 30,
    color: 'white',
    marginBottom: 10,
    fontFamily: "Roboto",
  },
  inputItem: {
    backgroundColor: "white",
    marginBottom: 10,
    width: 300,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  paragraph: {
    margin: 24,
    marginTop: 0,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: "#34495e"
  },
  navbar: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  profileHeader: {
    alignSelf: "stretch",
    height: 180,
    backgroundColor: "#71d3d1",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    elevation: 5,
  },
  profilePicture: {
    alignSelf: "center",
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#fc4970',
    borderWidth: 2,
  },
  profileNameText: {
    color: "#ffffff",
    fontFamily: "Roboto",
    fontSize: 20,
    textAlign: 'center'
  },
  profileText: {
    padding: 50,
    fontSize: 30,
    color: "#ffffff",
    fontFamily: "Roboto"
  },
  channelCard: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "stretch",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: '#CCCCCC',
    borderBottomWidth: 1,
    height: 50,
    paddingLeft: 5,
  },
  channelListButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10,
  },
  channelText: {
    fontSize: 20,
    textAlign:'left',
  },
  notificationBell: {
    width: 60,
    height: 60,
  },
  rightArrow: {
    width: 50,
    height: 50,
  },
  settingsIcon: {
    width: 50,
    height: 50,
  },
  helpIcon: {
    width: 50,
    height: 50,
  },
  profilePicThumbnail: {
    borderWidth: 2,
    borderColor: "#71d3d1"
  },
  profilePicThumbnailComment: {
    borderWidth: 1,
    borderColor: "#71d3d1",
    marginRight: 5,
  }
}));
