angular.module('mean.system')
  .factory('TokenInjector', ['$window', ($window) => ({
    request(config) {
      if ($window.localStorage.token) {
        config.headers['x-access-token'] = $window.localStorage.token;
      }
      return config;
    }
  })]);
