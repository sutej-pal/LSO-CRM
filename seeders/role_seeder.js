/**
 * Load Models
 */
const Model = require("../models/role");

/**
 * Load Data
 */
const data = [
  {name: "Super Admin", code: 'sadmin', permissions: [
    'user.profile.get', 'user.profile.update', 'roles.list', 'roles.create', 'roles.edit', 'roles.delete', 'sales.list', 'sales.create',
    'sales.edit', 'sales.delete', 'company.list', 'company.create', 'company.edit', 'company.delete', 'branch.list', 'branch.create',
    'branch.edit', 'branch.delete', 'user.list', 'user.create', 'user.edit', 'user.delete', 'lead-type.list', 'lead-type.create',
    'lead-type.edit', 'lead-type.delete', 'lead-source.list', 'lead-source.create', 'lead-source.edit', 'lead-source.delete',
    'lead.list', 'lead.create', 'lead.import', 'lead.export', 'lead.edit', 'lead.delete'
  ]},
  {name: "Branch Admin", code: 'badmin', permissions: []},
  {name: 'Sales Manager', code: 'sm', permissions: []},
  {name: 'Sales Team Leader', code: 'stl', permissions: []},
  {name: 'Tele Caller', code: 'tc', permissions: []},
  {name: 'Design Team Leader', code: 'dtl', permissions: []},
  {name: 'Design Assistant', code: 'da', permissions: []},
  {name: 'Project Management Head', code: 'pmc', permissions: []},
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
    ).then(() => {
    }).catch(err => {
      console.log("Unable to seed Role!");
    });
  }
};
