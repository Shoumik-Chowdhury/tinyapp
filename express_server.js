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
// Show all urls page
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);
});
//
// New URL pair page
app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies["username"] }
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
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: req.cookies["username"] };
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
// Login request
app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});
//
// Logout request
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});
//
// Registration Page
app.get("/register", (req, res) => {
  const templateVars = { username: req.cookies["username"] };
  res.render("urls_register", templateVars);
});

// Server Listening...
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});