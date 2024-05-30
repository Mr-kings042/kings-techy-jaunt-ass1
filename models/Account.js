const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Transaction = require('../models/Transaction');
// Define BankAccount schema
const AccountSchema = new mongoose.Schema(
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
        default: 0
       },
        
        dailyWithdrawalLimit: { 
          type: Number,
          required: true, 
          default: 1000 
        },
      
        withdrawnToday: {
           type: Number,
            default: 0 
          },
    transactions: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Transaction' }]
  });
  AccountSchema.methods.withdraw = async function (amount) {
    if (amount > this.balance) {
      throw new Error('Insufficient funds');
    }
    if (this.withdrawnToday + amount > this.dailyWithdrawalLimit) {
      throw new Error('Daily withdrawal limit exceeded');
    }
    this.balance -= amount;
    this.withdrawnToday = (this.withdrawnToday || 0) + amount;
    const transaction = new Transaction({ type: 'withdrawal', amount, accountId: this._id });
    this.transactions.push(transaction);
    await this.save(); // Save updated account and transaction
    await transaction.save(); // Explicitly save the transaction
    return transaction; // Return the created transaction object
  };
  
  AccountSchema.methods.deposit = async function (amount) {
    this.balance += amount;
    const transaction = new Transaction({ type: 'deposit', amount, accountId: this._id });
    this.transactions.push(transaction);
    await this.save(); // Save updated account and transaction
    await transaction.save(); // Explicitly save the transaction
    return transaction; // Return the created transaction object
  };
  
  module.exports = mongoose.model('Account',AccountSchema)