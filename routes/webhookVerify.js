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
                res.sendStatus(403);
            }
        }
    })
    .post('/', (req, res) => {
        if (req.body.object === 'page') {
            req.body.entry.forEach(entry => {

                let webhook_event = entry.messaging[0];
                console.log(webhook_event);

                let senderPsid = webhook_event.sender.id;
                console.log('sender PSID: ' + senderPsid);

                if (webhook_event.message) {
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