const LeadSource = require("../models/lead_source");
const Helper = require("../config/helper");
const LeadSourceResource = require("../resources/lead_source_resource");
const CreateLeadSourceValidator = require("../validators/create_lead_source");

module.exports = class Controller {
  static index(req, res) {
    LeadSource.find({
      isDeleted: false
    })
      .then(leadSources => {
        return Helper.main.response200(
          res,
          new LeadSourceResource(leadSources),
          "Lead source list!"
        );
      })
      .catch(err => {
        return Helper.main.response500(res);
      });
  }

  static create(req, res) {
    const validator = new CreateLeadSourceValidator(req);

    if (validator.fails()) {
      return Helper.main.validationResponse(res, validator.errors().all());
    }

    const validated = Helper.main.withSingature(req, validator.validated);

    LeadSource.findOne({
      code: validated.code
    })
      .then(exists => {
        if (exists) {
          return Helper.main.validationResponse(res, {
            code: ["Code already in use!"]
          });
        }
        // main code
        LeadSource.create(validated)
          .then(leadSource => {
            return Helper.main.response200(
              res,
              new LeadSourceResource(leadSource),
              "Lead source Created"
            );
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

  static update(req, res) {
    if (!Helper.main.isValidMongoId(req.params.id)) {
      return Helper.main.response404(res);
    }

    const validator = new CreateLeadSourceValidator(req);

    if (validator.fails()) {
      return Helper.main.validationResponse(res, validator.errors().all());
    }

    const validated = Helper.main.withSingature(
      req,
      validator.validated,
      false
    );

    LeadSource.findOne({
      code: validated.code
    })
      .then(exists => {
        if (exists && exists.id != req.params.id) {
          return Helper.main.validationResponse(res, {
            code: ["Code already in use!"]
          });
        }
        // main code

        LeadSource.findOneAndUpdate(
          {
            _id: req.params.id,
            isDeleted: false
          },
          validated,
          { new: true }
        )
          .then(leadSource => {
            if (!leadSource) {
              return Helper.main.response404(res);
            }

            return Helper.main.response200(
              res,
              new LeadSourceResource(leadSource),
              "Lead source Updated!"
            );
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

  static delete(req, res) {
    if (!Helper.main.isValidMongoId(req.params.id)) {
      return Helper.main.response404(res);
    }

    LeadSource.findOneAndUpdate(
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
      ),
      { new: true }
    )
      .then(leadSource => {
        if (!leadSource) {
          return Helper.main.response404(res);
        }
        return Helper.main.response200(
          res,
          new LeadSourceResource(leadSource),
          "Lead source Deleted"
        );
      })
      .catch(err => {
        return Helper.main.response500(res);
      });
  }
};
