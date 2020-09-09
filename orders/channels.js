const {getTime, } = require('../util');

const setChMas = (reply, word) => {
    
};

const delCh = (msg, word) => {
    console.log(word);
    if(word.length == 2){
        msg.reply('5분 뒤에 이 채널은 삭제됩니다');
        setTimeout(()=>{
            msg.channel.delete()
            .then(console.log)
            .catch(console.error);
        }, 5 * 60 * 1000);
    }else{
        const ms = getTime(word.slice(2));
        if(!ms){
            msg.reply('형식에 알맞게 입력해주세요');
            console.log(ms);
            return;
        }
        msg.reply(`${Math.round(ms/1000)}초 후에 이 채널은 삭제됩니다`);
        setTimeout(()=>{
            msg.channel.delete()
            .then(console.log)
            .catch(console.error);
        }, ms);
    }
};

module.exports = {
    setChMas: setChMas,
    delCh: delCh
}