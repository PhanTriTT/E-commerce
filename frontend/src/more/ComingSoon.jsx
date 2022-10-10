import React from 'react'
import { useSelector } from 'react-redux'
import './ComingSoon.css'
import BottomTab from './BottomTab'
import Loading from './Loader'
import MetaData from './MetaData'

const ComingSoon = () => {
  const { loading } = useSelector((state) => state.cart)

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <MetaData title='comming soon' />
          <div>
            <div className='bg'>
              <span dataText='Comming' className='first'>
                Comming<span dataText='Soon....'>Soon....</span>
              </span>
              <div className='one'>
                <div className='circle'></div>
              </div>
            </div>
          </div>
          <BottomTab />
        </>
      )}
    </>
  )
}

export default ComingSoon
