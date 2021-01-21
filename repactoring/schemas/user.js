const mongoose = require("mongoose");
const ObjectId = require("mongoose/lib/schema/objectid");
const Schema = mongoose.Schema;

const config = require("../config.json");

const User = new Schema({
    userID: {type: String, required: true},
    lank: {type: String, required: true, default: "muggle"},
    choco: {
        choco: {type: Number, required: true, default: 1000},
        game: {
            wins: {type: Number, default: 0},
            loses: {type: Number, default: 0},
        },
        
    },
    attendance: [{type: Number},],
    createdAt: {type: Date, default: Date.now }
});

User.methods = {
    getChoco: function(){
        return this.choco.choco;
    },
    getLank: function(){
        if(this.choco.lank == undefined){
            this.choco.lank = "muggle";
        }
        return this.choco.lank;
    },
    addChoco: function(choco){
        this.choco.choco += choco * 1;
    },
    addAttend: function(date){
        this.attendance.push(date);
    },
    addItem: function(itemName, cnt){
        const itemInfo = config.items[itemName];
        if(this.choco < itemInfo.price * cnt) return null;
        this.items[itemInfo.index] += cnt;
        this.choco -= itemInfo.price * cnt;
        return this.choco;
    }
};

module.exports = mongoose.model('User', User);