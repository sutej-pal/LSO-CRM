const Helper = require("../config/helper");

const Branch = require("../models/branch");
const User = require("../models/user");
const Lead = require("../models/lead");

// all validators
const CreateCompanyValidator = require("../validators/create_company");
const UpdateCompanyValidator = require("../validators/update_company");

const CompanyResource = require("../resources/company_resource");

module.exports = class CompanyController {
  static index(req, res) {
    Branch.find({ isDeleted: false, companyId: null })
      .then(companies => {
        return Helper.main.response200(
          res,
          new CompanyResource(companies),
          "Company list"
        );
      })
      .catch(err => {
        return Helper.main.response500(res);
      });
  }
  static create(req, res) {
    // validate
    const validator = new CreateCompanyValidator(req);

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
        // check if city exists
        require("../models/city")
          .findById(validated.cityId)
          .populate({
            path: "stateId",
            select: "_id",
            populate: {
              path: "countryId",
              select: "_id"
            }
          })
          .then(city => {
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
            Branch.create(validated).then(company => {
              return Helper.main.response200(
                res,
                new CompanyResource(company),
                "Company Created!"
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
    const validator = new UpdateCompanyValidator(req);

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

        require("../models/city")
          .findById(validated.cityId)
          .populate({
            path: "stateId",
            select: "_id",
            populate: {
              path: "countryId",
              select: "_id"
            }
          })
          .then(city => {
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
                companyId: null
              },
              validated,
              { new: true }
            ).then(company => {
              if (!company) {
                return Helper.main.response404(res);
              }

              // cascade inactive effect
              new Promise((resolve, reject) => {
                if (
                  validated.isActive != true &&
                  validated.isActive != "true"
                ) {
                  Helper.model
                    .deactivateModels([Branch, User], {
                      comapnyId: company._id
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
              })
                .then(_ => {
                  return Helper.main.response200(
                    res,
                    new CompanyResource(company),
                    "Company Updated"
                  );
                })
                .catch(err => {
                  console.log(err);
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
        companyId: null
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

        // cascade inactive effect
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
            new CompanyResource(company),
            "Company Deleted!"
          );
        });
      })
      .catch(err => {
        return Helper.main.response500(res);
      });
  }
};
