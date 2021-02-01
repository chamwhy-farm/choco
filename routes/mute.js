'use strict';

const util = require("../util.js");



const muteUser = async (msg, users) => {
    let word = msg.content.split(' ');
    word = word.slice(2); 
    if(word.length === 0){
        msg.reply("뮤트할 유저를 멘션해주세요");
        return;
    } 
    const user = util.getMention(msg);
    if(!user){
        msg.reply("형식에 알맞게 입력해주세욧"); 
        msg.reply("```"+word[0]+"```");
        return;
    } 
     
    console.log(word[0]);
    let muteRole = msg.guild.roles.cache.find(role => role.name === "mute");
    if(!muteRole) {
        await msg.guild.roles.create({
            data: {
                name: "mute",
                color: "RED",
            },
            reason: "mute user"
        });
        muteRole = msg.guild.roles.cache.find(role => role.name === "mute");
        await msg.channel.overwritePermissions(muteRole, { 'SEND_MESSAGES': false }, "mute user");
    }
    if(word.length > 1){
        const ms = util.getTime(word.slice(1)); 
        if(!ms){
            msg.reply("형식에 알맞게 입력해주세요");
            return;
        }
        console.log("nooooo\n" + user);
        user.roles.add(muteRole);
        setTimeout(()=>{
            user.roles.remove(muteRole);
            
        }, ms);
    }else{
        user.roles.add(muteRole);
    }
    msg.reply("뮤트 완료하였습니다");
};

const unmuteUser = async (msg, users) => {
    let word = msg.content.split(' ');
    word = word.slice(2); 
    if(word.length === 0){
        msg.reply("언뮤트할 유저를 멘션해주세요");
        return;
    } 
    const user = util.getMention(msg);
    if(!user){
        msg.reply("형식에 알맞게 입력해주세욧");
        msg.reply("```"+word[0]+"```");
        return;
    } 
    let muteRole = msg.guild.roles.cache.find(role => role.name === "mute");
    if(!muteRole) {
        await msg.guild.roles.create({
            data: {
                name: "mute",
                color: "red",
                deny: ["SEND_MESSAGES"]
            },
            reason: "mute user"
        });
        muteRole = msg.guild.roles.cache.find(role => role.name === "mute");
        await msg.channel.overwritePermissions(muteRole, { 'SEND_MESSAGES': false }, "mute user");
    }
    user.roles.remove(muteRole);
    msg.reply("언뮤트 완료하였습니다");
};




module.exports = {
    mute: muteUser,
    unmute: unmuteUser
};