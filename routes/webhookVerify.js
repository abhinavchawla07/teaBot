var express = require('express');
var verifyRouter = express.Router();
var config = require('../config');

verifyRouter
    .get('/', (req, res) => {
        let VERIFY_TOKEN = config.VERIFY_TOKEN;
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
            });
            res.status(200).send('event_received');
        }
    })

module.exports = verifyRouter;