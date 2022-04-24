/**
 * Load Models
 */
const Model = require("../models/sales_model");

/**
 * Load Data
 */
// const countries = require("../data/country.json");
const data = [
  { name: "ABC NB", code: "ABC-NB" },
  { name: "ABC STOCK", code: "ABC-STOCK" },
  { name: "WOW OFFICE", code: "WOW-OFFICE" },
  { name: "WOW HOMES", code: "WOW-HOMES" },
  { name: "CONNECT OFFICE LEASE", code: "COM-LEASE" },
  { name: "CONNECT OFFICE RESALE", code: "COM-RESALE" },
  { name: "CONNECT OFFICE FRESH SALE", code: "COM-FS" },
  { name: "CONNECT HOMES LEASE", code: "RES-LEASE" },
  { name: "CONNECT HOMES RESALE", code: "RES-RESALES" },
  { name: "CONNECT HOMES FRESH SALE", code: "RES-FS" },
  { name: "CONSTRUCTION", code: "CONSTRUCTION" },
  { name: "Wow Office/Homes", code: "WOW-OFFICE-HOME" },
  { name: "ABC", code: "ABC" }
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
        return Model.create(datum);
      })
    )
      .then(_ => {
        console.log("Sales Model Seeded");
      })
      .catch(err => {
        console.log("Unable to seed Sales Model!");
      });
  }
};
