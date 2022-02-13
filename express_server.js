const express = require("express");
const { generateRandomString, findUserByEmail, urlsForUser, isValidURL } = require("./helpers");
const app = express();
const PORT = 8080;  // default port 8080

// //       MIDDLEWARE      // //
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
// const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");

app.use(bodyParser.urlencoded({extended: true}));
// app.use(cookieParser());

// //       TEMPLATE      // //
app.set("view engine", "ejs");  // This tells the Express app to use EJS as its templating engine.

app.use(cookieSession({
  name: 'session',
  keys: ["abcdefg", "123456"]
}));

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  }
};

// //***************** ROUTE  ********************// //
app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


// //         for REGISTER file       // //
app.get("/register", (req, res) => {
  const user_id = req.session["user_id"];
  const user = users[user_id];

  if (user) {
    return res.redirect("/urls");
  }
  const templateVars = { user: null };
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).send("Require valid email and password");
  }

  const user = findUserByEmail(email, users);
  if (user) {
    return res.status(400).send("Email is already in used");
  }

  const user_id = generateRandomString(6);
  users[user_id] = { id: user_id, email, password };
  req.session["user_id"] = user_id;
  res.redirect("/urls");
});


//         for LOGIN file          // //
app.get("/login", (req, res) => {
  const user_id = req.session["user_id"];
  const user = users[user_id];     

  if (user) {
    return res.redirect("/urls");
  }
  
  const templateVars = { user: null };
  res.render("login", templateVars);
});


// //         for HEADER file         // //
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = findUserByEmail(email, users);
  if (!user) {
    return res.status(403).send("Require valid email");
  }
  if (bcrypt.compareSync(password, user.password)) {
    return res.status(403).send("Require valid password");
  }

  req.session["user_id"] = user.id;
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});


// //       for INDEX file          // //
app.get("/urls", (req, res) => {
  // setted cookie for key, user information is passed in users see above register POST method
  const user_id = req.session["user_id"];
  const user = users[user_id];     // users[key]

  if (!user) {
    return res.status(403).send("You must be logged in.");
  }

  const urls = urlsForUser(user_id, urlDatabase);
  const templateVars = { urls, user };
  res.render("urls_index", templateVars);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  const user_id = req.session["user_id"];

  if (urlDatabase[shortURL].userID !== user_id) {
    return res.status(403).send("You dont own this URL");
  }
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});


// //         for NEW FORM file         // //
app.get("/urls/new", (req, res) => {
  const user_id = req.session["user_id"];
  const user = users[user_id];
  const templateVars = { user };

  if (!user) {
    return res.redirect("/login");
  }
  res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
  const user_id = req.session["user_id"];
  const user = users[user_id];
  if (!user) {
    return res.status(403).send("You must be logged in to view url");
  }

  let longURL = req.body.longURL;
  if (!longURL) {
    return res.status(400).send("longURL is not valid");
  }
  
  if (!isValidURL(longURL)) {
    longURL = "http://" + longURL;
  }

  const shortURL = generateRandomString(6);
  urlDatabase[shortURL] = {
    longURL: longURL,
    userID: user_id
  };  
  res.redirect(`urls/${shortURL}`);
});


// //        for SHOW file         // //
app.get("/urls/:shortURL", (req, res) => {
  const user_id = req.session["user_id"];
  const user = users[user_id];
  if (!user) {
    return res.status(403).send("You must be logged in to view url");
  }

  const shortURL = req.params.shortURL;
  if (!urlDatabase[shortURL]) {
    return res.status(404).send("Short url doesn't exit");
  }

  if (urlDatabase[shortURL].userID !== user_id)  {
    return res.status(403).send("You can't edit, you don't own this URL");
  }

  const templateVars = { shortURL, longURL: urlDatabase[shortURL].longURL, user };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  const user_id = req.session["user_id"];
  
  if (urlDatabase[shortURL].userID !== user_id) {
    return res.status(403).send("You can't edit, you don't own this URL");
  }

  urlDatabase[shortURL].longURL = longURL;
  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  if (!urlDatabase[req.params.shortURL]) {
    return res.status(403).send("Not valid id");
  }
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
