const jwt = require("jsonwebtoken");
const SECRET_KEY = "dayadeveloper1948";

const generateToken = (user) => {
  const payload = {
    userId: user.id,
    username: user.username,
    role: user.role
  };
  const token = jwt.sign({ payload }, SECRET_KEY, { expiresIn: "48h" });
  return token;
};

const getUSERIDFromToken = (token) => {
  const decodedToken = jwt.verify(token, SECRET_KEY);
  return decodedToken.payload.userId;
};

module.exports = { generateToken, getUSERIDFromToken };
