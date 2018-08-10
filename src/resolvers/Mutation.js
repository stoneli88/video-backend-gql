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

async function createOrUpdateVideo(parent, args, context, info) {
	let createOrUpdatedVideo;
	const needUpdateParams = {};
	const { id, uuid, path, name, description, category, isEncoded } = args;

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

	if (id) {
		const video = await context.db.query.video({ where: { id: args.id } }, `{ id name }`);
		if (!video) {
			throw new Error('No such video found');
		}
		createOrUpdatedVideo = await context.db.mutation.updateVideo(
			{ where: { id: args.id }, data: needUpdateParams },
			`{ id name }`
		);
	} else {
		createOrUpdatedVideo = await context.db.mutation.createVideo({ data: needUpdateParams }, `{ id }`);
	}

	return createOrUpdatedVideo;
}

module.exports = {
	signup,
	login,
	createOrUpdateVideo
};
