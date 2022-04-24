const { folderPegawaiBaru } = require("./googleapi");

const test = async (parentId) => {
	try {
		const data = await folderPegawaiBaru(parentId);
		console.log(data);
	} catch (err) {
		console.error(err);
	}
};

test("1d-XQN8C9JpEwj3DjphunpbD0rBzsDd23");
