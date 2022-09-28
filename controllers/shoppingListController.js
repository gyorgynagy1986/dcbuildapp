const Product = require('../models/productModel');
const List = require('../models/shoppingList');
const factory = require('../controllers/handelerFactory');
const catchAsync = require('../utils/catchAsync');


exports.setListUserIds = (req, res, next) => {
    if(!req.body.product) req.body.product = req.params.productId;
    if(!req.body.user) req.body.user = req.user.id;
    next();
}

// THIS TAKES THE PACKAGE FROM GLOBAL PRODUCT  

exports.getMyShoppingList = catchAsync (async (req, res, ) => {

    // 1) find all List
  
    const list = await List.find({user : req.user.id})
  
    // 2) Find shopping with the retun ID-s
  
    const productIDs = list.map(el => el.product);
    const products = await Product.find({ _id: { $in: productIDs } });

    res.status(200).json({
        status: 'success',
        data: products
    })
  });


  // THIS TAKES THE USER SOPPING LIST FROM THE SHOPPLING MODELS 

  exports.getMyList = catchAsync (async (req, res, next ) => {

    // 1) FIND THE USER BY ID
  
    const list = await List.find({user : req.user.id})
  
    // 2) FIND THE SHOPPING LIST CREATED BY THE USER LOGGED IN 

    const products = await List.find({ _id: {$in: list}});

    res.status(200).json({
        status: 'success',
        data: products
    })
  });


exports.createList = factory.CreateOne(List);
exports.getList = factory.getOne(List);
exports.getAllList = factory.getAll(List);
exports.updateList = factory.UpdateOne(List);
exports.deleteList = factory.DeleteOne(List);
