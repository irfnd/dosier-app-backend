const { Schema } = require("mongoose");

module.exports = {
	SK_MasukSchema: new Schema({
		filename: { type: String, default: "" },
		keterangan: { type: String, default: "-" },
		fileId: { type: String, default: "-" },
		folderId: { type: String, default: "-" },
	}),
};
