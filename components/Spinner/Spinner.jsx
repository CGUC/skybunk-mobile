import React from 'react';
import { Image } from 'react-native';
import styles from './SpinnerStyle';

export default class Spinner extends React.Component {
  render() {
	var imageStyle = styles.mediumImage;
	if(this.props.size === "small"){
		imageStyle = styles.smallImage;
	}
	var colorStyle;
	if(this.props.color){
		colorStyle= {tintColor: this.props.color}
	}

    return (
		<Image 
			source={require('../../assets/spinner.gif')} 
			style={[
				imageStyle, 
				colorStyle,
				this.props.style
			]}
		/>
    );
  }
}