import React from 'react';
import { View, TouchableOpacity, Switch, AsyncStorage} from 'react-native';
import {Card, CardItem, Text, Thumbnail, Item, Input, Button } from 'native-base';
import DateTimePicker from 'react-native-modal-datetime-picker';
import _ from 'lodash';
import { Font} from "expo";
import ApiClient from '../../ApiClient';
import styles from "./DonStatusCardStyle";
import date from 'date-fns';

export default class DonStatusCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      profilePicture: null,
      isOn: props.don.donInfo.isOn,
      isLateSupper: props.don.donInfo.isOnLateSupper,
      changed: false,
      isDateTimePickerVisible: false,
      clockOut: props.don.donInfo.clockOut,
      location: props.don.donInfo.location,
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

  isChanged = () => {
    this.setState(state => ({changed: false}))

    if(this.props.togglable){
      //update all the fields
      var don = this.props.don;
      don.donInfo.isOn = this.state.isOn;
      don.donInfo.isOnLateSupper = this.state.isLateSupper;
      don.donInfo.clockOut = this.state.clockOut;
      don.donInfo.location = this.state.location

      //notify DonInfo page that something changed
      var onChange = this.props.onChange;
      onChange(don);
    }
  }

  handleToggleOn = () =>{
    if(this.props.togglable){
      //Set default time if the current clock out time is invalid
      //default time is 8:30am on the next weekday
      var nextClockOut = this.state.clockOut

      //check for valid time
      if(this.props.editable && (!date.isValid(new Date(this.state.clockOut))|| date.isPast(this.state.clockOut))){
        //set the time to 8:30, then find the next weekday
        nextClockOut = date.setHours(date.setMinutes(new Date(),30),8)
        if(date.isFriday(nextClockOut)){
          nextClockOut = date.addDays(nextClockOut, 3)
        }else if(date.isSaturday(nextClockOut)){
          nextClockOut = date.addDays(nextClockOut, 2)
        }else{
          nextClockOut = date.addDays(nextClockOut, 1)
        }
      }
      this.setState(state => ({
          isOn: !state.isOn,
          changed: true,
          clockOut: nextClockOut
        }))
    }
  };

  handleToggleLateSupper = () =>{
    if(this.props.togglable){
      this.setState(state => ({
        isLateSupper: !state.isLateSupper,
        changed: true
      }))
    }
  };

  showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
  hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false});
  handleDatePicked = (datetime) => {this.setState({ isDateTimePickerVisible: false, clockOut: datetime, changed: true })};

  handleUpdatedLocation = (text) => {this.setState({location: text, changed: true})}

  render() {
    const {don} = this.props

    //Entering the land of way-too-many-if-statements. You have been warned.

    // In case don account is deleted
    var donName;
    if (!don) donName = "Ghost Don";
    else donName = `${don.firstName} ${don.lastName}`;

    //Let DonInfo know if something has changed
    if(this.state.changed) this.isChanged();

    if(this.props.togglable){
      var icon = this.state.isLateSupper ? require('../../assets/fork-knife-on.png') : require('../../assets/fork-knife-off.png')
    }else{
      var icon = (this.state.isLateSupper && this.state.isOn) ? require('../../assets/fork-knife-on.png') : null
    }

    //Figure out what information should be displayed on the 2 lines of text beside the profile
    if(this.props.editable){
      if(this.state.isOn){
        var line1 = 'On until'
        if(!date.isValid(new Date(this.state.clockOut)) || date.isPast(this.state.clockOut)){
          var line2 = 'forever'
        }else if(date.isToday(this.state.clockOut)){
          var line2 = date.format(this.state.clockOut, 'h:mma');
        }else if(date.isTomorrow(this.state.clockOut)){
          var line2 = date.format(this.state.clockOut, '[Tomorrow at] h:mma');
        }else{
          var line2 = date.format(this.state.clockOut, 'ddd MMM Do [at] h:mma');
        }
      }else{
        var line1 = ''
      }
    }else{
      if(!don.info){
        var line1 = '';
      }else{
        var line1 = don.info.phone;
      }
      var line2 = don.donInfo.location
    }


    return (
      <View>
        <Card style={styles.card}>
          <CardItem>
            <View style={styles.headerContainer}>
              <View style={styles.headerLeft}>
                <View>
                  <TouchableOpacity onPress={() => this.props.onOpenProfile(don)}>
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
                  <Text note>{line1}</Text>
                  {this.state.isOn ?<Text note>{line2}</Text>:null}
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
                    value={this.state.location}
                    onChangeText={this.handleUpdatedLocation}
                  />
                </Item>
                <Button onPress={this.showDateTimePicker} style={styles.button}>
                  <Text>Change Clockout Time</Text>
                </Button>
                <DateTimePicker
                  isVisible={this.state.isDateTimePickerVisible}
                  date={new Date(this.state.clockOut)}
                  onConfirm={this.handleDatePicked}
                  onCancel={this.hideDateTimePicker}
                  mode={'datetime'}
                />
              </View>
            </CardItem>
          : null}
        </Card>
      </View>
    )
  }
}