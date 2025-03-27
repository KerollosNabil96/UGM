import React, { useContext } from 'react'
import styles from './Contact.module.css';
import { darkModeContext } from '../../Context/DarkModeContext';

export default function Contact() {
      const { darkMode } = useContext(darkModeContext);
  
  return <>
        <div className={`${darkMode? 'tw-dark' : ''}` }>
        <div className="container-fluid dark:tw-bg-gray-800" >
          <div className="container">
      <div className="row">
        <h1 className='text-center mt-5 fw-bolder dark:tw-text-white'>Get in <span className="mainColor">Touch</span></h1>
        <p className='tw-text-gray-500 dark:tw-text-white text-center fs-2 mt-2'>Have a question or want to get involved? Reach out to us — we’re here for you!</p>
        <div className={`${styles.shad} , my-4 col-sm-12 p-5 rounded-4 dark:tw-bg-gray-900`}>
        <div className={`${styles.child} , p-4 rounded-4 `}>
          <div><span className='h2'>📅 Meeting Time:</span> <span className='fs-2 ms-2'>Friday at 4:00 PM</span></div>
          <div className='py-3'>
          <span className='h2 py-3'>📍 Location:</span> <span className='fs-2 ms-2 '> Virgin Mary & St. George Church,Gabriel, Alexandria, Egypt</span></div>
          <div className='py-3'><span className='h2 py-3'>📞 Phone:</span> <span className='fs-2 ms-2 '> (+20)1201047167</span></div>
            <div><span className='h2 py-3'>✉️ Email:</span> <span className='fs-2 ms-2 '> ugm@gmail.com</span><br/></div>
          </div>
          <form className='position-relative'>
          <div className="parent d-flex justify-content-between mt-5">
          <input type="text" className={`${styles.child} , child w-40 py-4 rounded-4 px-3 border border-0'`} placeholder='Name' />
          <input type="text" className={`${styles.child} , child w-40 py-4 px-3 rounded-4 border border-0'`} placeholder='Phone' />
          </div>
          <textarea placeholder='Write your message here...' name="message" id="message" className={`${styles.child} , ${styles.myArea} , p-3 w-100 border border-0 mb-5  rounded-4 mt-5`}></textarea>
          <button className='bg-main text-white rounded-5 px-5 lft position-absolute py-3'>Submit</button>

          </form>
        </div>
      </div>
    </div>
          </div>
</div>
    
    </>
}
