const User = require("../models/user");
const Role = require("../models/role");
const Branch = require("../models/branch");
const Helper = require("../config/helper");
const CreateUserValidator = require("../validators/create_user");
const UpdateUserValidator = require("../validators/update_user");
const Bcrypt = require("bcrypt");

const UserResource = require("../resources/user_resource");
const MinimalUserResource = require("../resources/user_minimal_resource");

module.exports = class Controller {
  static index(req, res) {
    User.find({
      isDeleted: false
    })
      .populate("roleId")
      .then(users => {
        return helper.main.response200(res, new UserResource(users));
      });
  }

  static branchIndex(req, res) {
    if (!Helper.main.isValidMongoId(req.params.id)) {
      return Helper.main.response404(res);
    }
    User.find({
      isDeleted: false,
      branchId: req.params.id
    })
      .populate("roleId")
      .then(users => {
        const categorizedUsers = {
          sadmin: [],
          badmin: [],
          stl: [],
          sm: [],
          tc: [],
          dtl: [],
          da: [],
          pmc: []
        };
        users.forEach(user => {
          if (user.roleId.code in categorizedUsers) {
            categorizedUsers[user.roleId.code].push(
              new MinimalUserResource(user)
            );
          }
        });
        return helper.main.response200(res, categorizedUsers);
      });
  }

  static allIndex(req, res) {
    User.find({
      isDeleted: false
    })
      .populate("roleId")
      .then(users => {
        const categorizedUsers = {
          sadmin: [],
          badmin: [],
          stl: [],
          sm: [],
          tc: [],
          dtl: [],
          da: [],
          pmc: []
        };
        users.forEach(user => {
          if (user.roleId.code in categorizedUsers) {
            categorizedUsers[user.roleId.code].push(
              new MinimalUserResource(user)
            );
          }
        });
        return helper.main.response200(res, categorizedUsers);
      });
  }

  static create(req, res) {
    const validator = new CreateUserValidator(req);

    if (validator.fails()) {
      return Helper.main.validationResponse(res, validator.errors().all());
    }

    const validated = Helper.main.withSingature(req, validator.validated);

    Promise.all([
      Role.findOne({
        isActive: true,
        isDeleted: false,
        _id: validated.roleId
      }),
      Branch.findOne({
        isActive: true,
        isDeleted: false,
        _id: validated.branchId,
        companyId: {
          $ne: null
        }
      }),
      Array.isArray(validated.supervisorId)
        ? Promise.all(
            validated.supervisorId.map(id => {
              return User.findOne({
                isActive: true,
                isDeleted: false,
                _id: id
              }).populate("roleId");
            })
          )
        : new Promise((s, f) => {
            s("hasnosupervisor");
          })
    ])
      .then(([role, branch, supervisor]) => {
        if (!role) {
          return Helper.main.response422(
            res,
            {
              roleId: "Role is invalid"
            },
            "Some validation error occured!"
          );
        }
        if (!branch) {
          return Helper.main.response422(
            res,
            {
              branchId: "Branch is invalid"
            },
            "Some validation error occured!"
          );
        }

        if (supervisor !== "hasnosupervisor" && Array.isArray(supervisor)) {
          for (let [i, s] of supervisor.entries()) {
            if (!s || s.roleId.code !== "stl") {
              return Helper.main.response422(
                res,
                {
                  supervisorId: "Supervisor " + i + " is invalid lol"
                },
                "Some validation error occured!"
              );
            }
          }
        }

        if (supervisor == "hasnosupervisor") {
          validated.supervisorId = [];
        }

        Bcrypt.hash(validated.password, parseInt(process.env.HASH_ROUNDS)).then(
          hash => {
            validated.password = hash;
            validated.isActive = validated.isActive ? true : false;
            validated.companyId = branch.companyId;
            User.create(validated).then(user => {
              return Helper.main.response200(
                res,
                new UserResource(user),
                "User created!"
              );
            });
          }
        );
      })
      .catch(err => {
        console.log(err);
        return Helper.main.response500(res);
      });
  }

  static update(req, res) {
    const validator = new UpdateUserValidator(req);

    if (!Helper.main.isValidMongoId(req.params.id)) {
      return Helper.main.response404(res);
    }

    if (validator.fails()) {
      return Helper.main.validationResponse(res, validator.errors().all());
    }

    const validated = Helper.main.withSingature(
      req,
      validator.validated,
      false
    );

    Promise.all([
      Role.findOne({
        isActive: true,
        isDeleted: false,
        _id: validated.roleId
      }),
      Branch.findOne({
        _id: validated.branchId,
        isActive: true,
        isDeleted: false,
        companyId: {
          $ne: null
        }
      }),
      "password" in validated && validated.password
        ? Bcrypt.hash(validated.password, parseInt(process.env.HASH_ROUNDS))
        : new Promise((resolve, reject) => {
            resolve("password");
          }),
      Array.isArray(validated.supervisorId)
        ? Promise.all(
            validated.supervisorId.map(id => {
              return User.findOne({
                isActive: true,
                isDeleted: false,
                _id: id
              }).populate("roleId");
            })
          )
        : new Promise((s, f) => {
            s("hasnosupervisor");
          })
    ])
      .then(([role, branch, hash, supervisor]) => {
        if (!role) {
          return Helper.main.response422(
            res,
            {
              roleId: "Role is invalid"
            },
            "Some validation error occured!"
          );
        }
        if (!branch) {
          return Helper.main.response422(
            res,
            {
              branchId: "Branch is invalid"
            },
            "Some validation error occured!"
          );
        }

        if (supervisor !== "hasnosupervisor" && Array.isArray(supervisor)) {
          for (let [i, s] of supervisor.entries()) {
            if (!s || s.roleId.code !== "stl") {
              console.log(validated.supervisorId, supervisor);
              return Helper.main.response422(
                res,
                {
                  supervisorId: "Supervisor " + i + " is invalid hahaha"
                },
                "Some validation error occured!"
              );
            }
          }
        }

        if (supervisor == "hasnosupervisor") {
          validated.supervisorId = [];
        }

        if ("password" in validated) {
          validated.password = hash;
        }

        if (validated.password === "password") {
          delete validated.password;
        }

        validated.companyId = branch.companyId;

        validated.isActive = validated.isActive ? true : false;

        User.findOneAndUpdate(
          {
            _id: req.params.id,
            isDeleted: false
          },
          validated,
          { new: true }
        ).then(user => {
          if (!user) {
            return Helper.main.response404(res);
          }

          return Helper.main.response200(
            res,
            new UserResource(user),
            "User updated!"
          );
        });
      })
      .catch(err => {
        console.log(err);
        return Helper.main.response500(res);
      });
  }

  static delete(req, res) {
    if (!Helper.main.isValidMongoId(req.params.id)) {
      return Helper.main.response404(res);
    }
    User.findOneAndUpdate(
      {
        _id: req.params.id,
        isDeleted: false
      },
      Helper.main.withSingature(
        req,
        {
          isDeleted: true
        },
        false
      )
    )
      .then(user => {
        if (!user) {
          return Helper.main.response404(res);
        }
        return Helper.main.response200(
          res,
          new UserResource(user),
          "User Deleted!"
        );
      })
      .catch(err => {
        return Helper.main.response500(res);
      });
  }
};
