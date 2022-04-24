const Helper = require("../config/helper");

const UpdateLeadValidator = require("../validators/update_lead");
const moment = require("moment");

const Lead = require("../models/lead");
const Branch = require("../models/branch");
const LeadSource = require("../models/lead_source");
const LeadType = require("../models/lead_type");
const SalesModel = require("../models/sales_model");
const User = require("../models/user");
const City = require("../models/city");

const ClosureResource = require("../resources/closure_resource");

module.exports = (req, res) => {
  if (!Helper.main.isValidMongoId(req.params.id)) {
    return Helper.main.response404(res);
  }

  const errors = {};
  const validator = new UpdateLeadValidator(req);

  if (validator.fails()) {
    return Helper.main.validationResponse(res, validator.errors().all());
  }

  const validated = Helper.main.withSingature(
    req,
    validator.validated,
    false,
    false
  );

  // checkAllTrueFalse
  Helper.lead.getTrueOrFalse(validated);

  // check if branchid is same if not super admin
  Helper.lead.validateSameBranchId(req.user, validated.branchId, errors);

    // remove null followupDates
    try {
      validated.followupDate = validated.followupDate.filter(e => e.date);
    } catch(e) {
      console.log(e);
      validated.followupDate = [];
    }

  // remove null meetings
  validated.meetings = validated.meetings.filter(e => (e.ids.length > 0));

  // check if all the ids are available
  Helper.lead
    .validateAllRelatedResult(validated, true)
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
        leadRequirement,
        meetings
      ]) => {

        // check if branch is valid
        if (!branch) {
          Helper.lead.pushToError(errors, "branchId", "branch is invalid!");
        }

        // check for unique mobile numbers
        Helper.lead.checkForUniqueMobiles(validated.mobile, mobiles, errors, req.params.id);

        if(!salesModels) salesModels = [];
        salesModels.forEach(salesModel => {
          if ("salesModelId" in validated && !salesModel) {
            Helper.lead.pushToError(
              errors,
              "salesModelId",
              "salesModel is invalid!"
            );
          }
        });

        if ("cityId" in validated && !city) {
          Helper.lead.pushToError(errors, "cityId", "city is invalid!");
        }

        if (
          "meetings" in validated &&
          validated.meetings.length !== meetings.filter(e => e).length
        ) {
          Helper.lead.pushToError(
            errors,
            "meetings",
            "meeting person is invalid!"
          );
        }

        // send error response if errors
        if (Object.keys(errors).length != 0) {
          return Helper.main.response422(
            res,
            errors,
            "Some validation errors occured!"
          );
        }

        
        // fix meetings from validated
        validated.meetings = validated.meetings.map((meeting, index) => {
          return {
            peopleId: meeting.ids,
            remarks: meeting.remarks
          };
        }).filter(e => e.peopleId);

        // create closure
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
              let isChanged = false;
              if (!lead.pipelineDate) {
                lead.pipelineDate = new Date();
                isChanged = true;
              }
              if (!lead.closureDate) {
                lead.closureDate = new Date();
                isChanged = true;
              }
              if (isChanged) {
                lead
                  .save()
                  .then(_ => {
                    resolve(_);
                  })
                  .catch(err => {
                    reject(err);
                  });
              }
              {
                resolve(lead);
              }
            }).then(_ => {
              return Helper.main.response200(res, new ClosureResource(_));
            });
          })
          .catch(err => {
            return Helper.main.response500(res);
          });
      }
    );
};
