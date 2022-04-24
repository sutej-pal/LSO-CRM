'use strict';

const User = require('../models/user');

const JWT = require('jsonwebtoken');

const MainHelper = require('../helpers/main_helper');

const ProfileResource = require('../resources/profile_resource');

const response401 = {
    message: "Unauthenticated!"
};

module.exports = function(req, res, next) {
    // check if authorization header exists
    if(req.header('Authorization')) {
        const authorizationHeader = req.header('Authorization');
        const pieces = authorizationHeader.split(' ');
        // check if bearer and token are there
        if(pieces.length === 2) {
            const token = pieces[1];
            // validate token
            JWT.verify(token, process.env.APP_KEY, function(err, data) {
                if(err) {
                    return res.status(401).json(response401);
                };
                // check if user is still active
                User.findOne({
                    email: data.email,
                    isDeleted: false,
                    isActive: true,
                })
                .populate('roleId')
                .populate('companyId')
                .populate('branchId')
                .then(user => {
                    // check if user is still active
                    if(!user) {
                        return res.status(401).json(response401);
                    }
                    // delete all tokens if user inactive
                    if(user.isDeleted || !user.isActive) {
                        MainHelper.deleteUserToken(user);
                        return res.status(401).json(response401);
                    } else {
                        // if all is well forward the request
                        req.user = user;
                        next();
                    }
                }).catch(err => {
                    console.log(err);
                });
            });
            
        } else {
            return res.status(401).json(response401);
        }
    } else {
        return res.status(401).json(response401);
    }
}