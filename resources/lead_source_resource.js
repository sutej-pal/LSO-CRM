const Resource = require('./resource');

module.exports = class ProfileResource extends Resource {

    format(resource) {
        return {
            id: resource._id || null,
            name: resource.name || null,
            code: resource.code || null,
            description: resource.description || null,
            isActive: resource.isActive || null,
            updatedBy: resource.updatedBy || null,
            createdBy: resource.createdBy || null,
            createdAt: resource.createdAt || null,
            updatedAt: resource.updatedAt || null,
        };
    }

}