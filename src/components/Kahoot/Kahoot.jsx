import React, { useContext } from 'react'
import { darkModeContext } from '../../Context/DarkModeContext';

import styles from './Kahoot.module.css';
export default function Kahoot() {
      const { darkMode } = useContext(darkModeContext);
  
  return <>
           <div className={`${darkMode? 'tw-dark' : ''}` }>
        <div className="container-fluid dark:tw-bg-gray-800" >
          <div className="container">
    <div className="row">
    <h1 className='mt-5 fw-bold mainColor text-center'>Kahoot Game</h1>
    <p className='paragraph  dark:tw-text-white text-center'>Join the Kahoot game and enjoy the competition and <br/> challenge with your friends! 😊</p>

    <div className={`${styles.shad} , my-4 col-sm-12 p-5 rounded-4 bg-main dark:tw-bg-gray-900`}>
      <div className="pin tw-bg-white dark:tw-bg-gray-800 mx-auto p-5 rounded-4" style={{width: '50%'}}>
        <input type="text" placeholder='Game Pin'className={` ${styles.input} , p-4 form-control dark:tw-bg-gray-900`} />
        <button className='bg-main w-100 text-white fs-2 fw-bolder rounded-3 py-3 mt-5 form-control'>Submit</button>
      </div>
        </div>




<div className="row">

 


 
</div> 

    </div>
  </div>

          </div>
</div>
    </>
}
