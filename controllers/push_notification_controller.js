const webpush = require("../config/webpush");

const NotificationSubscriber = require("../models/notification_subscriber");

const MainHelper = require("../config/helper");

const Notification = require("../notifications/notification");

module.exports = class Controller {
  /**
   * Subscribing to push notification
   * @param {*} req
   * @param {*} res
   */
  static subscribe(req, res) {
    const subscription = req.body;
    NotificationSubscriber.findOne({
      user: req.user._id
    })
      .then(notificationSubscriber => {
        if (!notificationSubscriber) {
          return NotificationSubscriber.create({
            user: req.user._id,
            subscription: subscription
          });
        } else {
          return NotificationSubscriber.findOneAndUpdate(
            {
              user: req.user._id
            },
            {
              subscription: subscription
            },
            {
              new: true
            }
          );
        }
      })
      .then(notificationSubscriber => {
        const payload = new Notification.Payload(
          "Hi there!",
          "You won't miss a thing now"
        );
        const notification = new Notification.Notification(
          notificationSubscriber.subscription,
          payload
        );
        return notification.send();
      })
      .then(_ => {
        return MainHelper.main.response200(res, {}, "Subscribed!");
      })
      .catch(err => {
        console.log(err);
        return MainHelper.main.response500(res, {}, "Could not subscribe!");
      });
  }

  static sendPushNotification(subscription, payload) {
    return webpush.sendNotification(subscription, payload).catch(_ => {
      console.error(_);
    });
  }

  static sendAll(req, res) {
    NotificationSubscriber.find()
      .then(subscribers => {
        subscribers.forEach(subscriber => {
          const payload = new Notification.Payload("Testing it");
          const notification = new Notification.Notification(
            subscriber.subscription,
            payload
          );
          notification.send();
        });
        res.json({
          message: "sent notification to " + subscribers.length + " subscribers"
        });
      })
      .catch(err => {
        console.log(err);
        return MainHelper.main.response500(res, {}, "Some error occured!");
      });
  }
};
