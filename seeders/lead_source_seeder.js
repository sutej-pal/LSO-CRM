/**
 * Load Models
 */
const Model = require("../models/lead_source");
const User = require("../models/user");

/**
 * Load Data
 */
// const countries = require("../data/country.json");
const data = [
  { name: "Facebook", code: "fb" },
  { name: "Instagram", code: "insta" },
  { name: "Data Calling", code: "data_calling" },
  { name: "Banner", code: "banner" },
  { name: "Canopay", code: "canopay" },
  { name: "99 Acre", code: "99acre" },
  { name: "Whatsapp", code: "wa" },
  { name: "Call", code: "call" },
  { name: "Walking", code: "walking" },
  { name: "Linked In", code: "in" },
  { name: "Website", code: "web" },
  { name: "Other", code: "other" },
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
        console.log("Lead Source Seeded");
      }).catch(err => {
        console.log("Unable to seed Lead Source!");
      });
    })
  }
};
