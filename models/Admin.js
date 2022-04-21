const { Schema, model } = require("mongoose");

module.exports = {
	Admin: model(
		"admin",
		new Schema({
			email: { type: String, required: true },
			nama: { type: String, required: true },
			password: { type: String, required: true },
		})
	),
};
