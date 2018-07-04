import { createStackNavigator, createSwitchNavigator } from 'react-navigation';
import LoginView from './views/Login';
import HomeView from './views/Home';
import FeedView from './views/Feed';

const AppStack = createStackNavigator(
  {
    Home: HomeView,
    Feed: FeedView,
  }
)

export default createSwitchNavigator(
  {
    Auth: LoginView,
    App: AppStack
  },
  { initialRouteName: 'Auth' }
)
