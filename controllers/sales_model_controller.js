const SalesModel = require("../models/sales_model");

const Helper = require("../config/helper");

const SalesModelResource = require("../resources/sales_model_resource");

const CreateValidator = require("../validators/sales_model_create_validator");

module.exports = class SalesModelController {
  static index(req, res) {
    SalesModel.find({ isDeleted: false })
      .then(salesModels => {
        return Helper.main.response200(
          res,
          new SalesModelResource(salesModels),
          "Sales models list!"
        );
      })
      .catch(err => {
        return Helper.main.response500(res);
      });
  }

  static create(req, res) {
    const validator = new CreateValidator(req);

    if (validator.fails()) {
      return Helper.main.validationResponse(res, validator.errors().all());
    }

    const validated = Helper.main.withSingature(req, validator.validated);

    SalesModel.findOne({
      code: validated.code
    })
      .then(salesModel => {
        if (salesModel) {
          return Helper.main.validationResponse(res, {
            code: ["Code already in use!"]
          });
        }
        SalesModel.create(validated).then(salesModel => {
          return Helper.main.response200(
            res,
            new SalesModelResource(salesModel),
            "Created sales model"
          );
        });
      })
      .catch(err => {
        return Helper.main.response500(res);
      });
  }

  static update(req, res) {
    const validator = new CreateValidator(req);

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
    SalesModel.findOne({
      code: validated.code
    })
      .then(salesModel => {
        if (salesModel && salesModel.id != req.params.id) {
          return Helper.main.validationResponse(res, {
            code: ["Code already in use!"]
          });
        }
        SalesModel.findOneAndUpdate(
          {
            _id: req.params.id,
            isDeleted: false
          },
          validated,
          { new: true }
        ).then(salesModel => {
          if (!salesModel) {
            return Helper.main.response404(res);
          }
          return Helper.main.response200(
            res,
            new SalesModelResource(salesModel),
            "Updated sales model!"
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

    SalesModel.findOneAndUpdate(
      {
        _id: req.params.id,
        isDeleted: false
      },
      Helper.main.withSingature(req, { isDeleted: true }, false),
      { new: true }
    )
      .then(salesModel => {
        if (!salesModel) {
          return Helper.main.response404(res);
        }
        return Helper.main.response200(
          res,
          new SalesModelResource(salesModel),
          "Sales Model Deleted"
        );
      })
      .catch(err => {
        return Helper.main.response500(res);
      });
  }
};
