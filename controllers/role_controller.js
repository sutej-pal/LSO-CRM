const Role = require('../models/role');

const Helper = require('../config/helper');

const Validator = require('../validators/create_role');

const RoleResource = require("../resources/role_resource");

module.exports = class RoleController {
    /**
     * List all roles
     * @param {*} req 
     * @param {*} res 
     */
    static index(req, res) {
        Role.find({isDeleted: false})
        .select('-isDeleted -__v')
        .then(roles => {
            return Helper.main.response200(res, new RoleResource(roles));
        })
    }

    static create(req, res) {
        const validator = new Validator(req);

        if(validator.fails()) {
            return Helper.main.validationResponse(res, validator.errors().all());
        }
        // const validated = {...validator.validated, code: Helper.str.makeCode(req.body.name)};
        const validated = Helper.main.withSingature(req, validator.validated);
        Role.findOne({
            code: validated.code
        })
        .then(exists => {
            if (exists) {
              return Helper.main.validationResponse(res, {
                code: ["Code already in use!"]
              });
            }
            Role.create(validated)
            .then(role => {
                return Helper.main.response200(res, new RoleResource(role), 'Role Created!');
            })
            .catch(err => { console.log(err); });
        })
        .catch(e => {
            console.log(e);
            return Helper.main.response500(res);
        });
    }
    
    static update(req, res) {
        const validator = new Validator(req);
        const roleId = req.params.id;

        if(validator.fails()) {
            return Helper.main.validationResponse(res, validator.errors().all());
        }

        if(!Helper.main.isValidMongoId(req.params.id)) {
            return Helper.main.response404(res);
        }

        // const validated = {...validator.validated, code: Helper.str.makeCode(req.body.name)};
        const validated = Helper.main.withSingature(req, validator.validated, false);
        Role.findOne({
            code: validated.code
        })
        .then(exists => {
            if (exists && exists.id != req.params.id) {
              return Helper.main.validationResponse(res, {
                code: ["Code already in use!"]
              });
            }
            Role.findOne({
                _id: roleId
            }).then(role => {
                if(!role || (role && role.isDeleted)) {
                    return Helper.main.response404(res);
                }
                role.code = validated.code;
                role.name = validated.name;
                role.description = validated.description;
                role.permissions = validated.permissions;
                role.isActive = validated.isActive ? true : false;
                role.save().then(_ => {
                    return Helper.main.response200(res, new RoleResource(role), "Role updated!");
                });
            }).catch(err => {
                return Helper.main.response500(res);
            });
        })
        .catch(e => {
          console.log(e);
          return Helper.main.response500(res);
        });
    }

    /**
     * Delete a role
     * @param {*} req 
     * @param {*} res 
     */
    static delete(req, res) {

        if(!Helper.main.isValidMongoId(req.params.id)) {
            return Helper.main.response404(res);
        }

        Role.findOneAndUpdate({
            _id: req.params.id, isDeleted: false 
        }, Helper.main.withSingature(req, {isDeleted: true}, false)).then(role => {
            if(!role) {
                return Helper.main.response404(res);
            }
            return Helper.main.response200(res, {}, "Role deleted!");
        }).catch(err => {
            return Helper.main.response500(res);
        })
    }
    
    static permissions(req, res) {
        return Helper.main.response200(res, __globals.permissions, 'Permissions List');
    }
}