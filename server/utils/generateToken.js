const jwt = require("jsonwebtoken");

console.log(process.env.JWT_SECRET);

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

module.exports = generateToken;