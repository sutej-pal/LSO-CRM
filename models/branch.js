'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const branchSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
      required: true,
      type: String
    },
    companyId: {
        required: false,
        type: Schema.Types.ObjectId,
        ref: 'Branch'
    },
    address: String,
    countryId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Country'
    },
    stateId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'State'
    },
    cityId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'City'
    },
    landmark: String,
    mobile: {
        type: String,
        required: true,
        validate: {
            validator: v => /[0-9]{10}/.test(v)
        }
    },
    landline: String,
    email: String,
    GSTIN: String,
    panNo: String,
    isDeleted: {
        type: Boolean,
        required: false,
        default: false
    },
    isActive: {
        type: Boolean,
        required: false,
        default: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Branch', branchSchema);