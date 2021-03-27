const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, "Username can not be empty"],
	},
	password: {
		type: String,
		required: [true, "password can not be empty"],
	},
	// email : {
	// 	type :
	// }
});

module.exports = mongoose.model("User", userSchema);
