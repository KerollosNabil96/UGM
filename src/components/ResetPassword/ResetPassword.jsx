import React, { useState, useContext } from 'react';
import { useFormik } from 'formik';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { darkModeContext } from '../../Context/DarkModeContext';
import styles from './ResetPassword.module.css';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useContext(darkModeContext);
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation("resetPassword");
  const isRTL = i18n.language === 'ar';

  const validate = (values) => {
    const errors = {};
    if (!values.password) {
      errors.password = t('resetPassword.password.errors.required');
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(values.password)) {
      errors.password = t('resetPassword.password.errors.invalid');
    }
    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = t('resetPassword.confirmPassword.errors.mismatch');
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: ''
    },
    validate,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await axios.post(
          `https://ugmproject.vercel.app/api/v1/user/resetPassword/${token}`,
          { newPassword: values.password }
        );
        
        console.log('Reset password success:', response.data);
        toast.success(t('resetPassword.success'));
        navigate('/signin');
      } catch (error) {
        console.error('Reset password error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          config: error.config
        });

        if (error.response) {
          // Server responded with a status code outside 2xx range
          if (error.response.status === 400) {
            if (error.response.data?.message?.includes('expired')) {
              toast.error(t('resetPassword.tokenExpired'));
            } else if (error.response.data?.message?.includes('invalid')) {
              toast.error(t('resetPassword.invalidToken'));
            } else {
              toast.error(error.response.data?.err || t('resetPassword.error'));
            }
          } else if (error.response.status === 404) {
            toast.error(t('resetPassword.tokenExpired'));
          } else if (error.response.status === 401) {
            toast.error(t('resetPassword.unauthorized'));
          } else {
            toast.error(t('resetPassword.error'));
          }
        } else if (error.request) {
          // Request was made but no response received
          toast.error(t('resetPassword.networkError'));
        } else {
          // Something happened in setting up the request
          toast.error(t('resetPassword.requestError'));
        }
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <div className={`${darkMode ? "tw-dark" : ""}`}>
      <div className={`container-fluid dark:tw-bg-gray-800 ${styles.mainContainer}`} style={{ minHeight: '80vh' }}>
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="container py-5 h-100"
        >
          <div className="row justify-content-center h-100">
            <div className={`col-12 col-md-8 col-lg-6 ${styles.formContainer} tw-bg-gray-100 dark:tw-bg-gray-900 rounded-4 p-4 p-md-5 d-flex flex-column justify-content-center`}>
              <h2 className={`text-center mb-4 ${styles.title} dark:tw-text-white`}>
                {t('resetPassword.title')}
              </h2>
              
              <form onSubmit={formik.handleSubmit} dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label dark:tw-text-white">
                    {t('resetPassword.password.label')}
                  </label>
                  <input
                    type="password"
                    className={`form-control ${formik.errors.password && formik.touched.password ? 'is-invalid' : ''}`}
                    id="password"
                    name="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                  />
                  {formik.errors.password && formik.touched.password && (
                    <div className="invalid-feedback d-block">
                      {formik.errors.password}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label dark:tw-text-white">
                    {t('resetPassword.confirmPassword.label')}
                  </label>
                  <input
                    type="password"
                    className={`form-control ${formik.errors.confirmPassword && formik.touched.confirmPassword ? 'is-invalid' : ''}`}
                    id="confirmPassword"
                    name="confirmPassword"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmPassword}
                  />
                  {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                    <div className="invalid-feedback d-block">
                      {formik.errors.confirmPassword}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !formik.isValid}
                  className={`btn ${styles.submitBtn} w-100 py-2`}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  ) : null}
                  {t('resetPassword.submit')}
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}