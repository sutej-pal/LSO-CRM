const Resource = require('./resource');

module.exports = class ProfileResource extends Resource {

    format(resource) {
        return {
            id: resource._id || null,
            name: resource.name || null,
            description: resource.description || null,
            code: resource.code || null,
            isActive: resource.isActive || null,
            createdAt: resource.createdAt || null,
            updatedAt: resource.updatedAt || null,
            // __v: resource.__v,
        };
    }

}