module.exports.giphyTag = 'awesome';

module.exports.customerName = 'n/a';
module.exports.setCustomerName = (customerName)=>{
    this.customerName = customerName;
};

module.exports.checkedOutBy = 'n/a';
module.exports.setCheckedOutBy = (checkedOutBy)=>{
    this.checkedOutBy = checkedOutBy;
};

module.exports.customerId = 'n/a';
module.exports.setCustomerId = (customerId)=>{
    this.customerId = customerId;
};

module.exports.getCheckBoxText = ()=> {
    return "*Check this box when you've added notes to helm*";
}

module.exports.helmbotUsersUrl = "https://*.floathelm.com/users/";


module.exports.getSlackMessage = ()=> {
    return `*Reminder for:*  ${this.checkedOutBy} you checked out <${this.helmbotUsersUrl}${this.customerId}| ${this.customerName}> for their first float.  \n*Please add notes to <${this.helmbotUsersUrl}${this.customerId}| ${this.customerName}>'s profile:*\n • Why they float?\n• Did you present membership opportunity?\n• If they didn't sign up why not?\n\nFeel free to start a thread on this post to brainstorm tips for next time.`;
}

module.exports.getSaleCheckBoxText = ()=> {
    return "Check this box when you've called the customer";
}

module.exports.pastReservationCount = 'n/a';
module.exports.setPastReservationCount = (pastReservationCount)=>{
    this.pastReservationCount = pastReservationCount;
};

module.exports.customerPhoneNumber = 'n/a';
module.exports.setCustomerPhoneNumber = (customerPhoneNumber)=>{
    this.customerPhoneNumber = customerPhoneNumber;
};

module.exports.customerNameAndUrl = 'n/a';
module.exports.setCustomerNameAndUrl = (customerNameAndUrl)=>{
    this.customerNameAndUrl = customerNameAndUrl;
};

module.exports.getSaleSlackMessage = ()=> {
    return `${customerNameAndUrl} has purchased a session! Please call them at ${customerPhoneNumber} ASAP to see if they have any questions.  They have had ${pastReservationCount} appointments with us.`;
}