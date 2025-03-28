import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedCircle() {
  return (
    <>
      <motion.div
        className="circle"
        style={{
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          backgroundColor: '#4B0082', 
          filter: 'blur(120px)',
          position: 'absolute',
          top: '20%', 
          left: '20px', 
        }}
        animate={{
          y: [100, 80, 100], 
        }}
        transition={{
          duration: 2, 
          repeat: Infinity, 
          repeatType: 'loop',
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="circle"
        style={{
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          backgroundColor: '#4B0082', 
          filter: 'blur(120px)',
          position: 'absolute',
          bottom: '20px', 
          right: '20px',
        }}
        animate={{
          y: [100, 80, 100], 
        }}
        transition={{
          duration: 2, 
          repeat: Infinity,
          repeatType: 'loop', 
          ease: 'easeInOut', 
        }}
      />
    </>
  );
}
