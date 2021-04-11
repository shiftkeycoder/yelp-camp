const bcrypt = require('bcrypt');

// const hashPWD = async (pw) => {
//   const salt = await bcrypt.genSalt(12);
//   const hash = await bcrypt.hash(pw, salt);
//   console.log(salt);
//   console.log(hash);
// };
const hashPWD = async (pw) => {
  const hash = await bcrypt.hash(pw, 12);
  return hash;
};
const authPWD = async (pw, pwHash) => {
  const result = await bcrypt.compare(pw, pwHash);
  if (result) {
    return true;
  }
  else {
    return false;
  }
}

module.exports = {hashPWD, authPWD};