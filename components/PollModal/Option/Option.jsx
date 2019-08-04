import React from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import RadioButton from '../../RadioButton/RadioButton';
import styles from './OptionStyle';

export default function(props) {
  var countText;
  if (props.selected) {
    if (props.count > 1) {
      countText = `You + ${props.count - 1} others`
    } else {
      countText = 'You'
    }
  } else {
    countText = `${props.count}`
  }

	return (
		<TouchableHighlight style={styles.view} onPress={props.onPress} onLongPress={props.onLongPress}>
      <View>
        <RadioButton selected={props.selected} style={styles.button} />
			  <Text style={styles.text}>{props.text}</Text>
			  <Text style={styles.count}>{countText}</Text>
      </View>
		</TouchableHighlight>
	);
}