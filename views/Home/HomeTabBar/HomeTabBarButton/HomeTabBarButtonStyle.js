import { StyleSheet } from "react-native";

export default (styles = StyleSheet.create({
	buttonUnselected: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor:'#71d3d1'
  },
  buttonSelected: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor:'#408785'
  },
  text: {
    color: 'white'
  },
  notice: {
    backgroundColor: 'red',
    position: 'absolute',
    marginLeft: -4,
    alignSelf: 'flex-start',
    width: 8,
    height: 8,
    borderRadius: 4,
  }
}));
