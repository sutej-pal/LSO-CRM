const MainHelper = require('../helpers/main_helper');
const StringHelper = require('../helpers/string_helper');
const ModelHelper = require('../helpers/model_helper');
const LeadHelper = require('../helpers/lead_helper');

const Helper = {
    main: MainHelper,
    str: StringHelper,
    model: ModelHelper,
    lead: LeadHelper,
};

global.helper = Helper; 

module.exports = Helper;