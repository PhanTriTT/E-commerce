import React, { Fragment, useState, useEffect } from 'react'
import './UpdatePassword.css'
import Loading from '../../more/Loader'
import { useDispatch, useSelector } from 'react-redux'
import MetaData from '../../more/MetaData'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import LockIcon from '@mui/icons-material/Lock'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import { clearErrors, updatePassword } from '../../actions/userActions'
import { UPDATE_PASSWORD_RESET } from '../../constants/userContants'
import { useNavigate } from 'react-router-dom'

const UpdatePassword = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { error, isUpdated, loading } = useSelector((state) => state.profile)

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const updatePasswordSubmit = (e) => {
    e.preventDefault()

    const myForm = { oldPassword, newPassword, confirmPassword }

    dispatch(updatePassword(myForm))
  }

  useEffect(() => {
    if (error) {
      alert(error)
      dispatch(clearErrors())
    }

    if (isUpdated) {
      // alert('Profile Updated Successfully')
      navigate('/me')
      dispatch({
        type: UPDATE_PASSWORD_RESET,
      })
    }
  }, [dispatch, error, navigate, isUpdated])

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <MetaData title='Change Password' />
          <div className='updatePasswordContainer'>
            <div className='updatePasswordBox'>
              <h2 className='updatePasswordHeading'>Update Profile</h2>

              <form
                className='updatePasswordForm'
                onSubmit={updatePasswordSubmit}
              >
                <div className='loginPassword'>
                  <VpnKeyIcon />
                  <input
                    type='password'
                    placeholder='Old Password'
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>

                <div className='loginPassword'>
                  <LockOpenIcon />
                  <input
                    type='password'
                    placeholder='New Password'
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className='loginPassword'>
                  <LockIcon />
                  <input
                    type='password'
                    placeholder='Confirm Password'
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <input
                  type='submit'
                  value='Change'
                  className='updatePasswordBtn'
                />
              </form>
            </div>
          </div>
        </>
      )}
      {/* <BottomTab /> */}
    </>
  )
}

export default UpdatePassword
