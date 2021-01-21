const isMaster = (msg) => {
    return msg.guild.members.cache.find(user => user.id == msg.author.id).hasPermission('MANAGE_CHANNELS');
};

const getTime = (word)=>{
    if(word.length == 0) return 0;
    const type = "dhms";
    const typeCount = [1000 * 60 * 60 * 24, 1000 * 60 * 60, 1000 * 60, 1000];
    let ms = 0;
    for(let i = 0 ; i < word.length; i++){
        const timeType = type.indexOf(word[i].slice(-1));
        const time = word[i].slice(0, -1);
        if(isNaN(Number(time))) return null;
        if(timeType == -1) return null;
        console.log(typeCount[timeType]);
        ms += Number(time) * typeCount[timeType];
    }
    return ms;
};

const getMention = (users, mention) => {
    if (!mention) return;
  
      if (mention.startsWith('<@') && mention.endsWith('>')) {
          mention = mention.slice(2, -1);
  
          if (mention.startsWith('!')) {
              mention = mention.slice(1);
          }
      const user = users.cache.get(mention);
      if(!user) return;
      console.log("user get success");
          return user; 
      }
};

module.exports = {
    isMaster: isMaster,
    getTime: getTime,
    getMention: getMention
};