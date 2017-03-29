angular.module('mean.system')
   .factory('Users', ['$http', ($http) => {

     return {
       signup: (name, email, password) => new Promise((resolve, reject) => {
         const newuser = { name, email, password };
         $http.post('/api/auth/signup', newuser)
           .success((response) => {
             resolve(response);
           })
           .error((error) => {
             reject(error);
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
