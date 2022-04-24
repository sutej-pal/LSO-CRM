const CountrySeeder = require('./country_seeder');
const RoleSeeder = require('./role_seeder');
const SalesModelSeeder = require('./sales_model_seeder');
const CompanySeeder = require('./company_seeder');
const AdminSeeder = require('./admin_seeder');
const LeadTypeSeeder = require('./lead_type_seeder');
const LeadSourceSeeder = require('./lead_source_seeder');
const Lead = require('../models/lead');

module.exports = class Seeder {
    /**
     *  Drop all databases
     */
    static drop() {
        return Promise.all([
            CountrySeeder.drop(),
            RoleSeeder.drop(),
            SalesModelSeeder.drop(),
            CompanySeeder.drop(),
            AdminSeeder.drop(),
            LeadTypeSeeder.drop(),
            LeadSourceSeeder.drop(),
            Lead.deleteMany()
        ]);
    }

    /**
     * Seed all the tables
     */
    static seed() {
        // Sequential Seeder
        return CountrySeeder.seed().then(() => {
            return RoleSeeder.seed();
        }).then(() => {
            return SalesModelSeeder.seed();
        }).then(() => {
            return CompanySeeder.seed();
        }).then(() => {
            return AdminSeeder.seed();
        }).then(() => {
            return LeadTypeSeeder.seed();
        }).then(() => {
            return LeadSourceSeeder.seed();
        }).then(() => {
            console.info('Seeding complete!');
        });
    }
}