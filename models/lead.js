const Model = require("mongoose");

const Meeting = require("./meeting");

const Schema = Model.Schema;

const meetingSchema = new Schema(
  {
    peopleId: [
      {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "User"
      }
    ],
    remarks: {
      type: String,
      required: false
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "User"
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "User"
    },
    isActive: {
      type: Boolean,
      required: false,
      default: true
    },
    isDeleted: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const DealerSchema = new Schema({
  name: String,
  mobile: String,
  email: String,
  companyName: String
});

const followupSchema = new Schema({
  date: Date,
  isDone: Boolean,
  followupRemarks: String
});

const leadSchema = new Schema(
  {
    // Lead data
    date: {
      type: Date,
      required: true,
      default: Date
    },
    branchId: {
      type: Model.Types.ObjectId,
      required: true,
      ref: "Branch"
    },
    leadSourceId: {
      type: Model.Types.ObjectId,
      required: false,
      ref: "LeadSource"
    },
    leadTypeId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "LeadType"
    },
    salesModelId: [
      {
        ref: "SalesModel",
        required: false,
        type: Model.Types.ObjectId
      }
    ],
    badminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false
    },
    stlId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false
    },
    smId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false
    },
    stTcId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false
    },
    dtlId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false
    },
    daId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false
    },
    pmcId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false
    },
    // Lead data end
    // Client Information
    name: {
      type: String,
      required: false
    },
    mobile: {
      type: [String],
      // validate: {
      //   validator: value => {
      //     return /[.0-9]{10}/.test(value);
      //   }
      // },
      required: false
    },
    landline: {
      type: String,
      required: false
    },
    email: [
      {
        type: String,
        required: false
      }
    ],
    businessType: {
      type: String,
      required: false
    },
    // Client Information end
    // Dealer information
    dealer: DealerSchema,
    fmc: DealerSchema,
    // Dealer information end
    // Project requirement
    cityId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "City"
    },
    sector: String,
    location: String,
    // Project requirement end
    // Inventory details
    project: String,
    towerNo: {
      type: String,
      required: false
    },
    unitNo: {
      type: String,
      required: false
    },
    floor: {
      type: String,
      required: false
    },
    superArea: {
      type: String,
      required: false
    },
    carpetArea: {
      type: String,
      required: false
    },
    // Inventory details end
    status: {
      // Bareshell, furnished, semi furnished, build to siuit
      type: String,
      required: false
    },
    remarks: {
      type: String,
      required: false
    },
    // project requirement
    requirementType: {
      type: Schema.Types.ObjectId,
      refs: "LeadRequirement",
      required: false
    },
    requirement: {
      type: String,
      required: false
    },
    budgetType: {
      type: String,
      required: false
    },
    budget: String,
    // project requirement end
    // project fee
    projectFeeType: String,
    projectFee: String,
    projectFeeRemarks: {
      type: String,
      required: false
    },
    // project fee end
    // Status
    status: {
      required: false,
      type: String
    },
    welcomeCall: {
      required: true,
      type: Boolean,
      default: false
    },
    welcomeText: {
      required: true,
      type: Boolean,
      default: false
    },
    welcomeMail: {
      required: true,
      type: Boolean,
      default: false
    },
    designProposal: {
      required: false,
      type: Boolean,
      default: false
    },
    testFitout: {
      required: false,
      type: Boolean,
      default: false
    },
    boq: {
      required: false,
      type: Boolean,
      default: false
    },
    finalLayout: {
      required: false,
      type: Boolean,
      default: false
    },
    whatsappGroupLead: {
      required: false,
      type: Boolean,
      default: false
    },
    whatsappGroupPMC: {
      required: false,
      type: Boolean,
      default: false
    },
    whatsappGroupOwner: {
      required: false,
      type: Boolean,
      default: false
    },
    whatsappGroupTenant: {
      required: false,
      type: Boolean,
      default: false
    },
    loi: {
      required: false,
      type: Boolean,
      default: false
    },
    agreement: {
      required: false,
      type: Boolean,
      default: false
    },
    siteVisit: {
      required: false,
      type: Boolean,
      default: false
    },
    meeting: {
      required: false,
      type: Boolean,
      default: false
    },
    // yes no end
    followupDate: [followupSchema],
    pipelineDate: {
      type: Date,
      required: false
    },
    meetings: [meetingSchema],
    closureDate: {
      type: Date,
      required: false
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    isActive: {
      type: Boolean,
      required: false,
      default: true
    },
    isDeleted: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = Model.model("Lead", leadSchema);
