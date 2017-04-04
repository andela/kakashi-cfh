/* eslint-disable no-undef */

describe('The game controller', () => {
  let $rootScope;
  let $scope;
  const game = {};
  let factory = {};

  beforeEach(() => {
    module('mean');
    inject(($injector) => {
      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();
      controller = $injector.get('$controller')('GameController', { $scope, game });
      factory = $injector.get('Users');
    });
  });

  describe('Some functions', () => {
    it('should return true', () => {
      expect(typeof $scope.findUsers).toEqual('function');
    });
  });

  describe('Some functions', () => {
    it('should return true', () => {
      expect(Array.isArray($scope.usersInvited)).toBeTruthy();
    });

    it('should return true', () => {
      expect(Array.isArray(factory.usersInvited)).toBeTruthy();
    });
  });
});
