import React from 'react'
import './Sidebar.css'
import { Link } from 'react-router-dom'
import PostAddIcon from '@mui/icons-material/PostAdd'
import AddIcon from '@mui/icons-material/Add'
// import LocalOffer from '@mui/icons-material/LocalOffer'
import ListAltIcon from '@mui/icons-material/ListAlt'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'
import RateReviewIcon from '@mui/icons-material/RateReview'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import logo from '../../Assets/logo.svg'

const Sidebar = () => {
  const button = () => {
    // let items = document.querySelectorAll('.Dashboard__item')
  }

  return (
    <div className='sidebar'>
      <Link to='/'>
        <img
          src={logo}
          alt='Ecommerce'
          style={{
            height: '150px',
          }}
        />
      </Link>
      <Link to='/dashboard'>
        <p className='Dashboard__item' onClick={button}>
          <DashboardIcon /> Dashboard
        </p>
      </Link>
      <Link to='/admin/products'>
        <p className='Dashboard__item'>
          <PostAddIcon /> All Products
        </p>
      </Link>

      <Link to='/admin/product'>
        <p>
          <AddIcon />
          Create Product
        </p>
      </Link>

      <Link to='/admin/orders'>
        <p>
          <ListAltIcon />
          Orders
        </p>
      </Link>
      <Link to='/admin/users'>
        <p>
          <PeopleIcon /> Users
        </p>
      </Link>
      <Link to='/admin/reviews'>
        <p>
          <RateReviewIcon />
          Reviews
        </p>
      </Link>
      <Link to='/admin/monthlyincome'>
        <p>
          <ShowChartIcon />
          Monthly Income
        </p>
      </Link>
    </div>
  )
}

export default Sidebar
