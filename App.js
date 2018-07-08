import { createStackNavigator, createSwitchNavigator } from 'react-navigation';
import LoginView from './views/Login';
import HomeView from './views/Home';
import FeedView from './views/Feed';
import CommentsView from './views/Comments';

const AppStack = createStackNavigator(
  {
    Home: HomeView,
    Feed: FeedView,
    Comments: CommentsView,
  }
)

export default createSwitchNavigator(
  {
    Auth: LoginView,
    App: AppStack
  },
  { initialRouteName: 'Auth' }
)
