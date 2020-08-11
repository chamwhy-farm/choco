const { getMention } = require("../util.js");

require("../util.js");


const muteUser = async (msg, word, users) => {
    word.slice(2);
    if(word.length === 0){
        msg.reply("뮤트할 유저를 멘션해주세요");
        return;
    } 
    const user = getMention(users, word[0]);
    if(!user){
        msg.reply("형식에 알맞게 입력해주세욧");
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
};

const unmuteUser = () => {

};




module.exports = {
    mute: muteUser,
    unmute: unmuteUser
};