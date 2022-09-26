/* eslint-disable prettier/prettier */
const mongoose = require('mongoose'); //DRIVER HELPS FOR CONNECTING TO THE DATBASE //INSTALL= npm i mongoose@5 (version 5.)
// const User = require('./userModel');
const { default: slugify } = require('slugify');
// const validator = require('validator');
const User = require('./userModel');

 const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A product must have a name' ],
        unique: true,
        trim: true,
        maxlength: [40, 'product name has to be less or equal than 40 characters'],
        minlength: [5, 'product name has to be more or equal than 10 characters'],
       // validate: [validator.isAlpha, 'The name must only contain caracters']
    },

    slug : String,

    price: {
        type: Number,
        required:[true, 'A product must have a price' ],
        default:1000
    },

    priceDiscount: {
        type: Number,
        validate: {
            validator: function(val) {
                return val < this.price; // 10
              },
              message: 'Discount price ({VALUE}) should be below regular price'
            }
         
    },
        
    description: {
        type: String,
        trim: true,
        default: 'This a prduct without any description'
    },

    imageCover: {
        type: String,
        default: 'tour-7-1.jpg',
       // required:[false, 'A tour must have an image']
    },

    
    createAt: {
        type: Date,
        default: Date.now(),
        select:false // In this case the creation date will be not visible
    },

    },
    
    {   
        toJSON: { virtuals: true},
        toObject: { virtuals: true}
    }
); 

productSchema.index({price: 1, ratingsAverage: -1 });
productSchema.index({slug: 1}); 



// DOCUMNET MEDDELWARE : runs beforete .save() command and  .create() command.
productSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true});
    next();
});



const Product = mongoose.model('Product', productSchema);

module.exports = Product;



