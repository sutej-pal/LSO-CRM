const LeadRequirement = require("../models/lead_requirement");
const Helper = require("../config/helper");
const LeadRequirementValidator = require("../validators/create_lead_requirement");
const LeadRequirementResource = require("../resources/lead_requirement_resource");

module.exports = class Controller {
  static index(req, res) {
    const requirements = LeadRequirement.find({
      isDeleted: false
    })
      .then(requirements => {
        return Helper.main.response200(
          res,
          new LeadRequirementResource(requirements),
          "Requirement List"
        );
      })
      .catch(err => {
        console.log(err);
        return Helper.main.response500(res);
      });
  }

  static create(req, res) {
    const validator = new LeadRequirementValidator(req);
    if (validator.fails()) {
      return Helper.main.response422(res, validator.errors().all());
    }
    const validated = Helper.main.withSingature(req, validator.validated);
    LeadRequirement.create(validated)
      .then(leadRequirement => {
        return Helper.main.response200(
          res,
          new LeadRequirementResource(leadRequirement),
          "Lead Requirement Created!"
        );
      })
      .catch(err => {
        console.log(err);
        return Helper.main.response500(res);
      });
  }

  static update(req, res) {
    if (!Helper.main.isValidMongoId(req.params.id)) {
      return Helper.main.response404(res);
    }

    const validator = new LeadRequirementValidator(req);
    if (validator.fails()) {
      return Helper.main.response422(res, validator.errors().all());
    }
    const validated = Helper.main.withSingature(
      req,
      validator.validated,
      false
    );
    // check if someone has same code other than us
    LeadRequirement.findOne({
      isDeleted: false,
      code: validated.code
    })
      .then(exists => {
        if (exists && exists._id != req.params.id) {
          return Helper.main.validationResponse(res, {
            code: ["Code already in use!"]
          });
        }
        LeadRequirement.findOneAndUpdate(
          {
            _id: req.params.id,
            isDeleted: false
          },
          validated,
          {
            new: true
          }
        )
          .then(updatedLeadRequirement => {
            if (!updatedLeadRequirement) {
              return Helper.main.response404(res);
            }
            return Helper.main.response200(
              res,
              new LeadRequirementResource(updatedLeadRequirement),
              "Lead Requirement Updated!"
            );
          })
          .catch(err => {
            console.log(err);
            return Helper.main.response500(res);
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

    LeadRequirement.findOneAndUpdate(
      {
        _id: req.params.id,
        isDeleted: false
      },
      {
        isDeleted: true
      }
    )
      .then(leadRequirement => {
        if (!leadRequirement) {
          return Helper.main.response404(res);
        }
        return Helper.main.response200(
          res,
          new LeadRequirementResource(leadRequirement),
          "Lead Requirement Deleted!"
        );
      })
      .catch(err => {
        console.log(err);
        return Helper.main.response500(res);
      });
  }
};
