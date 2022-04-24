module.exports = class ModelHelper {
  static deactivateModels(models = [], condition = {}) {
    return Promise.all(
    //   models.map(model => {
    //     return model
    //       .updateMany(condition, {
    //         isActive: false
    //       })
    //       .catch(err => {
    //         // Todo: Log the error
    //       });
    //   })
    []
    );
  }

  static deleteModels(models = [], condition = {}) {
    return Promise.all(
    //   models.map(model => {
    //     return model
    //       .updateMany(condition, {
    //         isActive: false,
    //         isDeleted: true,
    //       })
    //       .catch(err => {
    //         // Todo: Log the error
    //       });
    //   })
    []
    );
  }
};
