const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('../utils');

async function signup(parent, args, context, info) {
	const password = await bcrypt.hash(args.password, 10);
	const user = await context.db.mutation.createUser(
		{
			data: { ...args, password }
		},
		`{ id }`
	);

	const token = jwt.sign({ userId: user.id }, APP_SECRET);

	return {
		token,
		user
	};
}

async function login(parent, args, context, info) {
	const user = await context.db.query.user({ where: { email: args.email } }, `{ id password }`);
	if (!user) {
		throw new Error('No such user found');
	}

	const valid = await bcrypt.compare(args.password, user.password);
	if (!valid) {
		throw new Error('Invalid password');
	}

	return {
		token: jwt.sign({ userId: user.id }, APP_SECRET),
		user
	};
}

async function createCollection(parent, args, context, info) {
	let createCollection;
	const needUpdateParams = {};
	const { title, keyword, cover_url, total_views, video_count, collection_url } = args;

	if (title) {
		needUpdateParams['title'] = title;
	}
	if (keyword) {
		needUpdateParams['keyword'] = keyword;
	}
	if (cover_url) {
		needUpdateParams['cover_url'] = cover_url;
	}
	if (name) {
		needUpdateParams['total_views'] = total_views;
	}
	if (name) {
		needUpdateParams['video_count'] = video_count;
	}
	if (name) {
		needUpdateParams['collection_url'] = collection_url;
	}

	createCollection = await context.db.mutation.createCollections({ data: needUpdateParams }, `{ id }`);

	return createCollection;
}

async function updateCollection(parent, args, context, info) {
	let updateCollection;
	const needUpdateParams = {};
	const { id, title, keyword, cover_url, total_views, video_count, collection_url } = args;

	const collection = await context.db.query.collectionses({ where: { id } }, `{ id }`);

	if (!collection) {
		throw new Error('#### [PRISMA] ERROR: No such collection found.');
	}
	
	if (title) {
		needUpdateParams['title'] = title;
	}
	if (keyword) {
		needUpdateParams['keyword'] = keyword;
	}
	if (cover_url) {
		needUpdateParams['cover_url'] = cover_url;
	}
	if (name) {
		needUpdateParams['total_views'] = total_views;
	}
	if (name) {
		needUpdateParams['video_count'] = video_count;
	}
	if (name) {
		needUpdateParams['collection_url'] = collection_url;
	}

	updateCollection = await context.db.mutation.updateCollections({ where: { id }, data: needUpdateParams }, `{ id }`);

	return updateCollection;
}

async function createCategory(parent, args, context, info) {
	let createCategory;
	const needUpdateParams = {};
	const { name, totalVideos, coverUrl } = args;

	if (name) {
		needUpdateParams['name'] = name;
	}
	if (name) {
		needUpdateParams['total_videos'] = totalVideos;
	}
	if (name) {
		needUpdateParams['cover_url'] = coverUrl;
	}

	createCategory = await context.db.mutation.createCategory({ data: needUpdateParams }, `{ id }`);

	return createCategory;
}

async function updateCategory(parent, args, context, info) {
	let updateCategory;
	const needUpdateParams = {};
	const { id, name, totalVideos, coverUrl } = args;
	const category = await context.db.query.categories({ where: { id } }, `{ id }`);

	if (!category) {
		throw new Error('#### [PRISMA] ERROR: No such category found.');
	}

	if (name) {
		needUpdateParams['name'] = name;
	}
	if (totalVideos) {
		needUpdateParams['total_videos'] = totalVideos;
	}
	if (coverUrl) {
		needUpdateParams['cover_url'] = coverUrl;
	}

	updateCategory = await context.db.mutation.updateCategory({ where: { id }, data: needUpdateParams }, `{ id }`);

	return updateCategory;
}

