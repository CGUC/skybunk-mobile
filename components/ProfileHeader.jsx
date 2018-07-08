import React from "react";
import { Text, View, Image, TouchableHighlight, AsyncStorage } from "react-native";
import { Icon } from "native-base"
import { ImagePicker } from 'expo';
import styles from "../styles/styles";
import ApiClient from '../ApiClient';

export default class ProfileHeader extends React.Component {
	static navigationOptions = { header: null };

	constructor(props) {
    super(props);
    this.state = {
    	token: null,
    	user: null,
    	profilePicture: null,
  	};
  }

  componentWillMount() {
  	AsyncStorage.getItem('@Skybunk:token').then(value => {
  		this.setState({
  			token: value,
  		});
  		ApiClient.get('/users/loggedInUser', { 'Authorization': 'Bearer ' + value}).then(user => {
	    	this.setState({
	    		user: user,
	    	});
  			ApiClient.get(`/users/${user._id}/profilePicture`, {}).then(pic => {
  				this.setState({
	    			profilePicture: pic,
	    		});	
  			});
  		});
    }).catch(error => {
    	this.props.navigation.navigate('Auth');
    });
  }

  render() {  		
    return (
      <View style={styles.profileHeader}>
			<Icon name='star-half' style={styles.profileText}/>
			<TouchableHighlight onPress={this.pickImage}>
        	<Image 
  				style={styles.profilePicture} 
  				source={{ uri: `data:image/png;base64,${this.state.profilePicture}` }} 
  			/>
        </TouchableHighlight>
        <Icon name='cog' style={styles.profileText}/>
      </View>
    );
  }
  
  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      base64: true,
      aspect: [1, 1],
      quality: 0.2,
    });    

    if (!result.cancelled) {
	    ApiClient.uploadPhoto(
	    	`/users/${this.state.user._id}/profilePicture`, 
	    	{ 'Authorization': 'Bearer ' + this.state.token },
	    	result.uri,
	    	'profilePicture'
	    )
	    .then(pic => {
	    	this.setState({
	    		profilePicture: pic,
	    	});
	    })
	    .catch(err => {
	    	console.log(err);
	    });
	  }
	}
}
