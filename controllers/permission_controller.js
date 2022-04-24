const Helper = require('../config/helper');

module.exports = class Controller {
    static index(req, res) {
        // TODO: Fix this
        console.log(require('express')()._router.stack);
    }
}