const Resource = require('./resource');

module.exports = class ProfileResource extends Resource {

    format(resource) {
        return {
            personId: resource.peopleId || null,
            remarks: resource.remarks || null,
        };
    }

}