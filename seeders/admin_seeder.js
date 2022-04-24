/**
 * Load Models
 */
const Model = require("../models/user");
const Company = require("../models/branch");
const Role = require("../models/role");

const Bcrypt = require("bcrypt");

/**
 * Load Data
 */
// const countries = require("../data/country.json");
const data = [
  {
    name: "Waseem Farooqi",
    code: "sadmin",
    mobile: "9999999999",
    email: "admin@abc.in",
    password: "Default@123"
  },
  {
    name: "Jai Kishan",
    code: "badmin",
    mobile: "9999999999",
    email: "jk@abc.in",
    password: "Default@123"
  },
  {
    name: "Mayank Yadav",
    code: "stl",
    mobile: "9999999999",
    email: "my@abc.in",
    password: "Default@123"
  },
];

module.exports = class Seeder {
  static drop() {
    // delete all previous data
    return Promise.all([Model.deleteMany({})]);
  }
  static seed() {
    // find company, branch, role and password has
    return Promise.all([
      Company.findOne({ name: "ABC" }),
      Company.findOne({ name: "ABC - Gurugram" }),
      Role.find(),
      Bcrypt.hash(data[0].password, parseInt(process.env.HASH_ROUNDS))
    ]).then(response => {
      const [company, branch, role, hash] = response;
      // create model
      return Promise.all(
        data.map(datum => {
          const toBeInserted = {
            ...datum,
            companyId: company._id,
            branchId: branch._id,
            roleId: role.filter(e => e.code == datum.code)[0].id,
            password: hash
          };
          return Model.create(toBeInserted);
        })
      )
        .then(_ => {
          console.log("Admin Seeded");
        })
        .catch(err => {
          console.log("Unable to seed Admin!");
        });
    });
  }
};
