import React, { useContext, useEffect, useState } from 'react';
import {darkModeContext} from '../../Context/DarkModeContext'
import Layout from '../Layout/Layout';
import { Link } from 'react-router-dom';

export default function Navbar() {

  let {darkMode ,toggleDarkMode } = useContext(darkModeContext)


  return <>
    <div className={`${darkMode? 'tw-dark' : ''}`}>
      <nav className="navbar navbar-expand-lg bg-main dark:tw-bg-gray-900 transition-colors duration-300">
        <div className="container-fluid">
          <Link className="navbar-brand text-white tw-dark:text-blue-800 fw-bolder" to="#">
            UGM
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav justify-content-center mb-2 mb-lg-0" style={{ width: '100%' }}>
              <li className="nav-item">
                <Link className="nav-link active text-white" aria-current="page" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active text-white" aria-current="page" to="about">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active text-white" aria-current="page" to="events">Events</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active text-white" aria-current="page" to="kahoot-game">Kahoot</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active text-white" aria-current="page" to="Memories">Memories</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active text-white" aria-current="page" to="contact">Contact</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active text-white" aria-current="page" to="servantInfo">Servant Info</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active text-white" aria-current="page" to="share-event">Share event</Link>
              </li>
            </ul>

            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <i onClick={() => toggleDarkMode()} className={darkMode === true ? 'fa-solid fa-sun crsr text-white fs-3 d-flex me-lg-3 cursor-pointer align-items-center' : 'fa-solid crsr fa-moon text-white fs-3 d-flex me-lg-3 cursor-pointer align-items-center'}/> 
                <li className="nav-item">
                <Link className="nav-link text-white" aria-current="page" to="signin">SignIn</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" aria-current="page" to="signup">SignUp</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" aria-current="page">SignOut</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      </div>
      </>
}
