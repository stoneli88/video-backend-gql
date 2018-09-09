const { getUserId } = require('../utils');

async function me(parent, args, ctx, info) {
	const id = getUserId(ctx);
	return ctx.db.query.user({ where: { id } }, info);
}

async function categories(parent, args, context, info) {
	const queriedVideos = await context.db.query.categories({}, `{ id name }`);
	return queriedVideos;
}

async function collections(parent, args, context, info) {
	let where = {};

	if (args.filter) {
		const filterObj = JSON.parse(args.filter);
		Object.keys(filterObj).forEach((key) => {
			if (key === 'id') {
				where['AND'] = [ { id: filterObj.id } ];
			}
			if (key === 'keyword') {
				where['AND'] = [ { keyword: filterObj.keyword } ];
			}
			if (key === 'name') {
				where['AND'] = [ { name: filterObj.name } ];
			}
		});
	}

	const queriedCollectionses = await context.db.query.collectionses(
		{ where, skip: args.skip, first: args.first, orderBy: args.orderBy },
		`{
      id
	    title
      keyword
	    cover_url
	    total_views
	    video_count
	    collection_url
    }`
	);

	return queriedCollectionses;
}

async function videos(parent, args, context, info) {
	let where = {};
	if (args.filter) {
		const filterObj = JSON.parse(args.filter);

		Object.keys(filterObj).forEach((key) => {
			if (key === 'id') {
				where['AND'] = [ { id: filterObj.id } ];
			}
			if (key === 'keyword') {
				where['AND'] = [ { keyword: filterObj.keyword } ];
			}
			if (key === 'name') {
				where['AND'] = [ { name: filterObj.name } ];
			}
		});
	}

	const queriedVideos = await context.db.query.videos(
		{ where, skip: args.skip, first: args.first, orderBy: args.orderBy },
		`{ 
			id
			mov_uuid
			cover_uuid
			mov_name
			cover_name
      name
      description
      category {
        id
        name
      }
      owner {
        id
        name
        email
      }
			channel
			duration
			framerate
			hd
			keyword
			viewnumber
			likes
			dislikes
			preview_url
      createdAt
      updatedAt
    }`
	);

	return queriedVideos;
}

module.exports = {
	me,
	categories,
	collections,
	videos
};
