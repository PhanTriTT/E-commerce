import React, { useRef, useState } from 'react'
import MetaData from './MetaData'
import './Support.css'
import emailjs from '@emailjs/browser'
import BottomTab from './BottomTab.jsx'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'
const Support = () => {
  const [done, setDone] = useState(false)
  const formRef = useRef(null)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [reply_email, setReply_email] = useState('')
  const navigate = useNavigate()

  let templateParams = {
    to_name: 'TTB flowers',
    from_name: name,
    message,
    reply_email,
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    emailjs
      .send(
        'service_51q2ief',
        'template_i7tv5my',
        templateParams,
        'BfvaMXb_SjW5GPvzm'
      )
      .then(
        (result) => {
          // console.log(result.text)
          setDone(true)
        },
        (error) => {
          console.log(error.text)
        }
      )
  }

  return (
    <>
      <MetaData title='Support' />
      <div
        className='support'
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '50px 0',
        }}
      >
        <h2
          className='support__heading'
          style={{
            textAlign: 'center',
          }}
        >
          Hey How can we improve our services
        </h2>
        <h2
          className='support__heading'
          style={{
            textAlign: 'center',
          }}
        >
          Report us for something...
        </h2>
        <div>
          <form
            style={{
              width: '400px',
              margin: 'auto',
              padding: '20px 0',
            }}
            ref={formRef}
            onSubmit={handleSubmit}
          >
            <input
              type='text'
              placeholder='Write your Name ...'
              required
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                borderBottom: '1px solid #3BB77E',
                margin: '10px 0',
                fontSize: '1.2vmax',
                height: '40px',
              }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              name='user__name'
            />
            <input
              type='text'
              placeholder='Write a Subject ...'
              required
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                borderBottom: '1px solid #3BB77E',
                margin: '10px 0',
                fontSize: '1.2vmax',
                height: '40px',
              }}
              name='user__subject'
            />
            <input
              type='email'
              value={reply_email}
              onChange={(e) => setReply_email(e.target.value)}
              placeholder='write your Email ...'
              required
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                borderBottom: '1px solid #3BB77E',
                margin: '10px 0',
                fontSize: '1.2vmax',
                height: '40px',
              }}
            />
            <textarea
              cols='30'
              rows='5'
              required
              placeholder='write your message ...'
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                borderBottom: '1px solid #3BB77E',
                margin: '10px 0',
                fontSize: '1.2vmax',
              }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              name='user__message'
            ></textarea>
            <button
              style={{
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                background: '#3BB77E',
                height: '40px',
                margin: '10px 0',
                color: '#fff',
                fontSize: '1.2vmax',
              }}
            >
              Submit
            </button>
          </form>
          <div className='animation'></div>
          {done &&
            toast.success(
              'Thanks for your report we will reply it in very soon...',
              { position: toast.POSITION.TOP_RIGHT }
            ) &&
            setTimeout(() => {
              navigate('/me')
            }, 5000)}
        </div>
      </div>
      <ToastContainer />
      <BottomTab />
    </>
  )
}

export default Support
