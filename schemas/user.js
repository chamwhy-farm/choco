const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
    username: {type: String, default: 'noob', trim: true, maxlength: 10},
    choco: {
        choco: {type: Number, required: true},
        game: {
            wins: Number,
            loses: Number,
        },
        
    },
    attendance: [[Number],],
    createdAt: {type: Date, default: Date.now }
});

User.methods = {
    getChoco: function(){
        return this.choco.choco;
    }
};

module.exports = mongoose.model("User", User);