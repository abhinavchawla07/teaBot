const request = require('request');
const senderAction = require('../templates/senderAction');
const sendMessage = require('../templates/sendMessage');

module.exports = (event) => {
    const senderID = event.sender.id;
    const payload = event.postback.payload;
    if (payload == 'WELCOME_USER') {
        request({
            url: "https://graph.facebook.com/v2.6/" + senderID,
            qs: {
                access_token: process.env.PAGE_ACCESS_TOKEN,
                fields: "first_name"
            },
            method: "GET"
        }, (err, res, body) => {
            let greeting='';
            if(err){
                console.log(err);
            }
            else{
                var bodyObject = JSON.parse(body);
                name=bodyObject.first_name;
                greeting = 'Hello '+name+', ';
            }
            let message1 = greeting+"welcome to tapriBot";
            let message2 = "Here, have this cup of chaa, on the house";
            let message3 = "Have a great day!";

            senderAction(senderID);
            sendMessage(senderID,{tesxt:message1})
            .then(()=>{sendMessage(senderID,{tesxt:message2})})
            .then(()=>{sendMessage(senderID,{tesxt:'☕'})})
            .then(()=>{sendMessage(senderID,{tesxt:message3})});
        });
    }
};