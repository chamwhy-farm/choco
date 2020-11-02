const { createCanvas, loadImage } = require('canvas');
const { createRoundBox, createUser } = require('../util');

const User = require("../schemas/user");
// const { config } = require('winston');
const config = require('../config.json');




function getProduct(product){
    console.log(product);
}

const shop = (msg) => {
    for(product in config.shop){
        getProduct(product);
    }
};

const buy = async (msg) => {
    const canvas = createCanvas(800, 200);
    const ctx = canvas.getContext('2d');

    let user = await User.findOne({userID: msg.author.id});
    if(!user){
        console.log("create new user! name: " + msg.author.username);
        user = await createUser(msg.author.id);
    }

    const itemName = "item";
    const itemCnt = 1;
    const lastChoco = user.addItem(itemName, itemCnt);
    if(lastChoco != null){
        
    }else{
        msg.reply("초코가 부족합니다");
    }


    
};

const getChoco = async (msg) => {
    const user = await getUser(msg.author.id);
    console.log(user);
    const usersChoco = user.getChoco();
    const userLV = user.getLv();
    const chocoCanvas = createCanvas(900, 300);
    const chocoCtx = chocoCanvas.getContext('2d');

    chocoCtx.save();
    chocoCtx.font = "100px Impact";
    chocoCtx.fillStyle = "#1a1a1a";

    createRoundBox(chocoCtx, 40, 900, 300, 0, 0, null, null);
    chocoCtx.fillStyle = "white";
    chocoCtx.font = 'bold 60px sans-serif';
    chocoCtx.textBaseline = "middle";
    let username;
    if(msg.author.username.length > 14){
        username = msg.author.username.slice(0, 14) + "..";
    }else{
        username = msg.author.username;
    }
    chocoCtx.fillText(msg.author.username, 330, 90);
    chocoCtx.fillStyle = "#0e0d0c";
    createRoundBox(chocoCtx, 10, 300, 80, 330, 170, null, null);
    chocoCtx.fillStyle = "#cccccc";
    chocoCtx.font = "50px sans-serif";
    chocoCtx.fillText(usersChoco, 350, 210);
    chocoCtx.beginPath();
	// Start the arc to form a circle
	chocoCtx.arc(150, 150, 110, 0, Math.PI * 2, true);
	// Put the pen down
	chocoCtx.closePath();
	// Clip off the region you drew on
	chocoCtx.clip();
    const avatar = await loadImage(msg.author.displayAvatarURL({format: 'png'}));
    
    chocoCtx.drawImage(avatar, 40, 40, 220, 220);
    
    chocoCtx.restore();
    chocoCtx.fillStyle = "#4a423e";
    console.log(userLV);
    chocoCtx.font = "bold 40px sans-serif";
    createRoundBox(chocoCtx, 40, 80, 80, 190, 190, userLV, "white");
    
    return {chococan: chocoCanvas, chocotext: `초코는 상점에서 이용이 가능합니다`};
};

const getLv = async (msg) => {
    const user = getUser(msg.author.id);
    const userLv = user.getLv();
    const lvCan = createCanvas(900, 300);
    const lvCtx = lvCan.getContext('2d');
    
    return {lvcan: lvCan, lvtext: `레벨은 게임이나 상점, 권한에 영향을 줍니다`};
}

async function getUser(userID){
    let user = await User.findOne({userID: userID});
    if(!user){
        user = await createUser(userID);
    }
    console.log(user);
    return user;
}

module.exports = {
    shop: shop,
    getChoco: getChoco,
};