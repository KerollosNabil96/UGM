import React, { useContext } from 'react'
import { darkModeContext } from '../../Context/DarkModeContext';
import styles from './Profile.module.css';
import { motion } from 'framer-motion';
import der from '../../assets/der.jpg'
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const { darkMode } = useContext(darkModeContext);
        const { i18n } = useTranslation();
        const isRTL = i18n.language === 'ar';
            const userName = localStorage.getItem('userName');

  

  return <>
   <div className={`${darkMode? 'tw-dark' : ''}` }>
          
          <div className="container-fluid dark:tw-bg-gray-800" >
          <motion.div
          initial={{ opacity: 0, x: isRTL ? 100 : -100 }}
        animate={{ opacity: 1, x: 0 }}     
        transition={{ duration: 1 }}       
      >
    <div className="container">
  <h1 className='text-center  mainColor dark:tw-text-indigo-600 mt-2 fw-bolder pt-4'>Profile</h1>
  <p className='text-center mb-4  fs-4 tw-text-gray-600 dark:tw-text-white text-sm'>In this section, you can view your wallet and the trips or events you have booked.</p>
  <div className={`${styles.shad} row  w-100 mx-auto rounded-4 p-3 my-4`}>
    <h2 className='mainColor dark:tw-text-indigo-600'>Hello , <span className='tw-text-black dark:tw-text-white'>{userName}</span>!</h2>
    <p className='tw-text-gray-500 fs-4 dark:tw-text-white '>Have a nice day!</p>
    <div className={`${styles.line} ` }></div>
    <h2 className='mt-4 fw-bold dark:tw-text-white'>Your Wallet :</h2>
    <h3 className='mt-3 fw-semibold dark:tw-text-white'>Your Available Balance : <span className=' fw-medium'> 15 EGP</span> </h3>
    <div className={`${styles.line2} mt-3`}></div>
    <h2 className='mt-4 fw-bold dark:tw-text-white'>Booking List :</h2>





    <div className="col-lg-4 col-md-6 my-4">
  <div class="card dark:tw-bg-gray-900" style={{height:'630px'}}>
  <img src={der} class="card-img-top w-100"  style={{height:'360px'}}/>
  <div class="card-body position-relative">
    <h5 class="card-title mainColor dark:tw-text-indigo-600">Syrian Monastery</h5>
    <p class="card-text dark:tw-text-white">A spiritual journey to Deir El-Suryan, a place of peace, prayer, and rich history. Experience tranquility, heritage, and deep connection with faith in this sacred monastery.</p>
    <div className={`${styles.parent} parent`}>
    <div className="card-end d-flex justify-content-between">
      <div className="card-date  ">
        <span className='tw-text-gray-500  dark:tw-text-white my-2'>12/07/2025</span>
      </div>
      <div className="card-btn">
      <button className="bg-main text-white tw-w-full tw-px-7 dark:tw-bg-indigo-600  py-2 rounded-3">More Info!</button>
      </div>
    </div>
    </div>
  </div>
</div>
  </div>
    </div>
  </div>
  </motion.div>
  </div>
  </div>
    </>
}
