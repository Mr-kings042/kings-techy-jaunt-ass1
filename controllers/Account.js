const asynchandler = require('express-async-handler');
const mongoose = require('mongoose');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');


const getAccounts = asynchandler(async (req,res) =>{
    try {
        const accounts  = await Account.find();
        res.status(200).json(accounts);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: "Error Fetching BankAccounts"
        });
    }
});

const createAccount = asynchandler (async (req,res) =>{
    const { accountNumber, firstName, lastName } = req.body;
    if(!accountNumber || !firstName || !lastName){
      return res.status(400).json({ 
        error: 'AccountNumber, FirstName and LastName required'});
    }
    // check if there is an existing account with same number and name
    try {
      const existingAccount = await Account.find({ 
        accountNumber,  firstName, lastName});
  
      if (existingAccount) {
        return res.status(400).json({ 
          error: 'AccountNumber and Name already exists' });
      }
     
    } catch (err) {
      console.error(err);
      res.status(500).json({ 
        error: 'Error creating account' });
    }
  
    const newAccount = new Account({ accountNumber, firstName, lastName });
    await newAccount.save();
  
    res.status(201).json(newAccount);
});

const getAccount = asynchandler(async (req,res) =>{
   const accountId = req.params.id;
    await Account.findById(accountId)
    .then((account) => {
       if (!account) {
         return res.status(404).json({
            error: 'Account not found' 
           });
       }
     })
      .catch ((error) => {
       res.status(400).json({ 
         error: 'Error fetching account' 
       });
     });
     res.status(200).json(account);
});

const updateAccount = asynchandler(async (req,res) =>{
    const accountId = req.params.id;
    const {firstName,lastName,dailyWithdrawalLimit} = req.body;
  
 
    const account = await Account.findByIdAndUpdate(accountId,
        {firstName,lastName,dailyWithdrawalLimit},
         { new: true }); // Return updated account
    if (!account) {
      return res.status(404).json({
        error: 'account not found'
      });
    }
  
    const user = await User.findById(req.userId);
    if (!user.accounts.includes(accountId)) {
      return  res.status(403).json({
        error:'Unauthorized to access this account'
    });
}
    res.status(200).json(account);
});

const deleteAccount = asynchandler(async (req, res) =>{
    const accountId = req.params.id;
               
const account = await Account.findById(accountId)
.then((account) => {
    if (!account) {
        return res.status(404).json({
            error: "Account not Found"
        });
    }
})
.catch((error) => {
    res.status(400).json({
        error: 'Error deleting account'
    })
});
await Account.findByIdAndDelete(accountId)
.catch((error) => {
    res.status(400).json({
        error: 'Error deleting account'
    })
});



res.status(200).json({ 
    message: 'Account deleted successfully' });
});
const getAccountTransactions = asynchandler(async(req, res) =>{
    const accountId = req.params.id;
  const account = await Account.findById(accountId);
  if (!account) {
    return res.status(404).json({
        error: 'Account not found'});
  }

  const transactions = await Transaction.find({ _id: { $in: account.transactions } });
  res.status(200).json(transactions);
});
const getAccountBalance = asynchandler (async (req,res) =>{
    const accountId = req.params.id;
    await Account.findById(accountId)
    .then((account) => {
       if (!account) {
         return res.status(404).json({
            error: 'Account not found' 
           });
       }
     })
      .catch ((error) => {
       res.status(400).json({ 
         error: 'Error fetching account' 
       });
     });
     res.status(200).json({
         balance: account.balance });
})

const getAccountwithdrawals = asynchandler(async (req,res) =>{
    const accountId = req.params.id;
    const amount = req.body.amount;
  
    if (!amount || typeof amount !== 'number') {
      return res.status(400).json({
        error: 'Invalid withdrawal amount'});
    }
  
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({
        error:'Account not found'});
    }
  
    
  
    try {
      const transaction = await account.withdraw(amount);
      
      res.status(200).json(transaction); // Return the created transaction object
    } 
    catch (error) {
      return res.status(400).json({
        error: message
    }); // Handle withdrawal errors (insufficient funds, daily limit exceeded)
    }
});
const getAccountDeposit = asynchandler(async (req,res) =>{
    const accountId = req.params.id;
    const amount = req.body.amount;
  
    if (!amount || typeof amount !== 'number' && amount <= 0) {
      return res.status(400).json({
        error: 'Invalid deposit amount'});
    }
  
    const account = await Account.findById(accountId);
    if (!account) {
        return res.status(400).json({
            error: 'Account not found'});
        }
    
  
  
    try {
      const transaction = await account.deposit(amount);
      res.status(200).json(transaction); // Return the created transaction object
    } catch (error) {
      return res.status(400).json({
        error: message}); // Handle potential errors (e.g., negative deposit amount)
    }
});

module.exports = {
    getAccounts,
    createAccount,
    getAccount,
    updateAccount,
    deleteAccount,
    getAccountTransactions,
    getAccountBalance,
    getAccountDeposit,
    getAccountwithdrawals
};