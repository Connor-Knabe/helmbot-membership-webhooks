const got = require("got");
const creds = require("./creds");

async function main(params) {
    console.log('params',params);
    if(params["event_type"] == "membership-range-begun" && params["membership_type_name"] != undefined){
        return await membershipSold(params);
    }
    if(params["event_type"] == "reservation-checkout" && params["checkout_by_user_name"] != undefined && params["service_type_title"] == "Float"){
        return await customerFloatCheckout(params);
    }
}

async function customerFloatCheckout(params) {
    const customerName = params["customer_name"];
    const checkedOutBy = getEmployee(params);
    const customerId = params["customer_id"];
    const customerNameAndUrl = `<${creds.helmbotUsersUrl}${customerId}| ${customerName}>`;

    var slackMessage = `*Reminder for:*  ${checkedOutBy} you checked out ${customerNameAndUrl}.  \n*Please add notes to ${customerNameAndUrl}'s profile:*\n • Why they float?\n• Did you present membership opportunity?\n• If they didn't sign up why not?\n\nFeel free to start a thread on this post to brainstorm tips for next time.`;
    await got.post(creds.slackWebhookURL, {
        json: {
            channel: creds.slackChannelID,
            blocks: [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": slackMessage
                    }
                },{
                    "type": "actions",
                    "elements": [
                        {
                            "type": "checkboxes",
                            "options": [
                                {
                                    "text": {
                                        "type": "mrkdwn",
                                        "text": "*Check this box when you've added notes to helm*"
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    });

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {"challenge":params.challenge}
    };

}

async function membershipSold(params) {
    const membershipType = params["membership_type_name"];
    const soldBy = getEmployee(params);

    var slackMessage = "Wooohooo!! "+ soldBy + " sold a "+ membershipType + "!";

    await got.post(creds.slackWebhookURL, {
        json: {
            channel: creds.slackChannelID,
            text: slackMessage
        }
    });
    const giphy = await got('https://api.giphy.com/v1/gifs/random?api_key='+creds.giphyAPIKey+'&tag=awesome').json();

    await got.post(creds.slackWebhookURL, {
        json: {
            channel: creds.slackChannelID,
            text: giphy?.data?.url
        }
    });
    
    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {"challenge":params.challenge}
    };
}


function getEmployee(params){
    const soldByUsername = params["sold_by_user_name"];
    const checkoutByUsername = params["checkout_by_user_name"];
    const employee = soldByUsername == undefined ? creds.helmToSlackNames[checkoutByUsername] : creds.helmToSlackNames[soldByUsername];
    return employee;
}

exports.main = main