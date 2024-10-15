// const User = require('../models/user');
// const Transaction = require('../models/transaction');

// const TRANSACTION_TYPES = {
//     DEPOSIT: 1,
//     WITHDRAWAL: 0
// };

// exports.controller = async (req, res) => {
//     try {
//         const { type, accno, amount } = req.body;

    
//         if (type === undefined || !accno || amount === undefined) {
//             return res.status(400).json({ message: 'All fields are required.' });
//         }

    
//         if (typeof amount !== 'number' || amount <= 0) {
//             return res.status(400).json({ message: 'Amount must be a positive number.' });
//         }

//         const date = new Date();

        
//         let user = await User.findOne({ accno });
//         if (!user) {
//             return res.status(400).json({ message: 'New users are not allowed to withdraw or deposit.' });
//         }

      
//         if (type === TRANSACTION_TYPES.DEPOSIT) {
//             user.currentbalance += amount; 
//         } 
     
//         else if (type === TRANSACTION_TYPES.WITHDRAWAL) {
//             if (user.currentbalance < amount) {
//                 return res.status(400).json({ message: 'Insufficient balance.' });
//             }
//             user.currentbalance -= amount;
//         } else {
//             return res.status(400).json({ message: 'Invalid transaction type.' });
//         }

   
//         user.date = date; 
//         await user.save();

       
//         const transaction = new Transaction({
//             user_id: user._id, 
//             type,
//             amount,
//             currentbalance: user.currentbalance,
//             dateTime: date,
//         });
//         await transaction.save(); 

      
//         res.status(200).json({ 
//             message: type === TRANSACTION_TYPES.DEPOSIT ? 'Deposit successful!' : 'Withdrawal successful!', 
//             amount, 
//             user 
//         });
//     } catch (error) {
//         console.error('Transaction error:', error);
//         res.status(500).json({ message: 'Internal server error.', error: error.message });
//     }
// };



const { getUserByAccountNumber, saveTransaction } = require('../connectors/transactionConnector');

const TRANSACTION_TYPES = {
    DEPOSIT: 1,
    WITHDRAWAL: 0
};

exports.controller = async (req, res) => {
    try {
        const { type, accno, amount } = req.body;

        if (type === undefined || !accno || amount === undefined) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number.' });
        }

        const date = new Date();
        let user = await getUserByAccountNumber(accno);
        
        if (!user) {
            return res.status(400).json({ message: 'New users are not allowed to withdraw or deposit.' });
        }

        if (type === TRANSACTION_TYPES.DEPOSIT) {
            user.currentbalance += amount;
        } else if (type === TRANSACTION_TYPES.WITHDRAWAL) {
            if (user.currentbalance < amount) {
                return res.status(400).json({ message: 'Insufficient balance.' });
            }
            user.currentbalance -= amount;
        } else {
            return res.status(400).json({ message: 'Invalid transaction type.' });
        }

        user.date = date; 
        await user.save();

        const transactionData = {
            user_id: user._id,
            type,
            amount,
            currentbalance: user.currentbalance,
            dateTime: date,
        };
        await saveTransaction(transactionData);

        res.status(200).json({ 
            message: type === TRANSACTION_TYPES.DEPOSIT ? 'Deposit successful!' : 'Withdrawal successful!', 
            amount, 
            user 
        });
    } catch (error) {
        console.error('Transaction error:', error);
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};
