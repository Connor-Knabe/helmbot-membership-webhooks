const data = JSON.parse(MakerWebhooks.jsonEvent.JsonPayload);
const occurredAt = MakerWebhooks.jsonEvent.OccurredAt;
const serviceType = data["service_type_id"];
const eventType = data["event_type"];

const membershipTypeId = data["membership_type_id"] != undefined ? data["membership_type_id"] : "";


const serviceTitle = data["service_title"] != undefined ? data["service_title"] : "";

const employeeName = data["checkout_by_user_name"] != undefined ? data["checkout_by_user_name"] : data["sold_by_user_name"];
// const customerName = data["customer_name"] != undefined ? data["customer_name"] : "N/a";
const pastReservationCount = data["appointment_number_this_service_type"] != undefined ? data["appointment_number_this_service_type"] : "N/a";
const sessionStartTime = data["begins_at"] != undefined ? data["begins_at"] : "N/a";
const activeMembershipCount = data["location_memberships_active_count"] != undefined ? data["location_memberships_active_count"] : 0;
const membershipsPastDueCount = data["location_memberships_active_past_due_count"] != undefined ? data["location_memberships_active_past_due_count"] : 0;

const customerId = data["customer_id"] != undefined ? data["customer_id"] : "N/a";

var checkoutByUserId = data["checkout_by_user_id"] != undefined ? data["checkout_by_user_id"] : "N/a";

const pricePaid = data["price_paid"] != undefined ? data["price_paid"] : "N/a";

const serviceTypeId = data["service_type_id"] != undefined ? data["service_type_id"] : "N/a";




var saleName = "";
var membershipCount = 0;

if (activeMembershipCount !=0 && membershipsPastDueCount != 0){
  membershipCount = activeMembershipCount - membershipsPastDueCount;
}

var checkoutOrMembership = "N/a"; 
var membershipOrServiceId = "";
if(eventType == "membership-range-begun"){
    checkoutOrMembership = "Membership Started";
    membershipOrServiceId = membershipTypeId;
    checkoutByUserId = data["sold_by_user_id"] != undefined ? data["sold_by_user_id"] : "N/a";
} else if (eventType == "membership-range-ended"){
    checkoutOrMembership = "Membership Ended";
    checkoutByUserId = data["sold_by_user_id"] != undefined ? data["sold_by_user_id"] : "N/a";
    membershipOrServiceId = membershipTypeId;
} else if(serviceTypeId){
    checkoutOrMembership = "Session"
    membershipOrServiceId = serviceTypeId;
}



GoogleSheets.appendToGoogleSpreadsheet.setFormattedRow(`${new Date().toDateString()} ||| ${checkoutByUserId} ||| ${customerId} ||| ${checkoutOrMembership} ||| ${membershipOrServiceId} ||| ${membershipCount} ||| ${pastReservationCount} ||| ${activeMembershipCount} ||| ${sessionStartTime} |||  ${serviceTitle} ||| ||| =IF(OR($C$2:$C$9244=Config!$I$3,$C$2:$C$9244=Config!$I$4,$C$2:$C$9244=Config!$I$5,$C$2:$C$9244=Config!$I$6,$C$2:$C$9244=Config!$I$7,$C$2:$C$9244=Config!$I$8,$C$2:$C$9244=Config!$I$9,$C$2:$C$9244=Config!$I$10),COUNTIF($I$2:$I$9244,INDIRECT("I"&ROW()))>1,0)`);



