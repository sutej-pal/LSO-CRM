"use strict";

const ValidatorJS = require("validatorjs");

const MainHelper = require('../helpers/main_helper');

/**
 * Create Company Validator
 */
class Validator {
  /**
   * Constructor
   * @param {*} req 
   */
  constructor(req) {
    /**
     * Rules
     */
    this.rules = {
      name: "required|string",
      code: 'string|required|max:50',
      address: "required|string|max:500",
      cityId: "required|string|" + MainHelper.mongoIdValidationRule(),
      companyId: "required|string|" + MainHelper.mongoIdValidationRule(),
      landmark: "string|max:500",
      mobile: "numeric|required|digits:10",
      landline: "string|max:25",
      email: "required|email",
      GSTIN: "string",
      panNo: "string",
      isActive: 'boolean',
    };

    /**
     * Error Messages
     */
    this.messages = {};

    /**
     * Validated fields' object
     */
    this.validated = {};

    /**
     * Object to be validated
     */
    this.data = req.body;

    /**
     * Validator
     */
    this.validator = new ValidatorJS(this.data, this.rules, this.messages);

    /**
     * Validate all the fields
     */
    this.getValidated();
  }

  /**
   * Check if the validator fails
   */
  fails() {
    return this.validator.fails();
  }

  /**
   * Check if the validator passes
   */
  passes() {
    return this.validator.passes();
  }

  errors() {
    return this.validator.errors;
  }

  /**
   * Get only the validated content
   */
  getValidated(getNull = false) {
    for (const rule in this.rules) {
      if(this.data[rule] == undefined) {
        if(getNull) {
          this.validated[rule] = null;
        }
      } else {
        this.validated[rule] = this.data[rule];
      }
    }
  }
}

module.exports = Validator;