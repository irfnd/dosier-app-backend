const { Schema } = require("mongoose");

module.exports = {
  SK_PHDPSchema: new Schema({
    filename: { type: String, required: true },
    keterangan: { type: String, default: "-" },
    fileId: { type: String, default: "-" },
    folderId: { type: String, default: "-" },
  }),
};
