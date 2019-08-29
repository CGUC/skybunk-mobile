import React from 'react';
import { View, Image } from 'react-native';
import { Icon, Thumbnail } from 'native-base';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import Poll from '../../../components/Poll/Poll'
import styles from './MediaPreviewStyle';

export default class MediaPreview extends React.Component {
  constructor(props) {
    super(props);
    var existingText = props.existing;
    var existingPollData = props.existingPoll;


    this.state = {
      resourceText: existingText || "",
      isPoll: !!existingPollData,
      pollData: existingPollData || null
    };
  }

  render () {
	if(this.props.image){
		return (
			<View style={styles.view}>
				<Image source={{ uri: this.props.image }} style={styles.image}/>
			</View>
			);
	} else if(this.props.isPoll){
		return (
			<View style={[styles.view, styles.pollView]}>
				<Poll 
				  data={null}
          savePoll={this.props.updatePoll}
          loggedInUser={this.props.loggedInUser}
          isAuthor={true}/>
			</View>
			);
	} else{
		return null;
	}
  }
}
