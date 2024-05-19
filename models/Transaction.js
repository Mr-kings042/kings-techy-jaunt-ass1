const mongoose = require('mongoose');

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
  
  
  
  module.exports = mongoose.model('Transaction',transactionSchema )