# Skybunk

The mobile application for Conrad Grebel students and staff to stay connected.

## The stack
This app is built with [React-Native](https://facebook.github.io/react-native/). React native apps are written with Javascript but compiled to mobile platforms native languages such as swift/objective-c/Java so the app performs as if it were written in these languages. React Native is very similar to React for the web, so if you know one it's easy to pick up the other.

This app communicates with our [server](https://github.com/cguc/skybunk-server) via HTTP requests. The API is documented _nowhere yet_

## To set up dev environment:
1. Install [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) if you don't already have it.
1a. If you are new to git, you can start out with the [UI version](https://desktop.github.com/) instead of using the command line. However, the UI has limited functionality and you will have to eventually learn the command line interface.
2. Install [node](https://nodejs.org/en/)
3. Install [Expo CLI](https://expo.io/tools#cli)
3. Clone this repository with `git clone http://github.com/cguc/skybunk-mobile.git`
4. cd into the folder and run `npm install`

#### To test the app
1. Install [expo](https://expo.io/) on your mobile device via your app store
2. run `expo start`
3. Scan the barcode with expo (android only) or text/email the link to your phone

#### Testing the app on eduroam
1. Download and install the [Expo development environment (XDE)](https://github.com/expo/xde) (NOTE: You must be logged into the same account on the app and the XDE)
2. Open XDE and select 'Open existing project...'
3. Select the root folder of the Skybunk client repo
4. Once the app builds, click either 'Share' or 'Device' to open the app on your smartphone

## Architecture
Full views are placed in `views` folder, reusable components are placed in `components` folder. The entry point is `App.js` and we are using [react-navigation](https://reactnavigation.org/) to handle app flow (navigation)
___

This project was bootstrapped with [Create React Native App](https://github.com/react-community/create-react-native-app). Here is a [guide](https://github.com/react-community/create-react-native-app/blob/master/react-native-scripts/template/README.md) of common tasks for a CRNA project
