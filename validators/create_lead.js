"use strict";

const ValidatorJS = require("validatorjs");

ValidatorJS.register('mongoId', function(value, requirement, attribute) {
  return value.match(/^$|^[0-9a-fA-F]{24}$/);
}, ':attribute is not a valid mongo Id');

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
      date : "required|date",
      branchId: "required|" + MainHelper.mongoIdValidationRule(),
      leadSourceId: "" + MainHelper.mongoIdValidationRule(),
      leadTypeId: "" + MainHelper.mongoIdValidationRule(),
      salesModelId: "array",
      'salesModelId.*': "" + MainHelper.mongoIdValidationRule(),
      badminId: "" + MainHelper.mongoIdValidationRule(),
      stlId: "" + MainHelper.mongoIdValidationRule(),
      smId: "" + MainHelper.mongoIdValidationRule(),
      stTcId: "" + MainHelper.mongoIdValidationRule(),
      dtlId: "" + MainHelper.mongoIdValidationRule(),
      daId: "" + MainHelper.mongoIdValidationRule(),
      pmcId: "" + MainHelper.mongoIdValidationRule(),
      name: "string",
      mobile: "array",
      'mobile.*': 'numeric|digits:10',
      landline: 'string|max:24',
      email: "array",
      'email.*': 'email',
      businessType: 'string',
      dealer: {
        name: 'string',
        mobile: 'string',
        email: 'email|string',
        companyName: 'string'
      },
      fmc: {
        name: 'string',
        mobile: 'string',
        email: 'email|string',
        companyName: 'string'
      },
      cityId: "" + MainHelper.mongoIdValidationRule(),
      sector: 'string',
      location: 'string',
      project: 'string',
      towerNo: 'string',
      unitNo: 'string',
      floor: 'string',
      superArea: 'string',
      carpetArea: 'string',
      status: 'string',
      requirementType: MainHelper.mongoIdValidationRule(),
      requirement: 'string',
      budgetType: 'string',
      budget: 'string',
      projectFeeType: 'string',
      projectFee: 'string',
      projectFeeRemarks: 'string',
      welcomeCall: 'boolean',
      welcomeText: 'boolean',
      welcomeMail: 'boolean',
      designProposal: 'boolean',
      testFitout: 'boolean',
      boq: 'boolean',
      finalLayout: 'boolean',
      whatsappGroupLead: 'boolean',
      whatsappGroupPMC: 'boolean',
      whatsappGroupOwner: 'boolean',
      whatsappGroupTenant: 'boolean',
      loi: 'boolean',
      agreement: 'boolean',
      siteVisit: 'boolean',
      meeting: 'boolean',
      followupDate: "array",
      'followupDate.*.date': 'date',
      'followupDate.*.isDone': 'boolean',
      'followupDate.*.followupRemarks': 'string',
      remarks: 'string',
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
