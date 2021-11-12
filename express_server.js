// Modules and packages required
const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require("bcryptjs");

const { urlDatabase, users } = require('./database');
const { generateRandomString, getUserByEmail, urlsForUser } = require('./helper_function');

// Server config
const app = express();
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");  // render engine ejs
//

// Middleware to extract data from POST request
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['john', 'cena']
}));
/////////////////////////////////////////////////

// GET /: Root page
app.get("/", (req, res) => {
  let { user_id } = req.session;
  if (!users[user_id]) return res.redirect("/login"); // check if logged in
  res.redirect("/urls");
});
//
// GET /urls: Show all urls page
app.get("/urls", (req, res) => {  
  let { user_id } = req.session;
  let userURLs = urlsForUser(user_id, urlDatabase); // URLs for specific user
  const templateVars = { urls: userURLs, user_id: users[user_id] };
  res.render("urls_index", templateVars);
});
//
// GET /urls/new: New URL pair page
app.get("/urls/new", (req, res) => {
  let { user_id } = req.session;
  const templateVars = { user_id: users[user_id] }
  if (!users[user_id]) return res.redirect("/login"); // check if logged in
  res.render("urls_new", templateVars);
});
//
// GET /urls/:id: Newly created / Edit URL page
app.get("/urls/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) { // error if url does not exist
    return res.status(404).send('<img src="https://http.cat/404">');
  };
  let { user_id } = req.session;
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]["longURL"], user_id: users[user_id] };
  if(!urlsForUser(user_id, urlDatabase)[req.params.shortURL]) { // check shortURL exists in the specific user database
    return res.status(401).send('<img src="https://http.cat/401">');
  };
  res.render("urls_show", templateVars);
});
//
// GET /u/:id: Redirection to longURL corresponding to shortURL
app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) { // error if url does not exist
    return res.status(404).send('<img src="https://http.cat/404">');
  };
  const longURL = urlDatabase[req.params.shortURL]["longURL"];
  res.redirect(longURL);
});
//
// POST /urls: Create request for new URL pair
app.post("/urls", (req, res) => {
  let { user_id } = req.session;
  if (!users[user_id]) return res.redirect("/login"); // check if user authorized
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = {}; // new url pair object
  urlDatabase[shortURL]["longURL"] = req.body.longURL; // set longURL value
  urlDatabase[shortURL]["user_id"] = user_id; // set user_id value
  res.redirect(`/urls/${shortURL}`);
});
//
// POST /urls/:id: Edit request for a longURL
app.post("/urls/:shortURL", (req, res) => {
  let { user_id } = req.session;
  if(!urlsForUser(user_id, urlDatabase)[req.params.shortURL]) { // check shortURL exists in the specific user database
    return res.status(401).send('<img src="https://http.cat/401">');
  }
  urlDatabase[req.params.shortURL]["longURL"] = req.body.editURL;
  res.redirect("/urls");
});
//
// POST /urls/:id/delete: Delete request for a URL pair
app.post("/urls/:shortURL/delete", (req, res) => {
  let { user_id } = req.session;
  if(!urlsForUser(user_id, urlDatabase)[req.params.shortURL]) { // check shortURL exists in the specific user database
    return res.status(401).send('<img src="https://http.cat/401">');
  };
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});
//
// GET /login: Login Page
app.get("/login", (req, res) => {
  let { user_id } = req.session;
  const templateVars = { user_id: users[user_id] };
  if (users[user_id]) return res.redirect("/urls");
  res.render("urls_login", templateVars);
});
//
// GET /register: Registration Page
app.get("/register", (req, res) => {
  let { user_id } = req.session;
  const templateVars = { user_id: users[user_id] };
  if (users[user_id]) return res.redirect("/urls");
  res.render("urls_register", templateVars);
});
//
// POST /login: Login request/verification
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (getUserByEmail(email, users)) { // check id exists for email
    let id = getUserByEmail(email, users); // get id for matching email
    if (bcrypt.compareSync(password, users[id]["password"])) { // compare password hash
      req.session.user_id = id;
      return res.redirect("/urls");
    }
    return res.status(403).send('<img src="https://http.cat/403">');
  }
  return res.status(403).send('<img src="https://http.cat/403">');
});
//
// POST /register: New registration request
app.post("/register", (req, res) => {
  const id = generateRandomString();
  const { email, password } = req.body;

  if ((!email || !password)) { // check blank fields
    return res.status(400).send('<img src="https://http.cat/400">');
  };

  if (getUserByEmail(email, users)) { // check email already exists
    return res.status(400).send('<img src="https://http.cat/400">');
  };

  const hashedPass = bcrypt.hashSync(password, 10);
  users[id] = { id, email, password: hashedPass }; // create new user object
  req.session.user_id = id;
  res.redirect("/urls");
});
//
// POST /logout: Logout request
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

// Server Listening...
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});