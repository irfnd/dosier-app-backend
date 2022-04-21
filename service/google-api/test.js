const { uploadFile, createFolder, deleteFile } = require("./googleapi");

const test = async (foldername, parentid) => {
	try {
		const { data } = await createFolder(foldername, parentid);
		console.log(data);
	} catch (err) {
		console.error(err);
	}
};
