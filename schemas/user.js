const mongoose = require("mongoose");
const ObjectId = require("mongoose/lib/schema/objectid");
const { config } = require("winston");
const Schema = mongoose.Schema;

const User = new Schema({
    userID: {type: String, required: true},
    lv: {type: Number, required: true, default: 1},
    choco: {
        choco: {type: Number, required: true, default: 1000},
        game: {
            wins: {type: Number, default: 0},
            loses: {type: Number, default: 0},
        },
        
    },
    items: [{type: Number, default: 0}],
    attendance: [{type: Number},],
    createdAt: {type: Date, default: Date.now }
});

User.methods = {
    getChoco: function(){
        return this.choco.choco;
    },
    getLv: function(){
        if(this.choco.lv == undefined){
            this.choco.lv = 1;
        }
        return this.choco.lv;
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