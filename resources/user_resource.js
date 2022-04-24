const Resource = require('./resource');

module.exports = class ProfileResource extends Resource {

    format(resource) {
        return {
            id: resource._id || null,
            name: resource.name || null,
            mobile: resource.mobile || null,
            email: resource.email || null,
            companyId: resource.companyId || null,
            branchId: resource.branchId || null,
            supervisorId: resource.supervisorId || null,
            isActive: resource.isActive || null,
            roleId: resource.roleId || null,
            createdAt: resource.createdAt || null,
            updatedAt: resource.updatedAt || null,
        };
    }

}