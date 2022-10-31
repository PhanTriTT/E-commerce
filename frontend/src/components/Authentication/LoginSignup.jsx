import MetaData from '../../more/MetaData'
import MailOutlinedIcon from '@mui/icons-material/MailOutlined'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import FaceIcon from '@mui/icons-material/Face'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loading from '../../more/Loader'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { login, register, clearErrors } from '../../actions/userActions'
import './LoginSignup.css'
const LoginSignup = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { error, isAuthenticated, loading } = useSelector((state) => state.user)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [avatar, setAvatar] = useState('/profile.png')
  const [avatarPreview, setAvatarPreview] = useState('/profile.png')

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  })

  const { name, email, password } = user
  const loginTab = useRef(null)
  const registerTab = useRef(null)
  const switcherTab = useRef(null)
  const loginSubmit = (e) => {
    e.preventDefault()
    dispatch(login(loginEmail, loginPassword))
  }

  const registerSubmit = (e) => {
    e.preventDefault()

    dispatch(register({ name, email, password, avatar }))
  }
  const registerDataChange = (e) => {
    if (e.target.name === 'avatar') {
      const reader = new FileReader()

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result)
          setAvatar(reader.result)
        }
      }

      reader.readAsDataURL(e.target.files[0])
    } else {
      setUser({ ...user, [e.target.name]: e.target.value })
    }
  }

  const redirect = location.search ? location.search.split('=')[1] : '/'
  useEffect(() => {
    if (error) {
      toast.error(error, { position: 'top-center' })
      dispatch(clearErrors())
    }

    if (isAuthenticated) {
      navigate(redirect)
    }
  }, [dispatch, error, redirect, navigate, isAuthenticated])
  const switchTabs = (e, tab) => {
    if (tab === 'login') {
      switcherTab.current.classList.add('shiftToNeutral')
      switcherTab.current.classList.remove('shiftToRight')

      registerTab.current.classList.remove('shiftToNeutralForm')
      loginTab.current.classList.remove('shiftToLeft')
    }
    if (tab === 'register') {
      switcherTab.current.classList.add('shiftToRight')
      switcherTab.current.classList.remove('shiftToNeutral')

      registerTab.current.classList.add('shiftToNeutralForm')
      loginTab.current.classList.add('shiftToLeft')
    }
  }
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <MetaData title='Login or Signup' />
          <div className='LoginSignUpContainer'>
            <div className='LoginSignUpBox'>
              <div>
                <div className='login_signUp_toggle'>
                  <p onClick={(e) => switchTabs(e, 'login')}>LOGIN</p>
                  <p onClick={(e) => switchTabs(e, 'register')}>REGISTER</p>
                </div>
                <button ref={switcherTab}></button>
              </div>
              <form className='loginForm' ref={loginTab} onSubmit={loginSubmit}>
                <div className='loginEmail'>
                  <MailOutlinedIcon />
                  <input
                    type='email'
                    placeholder='Email'
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className='loginPassword'>
                  <LockOpenIcon />
                  <input
                    type='password'
                    placeholder='Password'
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <Link to='/password/forgot'>Forgot Password ?</Link>
                <input type='submit' value='Login' className='loginBtn' />
                <Link to='/'>
                  <span>Login as a guest ?</span>
                </Link>
              </form>

              <form
                className='signUpForm'
                ref={registerTab}
                encType='multipart/form-data'
                onSubmit={registerSubmit}
              >
                <div className='signUpName'>
                  <FaceIcon />
                  <input
                    type='text'
                    placeholder='Name'
                    required
                    name='name'
                    value={name}
                    onChange={registerDataChange}
                  />
                </div>
                <div className='signUpEmail'>
                  <MailOutlinedIcon />
                  <input
                    type='email'
                    placeholder='Email'
                    required
                    name='email'
                    value={email}
                    onChange={registerDataChange}
                  />
                </div>
                <div className='signUpPassword'>
                  <LockOpenIcon />
                  <input
                    type='password'
                    placeholder='Password'
                    required
                    name='password'
                    value={password}
                    onChange={registerDataChange}
                  />
                </div>

                <div id='registerImage'>
                  <img src={avatarPreview} alt='Avatar Preview' />
                  <input
                    type='file'
                    name='avatar'
                    accept='image/*'
                    onChange={registerDataChange}
                  />
                </div>
                <input type='submit' value='Register' className='signUpBtn' />
              </form>
            </div>
          </div>
          <ToastContainer />
        </div>
      )}
    </>
  )
}
export default LoginSignup
