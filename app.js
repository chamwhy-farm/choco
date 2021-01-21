require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const mongoose = require('mongoose');


//상수
const token = process.env.token;
const password = process.env.password;

//util modules 
const util = require('./util');
const fs = require('fs');
const join = require('path').join;


//data
const config = require('./config.json');


//routes
const chocoRoute = require('./routes/choco');
const muteRoute = require('./routes/mute');
const attRoute = require('./routes/attendance');
const chRoute = require('./routes/channels');
const qaRoute = require('./routes/question');


//mongoose schemas
const Guile = require('./schemas/guild');
const User = require('./schemas/user');
const { cli } = require('winston/lib/winston/config');
const user = require('./schemas/user');
const choco = require('./routes/choco');

//mongoose connect
(()=>{
    const db = mongoose.connection;
    const url = `mongodb+srv://node:${password}@choco.vqljg.mongodb.net/choco?retryWrites=true&w=majority`;

    db.on('error', console.error);
    db.once('open', () => {
        console.log('connected to mongoose server!');
    });

    mongoose.connect(url, {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
})();







//시작
client.on('ready', async () => {
    const qaCh = client.channels.cache.find(c => c.name == '퀴즈');
    async function askQuestion(){
        await qaRoute.question(qaCh);
    }
    askQuestion();
    setTimeout(async()=>{
        await askQuestion();
    }, util.getRandomInt(1000 * 3600 * 24, 1000 * 3600 * 24 * 4));
});



//메시지
client.on('message', async msg => {
    //초코 사용
    if(!util.isCall(msg)) return;
    const word = msg.content.split(' ');
    //mongoose load
    const userDB = await util.getUser(msg.author.id);
    const guildDB = await util.getGuild(msg.guild.id);
    /* test */
    guildDB.qa.qaCnt = 0;
    guildDB.qa.isQa = true;
    guildDB.save();
    userDB.lastAns = -1;
    userDB.save();

    //명령어
    const order = msg.content.split(' ');

    switch(order[1]){

        case '안녕':
        case 'hello':
        case 'hi':
        case '헬로':
        case '하이':
        case '안녕하세요':
            msg.reply(util.getWord('인사'));
            break;

        case "마스터":
        case "주인":
            if(util.isMaster(msg)){
                msg.reply("네, 주인님");
            }else{
                msg.reply("누구신가요?");
            }
            break;

        case '링크':
        case 'link':
        case 'ㄹㅋ':
            msg.reply('');
            break;

        case 'mute':
        case '뮤트':
        case 'ㅁㅌ':
        case '뮽':
            muteRoute.mute(msg, client.users);
            break;

        case 'unmute':
        case '언뮤트':
        case 'ㅇㅁㅌ':
        case '언뮽':
            muteRoute.unmute(msg, client.users);
            break;
        
        case '출석':
        case 'attend':
        case 'attendance':
        case 'ㅊㅅ':
        case 'ct':
            msg.reply(await attRoute.attendance(msg, Discord.MessageAttachment));
            break;

        case "작품추가":
        case "작품신청":
        case "채널추가":
        case "addProject":
        case "채널신청":
            chRoute.askAddingProject(msg, userDB);
            break;

        case "작품신청":
        case "ㅈㅍㅅㅊ":
            chRoute.addProject(msg);
            break;

        case "정답":
        case "answer":
        case "ㅈㄷ":
        case "답":
        case "해답":
            if(!chRoute.isMas(msg, guildDB)){
                msg.reply("일시적 점검 상태입니다");
                return;
            }
            qaRoute.answer(msg, guildDB, userDB);
            break;
        
        case "초코양":
        case "초코":
        case "choco":
        case "cc":
            msg.reply(chocoRoute.getChoco(msg, Discord.MessageAttachment));
            break;

        
        /* master orders */
        case "초코뺏어":
            if(!util.isMaster(msg)){
                msg.reply('권한이 없습니다');
                return;
            }
            const minusChocoUser = util.getMention(client.users, word[2]);
            const mUserDB = await util.getUser(minusChocoUser.id);
            mUserDB.addChoco(-1* word[3]);
            mUserDB.save();
            break;

        case "초코더해":
            if(!util.isMaster(msg)){
                msg.reply('권한이 없습니다');
                return;
            }
            const plusChocoUser = util.getMention(client.users, word[2]);
            const pUserDB = await util.getUser(plusChocoUser.id);
            pUserDB.addChoco(word[3]);
            pUserDB.save();
            break;
        
        case '채마':
        case '채널주인':
        case '채널양도':
        case 'channelMaster':
        case 'chMas':
            if(!util.isMaster(msg)){
                msg.reply('권한이 없습니다');
                return;
            }
            chRoute.setChMas(msg, guildDB);
            break;

        case '채널삭제':
        case '채삭':
        case 'delCh':
        case 'deleteChannel':
            if(!chRoute.isMas(msg, guildDB)){
                msg.reply("권한이 없습니다");
                return;
            }
            chRoute.delCh(msg, guildDB);
            break;

        case '랭킹업데이트':
        case '랭업':
        case 'lankUpdate':
            if(!util.isMaster(msg)){
                msg.reply('권한이 없습니다!');
                return;
            }
            choco.lankingUpdate(msg);
            break;













        // case "상점":
        // case "시장":
        // case "market":
        //   shopRoute.shop(msg, Discord.MessageEmbed);
        //   break;

        // case "구입":
        // case "구매":
        // case "ㄱㅁ":
        // case "내놔":
        //   const {buyCanvas, itemName} = shopRoute.buy(msg);
        //   const buyment = new Discord.MessageAttachment(buyCanvas.toBuffer(), 'item.png');
        //   msg.reply(`${itemName}을 구매했습니다`, buyment);
        //   break;

        //   case "invite":
        //   case "초대":
        //   case "ㅊㄷ":

        //     const invites = await msg.guild.fetchInvites();
        //     console.log(invites);
        //     invites.forEach(invite => {
        //       const {uses, inviter} = invite;
        //       const { username, discriminator } = inviter;
        //       const name = `${username}#${discriminator}`;
        //       console.log(invite);
        //       // msg.reply(name, uses);
        //     });
        //     break;
        // }
    }
  });
  
  client.login(token);