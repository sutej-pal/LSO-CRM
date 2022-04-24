const Lead = require("../models/lead");
const Helper = require("../config/helper");
const LeadResource = require("../resources/closure_resource");
const CreateLeadValidator = require("../validators/create_lead");
const UpdateLeadValidator = require("../validators/edit_lead");
const moment = require("moment");

const Branch = require("../models/branch");
const LeadSource = require("../models/lead_source");
const LeadType = require("../models/lead_type");
const SalesModel = require("../models/sales_model");
const User = require("../models/user");
const Meeting = require("../models/meeting");
const City = require("../models/city");

const { Parser } = require("json2csv");
const CsvParser = require("csv-parser");
const path = require("path");
const fs = require("fs");

const ObjectId = require("mongoose").Types.ObjectId;

module.exports = class Controller {
  static index(req, res) {
    // return res.json(req.user);
    let options = {
      isDeleted: false
    };
    if (req.user.roleId.code != "sadmin") {
      options.branchId = req.user.branchId._id;
      options["$or"] = [
        { badminId: req.user._id },
        { stlId: req.user._id },
        { smId: req.user._id },
        { stTcId: req.user._id },
        { dtlId: req.user._id },
        { daId: req.user._id }
      ];
    }
    Lead.find(options)
      .populate("createdBy")
      .then(leads => {
        return Helper.main.response200(
          res,
          new LeadResource(leads),
          "Leads list"
        );
      })
      .catch(err => {
        return Helper.main.response500(res);
      });
  }

  static detail(req, res) {
    if (!Helper.main.isValidMongoId(req.params.id)) {
      return Helper.main.response404(res);
    }
    let options = {
      isDeleted: false,
      _id: req.params.id
    };
    if (req.user.roleId.code != "sadmin") {
      options.branchId = req.user.branchId;
    }
    Lead.findOne(options)
      .then(lead => {
        if (!lead) {
          return Helper.main.response404(res);
        }
        return Helper.main.response200(
          res,
          new LeadResource(lead),
          "Leads list"
        );
      })
      .catch(err => {
        console.log(err);
        return Helper.main.response500(res);
      });
  }

  static create(req, res) {
    const errors = {};
    const validator = new CreateLeadValidator(req);
    if (validator.fails()) {
      return Helper.main.validationResponse(res, validator.errors().all());
    }

    const validated = Helper.main.withSingature(
      req,
      validator.validated,
      true,
      true
    );

    // validate date
    Helper.lead.validateDate(validated.date, errors);
    // validate followupdate
    Helper.lead.validateFollowupDate(
      validated.followupDate,
      validated.date,
      errors
    );

    // check if branchid is same if not super admin
    Helper.lead.validateSameBranchId(req.user, validated.branchId, errors);

    // remove null followupDates
    try {
      validated.followupDate = validated.followupDate.filter(e => e.date);
    } catch (e) {
      console.log(e);
      validated.followupDate = [];
    }

    // check if all the ids are available
    Helper.lead
      .validateAllRelatedResult(validated)
      .then(
        ([
          branch,
          leadSource,
          leadType,
          salesModels,
          badmin,
          stl,
          sm,
          stTc,
          dtl,
          da,
          city,
          mobiles,
          leadRequirement
        ]) => {
          // check if branch is valid
          if (!branch) {
            Helper.lead.pushToError(errors, "branchId", "branch is invalid!");
          }

          // check for unique mobile numbers
          Helper.lead.checkForUniqueMobiles(validated.mobile, mobiles, errors);

          // check for sales model validity
          if (!salesModels) salesModels = [];
          salesModels.forEach(salesModel => {
            if ("salesModelId" in validated && !salesModel) {
              Helper.lead.pushToError(
                errors,
                "salesModelId",
                "salesModel is invalid!"
              );
            }
          });

          // check for city validity
          if ("cityId" in validated && !city) {
            Helper.lead.pushToError(errors, "cityId", "city is invalid!");
          }

          // send error response if errors
          if (Object.keys(errors).length != 0) {
            return Helper.main.response422(
              res,
              errors,
              "Some validation errors occured!"
            );
          }

          // create Lead
          Lead.create(validated)
            .then(lead => {
              return Helper.main.response200(
                res,
                new LeadResource(lead),
                "Lead Created!"
              );
            })
            .catch(err => {
              console.log(err);
              return Helper.main.response500(res);
            });
        }
      );
  }

  static update(req, res) {
    if (!Helper.main.isValidMongoId(req.params.id)) {
      return Helper.main.response404(res);
    }

    const errors = {};
    const validator = new UpdateLeadValidator(req);

    // return Helper.main.response200(res, req.body);

    if (validator.fails()) {
      return Helper.main.validationResponse(res, validator.errors().all());
    }

    const validated = Helper.main.withSingature(
      req,
      validator.validated,
      false
    );

    // checkAllTrueFalse
    Helper.lead.getTrueOrFalse(validated);

    /*
  not needed in pipeline
  */

    // validate date
    Helper.lead.validateDate(validated.date, errors);

    // check if branchid is same if not super admin
    Helper.lead.validateSameBranchId(req.user, validated.branchId, errors);

    // remove null followupDates
    try {
      validated.followupDate = validated.followupDate.filter(e => e.date);
    } catch (e) {
      console.log(e);
      validated.followupDate = [];
    }

    // remove null meetings
    validated.meetings = [];

    // check if all the ids are available

    Helper.lead
      .validateAllRelatedResult(validated)
      .then(
        ([
          branch,
          leadSource,
          leadType,
          salesModels,
          badmin,
          stl,
          sm,
          stTc,
          dtl,
          da,
          city,
          mobiles,
          leadRequirement
        ]) => {
          // check if branch is valid
          if (!branch) {
            Helper.lead.pushToError(errors, "branchId", "branch is invalid!");
          }

          // check for unique mobile numbers
          Helper.lead.checkForUniqueMobiles(
            validated.mobile,
            mobiles,
            errors,
            req.params.id
          );

          // check for sales model validity
          if (!salesModels) salesModels = [];
          salesModels.forEach(salesModel => {
            if ("salesModelId" in validated && !salesModel) {
              Helper.lead.pushToError(
                errors,
                "salesModelId",
                "salesModel is invalid!"
              );
            }
          });

          // check for leadType validation
          if ("leadTypeId" in validated && !leadType) {
            Helper.lead.pushToError(
              errors,
              "leadTypeId",
              "leadType is invalid!"
            );
          }

          // check for city validity
          if ("cityId" in validated && !city) {
            Helper.lead.pushToError(errors, "cityId", "city is invalid!");
          }

          // send error response if errors
          if (Object.keys(errors).length != 0) {
            return Helper.main.response422(
              res,
              errors,
              "Some validation errors occured!"
            );
          }
          // create Lead
          Lead.findOneAndUpdate(
            {
              _id: req.params.id,
              isDeleted: false
            },
            validated,
            {
              new: true
            }
          )
            .then(lead => {
              if (!lead) {
                return Helper.main.response404(res, {}, "lead not found!");
              }

              const result = new Promise((resolve, reject) => {
                lead.pipelineDate = null;
                lead.closureDate = null;
                lead
                  .save()
                  .then(_ => {
                    resolve(_);
                  })
                  .catch(err => {
                    reject(err);
                  });
              }).then(_ => {
                return Helper.main.response200(res, new LeadResource(lead));
              });
            })
            .catch(err => {
              return Helper.main.response500(res);
            });
        }
      );
  }

  static delete(req, res) {
    if (!Helper.main.isValidMongoId(req.params.id)) {
      return Helper.main.response404(res);
    }

    let options = {
      _id: req.params.id,
      isDeleted: false
    };
    if (req.user.roleId.code != "sadmin") {
      options.branchId = req.user.branchId;
    }

    Lead.findOneAndUpdate(
      options,
      Helper.main.withSingature(
        req,
        {
          isDeleted: true
        },
        false
      ),
      { new: true }
    )
      .then(lead => {
        if (!lead) {
          return Helper.main.response404(res);
        }
        return Helper.main.response200(
          res,
          new LeadResource(lead),
          "Lead deleted!"
        );
      })
      .catch(err => {
        return Helper.main.response500(res);
      });
  }
};
