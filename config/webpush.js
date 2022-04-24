const webpush = require('web-push');

webpush.setVapidDetails('email', process.env.VAPID_PUBLICKEY || '', process.env.VAPID_PRIVATEKEY || '');

module.exports = webpush;
