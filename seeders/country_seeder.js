/**
 * Load Models
 */
const City = require("../models/city");
const State = require("../models/state");
const Country = require("../models/country");

/**
 * Load Data
 */
const countries = require("../data/country.json");

module.exports = class CountrySeeder {
  static drop() {
    // delete all previous data
    return Promise.all([City.deleteMany({}), State.deleteMany({}), Country.deleteMany({})]);
  }
  static seed() {
    // create country
    return Promise.all(
      countries.map(countryData => {
        return Country.create({
          name: countryData.name
        })
          .then(country => {
            const countryId = country.id;
            const states = [];
            return Promise.all(
              countryData.states.map(stateData => {
                return State.create({
                  name: stateData.name,
                  countryId: countryId
                })
                  .then(createdState => {
                    const stateId = createdState._id;
                    states.push(stateId);
                    const cities = [];
                    return Promise.all(
                      stateData.cities.map(cityData => {
                        return City.create({
                          name: cityData,
                          stateId: stateId
                        }).then(city => {
                          cities.push(city._id);
                        });
                      })
                    ).then(_ => {
                      // add cities to state
                      createdState.cities = cities;
                      createdState.save();
                    });
                  })
              })
            ).then(_ => {
              // add states to country;
              country.states = states;
              country.save();
            });
          })
          .catch(err => {
            console.log("Unable to seed Country!");
          });
      })
    );
  }
};
