import React, { useEffect, useRef } from 'react'
import CheckoutSteps from './CheckoutSteps'
import { useSelector, useDispatch } from 'react-redux'
import MetaData from '../../more/MetaData'
import Typography from '@mui/material/Typography'
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import axios from 'axios'
import './Payment.css'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import EventIcon from '@mui/icons-material/Event'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import { createOrder, clearErrors } from '../../actions/OrderActions'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Loading from '../../more/Loader'
import { useNavigate } from 'react-router-dom'

const Payment = () => {
  const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo')) || {}
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const stripe = useStripe()
  const elements = useElements()
  const payBtn = useRef(null)
  const { shippingInfo, cartItems } = useSelector((state) => state.cart)

  const { user } = useSelector((state) => state.user)
  const { error, loading } = useSelector((state) => state.order)
  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100),
  }

  const orderData = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo?.subtotal,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo?.totalPrice,
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    payBtn.current.disabled = true

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const { data } = await axios.post(
        '/api/v2/payment/process',
        paymentData,
        config
      )

      const client_secret = data.client_secret

      if (!stripe || !elements) return

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: user.name,
            email: user.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              country: shippingInfo.country,
            },
          },
        },
      })

      if (result.error) {
        payBtn.current.disabled = false

        toast.error(result.error.message)
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          orderData.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          }

          dispatch(createOrder(orderData))
          navigate('/success')
        } else {
          toast.error("There's some issue while processing payment ")
        }
      }
    } catch (error) {
      payBtn.current.disabled = false
      toast.error(error.response.data.message)
    }
  }

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearErrors())
    }
  }, [dispatch, error])
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <MetaData title='Payment' />
          <CheckoutSteps activeStep={2} />
          <div className='paymentContainer'>
            <form className='paymentForm' onSubmit={(e) => submitHandler(e)}>
              <Typography>Card Info</Typography>
              <div>
                <CreditCardIcon />
                <CardNumberElement className='paymentInput' />
              </div>
              <div>
                <EventIcon />
                <CardExpiryElement className='paymentInput' />
              </div>
              <div>
                <VpnKeyIcon />
                <CardCvcElement className='paymentInput' />
              </div>

              <input
                type='submit'
                value={`Pay - $ ${orderInfo && orderInfo.totalPrice}`}
                ref={payBtn}
                className='paymentFormBtn'
              />
            </form>
          </div>
          <ToastContainer
            position='bottom-center'
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </>
      )}
    </>
  )
}

export default Payment
