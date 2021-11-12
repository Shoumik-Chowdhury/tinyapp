const { urlDatabase, users } = require('./database')
// Function generating new shortURL
function generateRandomString() {
  let result           = '';
  let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for ( let i = 0; i < 6; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
  return result;
}
//
// Function to check email in user database
const checkUserIdExist = (data, type) => {
  for (let id in users) {
    if (users[id][type] === data) {
      return id;
    };
  };
  return false;
}
//
// Function to return URL matching userID
const urlsForUser = (id) => {
  let userUrlsDatabase = {};
  for (let key in urlDatabase) {
    if (urlDatabase[key]["user_id"] === id) {
      userUrlsDatabase[key] = { longURL: urlDatabase[key]["longURL"], user_id: id }
    }
  }
  return userUrlsDatabase;
}

module.exports = {generateRandomString, checkUserIdExist, urlsForUser}