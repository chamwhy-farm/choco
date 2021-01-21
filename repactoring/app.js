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
const chocoRoute = require('./routes/choco.js');
const muteRoute = require('./routes/mute');
const attRoute = require('./routes/attendance');
const chRoute = require('./routes/channel');
const qaRoute = require('./routes/question');


//mongoose schemas
const Guile = require('./schemas/guild');
const User = require('./schemas/user');

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


/* functions */

//create
function createUser(userID){
    return User.create({userID: userID});
}
function createGuild(guildID){
    return Guild.create({guildID: guildID});
}

//get
function getUser(userID){
    let userDB = User.findOne({userID: userID});
    if(!userDB){
        userDB = createUser(userID);
    }
    return userDB;
}
function getGuild(guildID){
    let guildDB = Guild.findOne({guildID: guildID});
    if(!guildDB){
        guildDB = createGuild(guildID);
    }
    return guildDB;
}



//bots

//시작
client.on('ready', () => {

});

//메시지
client.on('message', async msg => {
    //초코 사용
    if(!util.isCall(msg)) return;
    
    //mongoose load
    const userDB = getUser(msg.author.id);
    const guildDB = getGuild(msg.guild.id);


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
            if(isMaster(msg)){
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
            muteRoute.unmute(msg, word, client.users);
            break;
        
        case '출석':
        case 'attend':
        case 'attendance':
        case 'ㅊㅅ':
        case 'ct':
            msg.reply(await attRoute.attendance(msg, Discord.MessageAttachment));
            break;

        case '채널삭제':
        case '채삭':
        case 'delCh':
        case 'deleteChannel':
            if(!isMaster(msg)){
                msg.reply("권한이 없습니다");
                return;
            }
            chRoute.delCh(msg);
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
            qaRoute.answer(msg);
            break;
        
        case "초코양":
        case "초코":
        case "choco":
        case "cc":
            msg.reply(chocoRoute.getChoco(msg));
            break;
    }
});

client.login(token);