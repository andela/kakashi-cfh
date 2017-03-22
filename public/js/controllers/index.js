angular.module('mean.system')
.controller('IndexController', ['$scope', '$location', '$window', '$http', 'Global', 'socket', 'game', 'AvatarService', 'Users',
  ($scope, $location, $window, $http, Global, socket, game, AvatarService, Users) => {
    $scope.global = Global;
    $scope.signupErrMsg = '';
    $scope.signinErrMsg = '';

    if ($window.localStorage.getItem('token')) {
      $scope.showOptions = false;
    } else {
      $scope.showOptions = true;
    }

    $scope.signup = () => {
      Users.signup($scope.name, $scope.email, $scope.password).then((response) => {
        if (response.success) {
          $window.localStorage.setItem('token', response.token);
          $location.path('/');
        } else {
          $scope.signupErrMsg = response.message;
        }
      }, (err) => {
        $scope.showError();
        $scope.error = err;
      });
    };

    $scope.signin = () => {
      // return console.log($scope.email, $scope.password);
      Users.signin($scope.email, $scope.password).then((response) => {
        if (response.success) {
          $window.localStorage.setItem('token', response.token);
          $location.path('/');
        } else {
          $scope.signinErrMsg = response.message;
        }
      }, (err) => {
        $scope.showError();
        $scope.error = err;
      });
    };

    $scope.logout = () => {
      $window.localStorage.removeItem('token');
      $scope.showOptions = true;
      $location.path('/');
    };

    $scope.playAsGuest = () => {
      game.joinGame();
      $location.path('/app');
    };

    $scope.showError = () => {
      if ($location.search().error) {
        return $location.search().error;
      }
    };

    $scope.avatars = [];
    AvatarService.getAvatars()
      .then((data) => {
        $scope.avatars = data;
      });
  }]);
