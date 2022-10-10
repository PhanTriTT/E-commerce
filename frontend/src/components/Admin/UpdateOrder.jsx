import React, { Fragment, useEffect, useState } from 'react'
import MetaData from '../../more/MetaData'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Typography } from '@mui/material'
import SideBar from './Sidebar'
import {
  getOrderDetails,
  clearErrors,
  updateOrder,
} from '../../actions/OrderActions'
import { useSelector, useDispatch } from 'react-redux'
import Loading from '../../more/Loader'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import { Button } from '@mui/material'
import { UPDATE_ORDER_RESET } from '../../constants/OrderConstants'
import './UpdateOrder.css'
import { ToastContainer, toast } from 'react-toastify'
import emailjs from '@emailjs/browser'
const UpdateOrder = () => {
  const { order, error, loading } = useSelector((state) => state.orderDetails)
  const navigate = useNavigate()
  const [status, setStatus] = useState('')
  const { id } = useParams()
  const { error: updateError, isUpdated } = useSelector(
    (state) => state.deleteOrder
  )
  let templateParams = {
    email: order?.user?.email,
    message: `Your order has been ${status} `,
    from_name: 'TTB flower',
    to_name: order?.user?.name,
  }

  const sendEmailToCustomer = () => {
    emailjs
      .send(
        'service_o4dapgs',
        'template_lhajfa5',
        templateParams,
        'rK9W87t7uhKibfFDP'
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

  const updateOrderSubmitHandler = (e) => {
    e.preventDefault()

    const myForm = { status }
    sendEmailToCustomer()
    dispatch(updateOrder(id, myForm))
  }

  const dispatch = useDispatch()

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearErrors())
    }
    if (updateError) {
      toast.error(updateError)
      dispatch(clearErrors())
    }
    if (isUpdated) {
      toast.success('Order Updated Successfully')
      navigate('/admin/orders')
      dispatch({ type: UPDATE_ORDER_RESET })
    }

    dispatch(getOrderDetails(id))
  }, [dispatch, error, id, isUpdated, updateError, navigate])

  return (
    <Fragment>
      <MetaData title='Process Order' />
      <div className='dashboard'>
        <SideBar />
        <div className='newProductContainer'>
          {loading ? (
            <Loading />
          ) : (
            <div
              className='confirmOrderPage'
              style={{
                display: order.orderStatus === 'Delivered' ? 'block' : 'grid',
              }}
            >
              <div>
                <div className='confirmshippingArea'>
                  <Typography>Shipping Info</Typography>
                  <div className='orderDetailsContainerBox'>
                    <div className='orderDetailsInfor'>
                      <p>Name:</p>
                      <span>{order.user && order.user.name}</span>
                    </div>
                    <div className='orderDetailsInfor'>
                      <p>Phone:</p>
                      <span>
                        {order.shippingInfo && order.shippingInfo.phoneNo}
                      </span>
                    </div>
                    <div className='orderDetailsInfor'>
                      <p>Address:</p>
                      <span>
                        {order.shippingInfo &&
                          `${order.shippingInfo.address}, ${order.shippingInfo.state}`}
                      </span>
                    </div>
                  </div>

                  <Typography>Payment</Typography>
                  <div className='orderDetailsContainerBox'>
                    <div className='orderDetailsInfor'>
                      <p
                        style={{
                          color: 'green',
                        }}
                      >
                        PAID
                      </p>
                    </div>

                    <div className='orderDetailsInfor'>
                      <p>Amount:</p>
                      <span>${order.totalPrice && order.totalPrice}</span>
                    </div>
                  </div>

                  <Typography>Order Status</Typography>
                  <div className='orderDetailsContainerBox'>
                    <div className='orderDetailsInfor'>
                      <p
                        className={
                          order.orderStatus && order.orderStatus === 'Delivered'
                            ? 'greenColor'
                            : 'redColor'
                        }
                      >
                        {order.orderStatus && order.orderStatus}
                      </p>
                    </div>
                  </div>
                </div>
                <div className='confirmCartItems'>
                  <Typography>Your Cart Items:</Typography>
                  <div className='confirmCartItemsContainer'>
                    {order.orderItems &&
                      order.orderItems.map((item) => (
                        <div key={item.productId}>
                          <img src={item.productImage} alt='Product' />
                          <Link to={`/product/${item.productId}`}>
                            {item.productName}
                          </Link>{' '}
                          <span>
                            {item.quantity} X ${item.productPrice} ={' '}
                            <b>${item.productPrice * item.quantity}</b>
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              {/*  */}
              <div
                style={{
                  display: order.orderStatus === 'Delivered' ? 'none' : 'block',
                }}
              >
                <form
                  className='updateOrderForm'
                  onSubmit={updateOrderSubmitHandler}
                >
                  <h1>Process Order</h1>

                  <div>
                    <AccountTreeIcon />
                    <select onChange={(e) => setStatus(e.target.value)}>
                      <option value=''>Choose Category</option>
                      {order.orderStatus === 'Processing' && (
                        <option value='Shipped'>Shipped</option>
                      )}

                      {order.orderStatus === 'Shipped' && (
                        <option value='Delivered'>Delivered</option>
                      )}
                    </select>
                  </div>

                  <Button
                    id='createProductBtn'
                    type='submit'
                    disabled={
                      loading ? true : false || status === '' ? true : false
                    }
                  >
                    Process
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
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
    </Fragment>
  )
}

export default UpdateOrder
