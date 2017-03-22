angular.module('mean.system')
   .factory('Users', ['$http', ($http) => {
     this.signupErrMsg = '';
     this.signinErrMsg = '';

     return {
       signup: (name, email, password) => new Promise((resolve, reject) => {
         const newuser = { name, email, password };
         $http.post('/api/auth/signup', newuser)
           .success((response) => {
             resolve(response);
           })
           .error((error) => {
             this.signupErrMsg = error.message;
             reject('Error sending invites ', this.signupErrMsg);
           });
       }),

       signin: (email, password) => new Promise((resolve, reject) => {
         const user = { email, password };
         $http.post('/api/auth/signin', user)
           .success((response) => {
             resolve(response);
           })
           .error((error) => {
             reject(error);
           });
       }),

     };
   }]);
