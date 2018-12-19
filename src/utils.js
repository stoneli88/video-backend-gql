const jwt = require("jsonwebtoken");
const _ = require('lodash');

const APP_SECRET = "dmlkZW8=";

function getUserId(ctx) {
  if (_.isString(ctx)) {
    const token = ctx;
    const { userId } = jwt.verify(token, APP_SECRET);
    return userId;
  } else {
    const Authorization = ctx.request.get("Authorization");
    if (Authorization) {
      const token = Authorization.replace("Bearer ", "");
      const { userId } = jwt.verify(token, APP_SECRET);
      return userId;
    }
  }

  throw new AuthError();
}

class AuthError extends Error {
  constructor() {
    super("Not authorized");
  }
}

module.exports = {
  getUserId,
  AuthError,
  APP_SECRET
};
