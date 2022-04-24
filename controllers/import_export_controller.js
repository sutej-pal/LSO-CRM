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

const csvFields = {
  date: "Date", // date
  branchId: "Branch", // branchID
  leadSourceId: "Lead Source", // leadSourceId
  leadTypeId: "Lead Type", // leadTypeId
  salesModelId: "Sales Model", // salesModelId
  badminId: "Branch Admin", // badminId
  stlId: "STL", // stlId
  smId: "SM", // smId
  stTcId: "ST TC", // stTcId
  dtlId: "DTL", // dtlId
  daId: "DA", // daId
  name: "Client Name", // name
  mobile: "Mobile", // mobile
  landline: "Landline", // landline
  email: "Email", // email
  businessType: "Business Type", // businessType
  dealerName: "Dealer Name", // dealer
  dealerMobile: "Dealer Mobile", // dealer
  dealerEmail: "Dealer Email", // dealer
  dealerCompany: "Dealer Company", // dealer
  fmcName: "FMC Name", // fmc
  fmcMobile: "FMC Mobile", // fmc
  fmcEmail: "FMC Email", // fmc
  fmcCompany: "FMC Company", // fmc
  cityId: "City", // cityId
  sector: "Sector", // sector
  location: "Location", // location
  project: "Project", // project
  towerNo: "Tower No", // towerNo
  unitNo: "Unit No", // unitNo
  floor: "Floor", // floor
  superArea: "Super Area", // superArea
  carpetArea: "Carpet Area", // carpetArea
  status: "Status", // status
  remarks: "Remarks", // remarks
  requirementType: "Requirement Type", // requirementType
  requirement: "Requirement", // requirement
  budgetType: "Budget Type", // budgetType
  budget: "Budget", // budget
  projectFeeType: "Project Fee Type", // projectFeeType
  projectFee: "Project Fee", // projectFee
  projectFeeRemarks: "Project Fee Remark", // projectFeeRemarks
  welcomeCall: "Welcome Call", // welcomeCall
  welcomeText: "Welcome Text", // welcomeText
  welcomeMail: "Welcome Mail", // welcomeMail
  designProposal: "Design Proposal", // designProposal
  testFitout: "Test Fitout", // testFitout
  boq: "BOQ", // boq
  finalLayout: "Final Layout", // finalLayout
  whatsappGroupLead: "Whatsapp Group Lead", // whatsappGroupLead
  whatsappGroupPMC: "Whatsapp Group PMC", // whatsappGroupPMC
  whatsappGroupOwner: "Whatsapp Group Owner", // whatsappGroupOwner
  whatsappGroupTenant: "Whatsapp Group Tenant", // whatsappGroupTenant
  loi: "LOI", // loi
  agreement: "Agreement", // agreement
  followupDate: "Followup Date", // followupDate
  pipelineDate: "Pipeline Date", // pipelineDate
  meetings: "Meetings", // meetings
  closureDate: "Closure Date", // closureDate
  createdBy: "Created By", // createdBy
  updatedBy: "Updated By", // updatedBy
  isActive: "Is Active" // isActive
  // createdAt: "Created At", // createdAt
  // updatedAt: "Updated At", // updatedAt
};

function getInvertedCSVFields(chunk = {}) {
  let reverted = {};
  let revertedChunk = {};
  for (const key in csvFields) {
    if (csvFields.hasOwnProperty(key)) {
      reverted[csvFields[key]] = key;
    }
  }
  return reverted;
  for (const key in chunk) {
    if (chunk.hasOwnProperty(key)) {
      revertedChunk[reverted[key]] = chunk[key];
    }
  }
  return revertedChunk;
}

function getNameFromModel(model = {}) {
  if (!model || typeof model != "object") {
    return "";
  }
  if ("name" in model) {
    return model.name;
  } else {
    return "";
  }
}

function getModelFromName(name = "", model = undefined) {
  let actualModel = null;
  return actualModel;
}

function formatDate(date) {
  let data = "";
  try {
    data = moment(date).format("Y-M-D");
  } catch (e) {}
  return data;
}

