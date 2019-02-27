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
  backgroundTheme: {
    backgroundColor: "#e4e3eb"
  }
}));
