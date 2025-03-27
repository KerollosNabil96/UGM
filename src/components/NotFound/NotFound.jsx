import React from 'react'
import styles from './NotFound.module.css';
import notFound from '../../assets/notFount.png'
export default function NotFound() {
  return <>
  <div className="container">
    <div className="row">
      <img src={notFound} alt="Not found" />
    </div>
  </div>
        </>
}
