// Database storing shortURL-longURL pairs
const urlDatabase = {
  "b2xVn2": { 
    longURL: "http://www.lighthouselabs.ca",
    user_id: ""
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    user_id: ""
  }
};
//
// Database for userID
const users = {
  "admin": {
    id: "admin",
    email: "admin@tiny",
    password: "1234"
  }
};
//
module.exports = { urlDatabase, users }