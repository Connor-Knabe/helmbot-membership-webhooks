var data = JSON.parse(MakerWebhooks.jsonEvent.JsonPayload);
var occurredAt = MakerWebhooks.jsonEvent.OccurredAt;

var serviceType = data["service_type_title"];
var eventType = data["event_type"];
var membershipTypeName = data["membership_type_name"] != undefined ? data["membership_type_name"].toLowerCase() : "";

var employeeName = data["checkout_by_user_name"] != undefined ? data["checkout_by_user_name"] : data["sold_by_user_name"];

var customerName = data["customer_name"] != undefined ? data["customer_name"] : "N/a";

var pastReservationCount = data["customer_past_reservation_count"] != undefined ? data["customer_past_reservation_count"] : "N/a";

var endsAt = data["ends_at"] != undefined ? data["ends_at"] : "N/a";


var activeMembershipCount = data["location_memberships_active_count"] != undefined ? data["location_memberships_active_count"] : 0;
var membershipsNeedingCardCount = data["location_memberships_active_needing_card_count"] != undefined ? data["location_memberships_active_needing_card_count"] : 0;

var membershipCount = 0;

if (activeMembershipCount !=0 && membershipsNeedingCardCount != 0){
  membershipCount = activeMembershipCount - membershipsNeedingCardCount;
}


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

GoogleSheets.appendToGoogleSpreadsheet.setFormattedRow(`${new Date().toDateString()} ||| ${employeeName} ||| ${saleName} ||| ${customerName} ||| ${membershipCount} ||| ${pastReservationCount}||| ${endsAt}`);
