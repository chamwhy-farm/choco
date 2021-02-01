'use strict';

require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const mongoose = require('mongoose');


//상수
const token = process.env.token;
const password = process.env.password;

//util modules 
const util = require('./util');

//data
const config = require('./config.json');


//routes
const chocoRoute = require('./routes/choco');
const muteRoute = require('./routes/mute');
const attRoute = require('./routes/attendance');
const chRoute = require('./routes/channels');
const qaRoute = require('./routes/question');
const guild = require('./schemas/guild');



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




const invites = {};

const wait = require('util').promisify(setTimeout);


//시작
client.on('ready', async () => {
    await wait(1000);

  // Load all invites for all guilds and save them to the cache.
  client.guilds.cache.forEach(g => {
    g.fetchInvites().then(guildInvites => {
      invites[g.id] = guildInvites;
    });
  });
});

client.on('guildMemberAdd', member => {
	
    member.guild.fetchInvites().then(async guildInvites => {
        const ei = invites[member.guild.id];
        invites[member.guild.id] = guildInvites;
        const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
        const inviter = client.users.cache.get(invite.inviter.id);
        const inviterChoco = await util.getUser(inviter.id, inviter, member.guild);
        const inviteGuild = await util.getGuild(member.guild.id);
        inviterChoco.addChoco(500, inviteGuild);
        inviterChoco.save();
        const channel = member.guild.channels.cache.find(ch => ch.name === '대문');
        if(!channel) return;
        channel.send(`MHU서버에 오신걸 환영합니다, ${member.user.tag}! (${inviter.tag} 500초코 추가)`);
    });
	
});


async function hongbo(msg){
    if(msg.channel.name != '홍보') return;
    if(util.isMaster(msg)) return;
    const userDB = await util.getUser(msg.author.id, msg.member, msg.guild);
    const guildDB = await util.getGuild(msg.guild.id);
    if(userDB.getChoco() < 1000){
        msg.reply('초코가 부족합니다 (1000초코)\n - 5초 뒤 삭제될 예정입니다').then(m=>m.delete(5000));
        msg.delete(5000);
    }else{
        userDB.addChoco(-2000, guildDB);
        userDB.save();
    }
}

//메시지
client.on('message', async msg => {
    await hongbo(msg);
    const qaCh = msg.guild.channels.cache.find(ch => ch.name == '퀴즈');
    //초코 사용
    if(!util.isCall(msg)) return;
    const word = msg.content.split(' ');
    //mongoose load
    const userDB = await util.getUser(msg.author.id, msg.member, msg.guild);
    const guildDB = await util.getGuild(msg.guild.id);
    console.log(userDB.getChoco());
    userDB.addChoco(-1000, guildDB);
    await userDB.save();
    console.log(userDB.getChoco());
    

    //명령어
    const order = msg.content.split(' ');

    switch(order[1]){

        case '도움말':
        case '도움':
        case '도움!':
        case 'help':
        case 'ㄷㅇ':
            msg.reply({ embed: config.helpEmbed });
            break;

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
            msg.reply('2/1 부터 시작됩니다 초코 2.0');
            //msg.reply(await attRoute.attendance(msg, Discord.MessageAttachment, guildDB));
            break;

        case "작품추가":
        case "작품신청":
        case "채널추가":
        case "addProject":
        case "채널신청":
            chRoute.askAddingProject(msg, userDB, guildDB);
            break;


        case "정답":
        case "answer":
        case "ㅈㄷ":
        case "답":
        case "해답":
            // if(!chRoute.isMas(msg, guildDB)){
            //     msg.reply("일시적 점검 상태입니다");
            //     return;
            // }
            await qaRoute.answer(msg, guildDB, userDB);
            break;
        
        case "초코양":
        case "초코":
        case "choco":
        case "cc":
            const replayMsg = await chocoRoute.getChoco(msg, Discord.MessageAttachment, guildDB);
            console.log(replayMsg);
            msg.reply(replayMsg);
            break;

        case "랭킹":
        case "lank":
        case "랭크":
        case "ㄹㅋ":
            chocoRoute.lank(msg, guildDB);
            break;

            
        case '홍보 신청':
            await chocoRoute.applyPromotion(msg);
            break;

        
        /* master orders */
        case "초코뺏어":
            if(!util.isMaster(msg)){
                msg.reply('권한이 없습니다');
                return;
            }
            const minusChocoUser = util.getMention(msg);
            const mUserDB = await util.getUser(minusChocoUser.id, minusChocoUser, msg.guild);
            await mUserDB.addChoco(-1* word[3], guildDB);
            await mUserDB.save();
            msg.reply(`${minusChocoUser.username}에게 ${word[3]}만큼 초코를 뺏었습니다!`);
            break;

        case "초코더해":
            if(!util.isMaster(msg)){
                msg.reply('권한이 없습니다');
                return;
            }
            const plusChocoUser = util.getMention(msg);
            console.log(plusChocoUser);
            const pUserDB = await util.getUser(plusChocoUser.user.id, plusChocoUser, msg.guild);
            await pUserDB.addChoco(word[3], guildDB);
            await pUserDB.save();
            msg.reply(`${plusChocoUser.user.username}에게 ${word[3]}만큼 초코를 지급했습니다!`);
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
            await chRoute.setChMas(msg, guildDB);
            break;

        case '채널삭제':
        case '채삭':
        case 'delCh':
        case 'deleteChannel':
            if(!chRoute.isMas(msg, guildDB)){
                msg.reply("권한이 없습니다");
                return;
            }
            await chRoute.delCh(msg, guildDB);
            break;

        case '랭킹업데이트':
        case '랭업':
        case 'lankUpdate':
            if(!util.isMaster(msg)){
                msg.reply('권한이 없습니다!');
                return;
            }
            await choco.lankingUpdate(msg, guildDB);
            break;

        case '퀴즈':
        case 'ㅋㅈ':
            qaRoute.question(qaCh);
            break;

        case '길드초기화':
            const chocoUsers = msg.guild.members.cache.filter(m => {
                return m.roles.cache.find(r => r.name == 'chocouser');
            });
            const students = {};
            for(let i of chocoUsers){
                const chocouser = await getUser(i[1].user.id, i[1], msg.guild);
                students[i[1].user.id] = chocouser.getChoco();
            }
            guildDB.students = students;
            await guildDB.save();
            console.log(students);
            msg.reply('초기화 완료하였습니다!');
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