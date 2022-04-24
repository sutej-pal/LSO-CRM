/**
 * Load Seeders
 */
const Seeder = require("../seeders/seeder");

const Helper = require("../config/helper");

const Branch = require("../models/branch");
const LeadSource = require("../models/lead_source");
const LeadType = require("../models/lead_type");
const SalesModel = require("../models/sales_model");
const User = require("../models/user");

module.exports = class DevController {
  static seed(req, res) {
    Seeder.drop().then(() => {
      return Seeder.seed();
    })
    .then(response => {
      console.info("Database seed complete!");
      return res.json({
        message: "Database seed complete!"
      });
    })
    .catch(err => {
      console.info("Seed failed", err);
      return res.json({
        message: "Some error occured"
      });
    });
  }

  static listUser(req, res) {
    User.find()
      .then(users => {
        users = users.map(user => {
          return user.toObject();
        });
        return res.json({
          message: "All Users List",
          users: users
        });
      })
      .catch(err => {
        if (err) {
          return res.json({
            error: err
          });
        }
      });
  }

  static test(req, res) {
    // const email = require('../config/mail');
    // email.sendMail({
    //   from: 'email',
    //   to: 'email',
    //   subject: 'Yo',
    //   text: 'HAHAHA',
    //   html: '<b>HAHAHA</b>'
    // }).then(info => {
    //   console.log(info);
    // }).catch(err => {
    //   console.log(err);
    // })
    const Mail = require("../mails/request_password_reset_mail");

    const mail = new Mail({
      to: "email",
      subject: "Password Reset",
      text: "CRM - Password Reset Request",
      html: "<b>HAHAHA</b>"
    });

    mail.send().then(info => {
      console.log(info);
    });

    return res.json([req.route.path, req.method, req.user]);
    // const file = req.file;
    // if (!file) {
    //   const error = new Error("Please upload a file");
    //   error.httpStatusCode = 400;
    //   throw error;
    // }
    // res.send(file);
  }

  static leadData(req, res) {
    Promise.all([
      Branch.findOne({
        companyId: {
          $ne: null
        }
      }),
      LeadSource.findOne({
        isActive: true,
        isDeleted: false
      }),
      LeadType.findOne({
        isActive: true,
        isDeleted: false
      }),
      SalesModel.findOne({
        isActive: true,
        isDeleted: false
      }),
      User.findOne({
        isActive: true,
        isDeleted: false
      })
    ])
      .then(([branch, leadSource, leadType, salesModel, user]) => {
        Helper.main.response200(res, {
          branchId: branch._id,
          leadSourceId: leadSource._id,
          leadTypeId: leadType._id,
          salesModelId: salesModel._id,
          stlId: user._id,
          smId: user._id,
          stTcId: user._id,
          dtlId: user._id,
          daId: user._id,
        });
      })
      .catch(err => {
        Helper.main.response500(res, err);
      });
  }
};
