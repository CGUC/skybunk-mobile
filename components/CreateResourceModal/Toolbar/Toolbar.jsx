import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Icon, Thumbnail } from 'native-base';
import styles from './ToolbarStyle';

export default function(props) {
	return (
		<View style={styles.view}>
			<TouchableOpacity onPress={props.takeImage}>
				<Icon name="camera" style={styles.icon}/>
			</TouchableOpacity>
			<TouchableOpacity onPress={props.pickImage}>
		  		<Icon name="image" style={styles.icon}/>
		  	</TouchableOpacity>
		  	{props.image ? <Thumbnail square source={{ uri: props.image }} style={styles.image}/> : null }
		</View>
	);
}