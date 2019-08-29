let authServerAddress = 'https://skybunk-auth-dev.herokuapp.com';

if (process.env.NODE_ENV === 'production') {
  authServerAddress = 'https://skybunk-auth-production.herokuapp.com';
} else if (process.env.NODE_ENV === 'staging') {
  authServerAddress = 'https://skybunk-auth-staging.herokuapp.com';
}

module.exports = {
  AUTH_ADDRESS: authServerAddress,
  VERSION: '6.1.0'
}