async function createVideo(parent, args, context, info) {
	let createVideo;
	const needUpdateParams = {};
	const {
		mov_uuid,
		cover_uuid,
		mov_name,
		cover_name,
		name,
		description,
		category,
		isEncoded,
		keyword
	} = args;

	if (name) {
		needUpdateParams['name'] = name;
	}
	if (mov_uuid) {
		needUpdateParams['mov_uuid'] = mov_uuid;
	}
	if (cover_uuid) {
		needUpdateParams['cover_uuid'] = cover_uuid;
	}
	if (mov_name) {
		needUpdateParams['mov_name'] = mov_name;
	}
	if (cover_name) {
		needUpdateParams['cover_name'] = cover_name;
	}
	if (keyword) {
		needUpdateParams['keyword'] = keyword;
	}
	if (description) {
		needUpdateParams['description'] = description;
	}
	if (category) {
		needUpdateParams['category'] = { connect: { id: category } };
	}
	if (isEncoded) {
		needUpdateParams['isEncoded'] = isEncoded;
	}

	needUpdateParams['owner'] = { connect: { id: getUserId(context) } };

	console.log(needUpdateParams);

	createVideo = await context.db.mutation.createVideo({ data: needUpdateParams }, `{ id }`);

	return createVideo;
}

async function updateVideo(parent, args, context, info) {
	const video = await context.db.query.video({ where: { id: args.id } }, `{ id }`);
	const needUpdateParams = {};
	const {
		name,
		description,
		category,
		isEncoded,
		channel,
		duration,
		framerate,
		keyword,
		viewnumber,
		likes,
		dislikes,
		mov_url,
		cover_url
	} = args;

	if (!video) {
		throw new Error('#### [PRISMA] ERROR: No such video found');
	}

	if (channel) {
		needUpdateParams['channel'] = channel;
	}
	if (duration) {
		needUpdateParams['duration'] = duration;
	}
	if (framerate) {
		needUpdateParams['framerate'] = framerate;
	}
	if (mov_url) {
		needUpdateParams['mov_url'] = mov_url;
	}
	if (viewnumber) {
		needUpdateParams['viewnumber'] = viewnumber;
	}
	if (likes) {
		needUpdateParams['likes'] = likes;
	}
	if (dislikes) {
		needUpdateParams['dislikes'] = dislikes;
	}
	if (cover_url) {
		needUpdateParams['cover_url'] = cover_url;
	}
	if (keyword) {
		needUpdateParams['keyword'] = keyword;
	}
	if (name) {
		needUpdateParams['name'] = name;
	}
	if (description) {
		needUpdateParams['description'] = description;
	}
	if (category) {
		needUpdateParams['category'] = { connect: { id: category } };
	}
	if (isEncoded !== null) {
		needUpdateParams['isEncoded'] = isEncoded;
	}

	const updatedVideo = await context.db.mutation.updateVideo(
		{ where: { id: args.id }, data: needUpdateParams },
		`{ id }`
	);

	return updatedVideo;
}

async function removeVideo(parent, args, context, info) {
	const { id } = args;
	const video = await context.db.query.video({ where: { id } }, `{ id }`);

	if (!video) {
		throw new Error('No such video found');
	}

	const deletedVideo = await context.db.mutation.deleteVideo({ where: { id: args.id } }, `{ id }`);

	return deletedVideo;
}

async function removeCategory(parent, args, context, info) {
	const { id } = args;
	const categories = await context.db.query.categories({ where: { id } }, `{ id }`);

	if (!categories) {
		throw new Error('#### [PRISMA] ERROR: No such category found.');
	}

	const deletedCategory = await context.db.mutation.deleteCategory({ where: { id: args.id } }, `{ id }`);

	return deletedCategory;
}

async function removeCollection(parent, args, context, info) {
	const { id } = args;
	const collection = await context.db.query.collectionses({ where: { id } }, `{ id }`);

	if (!collection) {
		throw new Error('#### [PRISMA] ERROR: No such collection found.');
	}

	const deletedCollection = await context.db.mutation.deleteCollections({ where: { id: args.id } }, `{ id }`);

	return deletedCollection;
}

module.exports = {
	signup,
	login,
	createCollection,
	updateCollection,
	createCategory,
	updateCategory,
	createVideo,
	updateVideo,
	removeVideo,
	removeCollection,
	removeCategory
};
