const debug = require("debug")("app");
const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  try {
    const token = req.header("x-auth-token");
    if (!token)
      return res.status(404).send("Access Denied! No Token Provided.");

    const decoded = jwt.verify(token, config.get("STUDENTPRIVATEKEY"));
    req.user = decoded;

    next();
  } catch (ex) {
    res.status(401).send("Invalid Token");
    debug(ex);
  }
};
