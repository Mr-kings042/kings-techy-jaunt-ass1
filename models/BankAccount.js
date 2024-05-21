const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define BankAccount schema
const bankAccountSchema = new mongoose.Schema(
    {
      accountNumber: { 
        type: String,
         required: true,
          unique: true
         },

       firstName: {
         type: String, 
         required: true
         },

      lastName: {
         type: String,
          required: true
         },

      balance: { 
        type: Number, 
        required: true, 
        default: 0 },

    transactions: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Transaction' }]
  });
  
  module.exports = mongoose.model('BankAccount',bankAccountSchema)