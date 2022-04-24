/**
 * Load Models
 */
const Model = require("../models/role");

/**
 * Load Data
 */
// const countries = require("../data/country.json");
const data = [
  {
    name: "Admin"
  }
];

module.exports = class Seeder {
  static drop() {
    // delete all previous data
    return Promise.all([Model.deleteMany({})]);
  }
  static seed() {
    // create country
    return Promise.all(
      data.map(datum => {
        return Model.create(datum)
      })
    ).then(_ => {
      console.log("Sample Seeded");
    }).catch(err => {
      console.log("Unable to seed Sample!");
    });
  }
};
