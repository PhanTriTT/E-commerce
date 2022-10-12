import React, { useEffect, useState } from 'react'
import Footer from '../../Footer'
import Header from '../Home/Header'
import { useSelector, useDispatch } from 'react-redux'
import Loading from '../../more/Loader'
import ProductCard from './ProductCard'
import { clearErrors, getProduct } from '../../actions/ProductActions'
import Pagination from 'react-js-pagination'
import './Products.css'
import Typography from '@mui/material/Typography'
import MetaData from '../../more/MetaData'
import { Link, useParams } from 'react-router-dom'
import BottomTab from '../../more/BottomTab'
import empty from '../../Assets/empty.svg'

const categories = [
  'Birthday flowers',
  'Opening flowers',
  'Congratulatory flowers',
  'Condolence flowers',
  'Love flowers',
  'Graduation flowers',
  'Wedding flowers',
  'Others',
]

const Products = () => {
  const dispatch = useDispatch()
  const [currentPage, setCurrentPage] = useState(1)

  const [category, setCategory] = useState('')

  const { products, loading, error, productsCount, resultPerPage } =
    useSelector((state) => state.products)
  const { keyword } = useParams()
  const setCurrentPageNo = (e) => {
    setCurrentPage(e)
  }

  useEffect(() => {
    if (error) {
      alert(error)
      dispatch(clearErrors())
    }
    dispatch(getProduct(keyword, currentPage, category))
  }, [dispatch, keyword, currentPage, category, error])

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <MetaData title='Products' />
          <Header />
          <div>
            {products?.length === 0 ? (
              ''
            ) : (
              <h2
                style={{
                  textAlign: 'center',
                  borderBottom: '1px solid rgba(21,21,21,0.5)',
                  width: '20vmax',
                  fontSize: '1.4vmax',
                  fontFamily: 'Poppins,sans-serif',
                  margin: '3vmax auto',
                  color: 'rgb(0, 0, 0, 0.7)',
                }}
              >
                Featured Products
              </h2>
            )}
            <div
              className='sidebar__product'
              style={{
                display: 'flex',
                flex: 1,
              }}
            >
              <div
                className='sidebar__products'
                style={{
                  border: '1px solid #999',
                  margin: '1vmax',
                  flex: '.177',
                }}
              >
                <Typography style={{ fontSize: '1.2vmax', padding: '5px' }}>
                  CHOOSE CATEGORIES
                </Typography>
                <ul className='categoryBox'>
                  {categories.map((category) => (
                    <li
                      className='category-link'
                      key={category}
                      onClick={() => setCategory(category)}
                      type='checkbox'
                    >
                      {category}
                    </li>
                  ))}
                </ul>
                <Typography style={{ fontSize: '1.2vmax', padding: '5px' }}>
                  QUICK LINKS
                </Typography>
                <Link to={'/cart'}>
                  <li className='category-link'>My Carts</li>
                </Link>
                <Link to={'/favourites'}>
                  <li className='category-link'>Favourites Items</li>
                </Link>
                <Link>
                  <li className='category-link'>Go to Checkout</li>
                </Link>
              </div>

              {products.length === 0 ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: '1',
                  }}
                >
                  <img
                    src={empty}
                    alt='empty'
                    style={{ width: '300px', height: '300px' }}
                  />
                  <span
                    style={{
                      display: 'block',
                      padding: '30px 0',
                      fontSize: '1.5rem',
                      flex: '.9',
                      textAlign: 'center',
                    }}
                  >
                    No Product Found ....
                  </span>
                </div>
              ) : (
                <div
                  className='products'
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    flex: '.9',
                  }}
                >
                  {products &&
                    products?.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                </div>
              )}
            </div>

            <div
              className='pagination__box'
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '6vmax',
              }}
            >
              {products.length > 0 ? (
                <Pagination
                  activePage={currentPage}
                  itemsCountPerPage={resultPerPage}
                  totalItemsCount={productsCount}
                  onChange={setCurrentPageNo}
                  nextPageText='Next'
                  prevPageText='Prev'
                  firstPageText='First'
                  lastPageText='Last'
                  itemClass='page-item'
                  linkClass='page-link'
                  activeClass='pageItemActive'
                  activeLinkClass='pageLinkActive'
                />
              ) : (
                <></>
              )}
            </div>
          </div>
          <Footer />
          <BottomTab />
        </>
      )}
    </>
  )
}

export default Products
