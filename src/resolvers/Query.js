const getUserId = require("../utils");

async function me(parent, args, ctx, info) {
  const id = getUserId(ctx);
  return ctx.db.query.user({ where: { id } }, info);
}

async function videos(parent, args, context, info) {
  let where = {};
  if (args.filter) {
    const filterObj = JSON.parse(args.filter);
    Object.keys(filterObj, key => {
      if (key === "email") {
        where["AND:"] = [{ owner: { email: args.filter.email } }];
      }
      if (key === "name") {
        where["AND:"] = [{ name: args.filter.name }];
      }
    });
  }

  const queriedVideos = await context.db.query.videos(
    { where, skip: args.skip, first: args.first, orderBy: args.orderBy },
    `{ 
      id,
      name,
      description,
      category {
        id
        name
      }
      owner {
        id
        name
        email
      }
      isEncoded
      createdAt
    }`
  );

  return queriedVideos;
}

module.exports = {
  me,
  videos
};
