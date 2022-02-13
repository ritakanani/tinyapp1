// In order to simulate generating a "unique" shortURL, for now we will implement a function that returns a string of 6 random alphanumeric characters:
function generateRandomString(length) {  
  let result = "";
  
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Refactor the helper function to take in both the users email and the users database:
function findUserByEmail(currentUserEmail, usersDB) {
  for (const user_id in usersDB) {
    const user = usersDB[user_id];
    if(currentUserEmail === user.email) {
      return user;
    }
  }
  return undefined;
}

// Create a function named urlsForUser(id) which returns the URLs where the userID is equal to the id of the currently logged-in user:
function urlsForUser(userID, urlsDB) {
  const urls = {};
  for (const shortURL in urlsDB) {    
    if (urlsDB[shortURL].userID === userID) {
      urls[shortURL] = urlsDB[shortURL];      
    }
  }
  return urls;
}

//  This function helps to validate URL with or without http/https:
function isValidURL(string) {
  var res = string.match(/http(s)?:\/\/(.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  return (res !== null)
};


module.exports = { 
  generateRandomString, 
  findUserByEmail,
  urlsForUser, 
  isValidURL
};