import React from "react";
import { Text, View, Image, TouchableHighlight, AsyncStorage } from "react-native";
import { ImagePicker } from 'expo';
import styles from "../styles/styles";
import ApiClient from '../ApiClient';

export default class ProfileHeader extends React.Component {
	static navigationOptions = { header: null };

	constructor(props) {
    super(props);
    this.state = {
    	token: null,
    	user: {
    		profilePicture: null,
    	},
  	};
  }

  componentDidMount() {
  	AsyncStorage.getItem('@Skybunk:token').then(value => {
  		this.setState({
  			token: value,
  		})
  		ApiClient.get('/users/loggedInUser', { 'Authorization': 'Bearer ' + value}).then(user => {
	    	this.setState({
	    		user: user,
	    	});	
  		})
    }).catch(error => {
    	this.props.navigation.navigate('Auth');
    });
  }

  render() {
  	const defaultImage = <Image style={styles.profilePicture} source={require('../assets/default-user.png')} />;
  	const userImage = 
  		<Image 
  			style={styles.profilePicture} 
  			source={{ uri: `data:image/png;base64,` }} 
  		/>;

    return (
      <View style={styles.profileHeader}>
        <Text style={styles.profileText}>⚙</Text>
        <TouchableHighlight onPress={this.pickImage}>
        	{this.state.user ? userImage : defaultImage}
        </TouchableHighlight>
        <Text style={styles.profileText}>?</Text>
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

    let user = this.state.user;
    user.profilePicture = result.base64;
    ApiClient.put(`/users/${this.state.user._id}`, 
    	{ 'Authorization': 'Bearer ' + this.state.token },
    	{ ...user }
    )
    .catch(err => {
    	console.log(err);
    });
  };
}
