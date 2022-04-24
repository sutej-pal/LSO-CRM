const LeadType = require("../models/lead_type");
const Helper = require("../config/helper");
const LeadTypeResource = require("../resources/lead_type_resource");
const CreateLeadTypeValidator = require("../validators/create_lead_type");

module.exports = class Controller {
  static index(req, res) {
    LeadType.find({
      isDeleted: false
    })
      .then(leadTypes => {
        return Helper.main.response200(
          res,
          new LeadTypeResource(leadTypes),
          "Lead type list!"
        );
      })
      .catch(err => {
        return Helper.main.response500(res);
      });
  }

  static create(req, res) {
    const validator = new CreateLeadTypeValidator(req);

    if (validator.fails()) {
      return Helper.main.validationResponse(res, validator.errors().all());
    }

    const validated = Helper.main.withSingature(req, validator.validated);

    LeadType.findOne({
      code: validated.code
    })
      .then(exists => {
        if (exists) {
          return Helper.main.validationResponse(res, {
            code: ["Code already in use!"]
          });
        }
        // main code
        LeadType.create(validated)
          .then(leadType => {
            return Helper.main.response200(
              res,
              new LeadTypeResource(leadType),
              "Lead Type Created"
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

  static update(req, res) {
    if (!Helper.main.isValidMongoId(req.params.id)) {
      return Helper.main.response404(res);
    }

    const validator = new CreateLeadTypeValidator(req);

    if (validator.fails()) {
      return Helper.main.validationResponse(res, validator.errors().all());
    }

    const validated = Helper.main.withSingature(
      req,
      validator.validated,
      false
    );

    LeadType.findOne({
      code: validated.code,
      isDeleted: false,
    })
      .then(exists => {
        if (exists && exists.id != req.params.id) {
          return Helper.main.validationResponse(res, {
            code: ["Code already in use!"]
          });
        }
        // main code

        LeadType.findOneAndUpdate(
          {
            _id: req.params.id,
            isDeleted: false
          },
          validated,
          { new: true }
        )
          .then(leadType => {
            if (!leadType) {
              return Helper.main.response404(res);
            }

            return Helper.main.response200(
              res,
              new LeadTypeResource(leadType),
              "Lead Type Updated!"
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

    LeadType.findOneAndUpdate(
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
      .then(leadType => {
        if (!leadType) {
          return Helper.main.response404(res);
        }
        return Helper.main.response200(
          res,
          new LeadTypeResource(leadType),
          "Lead Type Deleted"
        );
      })
      .catch(err => {
        return Helper.main.response500(res);
      });
  }
};
