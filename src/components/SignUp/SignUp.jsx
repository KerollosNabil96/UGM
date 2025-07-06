import React, { useContext, useState } from 'react';
import styles from './SignUp.module.css';
import { useFormik } from 'formik';
import { darkModeContext } from '../../Context/DarkModeContext';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';


export default function SignUp() {
  const { darkMode } = useContext(darkModeContext);
  const { t } = useTranslation("signUp");
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      try {
        const { data } = await axios.post(
          'https://ugmproject.vercel.app/api/v1/user/signup',
          values,
          {
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
            },
          }
        );

        if (data.message === 'User created successfully') {
          navigate('/signin', { state: { successMessage: data.message } });
        }
      } catch (error) {
        const errorMessage = error.response?.data?.err || 'Signup failed.';
        if (errorMessage.includes('phone_1 dup key')) {
          toast.error('This phone number is already registered. Please use a different one.');
        } else if (errorMessage.includes('email_1 dup key')) {
          toast.error('This email is already registered. Please use a different one.');
        } else if (errorMessage.includes('userName_1 dup key')) {
          toast.error('This username is already taken. Please choose another one.');
        } else {
          toast.error(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <div className={`${darkMode ? 'tw-dark' : ''}`}>
      <div className="container-fluid dark:tw-bg-gray-800 py-4" >
        <div className="container my-5" style={{ minHeight: '66vh' }}>
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="row w-75 mx-auto">
              <div className="col-12 col-lg-6 px-0">

                <div className={`${styles['bg-image']}`}>
                  <div className={`${styles['layer']}`}>
                    <p className='mainColor fs-2 fw-bolder d-flex justify-content-center align-items-center dark:tw-text-indigo-600 h-100'>
                      UGM Family
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 tw-bg-gray-100 dark:tw-bg-gray-900 rounded-3 py-3">
                <form onSubmit={formik.handleSubmit}>
                  {/* Username */}
                  <label htmlFor="userName" className='mt-3 dark:tw-text-white'>{t('signUp.name.label')}</label>
                  <input type="text" name="userName" id="userName" className="w-100 form-control mt-3"
                    placeholder={t('signUp.name.placeholder')} onChange={formik.handleChange}
                    onBlur={formik.handleBlur} value={formik.values.userName} />
                  {formik.touched.userName && formik.errors.userName &&
                    <div className="text-danger w-75" role="alert">{formik.errors.userName}</div>}

                  {/* Email */}
                  <label htmlFor="email" className='mt-3 dark:tw-text-white'>{t('signUp.email.label')}</label>
                  <input type="email" name="email" id="email" className="w-100 form-control mt-3"
                    placeholder={t('signUp.email.placeholder')} onChange={formik.handleChange}
                    onBlur={formik.handleBlur} value={formik.values.email} />
                  {formik.touched.email && formik.errors.email &&
                    <div className="text-danger w-100" role="alert">{formik.errors.email}</div>}

                  {/* Phone */}
                  <label htmlFor="phone" className='mt-3 dark:tw-text-white'>{t('signUp.phone.label')}</label>
                  <input type="tel" name="phone" id="phone" className="w-100 form-control mt-3"
                    placeholder={t('signUp.phone.placeholder')} onChange={formik.handleChange}
                    onBlur={formik.handleBlur} value={formik.values.phone} />
                  {formik.touched.phone && formik.errors.phone &&
                    <div className="text-danger w-75" role="alert">{formik.errors.phone}</div>}

                  {/* Password */}
                  <label htmlFor="password" className='mt-3 dark:tw-text-white'>{t('signUp.password.label')}</label>
                  <input type="password" name="password" id="password" className="w-100 form-control mt-3"
                    placeholder={t('signUp.password.placeholder')} onChange={formik.handleChange}
                    onBlur={formik.handleBlur} value={formik.values.password} />
                  {formik.touched.password && formik.errors.password &&
                    <div className="text-danger w-75" role="alert">{formik.errors.password}</div>}

                  {/* RePassword */}
                  <label htmlFor="rePassword" className='mt-3 dark:tw-text-white'>{t('signUp.rePassword.label')}</label>
                  <input type="password" name="rePassword" id="rePassword" className="w-100 form-control mt-3"
                    placeholder={t('signUp.rePassword.placeholder')} onChange={formik.handleChange}
                    onBlur={formik.handleBlur} value={formik.values.rePassword} />
                  {formik.touched.rePassword && formik.errors.rePassword &&
                    <div className="text-danger w-75" role="alert">{formik.errors.rePassword}</div>}

                  {/* Submit */}
                  <button type="submit" disabled={!(formik.dirty && formik.isValid) || loading}
                    className="bg-main dark:tw-bg-indigo-600 text-white w-100 py-2 rounded-2 mt-4">
                    {loading ? <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> : null}
                    {loading ? 'Creating account...' : t('signUp.submit')}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
