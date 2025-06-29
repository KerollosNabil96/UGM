import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { darkModeContext } from '../../Context/DarkModeContext';
import styles from './Spinner.module.css';

const Spinner = () => {
    const { darkMode } = useContext(darkModeContext);
    
    return (
        <div className={styles.spinnerContainer}>
            <motion.div
                className={`${styles.spinner} ${darkMode ? styles.darkSpinner : ''}`}
                animate={{ rotate: 360 }}
                transition={{ 
                    duration: 1, 
                    repeat: Infinity, 
                    ease: "linear" 
                }}
            />
        </div>
    );
};

export default Spinner;