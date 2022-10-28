import React, { useEffect } from 'react'
import './Home.css'
import Carousel from 'react-material-ui-carousel'
import bg from '../../Assets/background.jpg'
import bg2 from '../../Assets/background2.jpg'
import ProductCard from '../Product/ProductCard'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, getProduct } from '../../actions/ProductActions'
import Header from './Header'
import MetaData from '../../more/MetaData'
import Footer from '../../Footer'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import BottomTab from '../../more/BottomTab'
import Loading from '../../more/Loader'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { google } from 'googleapis'
const Home = () => {
  const dispatch = useDispatch()
  const { products, error, loading } = useSelector((state) => state.products)
  //
  const scopes = 'https://www.googleapis.com/auth/analytics.readonly'
  const jwt = new google.auth.JWT(
    'minhtritt01@gmail.com',
    null,
    '1235sa',
    scopes
  )
  const view_id = '247200638'
  //
  useEffect(() => {
    if (error) {
      toast.error(error, { position: 'top-right' })
      dispatch(clearErrors())
    }
    dispatch(getProduct())
  }, [dispatch, error])

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <MetaData title='Home' />
          <Header />
          {/* Carousel */}
          <div className='banner'>
            <Carousel
              NextIcon={<NavigateNextIcon />}
              PrevIcon={<ArrowBackIosIcon />}
            >
              <img src={bg} className='bgImg' alt='bg' />
              <img src={bg2} className='bgImg' alt='bg2' />
            </Carousel>
            {/* <div className='home__content'>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <h2
                  style={{
                    fontFamily: 'Segoe Script',
                    fontSize: '3em',
                    fontWeight: '500',
                  }}
                >
                  super-fast delivery
                </h2>
                <span
                  style={{
                    padding: '10px',
                    backgroundColor: '#fff',
                    margin: '0px 10px',
                    textAlign: 'center',
                    width: '150px',
                    height: '40px',
                    color: '#26c',
                    fontFamily: 'Segoe Script',
                    fontSize: '2.4em',
                    display: 'flex',
                    justifyContent: 'center',
                    lineHeight: '.7',
                    alignItems: 'center',
                  }}
                >
                  in 2 hours
                </span>
              </div>
              <div>
                <h2
                  style={{
                    fontSize: '4.5em',
                    fontFamily: 'Poppins,sans-serif',
                    color: '#34d61b',
                  }}
                >
                  Fresh
                </h2>
              </div>
              <div>
                <h2
                  style={{
                    fontSize: '4.5em',
                    fontWeight: '400',
                    fontFamily: 'Poppins,sans-serif',
                    color: '#fff',
                    lineHeight: '.7',
                  }}
                >
                  Collection
                </h2>
              </div>
              <div>
                <h2
                  style={{
                    fontWeight: '400',
                    fontFamily: 'Poppins,sans-serif',
                    color: '#fff',
                    fontSize: '1em',
                    paddingTop: '10px',
                  }}
                >
                  Get Free Shipping on all orders over $99.00
                </h2>
              </div>
              <div>
                <a href='#container'>
                  <button
                    type='submit'
                    style={{
                      width: '135px',
                      height: '50px',
                      border: 'none',
                      background: '#3BB77E',
                      margin: '10px 0',
                      fontSize: '1.2vmax',
                      color: '#fff',
                      cursor: 'pointer',
                    }}
                    className='Home__button'
                  >
                    SHOP NOW
                  </button>
                </a>
              </div>
            </div> */}
          </div>

          <h2 className='homeHeading'>Featured Products</h2>
          <div className='container' id='container'>
            {products &&
              products?.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
          <ToastContainer />
          <Footer />
          <BottomTab />
        </>
      )}
    </>
  )
}

export default Home
