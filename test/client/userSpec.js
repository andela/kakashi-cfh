describe('Users', () => {
  beforeEach(() => {
    module('ui.route');
    module('mean.system');
  });
  let $httpBackend, name, email, password, Users;
  const newuser = { name, email, password };
  const myResponse = {
    success: true,
    message: 'User successfully created',
    token: ''
  };
  const user = { email, password };


  beforeEach(inject((Users) => {
    $httpBackend = $injector.get('$httpBackend');
    Users = _Users_;
  }));

  afterEach(() => {
    httpBackend.verifyNoOutstandingExpectation();
  });

  it('should send the new user data to server', () => {
    $httpBackend.when('POST', '/api/auth/signup', (newuser) => {
    }).respond(200, '');

    Users.signup(newuser).then((response) => {
      expect(response).toBeTruthy();
      expect(response.success).toBe(myResponse.success);
      expect(response.message).toBe(myResponse.message);
      expect(response.token).toBe(myResponse.token);
    });
    $httpBackend.flush();

    it('should return a JSON when it runs', () => {
      $httpBackend.flush();
      Users.signup(newuser)
                .success((myResponse) => {
                  expect(myResponse).toBeObject();
                });
    });
  });
});
