const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const leadTypeSchema = new Schema({
    name: {
        required: true,
        type: String
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
        default: true
    },
    isDeleted: {
        type: Boolean,
        required: false,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('LeadType', leadTypeSchema);