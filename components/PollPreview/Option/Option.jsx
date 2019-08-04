import React from 'react';
import { View, Text } from 'react-native';
import ProgressBar from 'react-native-progress-bar-classic';
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
		<View style={styles.view}>
      <View style={styles.info}>
			  <Text numberOfLines={1} style={styles.text}>{props.text}</Text>
			  <Text style={styles.count}>{countText}</Text>
      </View>
      <ProgressBar progress={props.count / props.total * 100} />
		</View>
	);
}