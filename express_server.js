const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require("bcryptjs");

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
}))
//

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
  admin: {
    id: "admin",
    email: "admin@tiny",
    password: "1234"
  }
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

//
// Show all urls page
app.get("/urls", (req, res) => {  
  let { user_id } = req.session;
  const templateVars = { urls: urlsForUser(user_id), user_id: users[user_id] };
  res.render("urls_index", templateVars);
});
//
// New URL pair page
app.get("/urls/new", (req, res) => {
  let { user_id } = req.session;
  const templateVars = { user_id: users[user_id] }
  if (!checkUserIdExist(user_id, "id")) return res.redirect("/login");
  res.render("urls_new", templateVars);
});
//
// Create request for new URL pair
app.post("/urls", (req, res) => {
  let { user_id } = req.session;
  if (!checkUserIdExist(user_id, "id")) return res.redirect("/login");
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = {};
  urlDatabase[shortURL]["longURL"] = req.body.longURL;
  urlDatabase[shortURL]["user_id"] = user_id;
  res.redirect(`/urls/${shortURL}`);
});
//
// Newly created / Edit URL page
app.get("/urls/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) return res.status(404).send('<img src="https://http.cat/404">');
  let { user_id } = req.session;
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]["longURL"], user_id: users[user_id] };
  if(!urlsForUser(user_id)[req.params.shortURL]) return res.status(401).send('<img src="https://http.cat/401">');
  res.render("urls_show", templateVars);
});
//
// Redirection to longURL corresponding to shortURL
app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) return res.status(404).send('<img src="https://http.cat/404">');
  const longURL = urlDatabase[req.params.shortURL]["longURL"];
  res.redirect(longURL);
});
//
// Delete request for a URL pair
app.post("/urls/:shortURL/delete", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) return res.status(404).send('<img src="https://http.cat/404">');
  let { user_id } = req.session;
  if(!urlsForUser(user_id)[req.params.shortURL]) return res.status(401).send('<img src="https://http.cat/401">');
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});
//
// Edit request for a longURL
app.post("/urls/:shortURL/edit", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) return res.status(404).send('<img src="https://http.cat/404">');
  let { user_id } = req.session;
  if(!urlsForUser(user_id)[req.params.shortURL]) return res.status(401).send('<img src="https://http.cat/401">');
  urlDatabase[req.params.shortURL]["longURL"] = req.body.editURL;
  res.redirect("/urls");
});
//
// Login Page
app.get("/login", (req, res) => {
  let { user_id } = req.session;
  const templateVars = { user_id: users[user_id] };
  if (checkUserIdExist(user_id, "id")) return res.redirect("/urls");
  res.render("urls_login", templateVars);
});
//
// Login request/verification
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (checkUserIdExist(email, "email")) {
    let id = checkUserIdExist(email, "email");
    if (bcrypt.compareSync(password, users[id]["password"])) {
      req.session.user_id = id;
      return res.redirect("/urls");
    }
    return res.status(403).send('<img src="https://http.cat/403">');
  }
  return res.status(403).send('<img src="https://http.cat/403">');
});
//
// Logout request
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});
//
// Registration Page
app.get("/register", (req, res) => {
  let { user_id } = req.session;
  const templateVars = { user_id: users[user_id] };
  if (checkUserIdExist(user_id, "id")) return res.redirect("/urls");
  res.render("urls_register", templateVars);
});
//
// New registration request
app.post("/register", (req, res) => {
  const id = generateRandomString();
  const { email, password } = req.body;
  if ((!email || !password)) return res.status(400).send('<img src="https://http.cat/400">');
  if (checkUserIdExist(email, "email")) return res.status(400).send('<img src="https://http.cat/400">');
  const hashedPass = bcrypt.hashSync(password, 10);
  users[id] = { id, email, password: hashedPass };
  req.session.user_id = id;
  res.redirect("/urls");
});

// Server Listening...
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});