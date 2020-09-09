const { getMention, getTime } = require("../util.js");



const muteUser = async (msg, word, users) => {
    word = word.slice(2); 
    if(word.length === 0){
        msg.reply("뮤트할 유저를 멘션해주세요");
        return;
    } 
    const user = getMention(users, word[0]);
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
    }
    const muteUserTag = msg.guild.members.cache.find(user => user.id == msg.author.id);
    if(word.length > 1){
        const ms = getTime(word.slice(1));
        if(!ms){
            msg.reply("형식에 알맞게 입력해주세요");
            return;
        }
        setTimeout(()=>{
            muteUserTag.roles.remove(muteRole);
        }, ms);
    }
    muteUserTag.roles.add(muteRole);
    msg.reply("뮤트 완료하였습니다");
};

const unmuteUser = async (msg, word, users) => {
    word = word.slice(2); 
    if(word.length === 0){
        msg.reply("언뮤트할 유저를 멘션해주세요");
        return;
    } 
    const user = getMention(users, word[0]);
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
    }
    const muteUserTag = msg.guild.members.cache.find(user => user.id == msg.author.id);
    
    muteUserTag.roles.remove(muteRole);
    msg.reply("언뮤트 완료하였습니다");
};




module.exports = {
    mute: muteUser,
    unmute: unmuteUser
};