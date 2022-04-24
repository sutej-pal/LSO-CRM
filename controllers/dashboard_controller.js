const Lead = require("../models/lead");
const moment = require('moment');

module.exports = class DashboardController {
    static async getFollowUpData(req, res) {
        let options = {
            isDeleted: false
        };
        if (req.user.roleId.code != "sadmin") {
            options.branchId = req.user.branchId._id;
            options["$or"] = [
                {badminId: req.user._id},
                {stlId: req.user._id},
                {smId: req.user._id},
                {stTcId: req.user._id},
                {dtlId: req.user._id},
                {daId: req.user._id}
            ];
        }
        let today = '';
        let startDate = '';
        let endDate = '';
        if (req.body.today === undefined) {
            startDate = moment(req.body.startDate, 'YYYY-MM-DD');
            endDate = moment(req.body.endDate, 'YYYY-MM-DD');
        } else {
            today = moment(req.body.today, 'YYYY-MM-DD')
        }
        let result = [];
        try {
            let response = await Lead.find(options)
                .populate('createdBy', 'name')
                .select('closureDate pipelineDate status followupDate mobile email createdAt name businessType');
            response.filter((object) => {
                if (object.followupDate.length > 0) {
                    object.followupDate.filter((date, index) => {
                        if (today === '') {
                            if (moment(date.date).isBetween(startDate, endDate)) {
                        //         delete object.followupDate[index]._id;
                        //         delete object.followupDate[index].isDone;
                                object.id = object._id;
                                delete object._id;
                                result.push(object);
                            }
                        } else {
                            if (moment(date.date).isSame(today)) {
                        //         delete object.followupDate[index]._id;
                        //         delete object.followupDate[index].isDone;
                                object.id = object._id;
                                delete object._id;
                                result.push(object);
                            }
                        }
                    });
                }
            });
        } catch (e) {
            console.log('response', e);
        }
        res.json({
            message: "FollowUp Data",
            data: result
        });
    }
};