function getIdFromName(chunk = {}, req) {
  return new Promise((resolve, reject) => {
    try {
      let leadBranchId = "";
      Promise.all([
        Branch.findOne({
          // branchId
          isDeleted: false,
          name: chunk.branchId
        }),
        LeadSource.findOne({
          // leadSourceId
          isDeleted: false,
          name: chunk.leadSourceId
        }),
        LeadType.findOne({
          // leadTypeId
          isDeleted: false,
          name: chunk.leadTypeId
        }),
        Array.isArray(chunk.salesModelId) // salesModelId
          ? Promise.all(
              chunk.salesModelId.map(e =>
                SalesModelSalesModel.find({
                  isDeleted: false,
                  name: e.id
                })
              )
            )
          : new Promise((rs, rj) => rs([])),
        User.findOne({
          // badminId
          isDeleted: false,
          name: chunk.badminId
        }).populate("roleId"),
        User.findOne({
          // stlId
          isDeleted: false,
          name: chunk.stlId
        }).populate("roleId"),
        User.findOne({
          // smId
          isDeleted: false,
          name: chunk.smId
        }).populate("roleId"),
        User.findOne({
          // stTcId
          isDeleted: false,
          name: chunk.stTcId
        }).populate("roleId"),
        User.findOne({
          // dtlId
          isDeleted: false,
          name: chunk.dtlId
        }).populate("roleId"),
        User.findOne({
          // daId
          isDeleted: false,
          name: chunk.daId
        }).populate("roleId"),
        City.findOne({
          // cityId
          name: chunk.cityId
        }),
        User.findOne({
          // createdBy
          isDeleted: false,
          name: chunk.createdBy
        }),
        User.findOne({
          // updatedBy
          isDeleted: false,
          name: chunk.updatedBy
        })
      ]).then(ids => {
        const [
          branchId,
          leadSourceId,
          leadTypeId,
          salesModelId,
          badminId,
          stlId,
          smId,
          stTcId,
          dtlId,
          daId,
          cityId,
          createdBy,
          updatedBy
        ] = ids;

        // validate every record
        if (
          !branchId ||
          !leadSourceId ||
          !leadTypeId ||
          !salesModelId ||
          (salesModelId && salesModelId.length == 0) ||
          !badminId ||
          !stlId ||
          !smId ||
          !stTcId ||
          !dtlId ||
          !daId ||
          !cityId ||
          !createdBy ||
          !updatedBy
        ) {
          reject('Some of the resource ids are invalid');
        }
        // validate every record end

        chunk.branchId = branchId ? branchId._id : null;
        chunk.leadSourceId = leadSourceId ? leadSourceId._id : null;
        chunk.leadTypeId = leadTypeId ? leadTypeId._id : null;
        chunk.salesModelId = salesModelId ? salesModelId._id : null;
        chunk.salesModelId = salesModelId ? salesModelId.map(e => e._id) : [];
        chunk.badminId = badminId ? badminId._id : null;
        chunk.stlId = stlId ? stlId._id : null;
        chunk.smId = smId ? smId._id : null;
        chunk.stTcId = stTcId ? stTcId._id : null;
        chunk.dtlId = dtlId ? dtlId._id : null;
        chunk.daId = daId ? daId._id : null;
        chunk.cityId = cityId ? cityId._id : null;
        chunk.createdBy = createdBy ? createdBy._id : null;
        chunk.updatedBy = updatedBy ? updatedBy._id : null;
        console.log(chunk);
        resolve(chunk);
      });
    } catch (e) {
      reject(e);
    }
  });
}

function makeTable(fields = {}, leads = []) {
  const count = Object.keys(fields).length;
  let response = "<html><body><table border=1>";
  // make header
  response += "<tr>";
  for (const key in fields) {
    response += "<th>" + fields[key] + "</th>";
  }
  response += "</tr>";
  // make header end
  // make body
  for (lead of leads) {
    response += "<tr>";
    for (const key in lead) {
      if (fields.includes(key)) {
        response += "<td>" + lead[key] + "</td>";
        // response += '<td>' + key + ': ' + lead[key] + '</td>';
      }
    }
    response += "</tr>";
  }
  // make body end
  response += "</table></body></html>";
  return response;
}

