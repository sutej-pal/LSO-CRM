const Resource = require('./resource');

module.exports = class ProfileResource extends Resource {

    format(resource) {
        return {
            id: resource.id || null,
            name: resource.name || null,
            code: resource.code || null,
            description: resource.description || null,
            permissions: resource.permissions || null,
            isActive: resource.isActive || null,
            createdAt: resource.createdAt || null,
            updatedAt: resource.updatedAt || null,
        };
    }

}