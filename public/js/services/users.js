angular.module('mean.system')
  .factory('Users', ['$http', '$window', 'socket', ($http, $window, socket) => {
    const usersInvited = [];
    const friendsAdded = [];
    const users = {
      signedInusers: []
    };

    (function currentUsers() {
      socket.on('currentusers', (data) => {
        if (users.signedInusers.indexOf(data) === -1) {
          users.signedInusers = data;
        }
      });
    }());

    const signup = (name, email, password, userAvatar) => new Promise((resolve, reject) => {
      const newuser = {
        name,
        email,
        password,
        userAvatar
      };
      $http.post('/api/auth/signup', newuser)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });

    const signin = (email, password) => new Promise((resolve, reject) => {
      const user = {
        email,
        password
      };
      $http.post('/api/auth/signin', user)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });

    const findUsers = () => new Promise((resolve, reject) => {
      $http.get('/api/search/users').then((response) => {
        const userList = response.data;
        resolve(userList);
      }, (error) => {
        reject(error);
      });
    });

    const getFriends = userId => new Promise((resolve, reject) => {
      const postData = {
        userId,
      };
      $http.post('/user/friends', postData)
        .then((response) => {
          resolve(response.data);
        }, (error) => {
          reject(error);
        });
    });

    const addFriend = (email, userId) => new Promise((resolve, reject) => {
      const postData = {
        user: email,
        userId,
      };
      $http.post('/users/addfriend', postData)
        .then((response) => {
          if (friendsAdded.indexOf(response.data) <= -1) {
            friendsAdded.push(response.data);
          }
          const msg = `${response.data} has recently been added to friends list`;
          const friendName = response.data;
          resolve({
            msg,
            friendName
          });
        }, (error) => {
          reject(error);
        });
    });

    const deleteFriend = (email, userId) => new Promise((resolve, reject) => {
      const postData = {
        user: email,
        userId,
      };
      $http.post('/users/deletefriend', postData)
        .then((response) => {
          resolve(response.data);
        }, (error) => {
          reject(error);
        });
    });

    const inviteAllFriends = userId => new Promise((resolve, reject) => {
      const gameUrl = encodeURIComponent(window.location.href);
      const postData = {
        userId,
        url: gameUrl,
      };
      $http.post('/users/inviteallfriends', postData)
        .then((response) => {
          resolve(response.data);
        }, (error) => {
          reject(error);
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
          resolve({
            msg,
            usersInvited
          });
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
      usersInvited,
      users,
      friendsAdded,
      addFriend,
      inviteAllFriends,
      deleteFriend,
      getFriends,
    };
  }]);
