import { StyleSheet } from "react-native";

export default (styles = StyleSheet.create({
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
    height: 150,
    backgroundColor: "#00ff99",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  profilePicture: {
    alignSelf: "center",
    width: 100,
    height: 100,
    borderRadius: 50
  },
  profileText: {
    padding: 50,
    fontSize: 30,
    color: "#ffffff",
    fontFamily: "Roboto"
  },
  channelCard: {
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    // borderWidth: 1,
    // borderColor: "#000",
    // borderRadius: 5,
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5
  },
  channelText: {
    fontSize: 25
  }
}));
