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
        if (response.data.uccess) {
          $window.localStorage.setItem('token', response.data.token);
          $location.path('/');
        } else {
          $scope.signupErrMsg = response.data.message;
        }
      }, (err) => {
        $scope.showError();
        $scope.error = err;
      });
    };

    $scope.signin = () => {
      Users.signin($scope.email, $scope.password).then((response) => {
        const data = response.data;
        if (data.success) {
          window.user = {};
          window.user._id = data.userid;
          window.user._token = data.token;
          window.localStorage.userid = data.userid;
          window.localStorage.setItem('token', data.token);
          $location.path('/');
        } else {
          $scope.signinErrMsg = data.message;
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
