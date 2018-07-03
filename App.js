import { createStackNavigator, createSwitchNavigator } from 'react-navigation';
import LoginView from './views/login';
import TestView from './views/test';
import ChannelView from './views/Channel';
//import PostView from './view/Post';

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
    //Post: PostView,
  },
  { initialRouteName: 'Auth' }
)