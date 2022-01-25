const express = require("express");
const app = express();
const PORT = 8080;  // default port 8080

// //       MIDDLEWARE      // //
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

// //       TEMPLATE      // //
app.set("view engine", "ejs");  // This tells the Express app to use EJS as its templating engine.

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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


// //     ROUTE     // //
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


// //       for INDEX file          // //
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// //         for NEW FORM file         // //
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
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
  const templateVars = { shortURL, longURL: urlDatabase[shortURL] };

  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  console.log(longURL);
  res.redirect(longURL);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
