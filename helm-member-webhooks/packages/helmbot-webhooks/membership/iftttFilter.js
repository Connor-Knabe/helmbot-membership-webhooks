const data = JSON.parse(MakerWebhooks.jsonEvent.JsonPayload);
const occurredAt = MakerWebhooks.jsonEvent.OccurredAt;
const serviceType = data["service_type_title"];
const eventType = data["event_type"];
const membershipTypeName = data["membership_type_name"] != undefined ? data["membership_type_name"].toLowerCase() : "";
const employeeName = data["checkout_by_user_name"] != undefined ? data["checkout_by_user_name"] : data["sold_by_user_name"];
const customerName = data["customer_name"] != undefined ? data["customer_name"] : "N/a";
const pastReservationCount = data["customer_past_reservation_count"] != undefined ? data["customer_past_reservation_count"] : "N/a";
const endsAt = data["ends_at"] != undefined ? data["ends_at"] : "N/a";
const activeMembershipCount = data["location_memberships_active_count"] != undefined ? data["location_memberships_active_count"] : 0;
const membershipsNeedingCardCount = data["location_memberships_active_needing_card_count"] != undefined ? data["location_memberships_active_needing_card_count"] : 0;

var saleName = "";
var membershipCount = 0;

if (activeMembershipCount !=0 && membershipsNeedingCardCount != 0){
  membershipCount = activeMembershipCount - membershipsNeedingCardCount;
}

var startEndMembership = undefined; 
if(eventType == "membership-range-begun"){
    startEndMembership = "Started";
} else if (eventType == "membership-range-ended"){
    startEndMembership = "Ended";
}

if (startEndMembership != undefined) {
    if (membershipTypeName.includes("float")) {
        saleName = `Float Membership ${startEndMembership}`;
    } else if (membershipTypeName.includes("massage")) {
        saleName = `Massage Membership ${startEndMembership}`;
    } else if (membershipTypeName.includes("sauna")) {
        saleName = `Sauna Membership ${startEndMembership}`;
    }
} else if (eventType == "reservation-checkout") {
    saleName = `${serviceType} Session`;
}

GoogleSheets.appendToGoogleSpreadsheet.setFormattedRow(`${new Date().toDateString()} ||| ${employeeName} ||| ${saleName} ||| ${customerName} ||| ${membershipCount} ||| ${pastReservationCount}||| ${endsAt}`);
