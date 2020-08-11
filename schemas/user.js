const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
    username: String,
    choco: {
        choco: Number,
        game: {
            wins: Number,
            loses: Number,
        },
        
    },
    attendance: [[Number],],
});

module.exports = mongoose.model("User", User);