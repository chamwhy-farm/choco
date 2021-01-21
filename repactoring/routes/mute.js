const { getMention, getTime } = require("../util.js");

const muteRoute = async (msg, users) => {
    const call = msg.content.split(" ");
    if(call.length < 3){
        msg.reply('형식에 알맞게 입력해주세요');
        return;
    }
    const userNode = getMention(users, call[2]);
    if(!userNode){
        msg.reply('형식에 알맞게 입력해주세요');
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
    if(call.length > 3){
        const ms = getTime(call[3]); 
        if(!ms){
            msg.reply("형식에 알맞게 입력해주세요");
            return;
        }
        console.log("nooooo\n" + userNode);
        userNode.roles.add(muteRole);
        setTimeout(()=>{
            userNode.roles.remove(muteRole);
            
        }, ms);
    }else{
        userNode.roles.add(muteRole);
    }
    msg.reply("뮤트 완료하였습니다");


};

module.exports = muteRoute;