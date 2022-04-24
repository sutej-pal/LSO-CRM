const Helper = require("../config/helper");

const Branch = require("../models/branch");
const Lead = require("../models/lead");
const User = require("../models/user");

// all validators
const CreateBranchValidator = require("../validators/create_branch");
const UpdateBranchValidator = require("../validators/update_branch");

const BranchResource = require("../resources/branch_resource");

module.exports = class BranchController {
  static index(req, res) {
    let options = {
      isDeleted: false,
      companyId: {
        $ne: null
      }
    };
    if (req.user.roleId.code != "sadmin") {
      options._id = req.user.branchId._id;
    }
    Branch.find(options)
      .then(branches => {
        return Helper.main.response200(
          res,
          new BranchResource(branches),
          "Branch list"
        );
      })
      .catch(err => {
        return Helper.main.response500(res);
      });
  }
  static create(req, res) {
    // validate
    const validator = new CreateBranchValidator(req);

    if (validator.fails()) {
      return Helper.main.validationResponse(res, validator.errors().all());
    }

    const validated = Helper.main.withSingature(req, validator.validated);

    Branch.findOne({
      code: validated.code
    })
      .then(exists => {
        if (exists) {
          return Helper.main.validationResponse(res, {
            code: ["Code already in use!"]
          });
        }
        // main code
        // check if city and company exists
        Promise.all([
          require("../models/city")
            .findById(validated.cityId)
            .populate({
              path: "stateId",
              select: "_id",
              populate: {
                path: "countryId",
                select: "_id"
              }
            }),
          require("../models/branch").findOne({
            _id: validated.companyId,
            companyId: null,
            isActive: true,
            isDeleted: false
          })
        ])
          .then(([city, company]) => {
            if (!company) {
              return Helper.main.response422(
                res,
                {
                  companyId: "Company is invalid"
                },
                "Some validation error occured!"
              );
            }
            if (!city) {
              return Helper.main.response422(
                res,
                {
                  cityId: "City is invalid"
                },
                "Some validation error occured!"
              );
            }

            validated.stateId = city.stateId._id;
            validated.countryId = city.stateId.countryId._id;

            Branch.create(validated).then(branch => {
              return Helper.main.response200(
                res,
                new BranchResource(branch),
                "Branch Created!"
              );
            });
          })
          .catch(err => {
            return Helper.main.response500(res);
          });
        // main code end
      })
      .catch(e => {
        console.log(e);
        return Helper.main.response500(res);
      });
  }

  static update(req, res) {
    const validator = new UpdateBranchValidator(req);

    if (validator.fails()) {
      return Helper.main.validationResponse(res, validator.errors().all());
    }

    if (!Helper.main.isValidMongoId(req.params.id)) {
      return Helper.main.response404(res);
    }

    const validated = Helper.main.withSingature(
      req,
      validator.validated,
      false
    );

    Branch.findOne({
      code: validated.code
    })
      .then(exists => {
        if (exists && exists.id != req.params.id) {
          return Helper.main.validationResponse(res, {
            code: ["Code already in use!"]
          });
        }
        // main code

        Promise.all([
          require("../models/city")
            .findById(validated.cityId)
            .populate({
              path: "stateId",
              select: "_id",
              populate: {
                path: "countryId",
                select: "_id"
              }
            }),
          require("../models/branch").find({
            _id: validated.companyId,
            isActive: true,
            companyId: null,
            isDeleted: false
          })
        ])
          .then(([city, company]) => {
            if (!company) {
              return Helper.main.response422(
                res,
                {
                  companyId: "Company is invalid"
                },
                "Some validation error occured!"
              );
            }
            if (!city) {
              return Helper.main.response422(
                res,
                {
                  cityId: "City is invalid"
                },
                "Some validation error occured!"
              );
            }

            validated.stateId = city.stateId._id;
            validated.countryId = city.stateId.countryId._id;

            Branch.findOneAndUpdate(
              {
                _id: req.params.id,
                isDeleted: false,
                companyId: {
                  $ne: null
                }
              },
              validated,
              { new: true }
            ).then(branch => {
              if (!branch) {
                return Helper.main.response404(res);
              }

              // cascade inactive effect
              new Promise((resolve, reject) => {
                if (
                  validated.isActive != true &&
                  validated.isActive != "true"
                ) {
                  Helper.model
                    .deactivateModels([Lead, User], {
                      branchId: branch._id
                    })
                    .then(_ => {
                      resolve();
                    })
                    .catch(err => {
                      // Todo: Log Error
                      reject(err);
                    });
                } else {
                  resolve();
                }
              }).then(_ => {
                return Helper.main.response200(
                  res,
                  new BranchResource(branch),
                  "Branch Updated"
                );
              });
            });
          })
          .catch(err => {
            console.log(err);
            return Helper.main.response500(res);
          });
        // main code end
      })
      .catch(e => {
        console.log(e);
        return Helper.main.response500(res);
      });
  }

  static delete(req, res) {
    if (!Helper.main.isValidMongoId(req.params.id)) {
      return Helper.main.response404(res);
    }

    Branch.findOneAndUpdate(
      {
        _id: req.params.id,
        isDeleted: false,
        companyId: {
          $ne: null
        }
      },
      Helper.main.withSingature(
        req,
        {
          isDeleted: true
        },
        false
      )
    )
      .then(company => {
        if (!company) {
          return Helper.main.response404(res);
        }

        // cascade effect to sub docs
        new Promise((resolve, reject) => {
          Helper.model
            .deleteModels([Lead, User], {
              branchId: company._id
            })
            .then(_ => {
              resolve();
            })
            .catch(err => {
              // Todo: Log Error
              reject(err);
            });
        }).then(_ => {
          return Helper.main.response200(
            res,
            new BranchResource(company),
            "Branch Deleted!"
          );
        });
      })
      .catch(err => {
        return Helper.main.response500(res);
      });
  }
};
