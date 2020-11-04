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
const questionRoute = require('./orders/question');

const moduleUrl = './schemas';

const Guild = require('./schemas/guild.js');
const User = require('./schemas/user.js');
const user = require('./schemas/user.js');
const util = require('./util');
const { discriminator } = require('./schemas/guild.js');



const db = mongoose.connection;
db.on('error', console.error);

db.once('open', ()=>{
  console.log('connect to mongoose server!');
});
const url = `mongodb+srv://node:${process.env.password}@choco.vqljg.mongodb.net/choco?retryWrites=true&w=majority`;

mongoose.connect(url, {
  keepAlive: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

/*
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://chamwhy:<password>@cluster0.vqljg.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
*/



function isChocoUser(msg)
{
  User.findById
}

const invites = {};

// A pretty useful method to create a delay without blocking the whole script.
const wait = require('util').promisify(setTimeout);



client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  // "ready" isn't really ready. We need to wait a spell.
  await wait(1000);

  // Load all invites for all guilds and save them to the cache.
  client.guilds.cache.forEach(g => {
    g.fetchInvites().then(guildInvites => {
      invites[g.id] = guildInvites;
    });
  });
});


client.on('guildMemberAdd', async (member) => {
  // To compare, we need to load the current invite list.
  member.guild.fetchInvites().then(async (guildInvites) => {
    // This is the *existing* invites for the guild.
    const ei = invites[member.guild.id];
    // Update the cached invites for the guild.
    invites[member.guild.id] = guildInvites;
    // Look through the invites, find the one for which the uses went up.
    const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
    // This is just to simplify the message being sent below (inviter doesn't have a tag property)
    const inviter = client.users.get(invite.inviter.id);
    // Get the log channel (change to your liking)
    const logChannel = member.guild.channels.cache.find(channel => channel.name === "대문");

    let user = await User.findOne({userID: inviter.id});
    if(!user){
        console.log("create new user! name: " + msg.author.username);
        user = await createUser(msg.author.id);
    }
    user.addChoco(100);
    // A real basic message with the information we need. 
    logChannel.send(`환영합니다 ${member.user.tag}님. \`${inviter.tag} +100\``);
  });
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
          msg.reply("헤헤");
          //msg.reply(getWord('인사', lang));
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
          const {attendanceCanvas, answer} = await attendanceRoute.attendance(msg, word);
          if(attendanceCanvas == null) return;
          const attachment = new Discord.MessageAttachment(attendanceCanvas.toBuffer(), 'attendance.png');
	        msg.reply(answer, attachment);
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
          const {chococan, chocotext} = await shopRoute.getChoco(msg);
          const chocoment = new Discord.MessageAttachment(chococan.toBuffer(), `${msg.author.username}_choco.png`);
          msg.reply(chocotext, chocoment);
          break;

        case "레벨":
        case "렙":
        case "lv":
        case "level":
          const {lvcan, lvtext} = await shopRoute.getLv(msg);
          const lvment = new Discord.MessageAttachment(lvcan.toBuffer(), `${msg.author.username}_lv.png`);
          msg.reply(lvtext, lvment);
          break;
          
        case "작품신청":
        case "ㅈㅍㅅㅊ":
          projectRoute.askAddingProject(msg, word);
          break;

        case "상점":
        case "시장":
        case "market":
          shopRoute.shop(msg, Discord.MessageEmbed);
          break;

        case "구입":
        case "구매":
        case "ㄱㅁ":
        case "내놔":
          const {buyCanvas, itemName} = shopRoute.buy(msg);
          const buyment = new Discord.MessageAttachment(buyCanvas.toBuffer(), 'item.png');
          msg.reply(`${itemName}을 구매했습니다`, buyment);
          break;

        case "invite":
        case "초대":
        case "ㅊㄷ":
          const invites = await msg.guild.fetchInvites();
          console.log(invites);
          invites.forEach(invite => {
            const {uses, inviter} = invite;
            const { username, discriminator } = inviter;
            const name = `${username}#${discriminator}`;
            console.log(invite);
            msg.reply(name, uses);
          });
          break;
      }
    }
});

client.login(TOKEN);
