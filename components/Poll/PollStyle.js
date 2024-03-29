import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  view: {
    width: '100%',
    paddingLeft: 5,
    paddingRight: 5,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  fillWidth: {
    width: '100%',
  },
  topCheckboxContainer: {
    backgroundColor: '#00000000',
    borderWidth: 0,
    borderColor: '#00000000',
    alignSelf: 'flex-end',
    paddingTop: 5,
    paddingBottom: 4,
    margin: 0,
  },
  topCheckbox: {
    width: 24,
    height: 24,
  },
  questionText: {
    height: 24,
    marginTop: 5,
    marginLeft: 5,
  },
  textBox: {
    width: '100%',
    height: 80,
    flexWrap: 'wrap',
    marginLeft: 5,
    marginRight: 5,
  },
  finalQuestion: {
    width: '100%',
    flexWrap: 'wrap',
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 7,
  },
  optionView: {
    width: '100%',
    flexDirection: 'row',
    marginLeft: 5,
    marginTop: 5,
    alignItems: 'flex-start',
  },
  optionButtonContainer: {
    backgroundColor: '#00000000',
    borderWidth: 0,
    borderColor: '#00000000',
    padding: 0,
    marginLeft: 2,
    marginTop: 2,
    marginBottom: 2,
    marginRight: 8,
  },
  optionButton: {
    width: 24,
    height: 24,
  },
  optionText: {
    flex: 1,
    flexWrap: 'wrap',
    marginTop: 4,
    marginBottom: 4,
    marginLeft: 2,
    marginRight: 2,
  },
  optionCount: {
    maxWidth: 80,
    height: 24,
    marginLeft: 2,
    marginRight: 5,
    marginTop: 2,
    marginBottom: 2,
    textAlign: 'right',
  },
  optionDeleteContainer: {
    width: 30,
    height: 28,
    paddingLeft: 3,
    paddingRight: 7,
    paddingTop: 1,
    paddingBottom: 6,
  },
  optionDelete: {
    width: 20,
    height: 21,
  },
  optionGroup: {
    width: '100%',
    height: 28,
    marginLeft: 5,
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addContainingView: {
    width: 29,
    height: 39,
    paddingLeft: 0,
    paddingTop: 5,
    paddingRight: 5,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  addView: {
    width: 24,
    height: 24,
  },
  addOptionText: {
    flex: 1,
    height: 20,
    marginTop: 7,
    marginBottom: 12,
  },
});
