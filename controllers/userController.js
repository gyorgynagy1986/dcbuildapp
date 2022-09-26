/* eslint-disable prettier/prettier */
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('../controllers/handelerFactory');




// FILTER FUNCTION TO UPDATE ONLY THE NAT SENZITIVE DATA 

const filterObj = (obj, ...allowedFields) => {
   
    const newObj = {};
    Object.keys(obj).forEach( el => {
            if(allowedFields.includes(el)) newObj [el] = obj [el];
        });

        return newObj;
}

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined! Please sign up instead'
    })
}

// Only for administratiors // DO NOT UPDATE PASSWORD WITH THIS
exports.updateUser = factory.UpdateOne(User)
exports.deleteUser = factory.DeleteOne(User);
exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);

// UPDATE THE USER DATA (ONLY EMAIL ADDRESS AND NAME)

exports.updateMe = catchAsync(async (req, res, next) => {

    // 1) error if the user trys to update the pass
    if(req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'This rout is NOT for password update. Please use /Updatemypassword',
                 400
                )
            );
    }

    // Filtered out unwanted fileds name that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');
    if (req.file) filteredBody.photo = req.file.filename;
    // 3) Update the user document 
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new:true,
        runValidators: true
    });

    res.status(200).json({
        status:'success',   
        data: {
            user: updatedUser
        }    
    });
});

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}

exports.deleteMe = catchAsync(async (req, res, next) => {

    await User.findByIdAndUpdate(req.user.id, { active: false})
    // 204 for deleted! 
    res.status(204).json({
        status:'success,',
        data: null   
         
    });
});


exports.getOnebyEmail = catchAsync(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });
    if(!user) {
        return next(new AppError('There is not user with this email address', 404));
    }


    res.status(200).json({
        status:'success, the ID is found successfully',
            data: {
              data: user
            }
        });

});


// GET TEAM MEMBERS 
exports.ourTeam = catchAsync(async (req, res, next) => {

    const guides = await User.aggregate([

        {   
            // $match: { role: "guide"}
             $match: { role: { $in: [ "lead-guide", "guide" ] }}
        },  

        {  
            $group: {
                _id:  {id: "$_id"}, 
                id: {$push: "$_id"},
                name: {$push: "$name"},
                photo: {$push: "$photo"},
                role: {$push: "$role"},
                email: {$push: "$email"} 

            }
        }, 

        {
            $sort: {
              name: 1
            }
        },
    ]);



    res.status(200).render('team',  {
        title: guides,
        guides

    });
}); 