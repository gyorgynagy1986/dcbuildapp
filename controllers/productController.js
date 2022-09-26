/* eslint-disable import/no-useless-path-segments */
/* eslint-disable prettier/prettier */
const sharp = require('sharp');
const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handelerFactory');



exports.getAllProducts = factory.getAll(Product);
exports.getProduct = factory.getOne(Product);
exports.creatProduct = factory.CreateOne(Product);
exports.deleteProduct = factory.DeleteOne(Product);
exports.updateProduct = factory.UpdateOne(Product);