module.exports = class Controller {
  static export(req, res) {
    let fields = Object.values(csvFields);

    let options = {
      isDeleted: false
    };
    // if (req.user.roleId.code != "sadmin") {
    //   options.branchId = req.user.branchId;
    // }

    Lead.find(options)
      .populate("branchId")
      .populate("leadSourceId")
      .populate("leadTypeId")
      .populate("salesModelId")
      .populate("badminId")
      .populate("stlId")
      .populate("smId")
      .populate("stTcId")
      .populate("dtlId")
      .populate("daId")
      .populate("requirementType")
      .populate("createdBy")
      .populate("updatedBy")
      .then(leads => {
        // serialize all data
        leads = leads.map(lead => {
          let newLead = {};
          for (const key in lead) {
            switch (key) {
              case "dealer":
                newLead["Dealer Name"] = lead.dealer ? lead.dealer.name : "";
                newLead["Dealer Mobile"] = lead.dealer
                  ? lead.dealer.mobile
                  : "";
                newLead["Dealer Email"] = lead.dealer ? lead.dealer.email : "";
                newLead["Dealer Company"] = lead.dealer
                  ? lead.dealer.companyName
                  : "";
                break;
              case "fmc":
                newLead["FMC Name"] = lead.fmc ? lead.fmc.name : "";
                newLead["FMC Mobile"] = lead.fmc ? lead.fmc.mobile : "";
                newLead["FMC Email"] = lead.fmc ? lead.fmc.email : "";
                newLead["FMC Company"] = lead.fmc ? lead.fmc.companyName : "";
                break;

              default:
                newLead[csvFields[key]] = lead[key];
                break;
            }
          }
          // -------------------------------------------------------------------
          // get name for all related models
          newLead["Branch"] = getNameFromModel(newLead["Branch"]);
          newLead["Lead Source"] = getNameFromModel(newLead["Lead Source"]);
          newLead["Lead Type"] = getNameFromModel(newLead["Lead Type"]);
          newLead["Sales Model"] = getNameFromModel(newLead["Sales Model"]);
          newLead["Branch Admin"] = getNameFromModel(newLead["Branch Admin"]);
          newLead["STL"] = getNameFromModel(newLead["STL"]);
          newLead["SM"] = getNameFromModel(newLead["SM"]);
          newLead["ST TC"] = getNameFromModel(newLead["ST TC"]);
          newLead["DTL"] = getNameFromModel(newLead["DTL"]);
          newLead["DA"] = getNameFromModel(newLead["DA"]);
          newLead["Created By"] = getNameFromModel(newLead["Created By"]);
          newLead["Updated By"] = getNameFromModel(newLead["Updated By"]);
          // get name for all related models end
          // fix everything wrong
          newLead["Mobile"] = "'" + newLead["Mobile"].join(",");
          newLead["Email"] = newLead["Email"].join(",");

          newLead["Date"] = formatDate(newLead["Date"]);

          for (const key in newLead) {
            if (newLead[key] !== false && !newLead[key]) {
              newLead[key] = "-";
            }
          }
          // fix everything wrong end
          // -------------------------------------------------------------------
          return newLead;
        });
        const parser = new Parser({ fields });
        let csv = [];
        if (req.params.type == "sample") {
          csv = parser.parse([]);
        } else {
          csv = parser.parse(leads);
        }
        // res.send(csv);
        res.attachment("leads.csv");
        return res.status(200).send(csv);
        // return res.send(makeTable(fields, leads));
      });
  }

  static import(req, res) {
    if ("file" in req.files && (req.files.file.mimetype == "text/csv" || req.files.file.mimetype == "application/vnd.ms-excel")) {
      const csv = req.files.file;
      const storage = require("../config/storage");
      const filePath = path.join(process.cwd(), storage.storageDir, csv.name);
      csv
        .mv(filePath)
        .then(_ => {
          const readStream = fs.createReadStream(filePath);
          const data = [];
          // let sent = false;
          readStream
            .pipe(CsvParser())
            .on("data", chunk => {
              // unfix everything wrong
              for (const key in chunk) {
                if (chunk[key].trim() === "-") {
                  chunk[key] = undefined;
                }
              }

              chunk["Date"] = moment(chunk["Date"]);
              chunk["Email"] = chunk["Email"].split(",");
              chunk["Mobile"] = chunk["Mobile"].split(",");
              chunk["Followup Date"] = chunk["Followup Date"]
                .split(",")
                .filter(e => e);
              chunk["Meetings"] = chunk["Meetings"].split(",").filter(e => e);

              // unfix everything wrong end
              // -------------------------------------------------------------------
              let reverseCSVField = getInvertedCSVFields();
              let newLead = {};
              newLead.dealer = {};
              newLead.dealer.name = chunk["Dealer Name"];
              newLead.dealer.mobile = chunk["Dealer Mobile"];
              newLead.dealer.email = chunk["Dealer Email"];
              newLead.dealer.companyName = chunk["Dealer Company"];
              newLead.fmc = {};
              newLead.fmc.name = chunk["FMC Name"];
              newLead.fmc.mobile = chunk["FMC Mobile"];
              newLead.fmc.email = chunk["FMC Email"];
              newLead.fmc.companyName = chunk["FMC Company"];
              for (const key in chunk) {
                // console.log({key, fields: reverseCSVField[key], chunk: chunk[key]});
                newLead[reverseCSVField[key]] = chunk[key];
              }
              data.push(newLead);
            })
            .on("end", _ => {
              const failures = [];
              const success = [];
              Promise.all(data.map(e => getIdFromName(e, req)))
                .then(leads => {
                  return Promise.all(
                    leads.map((e, i) =>
                      Lead.create(e)
                        .then(_ => {
                          success.push("Imported lead no. " + (i + 1));
                        })
                        .catch(e => {
                          failures.push("Could not import lead no. " + (i + 1));
                        })
                    )
                  );
                })
                .then(insertedLeads => {
                  return res.json({
                    message: "Import Complete!",
                    data: { failures, success }
                  });
                })
                .catch(err => {
                  console.log(err);
                  return res.json(err);
                });
            });
        })
        .catch(err => {
          throw err;
          return Helper.main.response500(res);
        });
    } else {
      res.status(422).json({message: 'Validation Error', errors: { file: ['CSV file is required!']}});
    }
  }
};
