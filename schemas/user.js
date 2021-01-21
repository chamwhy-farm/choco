const mongoose = require("mongoose");
const ObjectId = require("mongoose/lib/schema/objectid");
const { config } = require("winston");
const Schema = mongoose.Schema;

const configjson = require("../config.json");

const User = new Schema({
    userID: {type: String, required: true},
    lv: {type: Number, required: true, default: 1},
    lank: {type: String, required: true, default: "muggle"},
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
    getLank: function(){
        if(this.choco.lank == undefined){
            const lankList = configjson.lank;
            let key;
            for(key in lankList){
                if(lankList[key] != -1 && this.choco.lv > lankList[key]){
                    break;
                }
            }
            this.choco.lank = key;

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