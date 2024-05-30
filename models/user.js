const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    username: 
    { type: String, 
        required: true,
         unique: true
        },
        email:{
            type: String,
            required: true,
            unique: true,
            min: 6,
            max: 255
        },
    password:
     { type: String,
         required: true,
         select: false,
         min: 5,
         max: 1024
        },
    accounts: [{
         type: mongoose.Schema.Types.ObjectId, 
        ref: 'Account' }]
  },
  {
    timestamps: true
}
);

  module.exports = mongoose.model('User', UserSchema);