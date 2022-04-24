const Lead = require("../models/lead");

module.exports = class LeadService {
    static findAllActiveLeads() {
        return Lead.find({
            isDeleted: false,
            isActive: true,
            stlId: {
                $ne: null
            }
        }).populate("stlId createdBy branchId");
    }
};
