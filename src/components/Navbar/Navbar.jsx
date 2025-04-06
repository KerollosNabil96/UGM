import React, { useContext, useEffect, useState } from 'react';
import {darkModeContext} from '../../Context/DarkModeContext'
import Layout from '../Layout/Layout';
import { Link , NavLink } from 'react-router-dom';
import { style } from 'motion/react-m';
import styles from './Navbar.module.css';
import { color } from 'motion/react';


export default function Navbar() {

  let {darkMode ,toggleDarkMode } = useContext(darkModeContext)


  return <>
    <div className={`${darkMode? 'tw-dark' : ''} ]
     `}>
      <nav className="navbar navbar-expand-lg bg-main dark:tw-bg-gray-900 transition-colors duration-300">
        <div className="container-fluid">
          <NavLink  className="navbar-brand text-white tw-dark:text-blue-800 fw-bolder" to="#">
            UGM
          </NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav justify-content-center mb-2 mb-lg-0" style={{ width: '100%' }}>
              <li className="nav-item">
                <NavLink className={({isActive})=>(isActive?`${styles.line} nav-link active text-white `:`nav-link active text-white `)}  aria-current="page" to="/">Home</NavLink>
              </li>
              {/* ${styles.line} */}
              <li className="nav-item">
                <NavLink className={({isActive})=>(isActive?`${styles.line} nav-link active text-white `:'nav-link active text-white')}  aria-current="page" to="about">About</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({isActive})=>(isActive?`${styles.line} nav-link active text-white `:'nav-link active text-white')}  aria-current="page" to="events">Events</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({isActive})=>(isActive?`${styles.line} nav-link active text-white `:'nav-link active text-white')}  aria-current="page" to="kahoot-game">Kahoot</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({isActive})=>(isActive?`${styles.line} nav-link active text-white `:'nav-link active text-white')}  aria-current="page" to="Memories">Memories</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({isActive})=>(isActive?`${styles.line} nav-link active text-white `:'nav-link active text-white')}  aria-current="page" to="contact">Contact</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({isActive})=>(isActive?`${styles.line} nav-link active text-white `:'nav-link active text-white')}  aria-current="page" to="servantInfo">Servant Info</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({isActive})=>(isActive?`${styles.line} nav-link active text-white `:'nav-link active text-white')}  aria-current="page" to="ServantList">Servant List</NavLink>
              </li>
              
              <li className="nav-item">
                <NavLink className={({isActive})=>(isActive?`${styles.line} nav-link active text-white `:'nav-link active text-white')}  aria-current="page" to="share-event">Share event</NavLink>
              </li>
            </ul>

            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 position-relative">
            <i onClick={() => toggleDarkMode()} className={darkMode === true ? 'fa-solid fa-sun crsr text-white fs-3 d-flex me-lg-3 cursor-pointer align-items-center' : 'fa-solid crsr fa-moon text-white fs-3 d-flex me-lg-3 cursor-pointer align-items-center'}/> 
                <li className="nav-item">
                <NavLink  className={({isActive})=>(isActive?`${styles.line} nav-link active text-white `:'nav-link active text-white')}  aria-current="page" to="signin">SignIn</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={({isActive})=>(isActive?`${styles.line} nav-link active text-white `:'nav-link active text-white')}  aria-current="page" to="signup">SignUp</NavLink>
              </li>
              <li className="nav-item dropdown">
  <button 
    type="button" 
    className="btn bg-main dark:tw-bg-gray-900 text-white border border-1 dropdown-toggle" 
    data-bs-toggle="dropdown" 
    aria-expanded="false"
  >
    Username
  </button>
  <ul className="dropdown-menu dropdown-menu-end ps-3 dark:tw-bg-gray-800">
  <li><NavLink className='dropdown-item dark:tw-text-white' to={'profile'}><i class="fa-solid fa-user me-2 dark:tw-text-white"></i> Profile</NavLink></li>
    <li><NavLink className='dropdown-item dark:tw-text-white' to={'settings'}><i class="fa-solid fa-gear me-2 dark:tw-text-white"></i> Settings</NavLink></li>
    <li><NavLink className='dropdown-item dark:tw-text-white' to={'/'}><i class="fa-solid fa-right-from-bracket  me-2 dark:tw-text-white"></i> Logout</NavLink></li>
  </ul>
</li>
            </ul>
          </div>
        </div>
      </nav>
      </div>
      </>
}
