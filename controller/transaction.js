const Transaction = require('../connector/transaction');
const User = require('../connector/user');
const { query, validationResult } = require('express-validator');

// Assuming TRANSACTION_TYPES is defined somewhere
const TRANSACTION_TYPES = {
    DEPOSIT: 'deposit',
    WITHDRAWAL: 'withdrawal',
};

exports.getUser = [
    query('accno').optional().isNumeric().withMessage('Account number must be numeric.'),
    query('username').optional().isString().withMessage('Username must be a string.'),
    
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { accno, username } = req.query;
            let user;

            if (accno) {
                user = await User.findOne({ accno });
                if (!user) {
                    return res.status(404).json({ message: 'User not found.' });
                }

                const userTransactions = await Transaction.find({ accno });
                
                return res.status(200).json({
                    success: true,
                    data: {
                        user,
                        transactions: userTransactions.map(transaction => ({
                            // message: transaction.type === TRANSACTION_TYPES.DEPOSIT ? 'Deposit successful!' : 'Withdrawal successful!', 
                            dateTime: transaction.dateTime,
                            type: transaction.type,
                            amount: transaction.amount,
                            currentbalance: transaction.currentbalance,
                        })),
                    }
                });
            }

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

            return res.status(400).json({ message: 'Please provide either an account number or a username.' });
        } catch (error) {
            console.error('Error retrieving user data:', error);
            res.status(500).json({ message: 'Internal server error.' });
        }
    }
];
