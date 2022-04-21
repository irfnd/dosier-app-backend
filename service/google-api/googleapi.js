const path = require("path");
const stream = require("stream");
const { google } = require("googleapis");

require("dotenv").config();

const auth = new google.auth.GoogleAuth({
	keyFile: path.join(__dirname, "dosier-app.json"),
	scopes: [process.env.SCOPES],
});

module.exports = {
	uploadFile: async (fileObject, fileName, folderId) => {
		const bufferStream = new stream.PassThrough();
		bufferStream.end(fileObject.buffer);
		const { data } = await google.drive({ version: "v3", auth }).files.create({
			media: {
				mimeType: fileObject.mimeType,
				body: bufferStream,
			},
			requestBody: {
				name: fileName,
				parents: [folderId],
			},
			fields: "id, name, mimeType, webViewLink, webContentLink",
		});
		return {
			id: data.id,
			name: data.name,
			mimeType: data.mimeType,
			webViewLink: data.webViewLink,
			webContentLink: data.webContentLink,
		};
	},

	createFolder: async (folderName, parentId) => {
		const { data } = await google.drive({ version: "v3", auth }).files.create({
			resource: {
				name: folderName,
				parents: [parentId],
				mimeType: "application/vnd.google-apps.folder",
				supportsAllDrives: true,
			},
			fields: "id, name",
		});
		return {
			id: data.id,
			name: data.name,
		};
	},

	deleteFile: async (fileId) => {
		await google.drive({ version: "v3", auth }).files.delete({
			fileId: fileId,
		});
	},
};
