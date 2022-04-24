const model = require('mongoose');

const Schema = model.Schema;

const salesModelSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        required: true,
        type: String,
        // unique: true,
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

module.exports = model.model('SalesModel', salesModelSchema);