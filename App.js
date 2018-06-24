import { createStackNavigator, createSwitchNavigator } from 'react-navigation';
import LoginView from './views/login';
import TestView from './views/test';
import ChannelView from './views/Channel';

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

const AppStack = createStackNavigator(
  {
    Test: TestView,
    Channel: ChannelView,
  }
)

export default createSwitchNavigator(
  {
    Auth: LoginView,
    App: AppStack,
  },
  { initialRouteName: 'App' }
)