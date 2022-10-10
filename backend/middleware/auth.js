const ErrorHandler = require('../utils/ErrorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const jwt = require('jsonwebtoken')
const User = require('../models/UserModel')

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies
  if (!token) {
    return next(new ErrorHandler('Please login to access this resource.', 401))
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY)
  req.user = await User.findById(decodedData.id)
  next()
})
//Admin roles
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`${req.user.role} can not access this resource`, 401)
      )
    }
    next()
  }
}
