const moment = require("moment");

const Lead = require("../models/lead");
const Branch = require("../models/branch");
const LeadSource = require("../models/lead_source");
const LeadType = require("../models/lead_type");
const SalesModel = require("../models/sales_model");
const User = require("../models/user");
const Meeting = require("../models/meeting");
const City = require("../models/city");
const LeadRequirement = require("../models/lead_requirement");

module.exports = class LeadHelper {
  // makesure if date is atmost before 2 days or after 2 days
  static validateDate(date, errors) {
    // if date is before 2 days
    if (moment(date).isBefore(moment().subtract(9, "days"))) {
      LeadHelper.pushToError(
        errors,
        "date",
        "Selected date should be after " +
          moment()
            .subtract(9, "days")
            .format("DD MMM YYYY")
      );
    }

    // if date is after 2 days
    if (moment(date).isAfter(moment().add(9, "days"))) {
      LeadHelper.pushToError(
        errors,
        "date",
        "Selected date should be before " +
          moment()
            .add(9, "days")
            .format("DD MMM YYYY")
      );
    }
  }

  //   makesure if followup is after today
  static validateFollowupDate(dateArray, date, errors) {
    if (!Array.isArray(dateArray)) {
      console.log("LeadHelper.validateFollowupDate: dateArray is not Array");
      return;
    }
    dateArray.forEach(date => {
      if (moment(date).isBefore(date)) {
        LeadHelper.pushToError(errors, "followupDate", "Invalid followup date");
      }
    });
  }

  //   check if user branch is same if not super admin
  static validateSameBranchId(user, branchId, errors) {
    if (user.roleId.code !== "sadmin" && user.branchId._id != branchId) {
      LeadHelper.pushToError(errors, "branchId", "Invalid branch Id");
    }
  }

  // check if all the related ids are available
  static validateAllRelatedResult(validatedRequest, hasMeetings = false) {
    const relatedModels = [
      LeadHelper.getPromiseForModel({
        model: Branch,
        value: validatedRequest.branchId
      }),
      LeadHelper.getPromiseForModel({
        model: LeadSource,
        value: validatedRequest.leadSourceId
      }),
      LeadHelper.getPromiseForModel({
        model: LeadType,
        value: validatedRequest.leadTypeId
      }),
      LeadHelper.getPromiseForModel({
        model: SalesModel,
        value: validatedRequest.salesModelId
      }),
      LeadHelper.getPromiseForModel({
        model: User,
        value: validatedRequest.badminId,
        populate: "roleId"
      }),
      LeadHelper.getPromiseForModel({
        model: User,
        value: validatedRequest.stlId,
        populate: "roleId"
      }),
      LeadHelper.getPromiseForModel({
        model: User,
        value: validatedRequest.smId,
        populate: "roleId"
      }),
      LeadHelper.getPromiseForModel({
        model: User,
        value: validatedRequest.stTcId,
        populate: "roleId"
      }),
      LeadHelper.getPromiseForModel({
        model: User,
        value: validatedRequest.dtlId,
        populate: "roleId"
      }),
      LeadHelper.getPromiseForModel({
        model: User,
        value: validatedRequest.daId,
        populate: "roleId"
      }),
      LeadHelper.getPromiseForModel({
        model: City,
        value: validatedRequest.cityId,
        otherConditions: {
          isActive: true
        }
      }),
      LeadHelper.getPromiseForModel({
        model: Lead,
        value: validatedRequest.mobile,
        key: "mobile",
        otherConditions: {
          isDeleted: false
        }
      }),
      LeadHelper.getPromiseForModel({
        model: LeadRequirement,
        value: validatedRequest.requirementType
      })
    ];

    if (hasMeetings) {
      relatedModels.push(
        Promise.all(
          validatedRequest.meetings.map(f => {
            return LeadHelper.getPromiseForModel({
              model: User,
              value: f.ids,
              populate: "roleId"
            });
          })
        )
      );
    }

    return Promise.all(relatedModels);
  }

  static getPromiseForModel(
    option = {
      model: null,
      obj: {},
      key: "_id",
      value: null,
      populate: null,
      otherConditions: {}
    }
  ) {
    if (!option.value) {
      return new Promise((resolve, reject) => {
        resolve(false);
      });
    }
    if (typeof option.value === "string") {
      return option.model.findOne(
        LeadHelper.getSearchingConditions(
          option.key,
          option.value,
          option.otherConditions
        )
      );
    }

    if (Array.isArray(option.value)) {
      return Promise.all(
        option.value.map(id => {
          const response = option.model.findOne(
            LeadHelper.getSearchingConditions(
              option.key,
              id,
              option.otherConditions
            )
          );
          if (option.populate) {
            return response.populate(option.populate);
          } else {
            return response;
          }
        })
      );
    }
  }

  static getSearchingConditions(
    key = "_id",
    value = null,
    otherConditions = {}
  ) {
    const conditions = Object.assign({}, otherConditions);
    conditions[key] = value;
    return conditions;
  }

  //   check for unqiue mobile numbers
  static checkForUniqueMobiles(
    incomingMobiles,
    existingMobiles,
    errors,
    leadId = null
  ) {
    // remove empty values
    existingMobiles = existingMobiles.filter(e => e);

    existingMobiles.forEach(mobile => {
      if (!(leadId && mobile._id == leadId)) {
        mobile.mobile
          .filter(e => incomingMobiles.includes(e)) // check which mobile for current lead is already on use
          .forEach(e => {
            console.log(mobile._id, leadId);
            LeadHelper.pushToError(errors, "mobile", e + " is already used!");
          });
      }
    });
  }

  static getTrueOrFalse(validated = {}) {
    validated.welcomeCall = validated.welcomeCall ? true : false;
    validated.welcomeText = validated.welcomeText ? true : false;
    validated.welcomeMail = validated.welcomeMail ? true : false;
    validated.designProposal = validated.designProposal ? true : false;
    validated.testFitout = validated.testFitout ? true : false;
    validated.boq = validated.boq ? true : false;
    validated.finalLayout = validated.finalLayout ? true : false;
    validated.whatsappGroupLead = validated.whatsappGroupLead ? true : false;
    validated.whatsappGroupPMC = validated.whatsappGroupPMC ? true : false;
    validated.whatsappGroupOwner = validated.whatsappGroupOwner ? true : false;
    validated.whatsappGroupTenant = validated.whatsappGroupTenant ? true : false;
    validated.loi = validated.loi ? true : false;
    validated.agreement = validated.agreement ? true : false;
    validated.siteVisit = validated.siteVisit ? true : false;
    validated.meeting = validated.meeting ? true : false;
    validated.status = validated.status ? true : false;
    validated.branchId = validated.branchId ? validated.branchId : null;
    validated.leadSourceId = validated.leadSourceId ? validated.leadSourceId : null;
    validated.leadTypeId = validated.leadTypeId ? validated.leadTypeId : null;
    validated.badminId = validated.badminId ? validated.badminId : null;
    validated.stlId = validated.stlId ? validated.stlId : null;
    validated.smId = validated.smId ? validated.smId : null;
    validated.stTcId = validated.stTcId ? validated.stTcId : null;
    validated.dtlId = validated.dtlId ? validated.dtlId : null;
    validated.daId = validated.daId ? validated.daId : null;
  }

  //   helpers
  static pushToError(errors, key, error) {
    if (key in errors) {
      errors[key].push(error);
    } else {
      errors[key] = [error];
    }
  }
};
