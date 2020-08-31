const axios = require('axios');
const callSendAPI = (senderPsid, key, value) => {

    let requestBody = {
        recipient: {
            id: senderPsid
        },
        [key]: value
    };
    return axios({
        url: "https://graph.facebook.com/v2.6/me/messages",
        params: { "access_token": process.env.PAGE_ACCESS_TOKEN },
        method: "POST",
        data: requestBody
    })
        .then((res) => {
            console.log("success: ", res.data);
        }, (err) => { console.log(err) })
        .catch((err) => { console.log(err) });
};

const getUser = async (senderPsid) => {
    return await axios({
        url: `https://graph.facebook.com/v2.6/${senderPsid}`,
        params: {
            "access_token": process.env.PAGE_ACCESS_TOKEN
        },
        method: "GET"
    })
        .then(res => res.data, (err) => { console.log(err) })
        .catch((err) => { console.log(err) });
};

const getJoke = async () => {
    let headers = { "Accept": "application/json" };
    return await axios.get('https://icanhazdadjoke.com/', { headers })
        .then(res => res.data.joke)
        .catch(err => console.log(err));
}

const quickReplies = [
    {
        "content_type": "text",
        "title": "More Tea ☕",
        "payload": "GET_TEA",
    },
    {
        "content_type": "text",
        "title": "Joke",
        "payload": "GET_JOKE",
    }
];

exports.handleSenderAction = (senderPsid) => {
    callSendAPI(senderPsid, "sender_action", "typing_on");
};

const handleQuickReply = (senderPsid, message) => {
    let payload = message.quick_reply.payload;
    handlePayload(senderPsid, payload);
};

exports.handlePostback = (senderPsid, postback) => {
    let payload = postback.payload;
    handlePayload(senderPsid, payload);
};

exports.handleMessage = (senderPsid, message) => {
    let response;
    if (message.quick_reply) {
        return handleQuickReply(senderPsid, message);
    }
    else if (message.nlp && message.nlp.entities && message.nlp.entities.intent && message.nlp.entities.intent.length > 0) {
        let payload = message.nlp.entities.intent[0].value;
        return handlePayload(senderPsid, payload);
    }
    else if (message.text || message.attachments) {
        response = {
            "text": "Bot is at your service",
            "quick_replies": quickReplies
        };
    }
    return callSendAPI(senderPsid, "message", response);
};

const handlePayload = async (senderPsid, payload) => {
    console.log("payload: ", payload);
    this.handleSenderAction(senderPsid);
    switch (payload) {
        case 'GET_STARTED':
            const user = await getUser(senderPsid);
            response1 = { "text": `Hello, ${user.first_name}! I am TeaBot, your tea-buddy. I can serve you tea, and tell corny jokes as well.` };
            response2 = { "text": "Oh! I do not keep track of the number, so drink away :)", "quick_replies": quickReplies };
            return callSendAPI(senderPsid, "message", response1)
                .then(() => {
                    this.handleSenderAction(senderPsid);
                    return callSendAPI(senderPsid, "message", response2);
                })
                .catch(err => console.log(err));
        case 'GET_TEA':
            this.handleSenderAction(senderPsid);
            response1 = { "text": "Here's your tea, enjoy!" };
            response2 = { "text": "☕" };
            response3 = { "text": "Careful! Its piping hot!🥵", "quick_replies": quickReplies };
            return callSendAPI(senderPsid, "message", response1)
                .then(() => {
                    this.handleSenderAction(senderPsid);
                    return callSendAPI(senderPsid, "message", response2);
                })
                .then(() => {
                    this.handleSenderAction(senderPsid);
                    return callSendAPI(senderPsid, "message", response3);
                })
                .catch(err => console.log(err));
        case 'GET_JOKE':
            this.handleSenderAction(senderPsid);
            const joke = await getJoke();
            response = { text: joke, "quick_replies": quickReplies };
            return callSendAPI(senderPsid, "message", response);
        case 'GOODBYE':
            this.handleSenderAction(senderPsid);
            response = { "text": "Goodbye! I hope to see you here again! Don't be a stranger :)" };
            return callSendAPI(senderPsid, "message", response);
        default:
            return;
    }
}