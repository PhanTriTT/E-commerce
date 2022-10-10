const catchAsyncErrors = require('../middleware/catchAsyncErrors')

// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const stripe = require('stripe')(
  'sk_test_51JmDkeLVwqnQn2QB4t9V7fYKpASNMPtp1gN1juPGCfodQ1oEHA6vossNm6b2rX3GxdQKeiNQJYUeelcV6rloWec0008fuq2MJf'
)

exports.Payment = catchAsyncErrors(async (req, res, next) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: 'usd',
    metadata: {
      company: 'TTT flower',
    },
  })
  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret })
})

exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY })
})
