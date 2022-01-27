const express = require("express");
const app = express();
const PORT = 8080;  // default port 8080

// //       MIDDLEWARE      // //
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// //       TEMPLATE      // //
app.set("view engine", "ejs");  // This tells the Express app to use EJS as its templating engine.

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

function generateRandomString(length) {  
  let result = "";
  
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}




// //***************** ROUTE  ********************// //
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// Will a variable that is created in one request be accessible in another?
app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});
app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});  // a is not defined in this scope, and will result in a reference error when anyone visits URL.


// //         for REGISTER file       // // 
app.get("/register", (req, res) => {
  const user_id = req.cookies["user_id"];
  const user = users[user_id];
  const templateVars = { user };
  res.render("register", templateVars);  
});

app.post("/register", (req, res) => {  
  const user_id = generateRandomString(6);    
  users[user_id] = { id: user_id, email: req.body.email, password: req.body.password };
  res.cookie("user_id", user_id);
  res.redirect("/urls");  
});


// //         for HEADER file         // //
app.post("/login", (req, res) => {    
  let username = req.body.username;   
  res.cookie("username", username);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});


// //       for INDEX file          // //
app.get("/urls", (req, res) => {
  // setted cookie for key, user information is passed in users see above register POST method
  const user_id = req.cookies["user_id"];
  const user = users[user_id];     // users[key]
  const templateVars = { urls: urlDatabase, user };
  res.render("urls_index", templateVars);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
})

// //         for NEW FORM file         // //
app.get("/urls/new", (req, res) => {
  const user_id = req.cookies["user_id"];
  const user = users[user_id];
  const templateVars = { user };
  res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;  
  const shortURL = generateRandomString(6);
  urlDatabase[shortURL] = longURL;  
  res.redirect(`urls/${shortURL}`);
});

// //        for SHOW file         // //
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const user_id = req.cookies["user_id"];
  const user = users[user_id];
  const templateVars = { shortURL, longURL: urlDatabase[shortURL], user };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls");
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];  
  res.redirect(longURL);
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
