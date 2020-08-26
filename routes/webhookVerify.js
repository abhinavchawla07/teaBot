var express = require('express');
var verifyRouter = express.Router();
var handleResponse = require('../services/handleResponse');

verifyRouter
    .get('/', (req, res) => {
        let VERIFY_TOKEN = process.env.VERIFY_TOKEN;
        let mode = req.query['hub.mode'];
        let token = req.query['hub.verify_token'];
        let challenge = req.query['hub.challenge'];
        if (mode && token) {
            if (mode === 'subscribe' && token === VERIFY_TOKEN) {
                console.log("webhook verified");
                res.status(200).send(challenge);
            }
            else {
                console.log("Problem 403 :" + mode);
                res.sendStatus(403);
            }
        }
    })
    .post('/', (req, res) => {
        if (req.body.object === 'page') {
            req.body.entry.forEach(entry => {

                let webhook_event = entry.messaging[0];
                // console.log(webhook_event);

                let senderPsid = webhook_event.sender.id;
                console.log('sender PSID: ' + senderPsid);

                if (webhook_event.message) {
                    // let intent = webhook_event.message.nlp.entities.intent[0].value;
                    // console.log(intent);
                    // switch (intent) {
                    //     case 'greeting':
                    //         console.log("Hey!");
                    //         break;
                    //     case 'bye':
                    //         console.log("Goodbye!");
                    //         break;
                    //     case 'get_weather':
                    //         let location = webhook_event.message.nlp.entities.location[0].value;
                    //         console.log("We need to check weather of " + location + " now!");
                    //         break;
                    //     default:
                    //         break;
                    // }
                    // console.log(webhook_event.message.nlp.entities);
                    handleResponse.handleMessage(senderPsid, webhook_event.message);
                }
                else if (webhook_event.postback) {
                    handleResponse.handlePostback(senderPsid, webhook_event.postback);
                }

            });
            res.status(200).send('event_received');
        }
        else {
            res.sendStatus(404);
        }
    })

module.exports = verifyRouter;