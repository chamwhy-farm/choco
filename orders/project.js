const askAddingProject = (msg, word) => {
    if(!msg.member.roles.cache.find(r => r.name === "sophomore")){
        msg.reply("2학년인 sophomore부터 가능합니다");
        return;
    }
    if(word.length <= 2){
        msg.reply("작품의 이름을 작성해주세요");
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
    askAddingProject: askAddingProject
}