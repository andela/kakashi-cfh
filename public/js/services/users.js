angular.module('mean.system')
    .factory('Users', ['$http', ($http) => {
      let usersToInvite = [];

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
              resolve(response.data);
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
        resetInviteList
      };
    }]);
