/**
 * Load Models
 */
const Model = require("../models/branch");
const Country = require('../models/country');

/**
 * Load Data
 */
// const countries = require("../data/country.json");
const data = [
  {
    name: "ACB",
    code: "abc",
    address: "Not Set",
    mobile: "9999999999",
    email: "contact@abc.org",
    cityId: "5da0585f6256eb073c4a7ba6",
    stateId: "5da0585f6256eb073c4a7b86",
    countryId: "5da0585f6256eb073c4a7b77"
  },
  {
    name: "ABC",
    code: "abc",
    address: "Not Set",
    mobile: "9999999999",
    email: "contact@abc.org",
    cityId: "5da0585f6256eb073c4a7ba6",
    stateId: "5da0585f6256eb073c4a7b86",
    countryId: "5da0585f6256eb073c4a7b77"
  }
];

module.exports = class Seeder {
  static drop() {
    // delete all previous data
    return Promise.all([
      Model.deleteMany({})
    ]);
  }
  static seed() {
    // get city state and country

    return Country.findOne({
      name: "India"
    }).populate({
      path: 'states',
      select: 'name _id',
      populate: {
        path: 'cities',
        select: 'name _id'
      }
    }).then(india => {
      data[0].cityId = data[1].cityId = india.states.filter(s => s.name == "Haryana")[0].cities.filter(c => c.name == "Gurgaon")[0]._id;
      data[0].stateId = data[1].stateId = india.states.filter(state => state.name == "Haryana")[0]._id;
      data[0].countryId = data[1].countryId = india.id;
      return Model.create(data[0]).then(model => {
        data[1].companyId = model._id;
        return Model.create(data[1]).then(_ => {
          console.log("Company Seeded");
        });
      });
    }).catch(err => {
      if(err.name == 'ValidationError') {
        console.error('Validation Error');
      } else {
        console.log("Unable to seed Company!");
      }
    });
  }
};
