/* eslint-disable prettier/prettier */
const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const listRouter = require('./../routes/shoppingListRouter');


// POINT TO {{URL}}api/v1/products/ 

const router = express.Router();

router.route('/publickProduct').get(productController.publickProduct);

router.use('/:productId', listRouter);

router
  .route('/')
  .get(authController.protect, authController.restrictTo('admin'), productController.getAllProducts)
  .post(productController.creatProduct);

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(
          authController.protect, 
          authController.restrictTo('admin'),
          productController.updateProduct,
          )
  .delete(
          authController.protect, //check whether the user is looged in and the token is valid 
          authController.restrictTo('admin'), // // check whether the user have permission to the the removal
          productController.deleteProduct); // Doing the removal process 

module.exports = router;

