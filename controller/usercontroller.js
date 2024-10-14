const Transaction = require('../connector/transaction');
const User = require('../connector/user');
const { validationResult } = require('express-validator');

exports.getUser = async (req, res) => {
  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { accno, username } = req.query;

        if (!accno && !username) {
            return res.status(400).json({ message: 'Please provide either an account number or a username.' });
        }

        let user;

        if (accno) {
            user = await User.findOne({ accno });
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            const userTransactions = await Transaction.find({ user_id: user._id });
            return res.status(200).json({
                success: true,
                data: {
                    user,
                    transactions: userTransactions.map(transaction => ({
                        dateTime: transaction.dateTime,
                        type: transaction.type,
                        amount: transaction.amount,
                        currentbalance: transaction.currentbalance,
                    })),
                }
            });
        }

        // Find user by username
        if (username) {
            user = await User.findOne({ username });
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            return res.status(200).json({
                success: true,
                data: {
                    username: user.username,
                    accno: user.accno,
                    currentbalance: user.currentbalance,
                }
            });
        }
    } catch (error) {
        console.error('Error retrieving user data:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};
