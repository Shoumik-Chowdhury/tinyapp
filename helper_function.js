//
// Function generating new shortURL (6 characters)
const generateRandomString = () => {
  let result           = '';
  let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
//
// Function to check email in user database.
// input: function(email, users id object)
// returns: userId if exists or false
const getUserByEmail = (email, userDB) => {
  for (let id in userDB) {
    if (userDB[id]["email"] === email) {
      return id;
    }
  }
  return false;
};
//
// Function to return URL matching userID
// input: function(userId, url data object)
// returns: matching urls as object
const urlsForUser = (id, urlDB) => {
  let userUrlsDatabase = {};
  for (let key in urlDB) {
    if (urlDB[key]["userId"] === id) {
      userUrlsDatabase[key] = { longURL: urlDB[key]["longURL"], userId: id };
    }
  }
  return userUrlsDatabase;
};

module.exports = {generateRandomString, getUserByEmail, urlsForUser};