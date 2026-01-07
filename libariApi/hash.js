// hash.js
const bcrypt = require('bcryptjs');

bcrypt.hash('123456', 10).then(hash => {
  console.log("Hash của 123456 là:", hash);
});
