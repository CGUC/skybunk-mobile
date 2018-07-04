import React from 'react';
import { ScrollView } from 'react-native';
import ProfileHeader from "../components/ProfileHeader";
import UserChannels from "../components/UserChannels";

export default class HomeView extends React.Component {
  render() {
    return (
      <ScrollView>
        <ProfileHeader />
        <UserChannels />
      </ScrollView>
    );
  }
}
