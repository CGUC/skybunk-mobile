import { createStackNavigator, createSwitchNavigator } from 'react-navigation';
import LoginView from './views/Login';
import ChannelView from './views/Channel';
import HomeView from './views/Home';
//import PostView from './view/Post';

const AppStack = createStackNavigator(
  {
  	Home: HomeView,
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
