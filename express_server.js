const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

// Server config
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");  // render engine ejs
//

// Middleware to extract data from POST request
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser()); // cookie parser
//

// Database storing shortURL-longURL pairs
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
//
// Database for userID
const users = {

};
//

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
// Show all urls page
app.get("/urls", (req, res) => {
  let { user_id } = req.cookies;
  const templateVars = { urls: urlDatabase, user_id: users[user_id] };
  res.render("urls_index", templateVars);
});
//
// New URL pair page
app.get("/urls/new", (req, res) => {
  let { user_id } = req.cookies;
  const templateVars = { user_id: users[user_id] }
  res.render("urls_new", templateVars);
});
//
// Create request for new URL pair
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});
//
// Newly created / Edit URL page
app.get("/urls/:shortURL", (req, res) => {
  let { user_id } = req.cookies;
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user_id: users[user_id] };
  res.render("urls_show", templateVars);
});
//
// Redirection to longURL corresponding to shortURL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});
//
// Delete request for a URL pair
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});
//
// Edit request for a longURL
app.post("/urls/:shortURL/edit", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.editURL;
  res.redirect("/urls");
});
//
// Login Page
app.get("/login", (req, res) => {
  let { user_id } = req.cookies;
  const templateVars = { user_id: users[user_id] };
  res.render("urls_login", templateVars);
});
//
// Login request/verification
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (checkUserIdExist(email, "email")) {
    if (checkUserIdExist(password, "password")) {
      let id = checkUserIdExist(password, "password");
      res.cookie("user_id", id);
      return res.redirect("/urls");
    }
    return res.status(403).send('<img src="https://http.cat/403">');
  }
  return res.status(403).send('<img src="https://http.cat/403">');
});
//
// Logout request
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});
//
// Registration Page
app.get("/register", (req, res) => {
  let { user_id } = req.cookies;
  const templateVars = { user_id: users[user_id] };
  res.render("urls_register", templateVars);
});
//
// New registration request
app.post("/register", (req, res) => {
  const id = generateRandomString();
  const { email, password } = req.body;
  if ((!email || !password)) return res.status(400).send('<img src="https://http.cat/400">');
  if (checkUserIdExist(email, "email")) return res.status(400).send('<img src="https://http.cat/400">');
  users[id] = { id, email, password };
  res.cookie("user_id", id);
  res.redirect("/urls");
});

// Server Listening...
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});