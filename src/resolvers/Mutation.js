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

async function createVideo(parent, args, context, info) {
	let createVideo;
	const needUpdateParams = {};
	const { uuid, path, name, description, category, isEncoded } = args;

	if (name) {
		needUpdateParams['name'] = name;
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
	if (uuid) {
		needUpdateParams['uuid'] = uuid;
	}
	if (path) {
		needUpdateParams['path'] = path;
	}

	needUpdateParams['owner'] = { connect: { id: getUserId(context) } };

	createVideo = await context.db.mutation.createVideo({ data: needUpdateParams }, `{ id }`);

	return createVideo;
}

async function updateVideo(parent, args, context, info) {
	const video = await context.db.query.video({ where: { id: args.id } }, `{ id }`);
	const needUpdateParams = {};
	const { uuid, path, name, description, category, isEncoded } = args;

	if (!video) { throw new Error('No such video found'); }

	if (name) { needUpdateParams['name'] = name; }
	if (description) { needUpdateParams['description'] = description; }
	if (category) { needUpdateParams['category'] = { connect: { id: category } }; }
	if (isEncoded) { needUpdateParams['isEncoded'] = isEncoded; }
	if (uuid) { needUpdateParams['uuid'] = uuid; }
	if (path) { needUpdateParams['path'] = path; }

	updatedVideo = await context.db.mutation.updateVideo(
		{ where: { id: args.id }, data: needUpdateParams },
		`{ id }`
	);
}

module.exports = {
	signup,
	login,
	createVideo,
	updateVideo
};
