const Resource = require("./resource");

module.exports = class ProfileResource extends Resource {
  format(resource) {
    return {
      id: resource._id || null,
      name: resource.name || null,
      mobile: resource.mobile || null,
      email: resource.email || null,
      company:
        "name" in resource.companyId
          ? resource.companyId.name
          : resource.companyId || null,
      role:
        "name" in resource.roleId
          ? {
              id: resource.roleId._id,
              name: resource.roleId.name,
              code: resource.roleId.code,
              permissions: resource.roleId.permissions
            }
          : resource.roleId || null,
      branch:
        "name" in resource.branchId
          ? resource.branchId.name
          : resource.branchId || null,
      createdAt: resource.createdAt || null
    };
  }
};
