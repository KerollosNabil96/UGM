import React, { useContext } from 'react'
import styles from './SignIn.module.css';
import { Formik ,useFormik} from 'formik';
import {darkModeContext} from '../../Context/DarkModeContext'
import signUpImage from '../../assets/92765ddf95236aa0d03442a27590c405.png';
import { motion } from 'framer-motion';

export default function SignIn() {
  let {darkMode  } = useContext(darkModeContext)
  const validate = values => {
    const errors = {};
   
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }

    if (!values.password) {
      errors.password = 'Password is required';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(values.password)) {
      errors.password = 'Password must contain at least 8 characters, including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character';
    }

    return errors;
  };
  let formik = useFormik ({
    initialValues : {
      email: '' , 
      password : '', 
    },onSubmit : ()=>{ 
      // post data to api
    },validate
    
  })

  return <>
  <div className={`${darkMode? 'tw-dark' : ''}`}>
  <div className="container-fluid dark:tw-bg-gray-800 py-5" >

  <motion.div
      initial={{ opacity: 0, x: -100 }} 
      animate={{ opacity: 1, x: 0 }}     
      transition={{ duration: 1 }}       
    >
    
    <div className="container my-5 justify-content-between  d-flex align-items-center ">
      <div className="row w-75 mx-auto"  >
        <div className="col-lg-6 ps-1  tw-bg-gray-100 dark:tw-bg-gray-900 ">
        <div className={`${styles['bg-image']}`}>
        <div className={`${styles['layer']}`}>
              <p className='mainColor fs-2 fw-bolder d-flex justify-content-center align-items-center dark:tw-text-indigo-600 h-100'>UGM Family</p>
            </div>
            </div>
        </div>
        <div className="col-lg-6 tw-bg-gray-100 dark:tw-bg-gray-900 rounded-3 py-3">
          <form onSubmit={formik.handleSubmit}>

          <label htmlFor="Email" className='mt-3 dark:tw-text-white'>Email :</label>
          <input onBlur={formik.handleBlur}  type="email" name='email' id='email' placeholder='Enter your email.' className='w-100 form-control mt-3' onChange={formik.handleChange} value={formik.values.email} />
          {formik.errors.email && formik.touched.email ? <div className="text-danger  w-75" role="alert">{formik.errors.email}</div> :null}

          <label htmlFor="password" className='mt-3 dark:tw-text-white'>Password :</label>
          <input onBlur={formik.handleBlur}  type="password" name='password' id='password' placeholder='Enter your password .' className='w-100 form-control mt-3' onChange={formik.handleChange} value={formik.values.password} />
          {formik.errors.password && formik.touched.password ? <div className="text-danger  w-100" role="alert">{formik.errors.password}</div> :null}
          <button type='submit' disabled={(formik.dirty && formik.isValid)} className='bg-main dark:tw-bg-indigo-600 text-white w-100 py-2 rounded-2 mt-4'>Register</button>
          </form>
        </div>
      </div>
    </div>


      </motion.div>
</div>
  </div>
   
  
    </>
}

