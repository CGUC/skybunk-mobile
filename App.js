import { createStackNavigator, createSwitchNavigator } from 'react-navigation';
import LoginView from './views/login';
import feedView from './views/feed';
import channelsView from './views/channels';
//import PostView from './view/Post';

const AppStack = createStackNavigator(
  {
    Channels: channelsView,
    Feed: feedView,
  }
)

export default createSwitchNavigator(
  {
    Auth: LoginView,
    App: AppStack
  },
  { initialRouteName: 'Auth' }
)
