const Resource = require('./resource');

module.exports = class ProfileResource extends Resource {

    format(resource) {
        return {
            id: resource._id || null,
            name: resource.name || null,
            code: resource.code || null,
            address: resource.address || null,
            mobile: resource.mobile || null,
            landline: resource.landline || null,
            email: resource.email || null,
            cityId: resource.cityId || null,
            stateId: resource.stateId || null,
            countryId: resource.countryId || null,
            landmark: resource.landmark || null,
            GSTIN: resource['GSTIN'] || null,
            panNo: resource.panNo || null,
            isActive: resource.isActive || null,
            createdAt: resource.createdAt || null,
            updatedAt: resource.updatedAt|| null,
        };
    }

}