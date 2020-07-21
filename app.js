require("dotenv").config();

const Discord = require('discord.js');
const client = new Discord.Client();

const TOKEN = process.env.TOKEN;

require("./util");
const config = require("./config.json");

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    const word = msg.split(" ");
    if(config.callName.indexOf(word[0]) != -1){
        
    }
});

client.login(TOKEN);
