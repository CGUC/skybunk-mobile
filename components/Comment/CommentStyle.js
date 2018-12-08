import { StyleSheet, Dimensions } from "react-native";
const { height, width } = Dimensions.get('window');

export default (styles = StyleSheet.create({
  card: {
    flex: 0,
    elevation: 0,
    marginTop: 0,
    marginBottom: 0,
    borderColor: 'rgba(0, 0, 0, 0.0)',
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
  },
  cardItem: {
    backgroundColor: 'rgba(42, 42, 42, 0.0)',
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb'
  },
  profilePicThumbnail: {
    borderWidth: 1,
    borderColor: "#71d3d1",
    marginRight: 5,
    marginTop: 5
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  textAuthor: {
    paddingLeft: 5,
    fontWeight: 'bold'
  },
  textContent: {
    paddingLeft: 5
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
    height: 100,
    flexDirection: 'column',
  	justifyContent: 'flex-end',
  	paddingBottom: 5
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
  title: {
    flexDirection: 'row',
  	justifyContent: 'space-between',
  	paddingBottom: 5
  }
}));
