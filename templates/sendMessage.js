const request = require('request');

const senderMessage = (recepientID,message) => {
    return new Promise((resolve,reject)=>{
        request({
            url: "https://graph.facebook.com/v2.6/me/messages",
            qs: process.env.PAGE_ACCESS_TOKEN,
            method: "POST",
            json: {
                recipient: { id: recepientID },
                message:message
            }
        }, (err, res, body) => {
            if (err) {
                console.log(res.error);
                reject(res.error);
            }
            else{
                resolve(body);
            }
        });
    });
};

module.exports = senderMessage;