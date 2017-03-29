angular.module('mean.system')
   .factory('Users', ['$http', ($http) => {
     const usersInvited = [];

     const signup = (name, email, password) => new Promise((resolve, reject) => {
       const newuser = { name, email, password };
       $http.post('/api/auth/signup', newuser)
        .success((response) => {
          resolve(response);
        })
        .error((error) => {
          reject(error);
        });
     });

     const signin = (email, password) => new Promise((resolve, reject) => {
       const user = { email, password };
       $http.post('/api/auth/signin', user)
        .success((response) => {
          resolve(response);
        })
        .error((error) => {
          reject(error);
        });
     });

     const findUsers = () => new Promise((resolve, reject) => {
       $http.get('/api/search/users/').then((response) => {
         const users = response.data;
         resolve(users);
       }, () => {
         reject('failure');
       });
     });

     const sendInvite = email => new Promise((resolve, reject) => {
       const gameUrl = encodeURIComponent(window.location.href);
       const postData = {
         url: gameUrl,
         user: email,
       };
       $http.post('/users/sendinvite', postData)
          .then((response) => {
            if (usersInvited.indexOf(response.data) <= -1) {
              usersInvited.push(response.data);
            }
            const msg = `${response.data} Invite sent`;
            resolve({ msg, usersInvited });
          })
          .catch((error) => {
            reject('Error sending invites ', error);
          });
     });

     return {
       findUsers,
       signup,
       signin,
       sendInvite,
       usersInvited
     };
   }]);
