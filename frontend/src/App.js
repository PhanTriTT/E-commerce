import './App.css'
import Home from './components/Home/Home'
import ProductDetails from './components/Product/ProductDetails'
import WebFont from 'webfontloader'
import Store from './store'
import UserData from './more/UserData'
import ProtectedRoute from './route/ProtectedRoute'
import Profile from './components/User/Profile'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import LoginSignup from './components/Authentication/LoginSignup'
import { useSelector } from 'react-redux'
import { loadUser } from './actions/userActions'
import UpdatePassword from './components/User/UpdatePassword'
import EditProfile from './components/User/EditProflie'
import About from './components/about/About'
import Products from './components/Product/Products'
import Search from './components/Product/Search'
import Support from './more/Support'
import Cart from './components/Cart/Cart'
import Favourites from './components/Cart/Favourites'
import Shipping from './components/Cart/Shipping'
import ConfirmOrder from './components/Cart/ConfirmOrder'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'
import Payment from './components/Cart/Payment'
import Success from './components/Cart/Success'
import MoreOption from './components/User/MoreOption'
import Dashboard from './components/Admin/Dashboard'
import CreateProduct from './components/Admin/CreateProduct'
import AllProducts from './components/Admin/AllProducts'
import UpdateProduct from './components/Admin/UpdateProduct'
import AllOrders from './components/Admin/AllOrders'
import UpdateOrder from './components/Admin/UpdateOrder'
import MyOrders from './components/User/MyOrders'
import AllUsers from './components/Admin/AllUsers'
import UpdateUser from './components/Admin/UpdateUser'
import AllReviews from './components/Admin/AllReviews'
import ForgotPassword from './components/User/ForgotPassword'
import ResetPassword from './components/User/ResetPassword'
import OrderDetails from './components/User/OrderDetails'
import Notfound from './more/NotFound'
import Contact from './more/Contact'
import Rules from './more/Rules'
import ComingSoon from './more/ComingSoon'
import ChatwootWidget from './components/chatwoot'
function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user)

  const [stripeApiKey, setStripeApiKey] = useState('')

  async function getStripeApiKey() {
    const { data } = await axios.get('/api/v2/stripeapikey')

    setStripeApiKey(data.stripeApiKey)
  }
  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Roboto', 'Droid Sans', 'Chilanka'],
      },
    })
    Store.dispatch(loadUser())

    getStripeApiKey()
  }, [])
  return (
    <>
      <Router>
        {isAuthenticated && <UserData user={user} />}

        <Routes>
          <Route path='*' element={<Notfound />} />
          <Route path='/' element={<Home />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/faq' element={<Rules />} />
          <Route path='/creator' element={<ComingSoon />} />
          <Route path='product/:id' element={<ProductDetails />} />
          <Route path='login' element={<LoginSignup />} />
          <Route path='/more' element={<MoreOption />} />
          <Route path='/password/forgot' element={<ForgotPassword />} />
          <Route path='/password/reset/:token' element={<ResetPassword />} />
          <Route
            exact
            path='/me'
            element={<ProtectedRoute component={Profile} />}
          />
          <Route
            exact
            path='/me/update'
            element={<ProtectedRoute component={UpdatePassword} />}
          />
          <Route
            exact
            path='/order/:id'
            element={<ProtectedRoute component={OrderDetails} />}
          />
          <Route
            exact
            path='/me/update/info'
            element={<ProtectedRoute component={EditProfile} />}
          />
          <Route
            exact
            path='/shipping'
            element={<ProtectedRoute component={Shipping} />}
          />
          <Route
            exact
            path='/orders'
            element={<ProtectedRoute component={MyOrders} />}
          />
          <Route
            exact
            path='/dashboard'
            element={<ProtectedRoute isAdmin={true} component={Dashboard} />}
          />
          <Route
            exact
            path='/admin/product'
            element={
              <ProtectedRoute isAdmin={true} component={CreateProduct} />
            }
          />
          <Route
            exact
            path='/admin/products'
            element={<ProtectedRoute isAdmin={true} component={AllProducts} />}
          />
          <Route
            exact
            path='/admin/users'
            element={<ProtectedRoute isAdmin={true} component={AllUsers} />}
          />
          <Route
            exact
            path='/admin/user/:id'
            element={<ProtectedRoute isAdmin={true} component={UpdateUser} />}
          />
          <Route
            exact
            path='/edit/product/:id'
            element={
              <ProtectedRoute isAdmin={true} component={UpdateProduct} />
            }
          />
          <Route
            exact
            path='/admin/orders'
            element={<ProtectedRoute isAdmin={true} component={AllOrders} />}
          />
          <Route
            exact
            path='/admin/order/:id'
            element={<ProtectedRoute isAdmin={true} component={UpdateOrder} />}
          />
          <Route
            exact
            path='/admin/reviews'
            element={<ProtectedRoute isAdmin={true} component={AllReviews} />}
          />
          <Route
            exact
            path='/process/payment'
            element={
              <Elements stripe={loadStripe(stripeApiKey)}>
                <ProtectedRoute component={Payment} />
              </Elements>
            }
          />
          <Route
            exact
            path='/order/confirm'
            element={<ProtectedRoute component={ConfirmOrder} />}
          />
          <Route
            exact
            path='/success'
            element={<ProtectedRoute component={Success} />}
          />
          <Route exact path='/about' element={<About />} />
          <Route exact path='/products' element={<Products />} />
          <Route exact path='/search' element={<Search />} />
          <Route exact path='/products/:keyword' element={<Products />} />
          <Route exact path='/support' element={<Support />} />
          <Route exact path='/cart' element={<Cart />} />
          <Route exact path='/favourites' element={<Favourites />} />
        </Routes>
      </Router>
      <ChatwootWidget />
    </>
  )
}

export default App
