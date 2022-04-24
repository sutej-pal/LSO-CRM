const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passwordResetSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    isConsumed: {
        type: Boolean,
        required: false,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('PasswordReset', passwordResetSchema);