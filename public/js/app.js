angular.module('mean', ['ngCookies', 'ngSanitize', 'ngResource', 'ngRoute',
  'ui.bootstrap', 'ui.route', 'mean.system', 'mean.directives', 'toastr'])
  .config(['$routeProvider',
    function mean($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'views/index.html'
        })
        .when('/app', {
          templateUrl: '/views/app.html',
        })
        .when('/privacy', {
          templateUrl: '/views/privacy.html',
        })
        .when('/bottom', {
          templateUrl: '/views/bottom.html'
        })
        .when('/signin', {
          templateUrl: '/views/signin.html'
        })
        .when('/signup', {
          templateUrl: '/views/signup.html'
        })
        .when('/choose-avatar', {
          templateUrl: '/views/choose-avatar.html'
        })
        .when('/player-dashboard', {
          templateUrl: '/views/player-dashboard.html'
        })
        .when('/welcome', {
        })
        .otherwise({
          redirectTo: '/'
        });
    }
  ]).config(['$locationProvider', '$httpProvider',
    ($locationProvider, $httpProvider) => {
      $locationProvider.hashPrefix('!');
      $httpProvider.interceptors.push('TokenInjector');
    }
  ]).run(['$rootScope', ($rootScope) => {
    $rootScope.safeApply = function safeApply(fn) {
      const phase = this.$root.$$phase;
      if (phase === '$apply' || phase === '$digest') {
        if (fn && (typeof (fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };
  }])
  .run(['DonationService', (DonationService) => {
    window.userDonationCb = (donationObject) => {
      DonationService.userDonated(donationObject);
    };
  }])
  .run(['$rootScope', 'UserDetails', '$location', 'socket',
    ($rootScope, UserDetails, $location, socket) => {
      $rootScope.$on('$routeChangeStart', (event, next) => {
        if (next.$$route.originalPath === '/welcome') {
          UserDetails.socialSignin()
          .then((response) => {
            const data = response.data;
            window.localStorage.userid = data.userid;
            window.localStorage.setItem('token', data.token);
            window.localStorage.setItem('email', data.email);
            window.localStorage.setItem('username', data.username);
            window.localStorage.setItem('avatar', data.avatar);
            socket.emit('issignedin', data.userid);
            $location.path('/');
          });
        }
      });
    }]);

angular.module('mean.system', []);
angular.module('mean.directives', []);
