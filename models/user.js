var mongoose = require('mongoose')

var userSchema =new mongoose.Schema({
    username:String,
    accno:Number,
    currentbalance: { type: Number, required: true },
    date:{ type: Date, default: Date.now }
})
module.exports =mongoose.model('user',userSchema);
