const mongoose = require('mongoose');

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
  
  const BankAccount = mongoose.model('BankAccount', bankAccountSchema);
  
  // Define Transaction schema
  
  const transactionSchema = new mongoose.Schema({

    type: { 
        type: String, 
        required: true 
    },

    amount: { 
        type: Number,
         required: true
         }
        },

   { 
    timestamp: true
  }
  );
  
  const Transaction = mongoose.model('Transaction', transactionSchema);
  
  module.exports = { BankAccount, Transaction};