const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const meetingSchema = new Schema({
    leadId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Lead'
    },
    personId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    remarks: {
        type: String,
        required: false
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
    timestamps: true,
});

module.exports = mongoose.model('meeting', meetingSchema);