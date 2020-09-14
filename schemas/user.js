const mongoose = require("mongoose");
const ObjectId = require("mongoose/lib/schema/objectid");
const Schema = mongoose.Schema;

const User = new Schema({
    userID: {type: String, required: true},
    choco: {
        choco: {type: Number, required: true, default: 1000},
        game: {
            wins: {type: Number, default: 0},
            loses: {type: Number, default: 0},
        },
        
    },
    attendance: [{type: Date},],
    createdAt: {type: Date, default: Date.now }
});

User.methods = {
    getChoco: function(){
        return this.choco.choco;
    },
    addChoco: function(choco){
        this.choco.choco += choco * 1;
        
    },
    addAttend: function(date){
        this.attendance.push(date);
        
    }
};

module.exports = mongoose.model('User', User);