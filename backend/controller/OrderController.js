const Order = require('../models/OrderModel')
const Product = require('../models/ProductModel')
const ErrorHandler = require('../utils/ErrorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')

//create a new Order
exports.createOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  })
  res.status(201).json({ success: true, order })
})

//get single order

exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  )

  if (!order) {
    return next(new ErrorHandler('Order not found with this id', 404))
  }

  res.status(200).json({ success: true, order })
})

//get all orders
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id })

  res.status(200).json({ success: true, orders })
})

//get all orders--admin
exports.getAdminAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find()
  let totalAmount = 0

  orders.forEach((order) => {
    totalAmount += order.totalPrice
  })

  res.status(200).json({ success: true, totalAmount, orders })
})

// update Order Status ---Admin
exports.updateAdminOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id)

  if (!order) {
    return next(new ErrorHandler('Order not found with this Id', 404))
  }

  if (order.orderStatus === 'Delivered') {
    return next(new ErrorHandler('You have already delivered this order', 400))
  }

  if (req.body.status === 'Shipped') {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.productId, o.quantity)
    })
  }
  order.orderStatus = req.body.status

  if (req.body.status === 'Delivered') {
    order.deliveredAt = Date.now()
  }

  await order.save({ validateBeforeSave: false })
  res.status(200).json({
    success: true,
  })
})

async function updateStock(id, quantity) {
  const product = await Product.findById(id)

  product.Stock -= quantity

  await product.save({ validateBeforeSave: false })
}

//delete order --admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
  if (!order) {
    return next(new ErrorHandler('Order not found with this id', 404))
  }
  await order.remove()

  res.status(200).json({ success: true })
})
// Get monthly income --admin
exports.getMonthlyincome = catchAsyncErrors(async (req, res, next) => {
  // const date = new Date(2022, 1, 1)
  // const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
  // const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1))
  try {
    // const income = await Order.aggregate([
    //   { $match: { createdAt: { $gte: previousMonth } } },
    //   {
    //     $project: {
    //       month: { $month: '$createdAt' },
    //       sales: '$totalPrice',
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: '$month',
    //       total: { $sum: '$sales' },
    //     },
    //   },
    // ])
    const income = await Order.aggregate([
      {
        $group: {
          _id: { $month: { $toDate: '$createdAt' } },
          total: { $sum: '$totalPrice' },
        },
      },
    ])
    res.status(200).json(income)
  } catch (error) {
    res.status(500).json(error)
  }
})
