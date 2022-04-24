const Country = require('../models/country');
const State = require('../models/state');
const City = require('../models/city');

const MainHelper = require('../helpers/main_helper');


/**
 * Single Action Controller
 */
module.exports = async (req, res) => {
    Country.find().select('name _id').populate({
        path: 'states',
        select: 'name _id',
        populate: {
            path: 'cities',
            select: 'name _id'
        }
    }).then(countries => {
        return res.json({
            message: "Countries List",
            data: countries
        });
    }).catch(error => {
        return MainHelper.response500(res);
    });
}