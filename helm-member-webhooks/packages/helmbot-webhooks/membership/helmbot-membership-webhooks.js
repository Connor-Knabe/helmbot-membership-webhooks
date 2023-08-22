const got = require("got");
const creds = require("./creds");
const customMessage = require("./customMessages");
var slackUrl = creds.slackWebhookURL;

//DEBUG

// var params = {"checkout_by_user_id":"1398935","event_type":"reservation-checkout","service_type_title":"Float", "customer_past_reservation_count":0,"checkout_by_user_name":"connor","customer_name":"BOB","sold_by_user_id":1398935,"checkout_by_user_id": 1398935}
// main(params);
// (()=>{
//     console.log(customMessage.getSlackMessage());
// })()




async function main(params) {
    console.log('params b4',params);



    //for debugging to not blow up slack channel    
    if(params["checkout_by_user_id"] == "1398935" || params["sold_by_user_id"] == "1398935"){
        slackUrl = creds.slackDebugWebhookURL;
    }

    if(params["event_type"] == "membership-range-begun" && params["membership_type_name"] != undefined  && params["period_number"] == 1){
        console.log("membership sold");
 
        return await membershipSold(params);
    }

    if(params["event_type"] == "reservation-checkout" && params["checkout_by_user_name"] != undefined && params["service_type_title"] == "Float" && params["appointment_number_this_service_type"] == 0){
        console.log("first timer checkout");
        return await customerFirstFloatCheckout(params);
    }

    if(params["event_type"] == "sale-closed" && params["sold_online"] && params["customer_phone"]?.length > 9 && params["customer_past_reservation_count"] == 0){
        console.log("new first timer sale");
        return await onlineSale(params);
    }

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {"Data":"N/a"}
    };
}

async function customerFirstFloatCheckout(params) {
    const customerName = params["customer_name"];
    const checkedOutBy = getEmployee(params);
    customMessage.setCheckedOutBy(checkedOutBy);
    customMessage.setCustomerName(customerName);
    const customerId = params["customer_id"];
    customMessage.setCustomerId(customerId);
    var slackMessage = customMessage.getSlackMessage();
    var checkboxText = customMessage.getCheckBoxText();
    var msg = formatSlackMessage(slackMessage,checkboxText);
    await got.post(creds.slackWebhookSalesUrl, {
        json: msg
    });
    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {"Data":"N/a"}
    };

}


async function onlineSale(params) {
    const customerName = params["customer_name"];
    var customerPhoneNumber = params["customer_phone"];
    const customerId = params["customer_id"];
    const pastReservationCount = params["customer_past_reservation_count"];
    customMessage.setPastReservationCount(pastReservationCount);
    customerPhoneNumber = `<tel:${customerPhoneNumber}|${customerPhoneNumber}>`;
    customMessage.setCustomerPhoneNumber(customerPhoneNumber);
    const customerNameAndUrl = `<${customMessage.helmbotUsersUrl}${customerId}| ${customerName}>`;
    customMessage.setCustomerNameAndUrl(customerNameAndUrl);

    await got.post(creds.slackWebhookSalesUrl, {
        json: formatSlackMessage(customMessage.getSaleSlackMessage(),customMessage.getSaleCheckBoxText())
    });
    
    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {"challenge":params.challenge}
    };
}

async function membershipSold(params) {

    const membershipType = params["membership_type_name"];
    const customerName = params["customer_name"];
    var activeMemberCount = params["location_memberships_active_count"];
    activeMemberCount = activeMemberCount - params["location_memberships_active_past_due_count"];

    var slackMessage = "Sweeeet a "+ membershipType + " was sold to "+ customerName +" online!  Membership count is: " +activeMemberCount+"";


    if(params["sold_by_user_id"]){
        const soldBy = getEmployee(params);
        slackMessage = "Wooohooo!! "+ soldBy + " sold a "+ membershipType + " to "+customerName+"!  Membership count is: " +activeMemberCount+"";
    }


    //make this using markdown and add new line
    
    await got.post(slackUrl, {
        json: {
            text: slackMessage
        }
    });
    const giphy = await got('https://api.giphy.com/v1/gifs/random?api_key='+creds.giphyAPIKey+'&tag='+customMessage.giphyTag).json();

    await got.post(slackUrl, {
        json: {
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

function formatSlackMessage(message,checkboxText){
    console.log('mSGG',message);
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