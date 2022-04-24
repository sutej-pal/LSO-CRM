'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const countrySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: false,
        default: true
    },
    states: [{
        type: Schema.Types.ObjectId,
        ref: 'State'
    }]
}, {
    timestamps: false,
    toObject: {
        transform: (obj, ret) => {
            delete ret.__v;
            ret.id = ret._id;
            delete ret._id;
            return ret;
        }
    }
});

module.exports = mongoose.model('Country', countrySchema);