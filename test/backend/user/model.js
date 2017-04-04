process.env.NODE_ENV = 'test';

require('../../../server');
const should = require('should');
const mongoose = require('mongoose');

const User = mongoose.model('User');

let user;

describe('<Unit Test>', () => {
  describe('Model User:', () => {
    before((done) => {
      user = new User({
        name: 'Full name',
        email: 'user@test.com',
        username: 'user',
        password: 'password'
      });

      done();
    });

    describe('Method Save', () => {
      it('should be able to save whithout problems', (done) => {
        user.save((err) => {
          should.not.exist(err);
          done();
        });
      });

      it('should be able to show an error when try to save witout name', (done) => {
        user.name = '';
        user.save((err) => {
          should.exist(err);
          done();
        });
      });
    });

    after((done) => {
      User.remove({}, () => {
        done();
      });
    });
  });
});
