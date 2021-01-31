const mongoose = require("mongoose");
const ObjectId = require("mongoose/lib/schema/objectid");
const { config } = require("winston");
const Schema = mongoose.Schema;

const configjson = require("../config.json");

const User = new Schema({
    userID: {type: String, required: true},
    choco: {
        choco: {type: Number, required: true, default: 1000},
        game: {
            wins: {type: Number, default: 0},
            loses: {type: Number, default: 0},
        },
        
    },
    items: [{type: Number, default: 0}],
    attendance: [{type: Number},],
    projects: {},
    lastAns: {type: Number, default: -1},
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
    addChoco: function(choco, guildDB){
        this.choco.choco += choco * 1;
        if(this.choco.choco < 0){
            this.choco.choco = 0;
        }
        guildDB.addChoco(this.choco.choco, this.userID);
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
    },
    isUserProjecting: function(){
        let projecting = false;
        for(let i in this.projects){
            if(!this.projects[i]){
                projecting = true;
                break;
            }
        }
        return projecting;
    },
    answer: function(qaCnt){
        this.lastAns = qaCnt;
    }
};

module.exports = mongoose.model('User', User);