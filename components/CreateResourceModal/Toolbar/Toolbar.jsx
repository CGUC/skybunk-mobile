import React from 'react';
import { View, TouchableOpacity, PixelRatio } from 'react-native';
import { Icon, Thumbnail } from 'native-base';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import styles from './ToolbarStyle';

export default function(props) { //TODO size should be 20, convert to dp somehow???
	return (
		<View style={styles.view}>
			<TouchableOpacity onPress={props.takeImage}>
				<Icon name="camera" style={styles.icon}/>
			</TouchableOpacity>
			<TouchableOpacity onPress={props.pickImage}>
		  	<Icon name="image" style={styles.icon}/>
		  </TouchableOpacity>
			<TouchableOpacity onPress={props.togglePoll}>
		  	<MaterialIcon name="poll" size={28} style={styles.icon}/>
		  </TouchableOpacity>
		  {props.image ? <Thumbnail square source={{ uri: props.image }} style={styles.image}/> : null }
		</View>
	);
}