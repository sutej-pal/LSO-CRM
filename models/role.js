const Model = require("mongoose");

const Schema = Model.Schema;

const roleSchema = new Schema(
  {
    name: {
      required: true,
      type: String
    },
    code: {
      required: true,
      type: String
    },
    description: {
      required: false,
      type: String
    },
    permissions: [{
      type: String
    }],
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
      required: false,
      default: false,
      type: Boolean
    }
  },
  {
    timestamps: true,
    toObject: {
      transform: (obj, ret) => {
        delete ret.__v;
        delete ret.isDeleted;
        ret.id = ret._id;
        delete ret._id;
        return ret;
      }
    }
  },
);

module.exports = Model.model('Role', roleSchema);
