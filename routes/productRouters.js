/* eslint-disable prettier/prettier */
const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
          authController.protect,
          authController.restrictTo('admin', 'lead-guide'),
          productController.creatProduct
      );

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(
          authController.protect, 
          authController.restrictTo('admin', 'lead-guide'),
          productController.updateProduct,
          )
  .delete(
          authController.protect, //check whether the user is looged in and the token is valid 
          authController.restrictTo('admin', 'lead-guide'), // // check whether the user have permission to the the removal
          productController.deleteProduct); // Doing the removal process 

module.exports = router;

