const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const stateSchema = new Schema({
    countryId: {
        type: Schema.Types.ObjectId,
        ref: 'Country',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    cities: [{
        type: Schema.Types.ObjectId,
        ref: 'City'
    }],
    nameAlt: String,
    isActive: {
        type: Boolean,
        required: false,
        default: true,

    }
}, {
    timestamps: false
});

module.exports = mongoose.model('State', stateSchema);