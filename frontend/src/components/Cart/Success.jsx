import React from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import './Success.css'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'
import emailjs from '@emailjs/browser'
import { useSelector } from 'react-redux'
const Success = () => {
  const { order } = useSelector((state) => state.order.order) || {}
  const { user } = useSelector((state) => state.user)
  let templateParams = {
    name: user.name,
    from_name: 'TTB flower',
    message: 'You have successfully placed an order',
    email: user.email,
    id: order?._id,
    createAt: String(order?.createdAt).substr(0, 10),
    phone: order?.shippingInfo.phoneNo,
    address: order?.shippingInfo.address,
    state: order?.shippingInfo.state,
    country: order?.shippingInfo.country,
    orderItems: order?.orderItems,
  }

  const sendEmailToCustomer = () => {
    emailjs
      .send(
        'service_51q2ief',
        'template_mqwgmbk',
        templateParams,
        'BfvaMXb_SjW5GPvzm'
      )
      .then(
        (result) => {
          // console.log(result.text)
        },
        (error) => {
          console.log(error.text)
        }
      )
  }

  if (order?._id) {
    sendEmailToCustomer()
  }

  return (
    <div className='orderSuccess'>
      <CheckCircleIcon />

      <Typography>Your Order has been Placed successfully </Typography>
      <Link to='/orders'>View Orders</Link>
    </div>
  )
}

export default Success
