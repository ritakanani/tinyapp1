const express = require("express");
const app = express();
const PORT = 8080;  // default port 8080


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});