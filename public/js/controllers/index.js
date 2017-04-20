angular.module('mean.system')
.controller('IndexController', ['$scope', '$location', '$window', '$http',
  'Global', 'socket', 'game', 'AvatarService', 'Users',
  ($scope, $location, $window, $http, Global, socket, game,
    AvatarService, Users) => {
    $scope.global = Global;
    $scope.signupErrMsg = '';
    $scope.signinErrMsg = '';

    if ($window.localStorage.getItem('token')) {
      $scope.showOptions = false;
    } else {
      $scope.showOptions = true;
    }

    /**
     * @param {Object} data - user details token and id
     * @param {Srting} email - add user email to localStorage
     * @return {Null} no-return value
     */
    function storeUserAndRedirect(data, email) {
      window.localStorage.userid = data.userid;
      window.localStorage.setItem('token', data.token);
      window.localStorage.setItem('email', email);
      socket.emit('issignedin', data.userid);
      $location.path('/');
    }

    let userAvatar = null;
    $scope.getAvatar = (selectedAvatar) => {
      userAvatar = selectedAvatar;
    };

    $scope.signup = () => {
      Users.signup($scope.name, $scope.email, $scope.password, userAvatar)
      .then((response) => {
        const data = response.data;
        if (data.success) {
          storeUserAndRedirect(data, $scope.email);
        } else {
          $scope.signupErrMsg = data.message;
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
          storeUserAndRedirect(data, $scope.email);
        } else {
          $scope.signinErrMsg = data.message;
        }
      }, (err) => {
        $scope.showError();
        $scope.error = err;
      });
    };

    $scope.socialAuth = () => {
      if (!($scope.socialEmail) || !(userAvatar)) {
        return false;
      }
      const userDetails = {
        email: $scope.socialEmail,
        userAvatar,
      };
      Users.socialAuth(userDetails)
      .then((data) => {
        storeUserAndRedirect(data);
      });
    };

    $scope.logout = () => {
      socket.emit('issignedout', window.localStorage.getItem('userid'));
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('userid');
      window.localStorage.removeItem('email');
      window.localStorage.removeItem('avatar');
      window.localStorage.removeItem('username');
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
