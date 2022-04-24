const NotificationSubscriber = require("../models/notification_subscriber");

const moment = require("moment");

const LeadService = require("../services/lead-service");
const FollowupMail = require("../mails/followup_mail");
const FollowupNotification = require("../notifications/notification");

module.exports = class FollowUpNotifications {

    static async prepareMail() {
        let followupMail = [];
        let leads = await LeadService.findAllActiveLeads();
        leads.forEach(lead => {
            lead.followupDate.forEach(date => {
                if (moment(date.date).isSame(Date.now(), 'day')) {
                    // send mail to stl and createdBy
                    followupMail.push(new FollowupMail(
                        {to: [lead.stlId.email, lead.createdBy.email]},
                        {lead: lead, time: moment(date.date).utcOffset("+05:30").format("hh:mm A")}
                    ));
                }
            });
        });
        return followupMail
    }

    static async sendFollowUpMail() {
        let mails = await this.prepareMail();
        mails.forEach(mail => {
            mails[0].send().then(info => {
                console.log("mail sent to stl with info: ", info);
            });
        });
    }

    static async sendFollowUpPushNotification() {
        let leads = await LeadService.findAllActiveLeads();
        leads.forEach(lead => {
            lead.followupDate.forEach(date => {
                if (moment(date.date).isSame(Date.now(), 'day')) {
                    NotificationSubscriber.findOne({
                        user: lead.stlId._id
                    }).populate("stlId")
                        .then(stl => {
                            if (stl) {
                                const payload = new FollowupNotification.Payload(
                                    "Followup in an hour!",
                                    "You have to followup with " +
                                    lead.name +
                                    " at " +
                                    moment(date).format("hh:mm A")
                                );
                                const notification = new FollowupNotification.Notification(
                                    stl.subscription,
                                    payload
                                );
                                notification.send();
                            }
                        })
                        .catch(err => {
                            console.log("error sending notification for followup", err);
                        });
                }
            });
        });
    }

};
