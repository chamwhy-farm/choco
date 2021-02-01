'use strict';

const qanda = require('../qanda.json');
const util = require('../util');

const question = async (qaCh, guildDB) => {
    const problem = qanda.qa[guildDB.getQa().qaCnt];
    if(!problem){
        console.log("문제가 없습니다!!!");
        return;
    }
    let sendMsg = problem.q + "\n\n";
    for(let i = 1; i <= problem.as.length; i++){
        sendMsg += `${i}.  ${problem.as[i-1]}\t`;
    }
    qaCh.send(sendMsg);
    guildDB.qa.isQa = true;
    await guildDB.save();
};


const answer = async (msg, guildDB, userDB) => {
    const word = msg.content.split(' ');
    if(!guildDB.getQa().isQa){
        msg.reply('문제가 없습니다!');
        return;
    }
    if(word.length < 3){
        msg.reply('답을 입력해주세요!');
        return;
    }
    if(userDB.lastAns == guildDB.qa.qaCnt){
        msg.reply('이미 답을 입력하셨습니다!');
        return;
    }    
    userDB.answer(guildDB.qa.qaCnt);
    const asw = word[2];
    if(asw == qanda.qa[guildDB.qa.qaCnt].a){
        userDB.addChoco(400, guildDB);
        guildDB.qa.isQa = false;
        guildDB.qa.qaCnt += 1;
        guildDB.save();
        msg.reply('정답입니다! 400초코를 지급하겠습니다!');
    }else{
        msg.reply('답이 틀립니다!');
    }
    await userDB.save();
};

module.exports = {
    question: question,
    answer: answer
}


