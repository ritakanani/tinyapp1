function generateRandomString(length) {  
  let result = "";
  
  const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function findUserByEmail(currentUserEmail, usersDB) {
  for (const user_id in usersDB) {
    const user = usersDB[user_id];
    if(currentUserEmail === user.email) {
      return user;
    }
  }
  return undefined;
}

function urlsForUser(userID, urlsDB) {
  const urls = {};
  for (const shortURL in urlsDB) {    
    if (urlsDB[shortURL].userID === userID) {
      urls[shortURL] = urlsDB[shortURL];      
    }
  }
  return urls;
}

module.exports = { 
  generateRandomString, 
  findUserByEmail,
  urlsForUser
};