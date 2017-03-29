describe('The game controller', () => {
  let $rootScope;
  let $scope;
  let controller;
  let game = {};
  let Users = {};

  beforeEach(() => {
    module('mean');
    inject(($injector) => {
      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();
      controller = $injector.get('$controller')('GameController', { $scope, game, Users });
    });
  });

  describe('Some functions', () => {
    it('should return true', () => {
      expect(typeof $scope.findUsers).toEqual('function');
    });
  });
});
