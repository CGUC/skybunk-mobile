import { StyleSheet } from "react-native";

export default (styles = StyleSheet.create({
	buttonUnselected: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor:'#C1464E'
  },
  buttonSelected: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor:'#943036',

  },
  text: {
    color: 'white'
  },
  notice: {
    backgroundColor: 'red',
    position: 'absolute',
    marginLeft: -4,
    alignSelf: 'center',
  },
  image: {
    height:40,
    width: 40
  }
}));
