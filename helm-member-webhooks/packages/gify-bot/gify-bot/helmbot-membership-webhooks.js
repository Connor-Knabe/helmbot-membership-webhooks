const crypto = require("crypto");
const qs = require("qs");
const got = require("got");
const creds = require("./creds");

//Isn't verifying webhook is valid from Slack!


async function main(params) {
    // const headers = params["__ow_headers"];
    // const body = params["__ow_body"];
    // console.log("params",params)

    // let slackSignature = headers['x-slack-signature'];
    // let requestBody = qs.stringify(body,{ format:'RFC1738' });
    // let timestamp = headers['x-slack-request-timestamp'];

    // convert current time from milliseconds to seconds
    // const time = Math.floor(new Date().getTime()/1000);
    // if (Math.abs(time - timestamp) > 300) {
    //     return {
    //         statusCode: 500,
    //         headers: { 'Content-Type': 'application/json' },
    //         body: {"challenge":"fail"}
    //     };
    // }
    // let sigBasestring = 'v0:' + timestamp + ':' + requestBody;

    // const slackSigningSecret = "";
    // console.log('signa',slackSignature);
    // let mySignature = 'v0=' + 
    // crypto.createHmac('sha256', slackSigningSecret)
    //       .update(sigBasestring, 'utf8')
    //       .digest('hex');

    // console.log('mySignature',mySignature);

    if(params?.event?.bot_id == creds.botID){
        
        const giphy = await got('https://api.giphy.com/v1/gifs/random?api_key='+creds.giphyAPIKey+'&tag=awesome').json();

        const {data} = await got.post(creds.slackWebhookURL, {
            json: {
                channel: creds.slackChannelID,
                text: giphy?.data?.url
            }
        }).json();
        
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: {"challenge":params.challenge}
        };

    } else {
        console.log("not slack bot")
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: {"challenge":params.challenge}
        };

    }

    // if (crypto.timingSafeEqual(Buffer.from(mySignature, 'utf8'),Buffer.from(slackSignature, 'utf8'))) {
    //     return {
    //         statusCode: 200,
    //         headers: { 'Content-Type': 'application/json' },
    //         body: {"challenge":params.challenge}
    //     };
    // } else {
        
    //     return {
    //         statusCode: 404,
    //         headers: { 'Content-Type': 'application/json' },
    //         body: body
    //     };

    // }



  }

exports.main = main