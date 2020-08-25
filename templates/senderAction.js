const request = require('request');

const senderAction = (recepientID) => {
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: process.env.PAGE_ACCESS_TOKEN,
        method: "POST",
        json: {
            recipient: { id: recipientId },
            "sender_action": "typing_on"
        }
    }, (err, res, body) => {
        if (err) {
            console.log(res.error);
        }
    });
};

module.exports = senderAction;