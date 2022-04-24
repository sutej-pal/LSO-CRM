const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const leadSourceSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        required: true,
        type: String,
        unique: false,
    },
    description: {
        required: false,
        type: String
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
    },
    isActive: {
        type: Boolean,
        required: false,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        required: false,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('LeadSource', leadSourceSchema);