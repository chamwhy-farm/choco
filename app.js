require('dotenv').config();

const fs = require("fs");

const Discord = require('discord.js');
const client = new Discord.Client();
const mongoose = require('mongoose');

const TOKEN = process.env.TOKEN;

require('./util');
const config = require('./config.json');
const { getLang, getWord } = require('./util');

const muteRoute = require('./orders/mute');
const attendanceRoute = require('./orders/attendance');

fs.readFileSync('./schemas')
  .forEach(file => require(join('./schemas', file)));

const db = mongoose.connection;
db.on('error', console.error);

db.once('open', ()=>{
  console.log('connect to mongoose server!');
});

mongoose.connect('mongodb://localhost/discord_choco');



client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    const word = msg.content.split(' ');
    if(config.callName.indexOf(word[0]) != -1){
      const lang = getLang();
    
      switch(word[1]){
        case '안녕':
        case 'hello':
        case 'hi':
        case '헬로':
        case '하이':
        case '안녕하세요':
          msg.reply(getWord('인사', lang));
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
          muteRoute.unmute(msg);
          break;

        case '출석':
        case 'attend':
        case 'attendance':
        case 'ㅊㅅ':
        case 'at':
          const attendanceCanvas = attendanceRoute.attendance(msg, word);
          const attachment = new Discord.MessageAttachment(attendanceCanvas.toBuffer(), 'attendance.png');
	        msg.reply(`your attendance`, attachment);
          break;
        
        case '':
      }
    }
});

client.login(TOKEN);
