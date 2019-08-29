import Constants from 'expo-constants';
let authServerAddress = 'https://skybunk-auth-dev.herokuapp.com';

if (Constants.manifest.releaseChannel === 'stpauls-demo') {
  authServerAddress = 'https://skybunk-auth-production.herokuapp.com';
}

module.exports = {
  AUTH_ADDRESS: authServerAddress,
  VERSION: '6.1.0'
}
