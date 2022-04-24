const Helper = require('../config/helper');
/**
 * Always use after auth middleware
 * 
 * - get auth user with req.user
 * - then check its roleId.permissions
 * - call next only if pathname in permissions
 * 
 * @param {string} routeName is route name
 * @param {boolean} guard is if the route should be guarded by permission or not
 */

function name(routeName = '', guard = false) {
    registerRoute(routeName);
    return (req, res, next) => {
        if(guard) {
            try {
                if(req.user.roleId.permissions.includes(routeName) || req.user.roleId.code == 'sadmin') {
                    next();
                } else {
                    return Helper.main.response403(res);
                }
            } catch(error) {
                return Helper.main.response403(res);
            }
        } else {
            next();
        }
    };
}

function registerRoute(routeName = '') {
    if(!__globals.permissions.includes(routeName)) {
        __globals.permissions.push(routeName);
    }
}

module.exports = name;