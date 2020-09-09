const winston = require("winston");
const moment = require("moment");
const fs = require("fs");
const logDir = "./log";


const Guild = require("./schemas/guild");
const User = require("./schemas/user");


const isMaster = (msg) => {
  return msg.guild.members.cache.find(user => user.id == msg.author.id).hasPermission('MANAGE_CHANNELS');
};

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

const config = require("./config.json");
const { NONAME } = require("dns");

const getWord = (msg, type) => {
    const answer = config.word[type][msg];
    if(answer === undefined) return null;
    return answer[getRandomInt(0, answer.length)];
};

const getRandomInt = (startInt, lastInt)=>{
    return Math.floor(Math.random() * (lastInt - startInt)) + startInt;
}

const getLang = async (gID) => {

  return await Guild.findOne({gID: gID}).then((err, doc) => {
    //if(err) throw new Error(err);
    // if(!doc) return null;
    return "kor";
    // return doc.set.lang;
  });
  
  
  
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

const createRoundBox = (ctx, r, w, h, x1, y1, text, textC) => {
  ctx.beginPath();
  ctx.arc(x1 + r, y1 + r, r, Math.PI, Math.PI*1.5, false);
  ctx.fill();
  ctx.fillRect(x1 + r, y1, w - 2*r, r);
  ctx.arc(x1 + w - r, y1 + r, r, Math.PI*1.5, Math.PI*2, false);
  ctx.fill();
  ctx.fillRect(x1, y1 + r, w, h - 2*r);
  ctx.arc(x1 + r, y1 + h - r, r, Math.PI*0.5, Math.PI*1, false);
  ctx.fill();
  ctx.fillRect(x1 + r, y1 + h - r, w - 2*r, r);
  ctx.arc(x1 + w - r, y1 + h - r, r, 0, Math.PI*0.5, false);
  ctx.fill();
  ctx.closePath();
  if(text != null){
      ctx.fillStyle = textC;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, x1+w/2, y1+h/2);
  }
};

const createUser = async (userID) => {
  const newUser = new User({
    userID: userID
  });
  return await newUser.save().then(saveUser => {
    return saveUser;
  });
};

module.exports = {
    log: log,
    getTime: getTime,
    getWord: getWord,
    getRandomInt: getRandomInt,
    getLang: getLang,
    getMention: getMention,
    isMaster: isMaster,
    createRoundBox: createRoundBox,
    createUser: createUser
}