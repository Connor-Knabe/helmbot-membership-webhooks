const got = require("got");
const creds = require("./creds");

var slackUrl = creds.slackWebhookURL;

async function main(params) {
    console.log('params b4',params);

    //for debugging to not blow up slack channel    
    if(params["checkout_by_user_id"] == "1398935" || params["sold_by_user_id"] == "1398935"){
        slackUrl = creds.slackDebugWebhookURL;
    }

    console.log('params',params);
    if(params["event_type"] == "membership-range-begun" && params["membership_type_name"] != undefined){
        return await membershipSold(params);
    }
    if(params["event_type"] == "reservation-checkout" && params["checkout_by_user_name"] != undefined && params["service_type_title"] == "Float" && params["customer_past_reservation_count"] == 0){
        return await customerFirstFloatCheckout(params);
    }

    if(params["event_type"] == "sale-closed" && params["sold_online"] && params["service_type_title"] == "Float"){
        return await onlineSale(params);
    }
    

}

async function customerFirstFloatCheckout(params) {

    const customerName = params["customer_name"];
    const checkedOutBy = getEmployee(params);
    const customerId = params["customer_id"];
    const customerNameAndUrl = `<${creds.helmbotUsersUrl}${customerId}| ${customerName}>`;

    //put this message in creds file for customization
    var slackMessage = `*Reminder for:*  ${checkedOutBy} you checked out ${customerNameAndUrl} for their first float.  \n*Please add notes to ${customerNameAndUrl}'s profile:*\n • Why they float?\n• Did you present membership opportunity?\n• If they didn't sign up why not?\n\nFeel free to start a thread on this post to brainstorm tips for next time.`;
    var checkboxText = "*Check this box when you've added notes to helm*";
    await got.post(slackUrl, {
        json: getSlackMessage(slackMessage,checkboxText)
    });

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {"Data":"N/a"}
    };

}

async function onlineSale(params) {

    const customerName = params["customer_name"];
    const customerPhoneNumber = params["customer_phone"];
    const customerId = params["customer_id"];
    const customerNameAndUrl = `<${creds.helmbotUsersUrl}${customerId}| ${customerName}>`;

    var slackMessage = `${customerNameAndUrl} has purchased a session! Please call them at ${customerPhoneNumber} ASAP to see if they have any questions.`;
    var slackMessage = "Check this box when you've called the customer";

    await got.post(slackUrl, {
        json: {
            text: getSlackMessage(slackMessage,checkboxText)
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

    await got.post(slackUrl, {
        json: {
            channel: creds.slackChannelID,
            text: slackMessage
        }
    });
    const giphy = await got('https://api.giphy.com/v1/gifs/random?api_key='+creds.giphyAPIKey+'&tag=awesome').json();

    await got.post(slackUrl, {
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
    const soldByUsername = params["sold_by_user_id"];
    const checkoutByUsername = params["checkout_by_user_id"];
    const employee = soldByUsername == undefined ? creds.helmToSlackNames[checkoutByUsername] : creds.helmToSlackNames[soldByUsername];
    return employee;
}

function getSlackMessage(message,checkboxText){
    return {
        blocks: [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": message
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
                                    "text": checkboxText
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }
}

exports.main = main