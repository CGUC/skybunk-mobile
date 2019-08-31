// import Constants from 'expo-constants';
let authServerAddress = 'https://skybunk-auth-production.herokuapp.com';

// TODO: Please change the above link to dev and update any necessary release channels below when ready
// if (Constants.manifest.releaseChannel === 'stpauls-demo') {
//   authServerAddress = 'https://skybunk-auth-production.herokuapp.com';
// }

module.exports = {
  AUTH_ADDRESS: authServerAddress,
  VERSION: '6.1.0'
}
