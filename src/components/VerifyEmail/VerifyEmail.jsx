import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { darkModeContext } from '../../Context/DarkModeContext';
import { useTranslation } from 'react-i18next';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { darkMode } = useContext(darkModeContext);
  const { t, i18n } = useTranslation('verify'); 
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setError(t('missingToken'));
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const res = await axios.get(`https://ugmproject.vercel.app/api/v1/user/verifyEmail?token=${token}`);
        setMessage(res.data.message || t('success'));

        // ✅ التوجيه بعد 3 ثواني فقط في حالة النجاح
        setTimeout(() => {
          window.location.href = 'https://ugm-family.vercel.app/signin';
        }, 3000);

      } catch (err) {
        setError(t('error'));
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [searchParams, t]);

  return (
    <div className={`${darkMode ? 'tw-dark' : ''}`}>
      <div className="container-fluid dark:tw-bg-gray-800">
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <div
            className="container d-flex justify-content-center align-items-center"
            style={{ minHeight: '80vh' }} 
          >
            <div className="tw-bg-white dark:tw-bg-gray-900 tw-p-12 tw-rounded-2xl tw-shadow-lg tw-text-center tw-w-full tw-max-w-xl"> {/* ✅ مربع أكبر */}
              <h2 className="tw-text-3xl tw-font-bold mb-6 dark:tw-text-white">
                {t('title')}
              </h2>

              {loading ? (
                <p className="tw-text-gray-600 dark:tw-text-gray-300">{t('loading')}</p>
              ) : error ? (
                <p className="tw-text-red-600 dark:tw-text-red-400 fw-bold fs-5">{error}</p>
              ) : (
                <>
                  <p className="tw-text-green-600 dark:tw-text-green-400 fw-bold fs-5">{message}</p>
                  <p className="tw-text-gray-500 dark:tw-text-gray-400 mt-3">{t('redirecting')}</p>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
