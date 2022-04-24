const cron = require('node-cron');
const FollowUpNotifications = require('../crons/followup_notification');
const TextMessage = require('../crons/text_message');

/**
 *             ┌────────────── second (optional)
 *             │ ┌──────────── minute
 *             │ │ ┌────────── hour
 *             │ │ │ ┌──────── day of month
 *             │ │ │ │ ┌────── month
 *             │ │ │ │ │ ┌──── day of week
 *             │ │ │ │ │ │
 *             │ │ │ │ │ │
 *             * * * * * *
 */
// cron.schedule('30 0 * * *', async _ => {
//     // call your cron here
//     console.log('cron start', new Date());
//     await FollowUpNotifications.sendFollowUpMail();
//     // await FollowUpNotifications.sendFollowUpPushNotification();
//     await TextMessage.sendFollowUpSMS();
// });
