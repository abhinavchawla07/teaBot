var express = require('express');
var verifyRouter = express.Router();

verifyRouter
    .get((req, res) => {
        if (req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
            console.log("Webhook verified");
            res.status(200).send(req.query['hub.challenge']);
        }
        else {
            console.log("Authentication failed");
            res.sendStatus(403);
        }
    })
    .post((req,res)=>{
        if(req.body.object==='page'){
            req.body.entry.forEach(event => {
                console.log(event);
                //process
            });
            res.sendStatus(200);
        }
    })

module.exports = verifyRouter;