angular.module('mean.system')
.factory('dashboard', ['$http', ($http) => {
  const getDonations = $http.get('/api/donations');
  const getGames = $http.get('/api/leaderboard');
  const getGameLog = $http.get('/api/games/history');

  return {
    getDonations,
    getGames,
    getGameLog
  };
}]);
