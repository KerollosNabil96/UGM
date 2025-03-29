import React, { useContext } from 'react'
import styles from './SignUp.module.css';
import { Formik ,useFormik} from 'formik';
import signUpImage from '../../assets/92765ddf95236aa0d03442a27590c405.png';
import {darkModeContext} from '../../Context/DarkModeContext'
import { motion } from 'framer-motion';

export default function SignUp() {
  let {darkMode  } = useContext(darkModeContext)

  const validate = values => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Name is required';
    } else if (values.name.length < 3 || values.name.length > 15) {
      errors.name = 'Name must be between 3 and 15 characters';
    }

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

    if (!values.rePassword) {
      errors.rePassword = 'Repassword is required';
    } else if (values.rePassword !== values.password) {
      errors.rePassword = 'Password and repassword must be the same';
    }

    if (!values.phone) {
      errors.phone = 'Phone is required';
    } else if (!/^01[0125][0-9]{8}$/.test(values.phone)) {
      errors.phone = 'Invalid phone number';
    }

    return errors;
  };
  let formik = useFormik ({
    initialValues : {
      name : '', 
      email: '' , 
      phone : '',
      userName: '',
      password : '', 
      rePassword : '',
    },onSubmit : (values)=>{ 
      // post data to api

      console.log(values)
    },validate
    
  })
  return <>
    <div className={`${darkMode? 'tw-dark' : ''}`}>
    <div className="container-fluid dark:tw-bg-gray-800 py-4" >

    <div className="container my-5  ">
    <motion.div
      initial={{ opacity: 0, x: -100 }} 
      animate={{ opacity: 1, x: 0 }}     
      transition={{ duration: 1 }}      
    >
      <div className="row w-75 mx-auto"  >
        <div className="col-lg-6 ps-1 tw-bg-gray-100 dark:tw-bg-gray-900">
        <div className={`${styles['bg-image']}`}>
        <div className={`${styles['layer']}`}>
              <p className='mainColor fs-2 fw-bolder d-flex justify-content-center align-items-center dark:tw-text-indigo-600 h-100'>UGM Family</p>
            </div>
            </div>

            
          
          
        </div>
        <div className="col-lg-6 tw-bg-gray-100 dark:tw-bg-gray-900 rounded-3 py-3">
          <form onSubmit={formik.handleSubmit}>
          <label htmlFor="name" className='mt-3 dark:tw-text-white'>Name :</label>
          <input onBlur={formik.handleBlur}  type="text" name='name' id='name' placeholder='Enter your name.' className='w-100 form-control mt-3' onChange={formik.handleChange} value={formik.values.name} />
          {formik.errors.name && formik.touched.name ? <div className=" text-danger w-75 " role="alert">{formik.errors.name}</div> :null}


          <label htmlFor="Email" className='mt-3 dark:tw-text-white'>Email :</label>
          <input onBlur={formik.handleBlur}  type="email" name='email' id='email' placeholder='Enter your email.' className='w-100 form-control mt-3' onChange={formik.handleChange} value={formik.values.email} />
          {formik.errors.email && formik.touched.email ? <div className="text-danger  w-100" role="alert">{formik.errors.email}</div> :null}


          <label htmlFor="Phone" className='mt-3 dark:tw-text-white'>Phone No. :</label>
          <input onBlur={formik.handleBlur}  type="tel" name='phone' id='Phone' placeholder='Enter your phone Number .' className='w-100 form-control mt-3' onChange={formik.handleChange} value={formik.values.phone} />
          {formik.errors.phone&& formik.touched.phone ? <div className="text-danger  w-75" role="alert">{formik.errors.phone}</div> :null}


          <label htmlFor="password" className='mt-3 dark:tw-text-white'>Password :</label>
          <input onBlur={formik.handleBlur}  type="password" name='password' id='password' placeholder='Enter your password .' className='w-100 form-control mt-3' onChange={formik.handleChange} value={formik.values.password} />
          {formik.errors.password && formik.touched.password ? <div className="text-danger  w-75" role="alert">{formik.errors.password}</div> :null}


          <label htmlFor="rePassword" className='mt-3 dark:tw-text-white'>Confrim Password :</label>
          <input onBlur={formik.handleBlur}  type="password" name='rePassword' id='rePassword' placeholder='Enter your Repassword .' className='w-100 form-control mt-3' onChange={formik.handleChange} value={formik.values.rePassword} />
          {formik.errors.rePassword && formik.touched.rePassword ? <div className="text-danger  w-75" role="alert">{formik.errors.rePassword}</div> :null}


          <button type='submit' disabled={!(formik.dirty && formik.isValid)} className='bg-main dark:tw-bg-indigo-600 text-white w-100 py-2 rounded-2 mt-4'>Register</button>
          </form>
        </div>
      </div>
      </motion.div>
    </div>
    </div>
    </div>
    </>
}
