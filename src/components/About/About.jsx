import React, { useContext } from 'react'
import styles from './About.module.css';
import { darkModeContext } from '../../Context/DarkModeContext';
export default function About() {
    const { darkMode } = useContext(darkModeContext);
  
  return <>
      <div className={`${darkMode? 'tw-dark' : ''}` }>
        <div className="container-fluid dark:tw-bg-gray-800" >
        <div className="container ">
    <div className="row">
    <h1 className='text-center  dark:tw-text-white mt-5 fw-bolder fs-1'>About <span className="mainColor">Us</span></h1>
    <p className='tw-text-gray-500  dark:tw-text-white text-center fs-2 mt-2'>Connecting youth to Christ through spiritual growth,community,<br/> and meaningful experiences. </p>
    <div className={`${styles.shad} ,w-60 my-4 col-sm-12 p-5 rounded-4  dark:tw-bg-gray-900`}>
        <h2 className='fw-bolder fs-1 mainColor text-center'>Who we are</h2>
        <p className='fs-2 tw-text-gray-500  dark:tw-text-white text-center'>Welcome to the Youth Ministry of Virgin Mary & St. George<br/> Church in Gabriel, Alexandria! We serve undergraduates<br/> and graduates, creating a loving family where young<br/> people grow in faith, build friendships, and serve <br/>the community.</p>
        </div>


        <div className={`${styles.shad} ,w-60 my-4 col-sm-12 p-5 rounded-4  dark:tw-bg-gray-900`}>
        <h2 className='fw-bolder fs-1 mainColor text-center'>Our Vision</h2>
        <p className='fs-2 tw-text-gray-500 text-center  dark:tw-text-white'>We believe in empowering young people to live a Christ<br/>-centered life by providing spiritual guidance, engaging<br/> activities, and a supportive Christian community. Our goal<br/> is to inspire and equip youth to grow in their relationship<br/> with God and positively impact the world around them.</p>
        </div>

    </div>
  </div>
        </div>
   

</div>

    </>
}
