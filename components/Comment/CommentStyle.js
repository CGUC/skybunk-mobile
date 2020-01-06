import { StyleSheet, Dimensions } from "react-native";
const { height, width } = Dimensions.get('window');
import defaultStyles from'../../styles/styles'

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
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb'
  },
  profilePicThumbnail: {
    borderWidth: 0,
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
    paddingLeft: 5,
    fontSize: 16,
    flex: 1
  },
  editButtonsContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'bottom',
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
    ...defaultStyles.primaryColor
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
  },
  icon: {
		width: 25,
		height: 25,
		marginRight: 0,
		paddingRight: 0
  },
  iconContainer: {
		flexDirection: 'column',
    padding: 5,
    flex: 0
  },
  likesDialog: {
		fontSize: 12,
		paddingBottom: 3,
		flex: 1,
    textAlignVertical: 'bottom',
    alignSelf: 'center'
  },
  
  likedList: {
		padding: 20,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
	},
	likedListIcon: {
		width: 25,
		height: 25,
		marginBottom: 10,
		alignSelf: 'center'
	},
	line: {
		width: '100%',
		borderBottomWidth: 1,
		borderBottomColor: '#C0C0C0',
		paddingLeft: 20,
		paddingRight: 20
	},
	likedListItem: {
		padding: 5
	}
}));
