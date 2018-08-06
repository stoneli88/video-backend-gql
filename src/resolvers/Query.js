const { getUserId } = require("../utils");

async function me(parent, args, ctx, info) {
  const id = getUserId(ctx);
  return ctx.db.query.user({ where: { id } }, info);
}

async function categories(parent, args, context, info) {
  const queriedVideos = await context.db.query.categories({}, `{ id name }`);
  return queriedVideos;
}

async function videos(parent, args, context, info) {
  let where = {};
  if (args.filter) {
    const filterObj = JSON.parse(args.filter);

    Object.keys(filterObj).forEach(key => {
      if (key === "id") {
        where["AND"] = [{ id: filterObj.id }];
      }
      if (key === "email") {
        where["AND"] = [{ email: filterObj.email }];
      }
      if (key === "name") {
        where["AND"] = [{ name: filterObj.name }];
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
      path
      isEncoded
      createdAt
    }`
  );

  return queriedVideos;
}

module.exports = {
  me,
  categories,
  videos
};
