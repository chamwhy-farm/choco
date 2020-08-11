const winston = require("winston");
const moment = require("moment");
const fs = require("fs");
const logDir = "./log";

const log = (info) => {
    console.log(info);
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }
      
    var logger = new (winston.Logger)({
        transports: [
          new (winston.transports.Console)({
           colorize: true,
           level: 'info',
           timestamp: function(){             //한국 시간 나타내는법
            return moment().format("YYYY-MM-DD HH:mm:ss");
          }
         }),
          new (require('winston-daily-rotate-file'))({
            level: 'info',
            filename: `${logDir}/log.log`,
            prepend: true,
            timestamp: function(){             //한국 시간 나타내는법
                return moment().format("YYYY-MM-DD HH:mm:ss");
              }
          })
        ]
      });
    try{
      logger.info(info);
    }catch(exception){
      logger.error("ERROR=>" +exception);
    }
};


const getTime = (word)=>{
    if(word.length == 0) return 0;
    const type = "dhms";
    const typeCount = [1000 * 60 * 60 * 24, 1000 * 60 * 60, 1000 * 60, 1000];
    let ms;
    for(let i = 0 ; i < word.length; i++){
        const timeType = type.indexOf(word[i].slice(0, -1));
        
        const time = word[i].slice(-1);
        if(isNaN(Number(time))) return null;
        if(timeType == -1) return null;
        ms += Number(time) * typeCount[timeType];
    }
    return ms;
};

const config = require("./config.json");

const getWord = (msg, type) => {
    const answer = config.word[type][msg];
    if(answer === undefined) return null;
    return answer[getRandomInt(0, answer.length)];
};

const getRandomInt = (startInt, lastInt)=>{
    return Math.floor(Math.random() * (lastInt - startInt)) + startInt;
}

const getLang = () => {

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
		return user;
	}
};

module.exports = {
    log: log,
    getTime: getTime,
    getWord: getWord,
    getRandomInt: getRandomInt,
    getLang: getLang,
    getMention: getMention
}