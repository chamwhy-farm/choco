require('dotenv').config();

const fs = require("fs");

const Discord = require('discord.js');
const client = new Discord.Client();
const mongoose = require('mongoose');
const join = require('path').join;
const { createCanvas, loadImage } = require('canvas');

const models = join(__dirname, 'app/models');

const TOKEN = process.env.TOKEN;

require('./util');
const config = require('./config.json');
const { getLang, getWord, isMaster } = require('./util');

const muteRoute = require('./orders/mute');
const attendanceRoute = require('./orders/attendance');
const channelRoute = require('./orders/channels');
const shopRoute = require('./orders/shop');
const projectRoute = require('./orders/project');

const moduleUrl = './schemas';

const Guild = require('./schemas/guild.js');
const User = require('./schemas/user.js');
const user = require('./schemas/user.js');
const util = require('./util');



const db = mongoose.connection;
db.on('error', console.error);

db.once('open', ()=>{
  console.log('connect to mongoose server!');
});



mongoose.connect('mongodb://localhost/discord_choco', {
  keepAlive: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});




function isChocoUser(msg)
{
  User.findById
}



client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
  
    const word = msg.content.split(' ');
    let isCall = false;
    for(let head in config.callName){
      if(word[0].indexOf(config.callName[head]) != -1) isCall = true;
    }
    if(isCall){
      isChocoUser(msg);

      const lang = await getLang(msg.guild.id);
      console.log(lang);
    
      switch(word[1]){
        case '안녕':
        case 'hello':
        case 'hi':
        case '헬로':
        case '하이':
        case '안녕하세요':
          msg.reply(getWord('인사', lang));
          break;

        case "마스터":
        case "주인":
          msg.reply(isMaster(msg));
          break;

        case '링크':
        case 'link':
        case 'ㄹㅋ':
          msg.reply('여기에 접속해서 서버에 초코를 추가할 수 있습니다\nhttps://bit.ly/34KXxCA');
          break;
        
        case 'mute':
        case '뮤트':
        case 'ㅁㅌ':
        case '뮽':
          muteRoute.mute(msg, word, client.users);
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
        case 'at':
          const attendanceCanvas = await attendanceRoute.attendance(msg, word);
          const attachment = new Discord.MessageAttachment(attendanceCanvas.toBuffer(), 'attendance.png');
	        msg.reply(`your attendance`, attachment);
          break;
        
        case '채널삭제':
        case '채삭':
        case 'delCh':
        case 'deleteChannel':
          if(!isMaster(msg)){
            msg.reply("권한이 없습니다");
            return;
          }
          channelRoute.delCh(msg, word);
          break;

        case "초코양":
        case "초코":
        case "choco":
        case "cc":
          const usersChoco = await shopRoute.getChoco(msg);
          const chocoCanvas = createCanvas(900, 300);
          const chocoCtx = chocoCanvas.getContext('2d');
          util.createRoundBox(chocoCtx, 80, 900, 300, 0, 0, usersChoco, 'gray');
          const chocoment = new Discord.MessageAttachment(chocoCanvas.toBuffer(), `${msg.author.username}_choco.png`);
          msg.reply(`초코는 출석, 대답, 게임, 이벤트 등으로 얻을 수 있습니다`, chocoment);
          break;

        case "작품신청":
        case "ㅈㅍㅅㅊ":
          projectRoute.askAddingProject(msg, word);
          break;
      }
    }
});

client.login(TOKEN);
