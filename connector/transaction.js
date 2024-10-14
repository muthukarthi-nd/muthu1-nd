const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    type: { type: Number, required: true },
    username: { type: String, ref: 'User', required: true }, 
    accno: { type: String,ref:'User', required: true }, 
    amount: { type: Number, required: true },
    currentbalance: { type: Number, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', transactionSchema);
