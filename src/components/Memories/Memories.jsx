import React, { useContext } from 'react'
import styles from './Memories.module.css';
import maria from '../../assets/maria.jpg'
import der from '../../assets/der.jpg'
import siwa from '../../assets/siwa.jpg'
import afri from '../../assets/africa-safari-park-1200x1000.jpg'
import { darkModeContext } from '../../Context/DarkModeContext';

export default function Memories() {
    const { darkMode } = useContext(darkModeContext);
    
  return <>
          <div className={`${darkMode? 'tw-dark' : ''}` }>
        <div className="container-fluid dark:tw-bg-gray-800" >
          <div className="container">
    <div className="row">
    <h1 className='mt-5 fw-bold mainColor text-center'>Memories</h1>

<div className={`${styles.searching} , d-flex align-items-center my-4 rounded-4 py-4 dark:tw-bg-gray-900`}>
  <input type="text" placeholder='Search by name....'   className=' w-input  border border-0 py-3 me-2 rounded-2'/>
  <select id="options" className='py-3 w-20 w-Drop me-3 my-2  border border-0  rounded-2 ' name="options">
    <option value="All Categories"  selected>All Categories</option>
    <option value="Events"> Events</option>
    <option value="Trip">Trip </option>
</select>
<button className='bg-main btn text-white w-10 py-3 w-myBtn'>Search</button>
</div>


<div className="row">
<div className="col-lg-4 col-md-6 my-4 ">
    <div className="card position-relative dark:tw-bg-gray-900" style={{ height: "600px" }}>
      <img src={siwa} className="card-img-top w-100" style={{ height: "450px" }} />
      <div className="card-body position-relative">
        <h5 className="card-title mainColor">Siwa Oasis</h5>
        
        <div className={`${styles.parent} parent`}>
          <div className="card-end d-flex justify-content-between w-100">
            <div className="card-date">
              <span className="tw-text-gray-500  dark:tw-text-white my-2">21/03/2024</span>
            </div>
            <div className="card-btn">
              <button className="bg-main text-white px-5 py-2 rounded-3">More Info!</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div className="col-lg-4 col-md-6 my-4">
  <div class="card dark:tw-bg-gray-900" style={{height:'600px'}}>
  <img src={der} class="card-img-top w-100"  style={{height:'450px'}}/>
  <div class="card-body position-relative">
    <h5 class="card-title mainColor">Syrian Monastery</h5>
    <div className={`${styles.parent} parent`}>
    <div className="card-end d-flex justify-content-between">
      <div className="card-date  ">
        <span className='c my-2'>05/01/2025</span>
      </div>
      <div className="card-btn">
        <button className='bg-main text-white px-5 py-2 rounded-3'>More Info!</button>
      </div>
    </div>
    </div>
  </div>
</div>
  </div>
  <div className="col-lg-4 col-md-6  my-4">
  <div class="card dark:tw-bg-gray-900"style={{height:'600px'}} >
  <img src={maria} class="card-img-top w-100"style={{height:'450px'}} />
  <div class="card-body position-relative">
    <h5 class="card-title mainColor">St. Maria Resort – Fun & Faith!</h5>
    <div className={`${styles.parent} parent`}>
    <div className="card-end d-flex justify-content-between">
      <div className="card-date  ">
        <span className='tw-text-gray-500  dark:tw-text-white my-2'>14/06/2025</span>
      </div>
      <div className="card-btn">
        <button className='bg-main text-white px-5 py-2 rounded-3'>More Info!</button>
      </div>
    </div>
    </div>
  </div>
</div>
  </div>



  <div className="col-lg-4 col-md-6  my-4">
  <div class="card dark:tw-bg-gray-900"style={{height:'600px'}} >
  <img src={afri} class="card-img-top w-100"style={{height:'450px'}} />
  <div class="card-body position-relative">
    <h5 class="card-title mainColor">africano park</h5>
    <div className={`${styles.parent} parent`}>
    <div className="card-end d-flex justify-content-between">
      <div className="card-date  ">
        <span className='tw-text-gray-500  dark:tw-text-white my-2'>10/02/2024</span>
      </div>
      <div className="card-btn">
        <button className='bg-main text-white px-5 py-2 rounded-3'>More Info!</button>
      </div>
    </div>
    </div>
  </div>
</div>
  </div>
</div> 

    </div>
  </div>

          </div>
</div>
    </>
}
