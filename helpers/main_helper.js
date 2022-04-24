const path = require("path");

const ApiToken = require("../models/api_token");

const Storage = require("fs");

const ResponseHelper = require('./response_helper');

class MainHelper extends ResponseHelper {
  static deleteUserToken(user, all = false) {
    return new Promise((resolve, reject) => {
      ApiToken.deleteMany({
        email: user.email
      })
        .then(response => {
          resolve();
        })
        .catch(err => {
          reject();
        });
    });
  }

  /**
   *
   * @param {String} name
   *
   * Add timestamp to file name
   */
  static stampedName(name) {
    return (
      name
        .substr(0, name.lastIndexOf("."))
        .split(" ")
        .join("_") +
      "_" +
      Date.now() +
      path.extname(name)
    );
  }

  static deleteFile(file) {
    return new Promise((resolve, reject) => {
      Storage.unlink(file, err => {
        if (err) {
          reject(err);
        } else {
          resolve("File deleted!");
        }
      });
    })
      .then(response => {})
      .catch(err => {
        console.error(err);
      });
  }

  static withSingature(req, body, withCreatedBy = true, removeEmpty = false) {
    let object = Object.assign({}, body);
    if(removeEmpty) {
      for(const prop in object) {
        if(object.hasOwnProperty(prop)) {
          if(object[prop] !== false && !object[prop]) {
            object[prop] = null;
          }
        }
      }
    }
    object.updatedBy = req.user._id || null;
    if (withCreatedBy) {
      object.createdBy = object.updatedBy;
    }
    return object;
  }

  static mongoIdValidationRule() {
    return "regex:/^[0-9a-fA-F]{24}$/";
  }

  static isValidMongoId(id = "") {
    return id.match(/^[0-9a-fA-F]{24}$/);
  }

  static getPropertiesWithPrefix(obj = {}, prefix) {
    let properties = {};
    for (const property in obj) {
      if (
        obj.hasOwnProperty(property) &&
        property.toString().startsWith(prefix)
      ) {
        properties[property.toString()] = obj[property];
      }
    }
    return properties;
  }

  static getArrayFromObject(obj) {
    const array = [];
    for (const property in obj) {
      if (obj.hasOwnProperty(property)) {
        array.push(obj[property]);
      }
      return array;
    }
  }

  static getRouteName(req) {
    try {
      return req.method + "|" + req.route.path;
    } catch(e) {
      return null;
    }
  }
}

MainHelper.publicPath = path.join(__dirname, "../public/");
MainHelper.uploadDir = {
  image: "uploads/images/",
  file: "uploads/files/"
};

module.exports = MainHelper;
