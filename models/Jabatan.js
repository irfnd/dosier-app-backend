const { Schema } = require("mongoose");

module.exports = {
	JabatanSchema: new Schema({
		jabatan: { type: String, required: true },
		divisi: { type: String, required: true },
		aktif: { type: Boolean, default: false },
		periode: { type: String, required: true },
		filename: { type: String, default: "" },
		keterangan: { type: String, default: "-" },
		fileId: { type: String, default: "-" },
		folderId: { type: String, default: "-" },
	}),
};
