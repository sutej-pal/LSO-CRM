const Model = require('mongoose');

const Schema = Model.Schema;

const SubscriptionSchema = new Schema({
    endpoint: {
        required: true,
        type: String
    },
  expirationTime: String,
  keys: {
    p256dh: {
        required: true,
        type: String
    },
    auth: {
        required: true,
        type: String
    }
  }
})

const NotificationSchema = new Schema({
    user: {
        required: true,
        ref: 'User',
        type: Schema.Types.ObjectId
    },
    subscription: SubscriptionSchema
});

module.exports = Model.model('NotificationSubscriber', NotificationSchema);