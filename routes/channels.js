'use strict';

const util = require('../util');

const setChMas = (msg, guildDB) => {
    guildDB.chMas[msg.channel.id] = msg.author.id;
    guildDB.save();
};

const isMas = (msg, guildDB) => {
    if(util.isMaster(msg)) return true;

    return guildDB.chMas[msg.channel.id] == msg.author.id;
};

const delCh = (msg, guildDB) => {
    const word = msg.content.split(' ');
    console.log(word);
    if(word.length == 2){
        msg.reply('5분 뒤에 이 채널은 삭제됩니다');
        setTimeout(()=>{
            msg.channel.delete()
            .then(console.log)
            .catch(console.error);
        }, 5 * 60 * 1000);
    }else{
        const ms = util.getTime(word.slice(2));
        if(!ms){
            msg.reply('형식에 알맞게 입력해주세요');
            console.log(ms);
            return;
        }
        msg.reply(`${Math.round(ms/1000)}초 후에 이 채널은 삭제됩니다`);
        setTimeout(()=>{
            msg.channel.delete()
            .then(console.log)
            .catch(console.error);
        }, ms);
    }
    delete guildDB.chMas[msg.channel.id];
    guildDB.save();
};


const askAddingProject = (msg, userDB) => {
    const word = msg.content.split(' ');
    if(!msg.member.roles.cache.find(r => r.name === "sophomore")){
        msg.reply("2학년인 sophomore부터 가능합니다");
        return;
    }
    if(word.length <= 2){
        msg.reply("작품의 이름을 작성해주세요");
        return;
    }
    if(userDB.isUserProjecting()){
        msg.reply('이미 작품을 진행중입니다!');
        return;
    }
    if(userDB.projects.hasOwnProperty(word.slice(2))){
        msg.reply('이미 같은 이름의 작품이 있습니다!');
        return;
    }
    let channelCategory;
    if(msg.channel.name == "작품신청"){
        channelCategory = msg.guild.channels.cache.find(c => c.name == "unity projects" && c.type == "category");
    }else if(msg.channel.name == "다른작품신청"){
        channelCategory = msg.guild.channels.cache.find(c => c.name == "other projects" && c.type == "category");
    }
    console.log(channelCategory);
    msg.reply(`**${word.slice(2)}-${msg.author.username}**로 설정됩니다\n생성하시겠습니까?`);
    msg.react('👍').then(() => msg.react('👎'));

    const filter = (reaction, user) => {
        return ['👍', '👎'].includes(reaction.emoji.name) && user.id === msg.author.id;
    };
    
    msg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
        .then(collected => {
            const reaction = collected.first();
    
            if (reaction.emoji.name === '👍') {
                msg.guild.channels.create(`${word.slice(2)}-${msg.author.username}`)
                .then(channel => {
                    if (!channelCategory) throw new Error("Category channel does not exist");
                    channel.setParent(channelCategory.id);
                }).catch(console.error);
                msg.reply('채널생성을 완료하였습니다');

                userDB.projects[word.slice(2)] = false;
                userDB.save();
            }
            else {
                msg.reply('채널생성을 취소하였습니다');
            }
        })
        .catch(collected => {
            console.log(`After a minute, only ${collected.size} out of 4 reacted.`);
            msg.reply('시간이 만료 되었으니 해당 작동은 중지합니다');
        });
};


module.exports = {
    setChMas: setChMas,
    isMas: isMas,
    delCh: delCh,
    askAddingProject: askAddingProject
}