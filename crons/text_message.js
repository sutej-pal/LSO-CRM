const SMS = require('../config/sms');

const moment = require("moment");
const LeadService = require("../services/lead-service");

module.exports = class TextMessage {

    static async sendFollowUpSMS() {
        let leads = await LeadService.findAllActiveLeads();
        leads.forEach(lead => {
            lead.followupDate.forEach(date => {
                if (moment(date.date).isSame(Date.now(), 'day')) {
                    let message = this.getMessageBody(lead, date);
                    this.sendMessages(this.getReceivers(lead), message);
                }
            });
        });

    }

    static checkLeadStatus(lead) {
        if (lead.closureDate) {
            return 'Closure';
        } else if (lead.pipelineDate) {
            return 'Pipeline';
        } else {
            return 'MIS';
        }
    }

    static getMessageBody(lead, date) {
        return `You have a follow-up scheduled with ${lead.name} (Mob: ${this.phoneNumbers(lead.mobile)}) today at ${moment(date.date).utcOffset("+05:30").format("hh:mm A")}.\nBelow are the details for your reference: \n\nLead Date: ${moment(lead.date).format("Do MMM YYYY")}\nLead Status: ${this.checkLeadStatus(lead)}\nBranch: ${lead.branchId.name}\n`;
    }

    static phoneNumbers(mobiles) {
        let mobileNos = mobiles.length;
        let response = '';
        mobiles.forEach((mobile, index) => {
            response += `${mobile}`;
            if (index !== mobileNos - 1) {
                response += ', '
            }
        });
        return response;
    }

    static getReceivers (lead) {
        let receivers = [];
        if (lead.stlId.mobile === lead.createdBy.mobile) {
            receivers.push(lead.stlId.mobile);
        } else {
            receivers.push(lead.stlId.mobile);
            receivers.push(lead.createdBy.mobile);
        }
        return receivers
    }

    static sendMessages(receivers, message) {
        receivers.forEach(receiverMobile => {
            SMS.send(receiverMobile, message, function (err, response) {
                if (err) {
                    console.log(err);
                }
                console.log(response);
            });
        });
    }
};
