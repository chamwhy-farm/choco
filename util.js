const config = require('./config.json');

const User = require('./schemas/user');
const Guild = require('./schemas/guild');

const isCall = (msg) => {
    let iscall = false;
    config.callName.forEach(name => {
        console.log(name, msg.content.split(' ')[0].indexOf(name));
        if(msg.content.split(' ')[0].indexOf(name) != -1){
            iscall = true;
        }
    });
    return iscall;
};

const isMaster = (msg) => {
    return msg.guild.members.cache.find(user => user.id == msg.author.id).hasPermission('MANAGE_CHANNELS');
};

const getWord = (word) => {
    const answerList = config["word"][word];
    return answerList[getRandomInt(0, answerList.length-1)];
};

const getUser = async (userID, member, guild) => {
    let user = await User.findOne({userID: userID});
    if(!user){
        user = createUser(userID, member, guild);
    }
    return user;
};

const createUser = async (userID, member, guild) => {
    const newUser = new User({
        userID: userID
    });
    const guildDB = await getGuild(guild.id);
    guildDB.student[userID] = 1000;
    await guildDB.save();
    await member.roles.add(guild.roles.cache.find(r => r.name == 'chocouser'));
    return await newUser.save().then(saveUser => {
        return saveUser;
    });
};

const getGuild = async (guildID) => {
    let guild = await Guild.findOne({gID: guildID});
    if(!guild){
        guild = createGuild(guildID);
    }
    return guild;
};

const createGuild = async (guildID) => {
    const newGuild = new Guild({
        gID: guildID
    });
    return await newGuild.save().then(saveGuild => {
        return saveGuild;
    });
};

const getTime = (word)=>{
    if(word.length == 0) return 0;
    const type = "dhms";
    const typeCount = [1000 * 60 * 60 * 24, 1000 * 60 * 60, 1000 * 60, 1000];
    let ms = 0;
    for(let i = 0 ; i < word.length; i++){
        const timeType = type.indexOf(word[i].slice(-1));
        const time = word[i].slice(0, -1);
        if(isNaN(Number(time))) return null;
        if(timeType == -1) return null;
        console.log(typeCount[timeType]);
        ms += Number(time) * typeCount[timeType];
    }
    return ms;
};

const getMention = (msg) => {
    let user = msg.mentions.users.first();
    console.log(user);
    if(!user) return null;
    return msg.guild.members.cache.find(u => u.id == user.id);
};


const getRandomInt = (startInt, lastInt)=>{
    return Math.floor(Math.random() * (lastInt - startInt)) + startInt;
}

const createRoundBox = (ctx, r, w, h, x1, y1, text, textC) => {
    ctx.beginPath();
    ctx.arc(x1 + r, y1 + r, r, Math.PI, Math.PI*1.5, false);
    ctx.fill();
    ctx.fillRect(x1 + r, y1, w - 2*r, r);
    ctx.arc(x1 + w - r, y1 + r, r, Math.PI*1.5, Math.PI*2, false);
    ctx.fill();
    ctx.fillRect(x1, y1 + r, w, h - 2*r);
    ctx.arc(x1 + r, y1 + h - r, r, Math.PI*0.5, Math.PI*1, false);
    ctx.fill();
    ctx.fillRect(x1 + r, y1 + h - r, w - 2*r, r);
    ctx.arc(x1 + w - r, y1 + h - r, r, 0, Math.PI*0.5, false);
    ctx.fill();
    ctx.closePath();
    if(text != null){
        ctx.fillStyle = textC;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x1+w/2, y1+h/2);
    }
};

const sortObject = (obj) => {
    let sortobj = [];
    const returnObj = {};
    for (let key in obj) {
        sortobj.push([key, obj[key]]);
    }
    sortobj.sort(function(a, b) {
        return a[1] - b[1];
    });
    for(let i in sortobj){
        returnObj[i[0]] = i[1];
    }
    return returnObj;
};

const setGrade = async (student, grades, gradeCnt) => {
    for(let grade in grades){
        console.log(grades[gradeCnt]);
        const gradeId = grades[gradeCnt];
        if(!gradeId){
            await student.roles.remove(grades[grade]);
        }else{
            if(grades[grade].id == grades[gradeCnt].id){
                await student.roles.add(grades[grade]);
            }else{
                await student.roles.remove(grades[grade]);
            }
        }
    }
};

module.exports = {
    isCall: isCall,
    isMaster: isMaster,
    getWord: getWord,
    getUser: getUser,
    getGuild: getGuild,
    getTime: getTime,
    getMention: getMention,
    getRandomInt: getRandomInt,
    createRoundBox: createRoundBox,
    sortObject: sortObject,
    setGrade: setGrade
};