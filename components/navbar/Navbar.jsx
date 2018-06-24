/**
 * Has header text giving contextual information (ie channel name), as well as navigation controls
 * (at the moment just a back button)
 */

import React from 'react';
import { View, Platform } from 'react-native';
import Navbar, { NavButton, NavButtonText, NavTitle } from 'react-native-nav';

export default class NavBar extends React.Component {
  render() {
    return (
      <NavBar>
        <NavigationButton onPress={() => alert("Going back!")}>
          <NavButtonText>
            {"Back"}
          </NavButtonText>
        </NavigationButton>
        <NavTitle>
          {"Channel Name"}
        </NavTitle>
        <NavButton onPress={() => alert("Saving subscription...")}>
          <NavButtonText>
            Sub Icon
          </NavButtonText>
        </NavButton>
      </NavBar>
    )
  }
}