angular.module('mean.system')
.factory('dashboard', ['$http', ($http) => {
  const getDonations = $http.get('/api/donations');
  const getGames = $http.get('/api/leaderboard');

  return {
    getDonations,
    getGames
  };
}]);
