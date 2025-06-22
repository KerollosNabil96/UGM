import React, { useContext } from 'react'
import styles from './SignUp.module.css';
import { useFormik } from 'formik';
import signUpImage from '../../assets/92765ddf95236aa0d03442a27590c405.png';
import { darkModeContext } from '../../Context/DarkModeContext';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  let { darkMode } = useContext(darkModeContext);
  const { t } = useTranslation("signUp");
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();

  const validate = values => {
    const errors = {};

    if (!values.userName) {
      errors.userName = t('signUp.name.errors.required');
    } else if (values.userName.length < 3 || values.userName.length > 15) {
      errors.userName = t('signUp.name.errors.length');
    }

    if (!values.email) {
      errors.email = t('signUp.email.errors.required');
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = t('signUp.email.errors.invalid');
    }

    if (!values.password) {
      errors.password = t('signUp.password.errors.required');
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(values.password)) {
      errors.password = t('signUp.password.errors.invalid');
    }

    if (!values.rePassword) {
      errors.rePassword = t('signUp.rePassword.errors.required');
    } else if (values.rePassword !== values.password) {
      errors.rePassword = t('signUp.rePassword.errors.mismatch');
    }

    if (!values.phone) {
      errors.phone = t('signUp.phone.errors.required');
    } else if (!/^01[0125][0-9]{8}$/.test(values.phone)) {
      errors.phone = t('signUp.phone.errors.invalid');
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      userName: '',
      email: '',
      phone: '',
      password: '',
      rePassword: '',
    },
    validate,
    onSubmit: async (values) => {
      try {
        let { data } = await axios.post(
          'https://projectelkhdma-projectelkhdma.up.railway.app/api/v1/user/signup',
          {
            userName: values.userName,
            email: values.email,
            phone: values.phone,
            password: values.password,
            rePassword: values.rePassword,
          },
          {
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
            },
          }
        );

        console.log(data)

        if (data.message === 'User created successfully') {
          navigate('/signin');
          toast.success(data.message);
        }
      } catch (error) {
        console.log(error.response.data?.err)
        toast.error(error.response.data?.err || 'Signup failed.');
      }
    }
  });

  return (
    <>
      <div className={`${darkMode ? 'tw-dark' : ''}`}>
        <div className="container-fluid dark:tw-bg-gray-800 py-4">
          <Toaster position="top-right" />
          <div className="container my-5">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <div className="row w-75 mx-auto">
                <div className="col-lg-6 ps-1 tw-bg-gray-100 dark:tw-bg-gray-900">
                  <div className={`${styles['bg-image']}`}>
                    <div className={`${styles['layer']}`}>
                      <p className='mainColor fs-2 fw-bolder d-flex justify-content-center align-items-center dark:tw-text-indigo-600 h-100'>UGM Family</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 tw-bg-gray-100 dark:tw-bg-gray-900 rounded-3 py-3">
                  <form onSubmit={formik.handleSubmit}>

                    <label htmlFor="userName" className='mt-3 dark:tw-text-white'>{t('signUp.name.label')}</label>
                    <input
                      onBlur={formik.handleBlur}
                      type="text"
                      name='userName'
                      id='userName'
                      placeholder={t('signUp.name.placeholder')}
                      className='w-100 form-control mt-3'
                      onChange={formik.handleChange}
                      value={formik.values.userName}
                    />
                    {formik.errors.userName && formik.touched.userName ? (
                      <div className="text-danger w-75" role="alert">{formik.errors.userName}</div>
                    ) : null}

                    <label htmlFor="Email" className='mt-3 dark:tw-text-white'>{t('signUp.email.label')}</label>
                    <input
                      onBlur={formik.handleBlur}
                      type="email"
                      name='email'
                      id='email'
                      placeholder={t('signUp.email.placeholder')}
                      className='w-100 form-control mt-3'
                      onChange={formik.handleChange}
                      value={formik.values.email}
                    />
                    {formik.errors.email && formik.touched.email ? (
                      <div className="text-danger w-100" role="alert">{formik.errors.email}</div>
                    ) : null}

                    <label htmlFor="Phone" className='mt-3 dark:tw-text-white'>{t('signUp.phone.label')}</label>
                    <input
                      onBlur={formik.handleBlur}
                      type="tel"
                      name='phone'
                      id='Phone'
                      placeholder={t('signUp.phone.placeholder')}
                      className='w-100 form-control mt-3'
                      onChange={formik.handleChange}
                      value={formik.values.phone}
                    />
                    {formik.errors.phone && formik.touched.phone ? (
                      <div className="text-danger w-75" role="alert">{formik.errors.phone}</div>
                    ) : null}

                    <label htmlFor="password" className='mt-3 dark:tw-text-white'>{t('signUp.password.label')}</label>
                    <input
                      onBlur={formik.handleBlur}
                      type="password"
                      name='password'
                      id='password'
                      placeholder={t('signUp.password.placeholder')}
                      className='w-100 form-control mt-3'
                      onChange={formik.handleChange}
                      value={formik.values.password}
                    />
                    {formik.errors.password && formik.touched.password ? (
                      <div className="text-danger w-75" role="alert">{formik.errors.password}</div>
                    ) : null}

                    <label htmlFor="rePassword" className='mt-3 dark:tw-text-white'>{t('signUp.rePassword.label')}</label>
                    <input
                      onBlur={formik.handleBlur}
                      type="password"
                      name='rePassword'
                      id='rePassword'
                      placeholder={t('signUp.rePassword.placeholder')}
                      className='w-100 form-control mt-3'
                      onChange={formik.handleChange}
                      value={formik.values.rePassword}
                    />
                    {formik.errors.rePassword && formik.touched.rePassword ? (
                      <div className="text-danger w-75" role="alert">{formik.errors.rePassword}</div>
                    ) : null}

                    <button
                      type='submit'
                      disabled={!(formik.dirty && formik.isValid)}
                      className='bg-main dark:tw-bg-indigo-600 text-white w-100 py-2 rounded-2 mt-4'>
                      {t('signUp.submit')}
                    </button>

                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}
