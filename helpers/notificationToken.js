import { Permissions, Notifications } from 'expo';
import ApiClient from '../ApiClient';

module.exports = {
  registerForPushNotificationsAsync: async function (user) {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return null;
    }


    // Get the token that uniquely identifies this device
    Notifications.getExpoPushTokenAsync().then(token => {
      if (token) {
        ApiClient.post(
          `/users/${user._id}/notificationToken`,
          {notificationToken: token},
          {authorized: true}
        )
        .then(response => {})
        .catch(err => console.error(err));
      }
      else {
        console.error('Error getting notification token!');
      }
    })
    .catch(err => console.error(err));
  }
}