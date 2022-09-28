/* eslint-disable prettier/prettier */
const express = require('express');
const shoppingController = require('./../controllers/shoppingListController');
const productController = require('./../controllers/productController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

// THE LOGGED IN USER GET HIS/HER SHOPPING LIST
router.route('/myShoppingList').get(shoppingController.getMyList);

// GET ALL SHOPPING LIST. This is not an imporatant function, only for testing purpose (USER PERMISSION IS ONLY TEMPORARLY)
router.route('/getAllList').get(authController.restrictTo('admin', 'user'), shoppingController.getAllList, productController.publickProduct);

// DELETE THE USER ENTIRE SHOPPING LIST
router.route('/deleteAllShoppingList').delete(authController.restrictTo('admin', 'user'), shoppingController.deleteAllShoppingList);


// DELETE ONLY ONE PRODUCT FROM THE SHOPPING LIST
router.route('/removeOneShpList/:id').delete(
          authController.protect, //check whether the user is looged in and the token is valid 
          authController.restrictTo('user', 'admin'), // // check whether the user have permission to the the removal
          shoppingController.deleteList); // Doing the removal process 

          
router.route('/')
      .get(shoppingController.getAllList)
      .post(
            authController.restrictTo('admin', 'user'),
            shoppingController.setListUserIds,
            shoppingController.createList
        );

module.exports = router;