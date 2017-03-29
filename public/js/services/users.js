angular.module('mean.system')
   .factory('Users', ['$http', ($http) => {
     let numberOfUsersInvited = 0;
     let usersToInvite = [];


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


     const sendInvites = () => new Promise((resolve, reject) => {
       const gameUrl = encodeURIComponent(window.location.href);
       const postData = {
         url: gameUrl,
         users: usersToInvite,
       };
       $http.post('/users/sendinvite', postData)
          .then((response) => {
            numberOfUsersInvited += response.data.length;
            const listlen = response.data.length;
            const msg = `Invites sent to ${listlen}. You can add ${11 - listlen} users`;
            resolve({ msg, numberOfUsersInvited });
          })
          .catch((error) => {
            reject('Error sending invites ', error);
          });
     });

     const addToInviteList = user => new Promise((resolve) => {
       if (usersToInvite.indexOf(user) === -1) {
         usersToInvite.push(user);
         resolve(usersToInvite.length);
       } else {
         const userindex = usersToInvite.indexOf(user);
         usersToInvite.splice(userindex, 1);
         resolve(usersToInvite.length);
       }
     });

     const resetInviteList = () => {
       usersToInvite = [];
       return usersToInvite;
     };


     return {
       usersToInvite,
       findUsers,
       sendInvites,
       addToInviteList,
       resetInviteList,
       signup,
       signin
     };
   }]);
