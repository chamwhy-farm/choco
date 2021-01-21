const { createCanvas, loadImage } = require('canvas');
const util = require('../util');
const config = require('../config.json');


const getChoco = async (msg, MsgAth) => {
    const user = await util.getUser(msg.author.id);
    console.log(user);
    const usersChoco = user.getChoco();
    const userLV = user.getLv();
    const chocoCanvas = createCanvas(900, 300);
    const chocoCtx = chocoCanvas.getContext('2d');

    chocoCtx.save();
    chocoCtx.font = "100px Impact, segoe-ui-emoji";
    chocoCtx.fillStyle = "#1a1a1a";

    util.createRoundBox(chocoCtx, 40, 900, 300, 0, 0, null, null);
    chocoCtx.fillStyle = "white";
    chocoCtx.font = 'bold 60px sans-serif, segoe-ui-emoji';
    chocoCtx.textBaseline = "middle";
    let username;
    if(msg.author.username.length > 14){
        username = msg.author.username.slice(0, 14) + "..";
    }else{
        username = msg.author.username;
    }
    chocoCtx.fillText(msg.author.username, 330, 90);
    chocoCtx.fillStyle = "#0e0d0c";
    util.createRoundBox(chocoCtx, 10, 300, 80, 330, 170, null, null);
    chocoCtx.fillStyle = "#cccccc";
    chocoCtx.font = "50px sans-serif, segoe-ui-emoji";
    chocoCtx.fillText(usersChoco, 350, 210);
    chocoCtx.save();
    chocoCtx.fillStyle = "#cccccc";
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
    chocoCtx.font = "bold 40px sans-serif, segoe-ui-emoji";
    util.createRoundBox(chocoCtx, 40, 80, 80, 190, 190, userLV, "white");
    
    return (`초코는 상점에서 이용이 가능합니다`, new MsgAth(chocoCanvas.toBuffer(), `${msg.author.username}_attendance.png`));
};


const lankingUpdate = (msg) => {
    const students = msg.guild.members.cache.filter(m => m.roles.cache.has('student'));
    for(let i of students){
        
    }
};

module.exports = {
    getChoco: getChoco,
    lankingUpdate: lankingUpdate
};