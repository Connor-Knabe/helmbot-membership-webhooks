const got = require("got");
const creds = require("./creds");
//Isn't verifying webhook is valid from Slack

async function main(params) {
    console.log('params',params);

    // var data = JSON.parse(MakerWebhooks.jsonEvent.JsonPayload);

    if(params?.membership-range-begun != undefined && params?.membership_type_name){
        const membershipType = params["membership_type_name"];
        const soldByUsername = params["sold_by_user_name"];
    
        const helmToSlackNames = {
            "Anna Jones":"<@UP9F1FSMU>",
            "Ashley Stout":"<@U01T7TZ701G>",
            "Claire Forshee":"<@U03GH2H06SH>",
            "Connor Knabe":"<@U0FTYG2HE>",
            "Jenna Burton":"<@UGXHR7GP6>",
            "Kiley Phillips":"<@U03310WKE6B>",
            "Noah Barnes":"<@U2B5GLR1Q>",
            "Zac Crismaru":"<@UK3972UN6>"
        };

        const soldBy = soldByUsername == undefined ? "Online store" : helmToSlackNames[soldByUsername];

        var slackMessage = "Wooohooo!! "+ soldBy + " sold a "+ membershipType + "!";
        Slack.postToChannel.setMessage(slackMessage);

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

    }
  }

exports.main = main