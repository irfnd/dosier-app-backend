const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const respond = require("express-respond");
const app = express();

require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(respond);

require("./service/auth/passport");
const validate = passport.authenticate("jwt", { session: false });

app.use("/", require("./routes/index"));
app.use("/api", validate, require("./routes/api"));

mongoose.connect(process.env.DB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", (err) => {
	console.log("> Database Connection Error");
	console.log(`> ${err}`);
	process.exit();
});

db.once("open", () => {
	console.log("> Database Connected");
});

app.listen(process.env.SERVER_PORT, () => {
	console.log(`> Server Running on port ${process.env.SERVER_PORT}`);
});
