/**
 * Load Models
 */
const Model = require("../models/lead_type");
const User = require("../models/user");

/**
 * Load Data
 */
// const countries = require("../data/country.json");
const data = [
  { name: "DST", code: "dst" },
  { name: "CPT", code: "cpt" },
  { name: "FMC", code: "fmc" },
];

module.exports = class Seeder {
  static drop() {
    // delete all previous data
    return Promise.all([Model.deleteMany({})]);
  }
  static seed() {
    return User.findOne({name: 'Waseem Farooqi'}).then(admin => {
      return Promise.all(
        data.map(datum => {
          datum.createdBy = datum.updatedBy = admin._id;
          return Model.create(datum)
        })
      ).then(_ => {
        console.log("Lead Type Seeded");
      }).catch(err => {
        console.log("Unable to seed Lead Type!");
      });
    })
  }
};
