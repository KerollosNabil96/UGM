import React from 'react';
import styles from './Layout.module.css';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import AnimatedCircle from '../AnimatedCircle/AnimatedCircle';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className={styles.layoutContainer}>
      <Navbar />
      <div className="tw-hidden lg:tw-block">
        <AnimatedCircle />
      </div>
      <main className={styles.mainContent}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
