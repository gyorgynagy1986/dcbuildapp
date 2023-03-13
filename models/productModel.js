/* eslint-disable prettier/prettier */
const mongoose = require('mongoose'); 
const { default: slugify } = require('slugify');
    //const validator = require('validator');

 const productSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: false,
      // required: [true, 'A product must have a name' ],
       //trim: true,
        maxlength: [40, 'product name has to be less or equal than 40 characters'],
        minlength: [3, 'product name has to be more or equal than 3 characters'],
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

    amountOfDiscount: {
        type: Number,
    }, 
    
    brand: {
        type:Array,
    },

    type: {
        type:String,
        default:'default'
    },
    
    category: {
        type:Array,
    },
    
    description: {
        type: String,
        trim: true,
        default: 'This is a product without any description'
    },

    shop: {
        type: String,
        trim: true,
        default: 'abc'
    },


    imageCover: {
        type: String,
        default: 'default.jpg',
    },

    visibility: {
        type: Boolean,
        default: true
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

 productSchema.index({priceDiscount: 1 });
 productSchema.index({slug: 1}); 


// Product visibility 

productSchema.pre(/^find/, function(next) { ///^find/ = all the strings that starts as find
   // tourSchema.pre('find', function(next) {
   this.find({visibility: {$ne: false}})
       next();
   });


// Calculate the DISCOUNTED PRICE

productSchema.virtual('discountedPrice').get(function() {
    return this.price - this.price * (this.amountOfDiscount / 100);
});
        

// DOCUMNET MEDDELWARE : runs beforete .save() command and  .create() command.
    productSchema.pre('save', function(next) {
        this.slug = slugify(this.name, { lower: true});
        next();
    });


const Product = mongoose.model('Product', productSchema);
module.exports = Product;



