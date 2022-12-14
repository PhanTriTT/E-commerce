import React, { useState, useEffect } from 'react'
import './EditProfile.css'
import MailOutlinedIcon from '@mui/icons-material/MailOutlined'
import FaceIcon from '@mui/icons-material/Face'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, loadUser, updateProfile } from '../../actions/userActions'
import Loading from '../../more/Loader'
import MetaData from '../../more/MetaData'
import { UPDATE_PROFILE_RESET } from '../../constants/userContants'
import { useNavigate } from 'react-router-dom'

const EditProfile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.user)

  const { error, isUpdated, loading } = useSelector((state) => state.profile)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [avatar, setAvatar] = useState()
  const [avatarPreview, setAvatarPreview] = useState('/profile.png')

  const updateProfileSubmit = (e) => {
    e.preventDefault()

    const myForm = { name, email, avatar }

    dispatch(updateProfile(myForm))
  }

  const updateProfileDataChange = (e) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result)
        setAvatar(reader.result)
      }
    }
    reader.readAsDataURL(e.target.files[0])
  }

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setAvatarPreview(user.avatar.url)
    }

    if (error) {
      alert(error)
      dispatch(clearErrors())
    }

    if (isUpdated) {
      alert('Profile updated successfully')
      dispatch(loadUser())

      navigate('/me')

      dispatch({
        type: UPDATE_PROFILE_RESET,
      })
    }
  }, [dispatch, error, navigate, isUpdated, user])

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <MetaData title='Update Profile' />
          <div className='updateProfileContainer'>
            <div className='updateProfileBox'>
              <h2 className='updateProfileHeading'>Update Profile</h2>

              <form
                className='updateProfileForm'
                encType='multipart/form-data'
                onSubmit={updateProfileSubmit}
              >
                <div className='updateProfileName'>
                  <FaceIcon />
                  <input
                    type='text'
                    placeholder='Name'
                    required
                    name='name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className='updateProfileEmail'>
                  <MailOutlinedIcon />
                  <input
                    type='email'
                    placeholder='Email'
                    required
                    name='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div id='updateProfileImage'>
                  <img src={avatarPreview} alt='Avatar Preview' />
                  <input
                    type='file'
                    name='avatar'
                    accept='image/*'
                    onChange={updateProfileDataChange}
                  />
                </div>
                <input
                  type='submit'
                  value='Update'
                  className='updateProfileBtn'
                />
              </form>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default EditProfile
