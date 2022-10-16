var data = JSON.parse(MakerWebhooks.jsonEvent.JsonPayload);
var occurredAt = MakerWebhooks.jsonEvent.OccurredAt;

var serviceType = data["service_type_title"];
var eventType = data["event_type"];
var membershipTypeName = data["membership_type_name"] != undefined ? data["membership_type_name"].toLowerCase() : "";

var checkedOutBy = data["checkout_by_user_name"];
var saleName = "";
if (eventType == "membership-range-begun") {
    if (membershipTypeName.includes("float")) {
        saleName = "Float Membership";
    } else if (membershipTypeName.includes("massage")) {
        saleName = "Massage Membership";
    } else if (membershipTypeName.includes("sauna")) {
        saleName = "Sauna Membership";
    }
} else if (eventType == "reservation-checkout") {
    saleName = `${serviceType} Session`;
}

GoogleSheets.appendToGoogleSpreadsheet.setFormattedRow(`${new Date().toDateString()} ||| ${checkedOutBy} ||| ${saleName}`);


// var data = JSON.parse(MakerWebhooks.jsonEvent.JsonPayload);
// var occurredAt = MakerWebhooks.jsonEvent.OccurredAt;

// var serviceType = data["service_type_title"];
// var eventType = data["event_type"];
// var membershipTypeName = data["membership_type_name"] != undefined ? data["membership_type_name"] :"";

// var pastReservationCount = data["customer_past_reservation_count"];

// var checkedOutBy = data["checkout_by_user_name"];
// var customer = data["customer_name"];



// if (serviceType == "Float" || membershipTypeName.toLowerCase().includes("float")){
//   if (eventType = "reservation-checkout" && pastReservationCount == 0){
//       GoogleSheets.appendToGoogleSpreadsheet.setFormattedRow(`${new Date().toDateString()} ||| ${checkedOutBy} ||| Float`);
//   } else if (eventType == "membership-range-begun") { 
//       GoogleSheets.appendToGoogleSpreadsheet.setFormattedRow(`${new Date().toDateString()} ||| ${checkedOutBy} ||| Membership`);
//   } else {
//       GoogleSheets.appendToGoogleSpreadsheet.skip();
//   }
// } else {
//   GoogleSheets.appendToGoogleSpreadsheet.skip();

// }
