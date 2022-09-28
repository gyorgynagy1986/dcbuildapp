/* eslint-disable prettier/prettier */
const express = require('express');
const shoppingController = require('./../controllers/shoppingListController');
const productController = require('./../controllers/productController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.route('/getMyshippingList').get(shoppingController.getMyList);

router.route('/getAllList').get(shoppingController.getAllList, productController.publickProduct);

router.route('/')
      .get(shoppingController.getAllList)
      .post(
            authController.restrictTo('user', 'admin'),
            shoppingController.setListUserIds,
            shoppingController.createList
        );

module.exports = router;