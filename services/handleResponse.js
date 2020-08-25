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
            "text": `You sent message "${message.text}". Now send an image`,
            "quick_replies":[
                {
                    "content_type":"text",
                    "title":"Very cool!",
                    "payload": "cool_quick_reply"
                },
                {
                    "content_type":"text",
                    "title":"Not so cool",
                    "payload": "not_cool_quick_reply"
                }
            ]
        };
    }
    else if (message.attachments) {
        let attachmentUrl = message.attachments[0].payload.url;
        response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "Is this the right picture?",
                            "subtitle": "Tap the correct answer",
                            "image_url": attachmentUrl,
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Yes!",
                                    "payload": "yes"
                                },
                                {
                                    "type": "postback",
                                    "title": "No!",
                                    "payload": "no"
                                }
                            ]
                        }
                    ]
                }
            }
        };
    }
    callSendAPI(senderPsid, response);
};

exports.handlePostback = (senderPsid, postback) => {
    let response;
    let payload = postback.payload;
    if (payload === 'yes') {
        response = { "text": "Good!" };
    }
    else if (payload === 'no') {
        response = { "text": "Maybe try again" };
    }
    else if (payload === 'cool_quick_reply') {
        response = { "text": "I knoww right?" };
    }
    else if (payload === 'not_cool_quick_reply') {
        response = { "text": "Maybe you're not cool enough" };
    }
    callSendAPI(senderPsid, response);
};