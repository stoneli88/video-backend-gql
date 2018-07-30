const getUserId = require("../utils");

async function me(parent, args, ctx, info) {
  const id = getUserId(ctx);
  return ctx.db.query.user({ where: { id } }, info);
}

module.exports = {
  me
};
