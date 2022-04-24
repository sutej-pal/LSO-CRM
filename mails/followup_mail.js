const Mail = require('./mail');
const moment = require('moment');

module.exports = class SampleMail extends Mail {

    /**
     * Change your options here
     * * this.subject {string}
     * * this.html {string}
     * * this.other {object}
     */
    // prepare() {
    //     this.subject = "Followup Email Notification";
    //     this.html = `
    //     Hi ${this.other.lead.stlId.name},<br>
    //     You have a followup with <b>${this.other.lead.name}</b> after an hour.<br>
    //     Please reach him on - ${this.phoneTable(this.other.lead.mobile)}
    //     at <b>${this.other.time}</b>
    //     `;
    // }
    prepare() {
        this.subject = `Subject: ABC | Follow-up scheduled at ${this.other.time}`;
        this.html = `
                   <div style="padding-bottom: 10px">Hi ${this.getReceiversNames(this.other.lead)},</div>
                   You have a follow-up scheduled with <b>${this.other.lead.name}</b> (Mob: ${this.phoneNumbers(this.other.lead.mobile)}</div>) 
                   today at <b>${this.other.time}</b>.
                   
                   <div style="padding: 15px 0">Below are the details for your reference.</div>
                   
                   <div><b>Lead Date</b>: ${moment(this.other.lead.date).format("Do MMM YYYY")}</div>
                   <div><b>Lead Status</b>: ${this.checkLeadStatus(this.other.lead)}</div>
                   <div><b>Branch</b>: ${this.other.lead.branchId.name === undefined ? '': this.other.lead.branchId.name}</div>
                   <div><b>Remarks</b>: ${this.other.lead.remarks === undefined ? '': this.other.lead.remarks}</div>
                   <div><b>Status</b>: ${this.other.lead.status === undefined ? '': this.other.lead.status}</div>
                   
                   <div style="padding: 15px 0">Pls ensure to update the status in CRM after your follow-up.</div>
                   
                   <div>All the best.</div>
                `;
    }

    phoneNumbers(mobiles) {
        let mobileNos = mobiles.length;
        let response = '';
        mobiles.forEach((mobile, index) => {
            response += `<span> ${mobile} </span>`;
            if (index !== mobileNos - 1) {
                response += ', '
            }
        });
        return response;
    }

    checkLeadStatus(lead) {
        if (lead.closureDate) {
            return 'Closure';
        } else if (lead.pipelineDate) {
            return 'Pipeline';
        } else {
            return 'MIS';
        }
    }

    getReceiversNames(lead) {
       return lead.stlId.name === lead.createdBy.name ? lead.stlId.name : `${lead.stlId.name} / ${lead.createdBy.name}`
    }

};
