const { createCanvas, loadImage } = require('canvas');
const util = require('../util');
const config = require('../config.json');


const getChoco = async (msg, MsgAth, guildDB) => {
    const user = await util.getUser(msg.author.id, msg.member, msg.guild);
    console.log(user);
    const usersChoco = user.getChoco();
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
    const userLank = getChocoList(msg, guildDB).indexOf(msg.author.id) + 1;
    console.log(userLank);
    if(userLank != 0){
        chocoCtx.font = "bold 40px sans-serif, segoe-ui-emoji";
        util.createRoundBox(chocoCtx, 40, 80, 80, 190, 190, userLank, "white");
    }
    
    return (`초코는 상점에서 이용이 가능합니다`, new MsgAth(chocoCanvas.toBuffer(), `${msg.author.username}_attendance.png`));
};

const getChocoList = (msg, guildDB, roleName) => {
    const students = msg.guild.members.cache.filter(m => {
        return m.roles.cache.find(r => r.name == roleName);
    });
    const userIDList = [];
    for(let i of students){
        userIDList.push(i[1].user.id);
    }
    return [guildDB.getStudents(userIDList), students];
};


const lankingUpdate = async (msg, guildDB) => {
    const data = getChocoList(msg, guildDB, "student");
    const chocoList = data[0];
    const students = data[1];
    const lankCnt = [0, 0, 0];

    const roles = [];
    roles.push(msg.guild.roles.cache.find(role => role.name === "senior"));
    roles.push(msg.guild.roles.cache.find(role => role.name === "junior"));
    roles.push(msg.guild.roles.cache.find(role => role.name === "sophomore"));
    const topRole = msg.guild.roles.cache.find(r => r.name == "top");

    lankCnt[0] = Math.ceil(chocoList.length * config.lankPercent.senior / 100);
    lankCnt[1] = Math.ceil(chocoList.length * config.lankPercent.junior / 100);
    lankCnt[2] = Math.ceil(chocoList.length * config.lankPercent.sophomore / 100);
    console.log(lankCnt);
    let lankInd = 0;
    let peopleCnt = 0;
    let list = '```\n';
    for(let i in chocoList){
        peopleCnt++;
        if(peopleCnt < 4){
            students.get(chocoList[i]).roles.add(topRole);
        }
        await util.setGrade(students.get(chocoList[i]), roles, lankInd); 
        let name = students.get(chocoList[i]).nickname;
        if(!name){
            name = students.get(chocoList[i]).user.username;
        }
        list += `${peopleCnt}.  ${name}  -  ${guildDB.students[chocoList[i]]}\n`;
        if(!(--lankCnt[lankInd])){
            lankInd++;
        }
    }
    list += '```';
    msg.reply(list);
};


const lank = (msg, guildDB) => {
    const data = getChocoList(msg, guildDB, "chocouser");
    const chocoList = data[0];
    const students = data[1];
    let list = '```\n';
    let peopleCnt = 0;
    for(let i in chocoList){
        peopleCnt++;
        let name = students.get(chocoList[i]).nickname;
        if(!name){
            name = students.get(chocoList[i]).user.username;
        }
        list += `${peopleCnt}.  ${name}  -  ${guildDB.students[chocoList[i]]}\n`;
    }
    list += '```';
    msg.reply(list);
}


const applyPromotion = (msg) => {
    const hongboRole = msg.guild.roles.cache.find(r => r.name == 'hongbo');
    msg.member.roles.add(hongboRole);
    msg.reply('홍보기능을 수락하셨습니다!');
};


module.exports = {
    getChoco: getChoco,
    lankingUpdate: lankingUpdate,
    lank: lank,
    applyPromotion: applyPromotion,
};