const path = require('path');

const rootPath = path.normalize(__dirname + '/../..');
const keys = rootPath + '/keys.txt';

const database = (process.NODE_ENV === 'test' ? process.env.MONGO_TEST = 'test' : process.env.MONGOHQ_URL); 
module.exports = {
  root: rootPath,
  port: process.env.PORT || 3000,
  db: database
};
