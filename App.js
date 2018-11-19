import { createStackNavigator, createSwitchNavigator } from 'react-navigation';
import LoginView from './views/Login/Login';
import HomeView from './views/Home/Home';
import FeedView from './views/Feed/Feed';
import CommentsView from './views/Comments/Comments';
import SplashScreen from './views/Splash/Splash';
import SettingsView from './views/Settings/Settings';
import MemberListView from './views/MemberList/MemberList';
import DonInfoView from './views/DonInfo/DonInfo';
import EditProfileView from './views/EditProfile/EditProfile';

const AppStack = createStackNavigator(
  {
    Home: HomeView,
    Feed: FeedView,
    Comments: CommentsView,
    Settings: SettingsView,
    MemberList: MemberListView,
    DonInfo: DonInfoView,
    EditProfile: EditProfileView,
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
