import React, { useContext } from 'react'
import styles from './Dashboard.module.css';
import { NavLink, Outlet } from 'react-router-dom';
import { darkModeContext } from '../../Context/DarkModeContext';
import { motion } from 'framer-motion';


export default function Dashboard() {
    const { darkMode } = useContext(darkModeContext);
  return <>
        
      

    <div className={`container-fluid  ${darkMode? 'tw-dark' : ''}`}  style={{minHeight : '80vh'}}>
      <div className="row tw-bg-gray-100 dark:tw-bg-gray-800 " >

 

      <div class="collapse" id="navbarToggleExternalContent" className={`collapse bg-main ${styles.secNav}`} >
  <div class="bg-main py-4">
    <ul className={`${styles.paddingLeft}`}  style={{listStyle : 'none'}}>
    <li class="nav-item">
    <NavLink className="nav-link active text-white" aria-current="page" to=""><i class="fa-solid fa-users me-1"></i> Users</NavLink>
  </li>
  <li class="nav-item">
    <NavLink className="nav-link active text-white" aria-current="page" to="update-request"><i class="fa-regular fa-hand me-1"></i> Update Requests</NavLink>
  </li>
  
    </ul>
  </div>
</div>
<nav className={`navbar bg-main ${styles.secNav}`}>
  <div className="container-fluid">
    <h3 className='text-white'>Admin Dashboard</h3>
    <button className="navbar-toggler ms-auto " type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon "></span>
    </button>
  </div>
</nav>
        <div className={`col-2 bg-main ${styles.sideHidden} dark:tw-bg-gray-900` } style={{minHeight:'80vh' }}>
          <h4 className='text-white my-4'>Admin Dashboard</h4>
        <ul class="nav flex-column  w-100 bg-main dark:tw-bg-gray-900 h-100">
  <li class="nav-item">
    <NavLink className="nav-link active text-white" aria-current="page" to=""><i class="fa-solid fa-users me-1"></i> Users</NavLink>
  </li>
  <li className="nav-item">
    <NavLink className="nav-link active text-white" aria-current="page"to="update-request"><i class="fa-regular fa-hand me-1"></i> Update Requests</NavLink>
  </li>
  
</ul>


        </div>
      
      <div className="col-12 col-md-10 " >
        <Outlet></Outlet>
      </div>
      </div>
    </div>
    </>
}
