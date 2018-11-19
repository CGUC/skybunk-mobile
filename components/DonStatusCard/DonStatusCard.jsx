import React from 'react';
import { View, TouchableOpacity, Switch, AsyncStorage} from 'react-native';
import Image from 'react-native-scalable-image';
import {Card, CardItem, Text, Thumbnail, Item, Input } from 'native-base';
import _ from 'lodash';
import { Font } from "expo";
import ApiClient from '../../ApiClient';
import styles from "./DonStatusCardStyle";

export default class DonStatusCard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      profilePicture: null,
      isOn: props.don.donInfo.isOn,
      isLateSupper: props.don.donInfo.isOnLateSupper,
      save: props.save
    }
  }

  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    ApiClient.get(`/users/${this.props.don._id}/profilePicture`, {}).then(pic => {
      this.setState({
        profilePicture: pic,
      });
    }).catch(error => {
      console.log(error);
    });
  }

  saveState = async () => {
    console.log('Trying to save')
    //late supper
    var don = this.props.don;
    var donInfo = this.props.don.donInfo;
    donInfo.isOn = this.state.isOn;
    donInfo.isOnLateSupper = this.state.isLateSupper;
    //status
    //location
    //clocked

    try {
      let token = await AsyncStorage.getItem('@Skybunk:token');
      console.log(`/users/${don._id}`)
      let result = await ApiClient.post(`/users/${don._id}/password`,  { 'Authorization': 'Bearer ' + token }, {password: "test"});
    } catch (err) {
      alert('Error updating don information. Sorry about that!');
      console.error(err);
    }
  }

  handleToggleOn = () =>{
  this.setState(state => ({
    isOn: !state.isOn,
    save: true
  }))
  };

  handleToggleLateSupper = () =>{
    this.setState(state => ({
      isLateSupper: !state.isLateSupper,
      save: true
    }))
    };

  render() {
    const {don} = this.props

    // In case don account is deleted
    var donName;
    if (!don) donName = "Ghost";
    else donName = `${don.firstName} ${don.lastName}`;
    
    console.log(this.props.save)
    if(this.state.save) this.saveState();
    
    if(this.props.togglable){
      var icon = this.state.isLateSupper ? require('../../assets/fork-knife-on.png') : require('../../assets/fork-knife-off.png')
    }else{
      var icon = (this.state.isLateSupper && this.state.isOn) ? require('../../assets/fork-knife-on.png') : null
    }
    return (
      <View>
        <Card style={styles.card}>
          <CardItem>
            <View style={styles.headerContainer}>
              <View style={styles.headerLeft}>
                <View>
                  <TouchableOpacity onPress={() => showUserProfile(don)}>
                    <Thumbnail
                      style={styles.profilePicThumbnail}
                      source={{ uri: `data:image/png;base64,${this.state.profilePicture}` }}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.headerBody}>
                  <View style={styles.donDetails}>
                    <Text>{donName}</Text>
                  </View>
                  <Text note>{don.phone}</Text>
                  {this.state.isOn ?<Text note>{don.donInfo.location}</Text>:null}
                </View>
              </View>

              <View style={styles.headerRight}>
                <TouchableOpacity onPress={this.handleToggleLateSupper}>
                  <Thumbnail medium square  source={icon} />
                </TouchableOpacity>
                <Switch value={this.state.isOn} disabled={!this.props.togglable} onValueChange={this.handleToggleOn}/>
              </View>
            </View>
          </CardItem>
          {this.props.editable ? 
            <CardItem>
              <View style={styles.formElement}>
                <Text style={styles.fieldHeader}>
                  Location
                </Text>
                <Item regular style={styles.inputItem}>
                  <Input
                    placeholder={'Enter your location'}
                    value={don.donInfo.location}
                  />
                </Item>
              </View>
            </CardItem> 
          : null}
        </Card>
      </View>
    )
  }
}