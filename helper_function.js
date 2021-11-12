//
// Function generating new shortURL (6 characters)
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
// Function to check email in user database.
// input: function(email, users id object)
// returns: user_id if exists or false
const getUserByEmail = (email, userDB) => {
  for (let id in userDB) {
    if (userDB[id]["email"] === email) {
      return id;
    };
  };
  return false;
}
//
// Function to return URL matching userID
// input: function(user_id, url data object)
// returns: matching urls as object
const urlsForUser = (id, urlDB) => {
  let userUrlsDatabase = {};
  for (let key in urlDB) {
    if (urlDB[key]["user_id"] === id) {
      userUrlsDatabase[key] = { longURL: urlDB[key]["longURL"], user_id: id }
    }
  }
  return userUrlsDatabase;
}

module.exports = {generateRandomString, getUserByEmail, urlsForUser}