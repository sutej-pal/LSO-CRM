const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const citySchema = new Schema({
    stateId: {
        type: Schema.Types.ObjectId,
        ref: 'State',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    nameAlt: String,
    isActive: {
        type: Boolean,
        required: false,
        default: true
    }
}, {
    timestamps: false
});

module.exports = mongoose.model('City', citySchema);