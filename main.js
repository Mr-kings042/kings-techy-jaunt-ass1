// install express
const express = require ('express');
// install mongoose
const mongoose = require('mongoose');
// install middleware
const bodyParser = require('body-parser');
// assign port and create express app
const app = express();
const port = 5000;
// import models
const { BankAccount, Transaction } = require('./models');
// create middleware app
app.use(bodyParser.json());
// mongoDB url
const dBUrl = 'mongodb://localhost:27017/';



// Connect to MongoDB
mongoose.connect(dBUrl)
.then(() =>{
 console.log('Connected to MongoDB.....')})
.catch((err) =>  {
  console.error('Error connecting to MongoDB:', err)});

// FETCHING ALL ACCOUNTS
  app.get('/BankAccount/', async (req, res) => {
    try {
        const accounts  = await BankAccount.find();
        res.status(200).json(accounts);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: "Error Fetching Accounts"
        });
    }
});

// CREATING ACCOUNT
app.post('/BankAccount/', async (req, res) => {
  const { accountNumber, firstName, lastName } = req.body;
  try {
    const existingAccount = await BankAccount.find({ 
      accountNumber });

    if (existingAccount) {
      return res.status(400).json({ 
        error: 'AccountNumber already exists' });
    }
   
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      error: 'Error creating account' });
  }

  if (!accountNumber) {
      return res.status(400).send({
          error: "AccountNumber is required"
      });
  }

  if (!firstName) {
      return res.status(400).send({
          error: "firstName is required"
      });
  }
  if (!lastName) {
      return res.status(400).send({
          error: "lastName is required"
      });
  }
  const newAccount = new BankAccount({ accountNumber, firstName, lastName });
  await newAccount.save();

  res.status(201).json(newAccount);
});

// FETCHING SINGLE ACCOUNTS
app.get('/BankAccount/:id/', async (req, res) => {
  accountId = req.params.id;
 await BankAccount.findById(accountId)
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
 
// DELETING ACCOUNT
app.delete('/BankAccount/:id', async (req, res) => {
  accountId = req.params.id;
  
    await BankAccount.findById(accountId)
    .then((account) => {
      if (!account) {
        return res.status(404).json({ 
          error: 'Account not found' 
        });
      }
    })
    .catch ((error) => {
      res.status(400).json({
        error: 'Error deleting account'
      })
    });

    await BankAccount.findByIdAndDelete(accountId)
    .catch((error) => {
      res.status(400).json({
        error: 'Error deleting account'
      })
    })
    res.status.apply(200).json({
       message: 'Account deleted successfully' });
});

// UPDATE ACCOUNT
app.put('/BankAccount/:id', async (req, res) => {
  const { accountNumber, firstName, lastName, balance } = req.body;
  accountId = req.params.id;
  let updatedAccount = await BankAccount.findByIdAndUpdate(
    accountId,
  {accountNumber,firstName,lastName,balance},
     {new: true}
    ).catch((error) => {
      res.status(400).json({
        error: 'Error updating account'
      })
    });
    res.status(200).json({
      message: 'Account updated successfully',
      updatedAccount
    });
});

// FETCH ALL TRANSACTION FOR AN ACCOUNT
app.get('/Transactions/:id/transactions', async (req, res) => {
  
  const accountId = req.params.id;
  try {
    const transactions = await Transaction.find({ account: accountId });
    const account = await BankAccount.findById(accountId);
    if (!account) {
      return res.status(404).json({
        error:'Account not found' 
      });
    }
    res.status(200).json(transactions);
  } catch (error) {
   
    res.status(400).json({ 
      error: 'Error fetching transactions'
     });
  }
});

// WITHDRAWAL LIMIT
app.put('/Transactions/:id/withdraw', async (req, res) => {
  const accountId = req.params.id;
  const { amount } = req.body;

  try {
    const account = await BankAccount.findById(accountId);
    
    const today = new Date().toISOString().slice(0, 10); // Get today's date
    const todaysTransactions = await Transaction.find({ account: id, timestamp: { date: today } });
    const withdrawnToday = todaysTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    if (!account) {
      return res.status(404).json({ 
        message: 'Account not found' 
      });
    }


    if (amount <= 0) {
     return "Withdrawal amount must be positive.";
    }
    if (amount > dailyWithdrawalLimit - withdrawnToday) {
      return `Withdrawal exceeds daily limit of ${dailyWithdrawalLimit}`;
    }
    if (amount > account.balance) {
      return "Insufficient funds.";
    }

    await account.withdraw(amount); // Call the BankAccount class method
    res.status(200).json({ 
      message: 'Withdrawal successful' 
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
       error: 'withdrawal failed'
     }); 
    }
    });

// DEPOSIT
app.put('/Transactions/:id/deposit', async (req, res) => {
  const accountId = req.params.id;
  const { amount } = req.body;

  try {
    const account = await BankAccount.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    account.deposit(amount); // Call the BankAccount class method
    await account.save(); // Save the updated account document

    res.status(200).json({ 
      message: 'Deposit successful' 
    });
  } catch (error) {
    
    // Handle specific errors (e.g., negative deposit amount)
   if (amount <= 0) {
      return res.status(400).json({ 
        error: "Deposit amount must be positive." 
      });
    
    }
    else {
      return res.status(500).json({ 
        error: 'Error depositing funds' 
      });
    }
    
  }
});
  
//testing server port
app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
  });