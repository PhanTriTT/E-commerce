const express = require('express')
const {
  createOrder,
  getSingleOrder,
  getAllOrders,
  getAdminAllOrders,
  updateAdminOrder,
  deleteOrder,
  getMonthlyincome,
} = require('../controller/OrderController')
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth')
const router = express.Router()

router.route('/order/new').post(isAuthenticatedUser, createOrder)
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder)
router.route('/orders/me').get(isAuthenticatedUser, getAllOrders)
router
  .route('/admin/orders')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getAdminAllOrders)

router
  .route('/admin/order/:id')
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateAdminOrder)
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteOrder)
router
  .route('/admin/orders/income')
  .get(isAuthenticatedUser, authorizeRoles('admin'), getMonthlyincome)
module.exports = router
