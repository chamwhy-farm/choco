require("dotenv").config();

const Discord = require('discord.js');
const client = new Discord.Client();

const TOKEN = process.env.TOKEN;

require("./util");
const config = require("./config.json");
const { getLang, getWord } = require("./util");

const muteRoute = require("./orders/mute");
const attendanceRoute = require("./orders/attendance");

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    const word = msg.content.split(" ");
    if(config.callName.indexOf(word[0]) != -1){
      const lang = getLang();
    
      switch(word[1]){
        case "안녕":
        case "hello":
        case "hi":
        case "헬로":
        case "하이":
        case "안녕하세요":
          msg.reply(getWord("인사", lang));
          break;
        
        case "mute":
        case "뮤트":
        case "ㅁㅌ":
        case "뮽":
          muteRoute.mute(msg);
          break;

        case "unmute":
        case "언뮤트":
        case "ㅇㅁㅌ":
        case "언뮽":
          muteRoute.unmute(msg);
          break;

        case "출석":
        case "attend":
        case "attendance":
        case "ㅊㅅ":
        case "at":
          const attendanceCanvas = attendanceRoute.attendance(msg, word);
          const attachment = new Discord.MessageAttachment(attendanceCanvas.toBuffer(), 'attendance.png');
	        msg.reply(`your attendance`, attachment);
          break;
        
      }
    }
});

client.login(TOKEN);
