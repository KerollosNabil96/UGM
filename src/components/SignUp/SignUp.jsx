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

    // First Name validation
    if (!values.firstName) {
      errors.firstName = t('signUp.firstName.errors.required');
    } else if (values.firstName.length < 2 || values.firstName.length > 10) {
      errors.firstName = t('signUp.firstName.errors.length');
    }

    // Second Name validation
    if (!values.secName) {
      errors.secName = t('signUp.secName.errors.required');
    } else if (values.secName.length < 2 || values.secName.length > 10) {
      errors.secName = t('signUp.secName.errors.length');
    }

    // Family Name validation
    if (!values.familyName) {
      errors.familyName = t('signUp.familyName.errors.required');
    } else if (values.familyName.length < 2 || values.familyName.length > 10) {
      errors.familyName = t('signUp.familyName.errors.length');
    }

    // Email validation
    if (!values.email) {
      errors.email = t('signUp.email.errors.required');
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = t('signUp.email.errors.invalid');
    }

    // Password validation
    if (!values.password) {
      errors.password = t('signUp.password.errors.required');
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(values.password)) {
      errors.password = t('signUp.password.errors.invalid');
    }

    // RePassword validation
    if (!values.rePassword) {
      errors.rePassword = t('signUp.rePassword.errors.required');
    } else if (values.rePassword !== values.password) {
      errors.rePassword = t('signUp.rePassword.errors.mismatch');
    }

    // Phone validation
    if (!values.phone) {
      errors.phone = t('signUp.phone.errors.required');
    } else if (!/^01[0125][0-9]{8}$/.test(values.phone)) {
      errors.phone = t('signUp.phone.errors.invalid');
    }

    // Birth Date validation
    if (!values.birthDate) {
      errors.birthDate = t('signUp.birthDate.errors.required');
    } else {
      const birthDate = new Date(values.birthDate);
      const today = new Date();
      const minDate = new Date();
      minDate.setFullYear(today.getFullYear() - 100); // 100 years ago
      const maxDate = new Date();
      maxDate.setFullYear(today.getFullYear() - 13); // At least 13 years old

      if (birthDate < minDate) {
        errors.birthDate = t('signUp.birthDate.errors.tooOld');
      } else if (birthDate > maxDate) {
        errors.birthDate = t('signUp.birthDate.errors.tooYoung');
      }
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      firstName: '',
      secName: '',
      familyName: '',
      email: '',
      phone: '',
      password: '',
      rePassword: '',
      birthDate: '',
    },
    validate,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const requestData = {
          firstName: values.firstName,
          secName: values.secName,
          familyName: values.familyName,
          email: values.email,
          phone: values.phone,
          password: values.password,
          rePassword: values.rePassword,
          birthDate: values.birthDate
        };

        const { data } = await axios.post(
          'https://ugmproject.vercel.app/api/v1/user/signup',
          requestData,
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
                  {/* First Name */}
                  <label htmlFor="firstName" className='mt-3 dark:tw-text-white'>{t('signUp.firstName.label')}</label>
                  <input type="text" name="firstName" id="firstName" className="w-100 form-control mt-3"
                    placeholder={t('signUp.firstName.placeholder')} onChange={formik.handleChange}
                    onBlur={formik.handleBlur} value={formik.values.firstName} />
                  {formik.touched.firstName && formik.errors.firstName &&
                    <div className="text-danger w-75" role="alert">{formik.errors.firstName}</div>}

                  {/* Second Name */}
                  <label htmlFor="secName" className='mt-3 dark:tw-text-white'>{t('signUp.secName.label')}</label>
                  <input type="text" name="secName" id="secName" className="w-100 form-control mt-3"
                    placeholder={t('signUp.secName.placeholder')} onChange={formik.handleChange}
                    onBlur={formik.handleBlur} value={formik.values.secName} />
                  {formik.touched.secName && formik.errors.secName &&
                    <div className="text-danger w-75" role="alert">{formik.errors.secName}</div>}

                  {/* Family Name */}
                  <label htmlFor="familyName" className='mt-3 dark:tw-text-white'>{t('signUp.familyName.label')}</label>
                  <input type="text" name="familyName" id="familyName" className="w-100 form-control mt-3"
                    placeholder={t('signUp.familyName.placeholder')} onChange={formik.handleChange}
                    onBlur={formik.handleBlur} value={formik.values.familyName} />
                  {formik.touched.familyName && formik.errors.familyName &&
                    <div className="text-danger w-75" role="alert">{formik.errors.familyName}</div>}

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

                  {/* Birth Date */}
                  <label htmlFor="birthDate" className='mt-3 dark:tw-text-white'>{t('signUp.birthDate.label')}</label>
                  <input type="date" name="birthDate" id="birthDate" className="w-100 form-control mt-3"
                    onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.birthDate} />
                  {formik.touched.birthDate && formik.errors.birthDate &&
                    <div className="text-danger w-75" role="alert">{formik.errors.birthDate}</div>}

                  {/* Password */}
                  <label htmlFor="password" className='mt-3 dark:tw-text-white'>{t('signUp.password.label')}</label>
                  <input type="password" name="password" id="password" className="w-100 form-control mt-3"
                    placeholder={t('signUp.password.placeholder')} onChange={formik.handleChange}
                    onBlur={formik.handleBlur} value={formik.values.password} />
                  {formik.touched.password && formik.errors.password &&
                    <div className="text-danger w-75" role="alert">{formik.errors.password}</div>}

                  {/* RePassword */}
                  <label htmlFor="rePassword" className='mt-3 dark:tw-text-white'>{t('signUp.rePassword.label')}</label>
                  <input
                    type="password"
                    name="rePassword" 
                    id="rePassword"
                    className="w-100 form-control mt-3"
                    placeholder={t('signUp.rePassword.placeholder')}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.rePassword}
                  />
                  {formik.touched.rePassword && formik.errors.rePassword && (
                    <div className="text-danger w-75" role="alert">{formik.errors.rePassword}</div>
                  )}

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