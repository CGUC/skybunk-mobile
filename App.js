import { createStackNavigator, createSwitchNavigator } from 'react-navigation';
import LoginView from './views/Login';
import HomeView from './views/Home';
import FeedView from './views/Feed';
import CommentsView from './views/Comments';
import SplashScreen from './views/Splash';
import SettingsView from './views/Settings';

const AppStack = createStackNavigator(
  {
    Home: HomeView,
    Feed: FeedView,
    Comments: CommentsView,
    Settings: SettingsView,
  }
)

export default createSwitchNavigator(
  {
    Splash: SplashScreen,
    Auth: LoginView,
    App: AppStack
  },
  { initialRouteName: 'Splash' }
)
