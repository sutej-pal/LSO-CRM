const Resource = require('./resource');

module.exports = class UserMinimialResource extends Resource {

    format(resource) {
        return {
            id: resource._id || null,
            name: resource.name || null,
            mobile: resource.mobile || null,
            email: resource.email || null,
            companyId: resource.companyId || null,
            branchId: resource.branchId || null,
            isActive: resource.isActive || null,
            createdAt: resource.createdAt || null,
            updatedAt: resource.updatedAt || null,
        };
    }

}