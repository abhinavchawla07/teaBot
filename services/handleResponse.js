const { text } = require("express");

const request = require('request');
const callSendAPI = (senderPsid, response) => {
    let requestBody = {
        "recipient": {
            "id": senderPsid
        },
        "message": response
    };
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
        "method": "POST",
        "json": requestBody
    }, (err, res, body) => {
        if (err) {
            console.log("error occured: " + err);
        }
        else {
            console.log("message sent");
        }
    });
};

exports.handleMessage = (senderPsid, message) => {
    let response;
    if (message.text) {
        response = {
            "text": `You sent message "${message.text}". Now send an image`
        };
    }
    callSendAPI(senderPsid, response);
};

exports.handlePostback = (senderPsid, postback) => {

};