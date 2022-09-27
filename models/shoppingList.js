const mongoose = require('mongoose');

const shoppingListSchema = new mongoose.Schema({
   
    user: {
        type: mongoose.Schema.ObjectId,
        ref:'User',
        require: [true, 'required']
    },

    product: {
        type: mongoose.Schema.ObjectId,
        ref:'Product',
        required: [true, 'required'],
    },

    createAt: {
        type: Date,
        default: Date.now()
    },
    
  
});

shoppingListSchema.pre(/^find/, function(next) {
    this.populate({path:'user', select:'name'});
    next();
});

const List = mongoose.model('List', shoppingListSchema);

module.exports = List;
