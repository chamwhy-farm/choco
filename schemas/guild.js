const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Guild = new Schema({
    gID: {type: Number, required: true},
    mute: {
        choco: [Number],
        msg: [Number],
        promotion: [Number],

    },
    permission: {
        mng: [Number],
        mute: [Number],

    },
    set: {
        lang: {type: String, default: "eng"},
        isPro: Boolean,
        promotion: Boolean
    },
    chMas: [
        {
            channelName: {type: String},
            master: {type: Number}
        },
    ],
    qa:{
        qaCnt: {type: Number, default: 0},
        isQa: {type: Boolean, default: false}
    },
    students: {}
    
});

Guild.methods = {
    addChoco: function(choco, userID){
        if(!this.students){
            this.students = {};
        }
        this.students[userID] = choco;
    },
    getStudents: function(userIDList){
        console.log(this.students, userIDList);
        const students = this.students;
        userIDList.sort(function (a, b) { 
            if(!students[a]){
                if(!students[b]){
                    return 0;
                }else{
                    return 1;
                }
            }else{
                if(!students[b]){
                    return -1;
                }
            }
            return students[a] > students[b] ? -1 : students[a] < students[b] ? 1 : 0;  
        });
        return userIDList;
    }
};
module.exports = mongoose.model("Guild", Guild);