const User = require('../models/UserModel')
const ErrorHandler = require('../utils/ErrorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const sendToken = require('../utils/jwtToken')
const sendMail = require('../utils/sendMail')
const crypto = require('crypto')
const cloudinary = require('cloudinary')
//Register user
exports.createUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, email, password, avatar } = req.body

    let user = await User.findOne({ email })
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: 'User already exists' })
    }

    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: 'avatars',
    })

    user = await User.create({
      name,
      email,
      password,
      avatar: { public_id: myCloud.public_id, url: myCloud.secure_url },
    })

    sendToken(user, 201, res)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

//log in user

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    return next(new ErrorHandler(`Please enter your email and password`, 400))
  }
  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    return next(
      new ErrorHandler(
        `User is not available with this email and password`,
        401
      )
    )
  }
  const isPasswordMatched = await user.comparePassword(password)
  if (!isPasswordMatched) {
    return next(
      new ErrorHandler(`User is not found with this email and password`, 401)
    )
  }
  sendToken(user, 201, res)
})

// log out user

exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  })
  res
    .status(200)
    .json({ success: true, message: 'User logged out successfully!' })
})

//forgot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return next(new ErrorHandler('User not found with this email ', 404))
  }

  //get ResetPassword Token

  const resetToken = user.getResetToken()
  await user.save({
    validateBeforeSave: false,
  })
  const host = `ttbflowers.herokuapp.com`
  const resetPasswordUrl = `${req.protocol}://${host}/password/reset/${resetToken}`

  const message = `Your password reset token is :- \n \n ${resetPasswordUrl}`
  try {
    await sendMail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    })

    res.status(200).json({
      success: true,
      message: `Email was sent to ${user.email} successfully`,
    })
  } catch (error) {
    user.resetPasswordToken = undefined
    user.resetPasswordTime = undefined
    await user.save({
      validateBeforeSave: false,
    })
    return next(new ErrorHandler(error.message))
  }
})

//reset password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  //create token hash

  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordTime: { $gt: Date.now() },
  })
  if (!user) {
    return next(
      new ErrorHandler('Reset password url is invalid or has been expired', 400)
    )
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler('Password is not match with confirmPassword', 400)
    )
  }

  user.password = req.body.password

  user.resetPasswordToken = undefined
  user.resetPasswordTime = undefined
  await user.save()

  sendToken(user, 200, res)
})

//get user details
exports.userDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  res.status(200).json({
    success: true,
    user,
  })
})

//update user password

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password')

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword)

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Old password mismatch', 400))
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler('Confirm password mismatch', 400))
  }

  user.password = req.body.newPassword

  await user.save()

  sendToken(user, 200, res)
})

//update profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  }

  if (req.body.avatar !== '') {
    const user = await User.findById(req.user.id)

    const imageId = user.avatar.public_id

    await cloudinary.v2.uploader.destroy(imageId)

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: 'avatars',
      width: 150,
      crop: 'scale',
    })
    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    }
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidator: true,
    useFindAndModify: false,
  })

  res.status(200).json({
    success: true,
  })
})

// get all users ---admin
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find()
  res.status(200).json({ success: true, users })
})
//get single user ---admin
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id)
  if (!user) {
    return next(new ErrorHandler('User not found with this id', 400))
  }
  res.status(200).json({ success: true, user })
})
//change user role --admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  }

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  })

  res.status(200).json({
    success: true,
    user,
  })
})

//delete user  --admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  const imageId = user.avatar.public_id

  await cloudinary.v2.uploader.destroy(imageId)
  if (!user) {
    return next(new ErrorHandler('User not found with this id', 400))
  }
  await user.remove()
  res.status(200).json({ success: true, message: 'User deleted successfully' })
})
