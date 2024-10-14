
const User = require('../connector/user');
const Transaction = require('../connector/transaction');

const TRANSACTION_TYPES = {
    DEPOSIT: 1,
    WITHDRAWAL: 0
};

exports.controller = async (req, res) => {
    try {
        const { type, username, accno, amount } = req.body;

        if (type === undefined || !username || !accno || amount === undefined) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number.' });
        }

        const date = new Date();
        
        let user = await User.findOne({ accno, username });
        if (!user) {
            return res.status(400).json({ message: 'New users are not allowed to withdraw or deposit.' });
        }

        if (type === TRANSACTION_TYPES.DEPOSIT) {
            user.currentbalance += amount; 
            user.type = type; 
        } 
       
        else if (type === TRANSACTION_TYPES.WITHDRAWAL) {
            if (user.currentbalance < amount) {
                return res.status(400).json({ message: 'Insufficient balance.' });
            }
            user.currentbalance -= amount;
            user.type = type; 
        } else {
            return res.status(400).json({ message: 'Invalid transaction type.' });
        }

        user.date = date; 
        await user.save();

        const transaction = new Transaction({
            accno: user.accno,
            username: user.username,
            type,
            amount ,
            currentbalance: user.currentbalance,
            dateTime: date,
        });
        await transaction.save(); 


        res.status(200).json({ 
            message: type === TRANSACTION_TYPES.DEPOSIT ? 'Deposit successful!' : 'Withdrawal successful!', 
            amount, 
            user
          
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};
