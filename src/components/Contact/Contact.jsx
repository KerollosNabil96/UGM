import React, { useContext, useState } from 'react';
import styles from './Contact.module.css';
import { darkModeContext } from '../../Context/DarkModeContext';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Contact() {
  const { darkMode } = useContext(darkModeContext);
  const { t, i18n } = useTranslation('contact');
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    userName: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    const egyptianPhoneRegex = /^(010|011|012|015)[0-9]{8}$/;

    if (!formData.userName.trim()) {
      newErrors.userName = t('contact.errors.nameRequired');
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('contact.errors.phoneRequired');
    } else if (!egyptianPhoneRegex.test(formData.phone)) {
      newErrors.phone = t('contact.errors.phoneInvalid');
    }

    if (!formData.message.trim()) {
      newErrors.message = t('contact.errors.messageRequired');
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        await axios.post('https://ugmproject.vercel.app/api/v1/contact/addMessage', formData);
        toast.success(t('contact.form.success'));
        setFormData({ userName: '', phone: '', message: '' });
      } catch (err) {
        toast.error(t('contact.form.error'));
      }
    }
  };

  return (
    <div className={`${darkMode ? 'tw-dark' : ''}`}>
      <div className="container-fluid dark:tw-bg-gray-800">
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="container">
            <div className="row">
              <h1 className='text-center mt-5 fw-bolder dark:tw-text-white'>
                {t('contact.title.part1')} <span className="mainColor dark:tw-text-indigo-600">{t('contact.title.part2')}</span>
              </h1>
              <p className='tw-text-gray-500 dark:tw-text-white text-center fs-2 mt-2'>
                {t('contact.subtitle')}
              </p>

              <div className={`${styles.shad} my-4 col-sm-12 p-5 rounded-4 dark:tw-bg-gray-900`}>
                <div className={`${styles.child} p-4 rounded-4`}>
                  <div>
                    <span className='tw-text-responsive fw-bold'>{t('contact.details.meetingTime')}</span>
                    <span className='tw-text-responsive ms-2'>{t('contact.details.meetingValue')}</span>
                  </div>
                  <div className='py-3'>
                    <span className='tw-text-responsive fw-bold py-3'>{t('contact.details.location')}</span>
                    <span className='tw-text-responsive ms-2'>{t('contact.details.locationValue')}</span>
                  </div>
                  <div className='py-3'>
                    <span className='tw-text-responsive fw-bold py-3'>{t('contact.details.phone')}</span>
                    <span className='tw-text-responsive ms-2'>{t('contact.details.phoneValue')}</span>
                  </div>
                  <div>
                    <span className='tw-text-responsive fw-bold py-3'>{t('contact.details.email')}</span>
                    <span className='tw-text-responsive ms-2'>{t('contact.details.emailValue')}</span>
                  </div>
                </div>

                <form className='mt-5' onSubmit={handleSubmit}>
                  <div className="parent d-flex gap-3 justify-content-between">
                    <div className="w-100">
                      <input
                        type="text"
                        className={`${styles.child} w-100 py-4 rounded-4 px-3 border border-0`}
                        placeholder={t('contact.form.namePlaceholder')}
                        value={formData.userName}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, userName: value });

                          if (value.trim()) {
                            setErrors(prev => ({ ...prev, userName: '' }));
                          }
                        }}
                      />
                      {errors.userName && <p className="text-danger mt-1">{errors.userName}</p>}
                    </div>
                    <div className="w-100">
                      <input
                        type="text"
                        className={`${styles.child} w-100 py-4 px-3 rounded-4 border border-0`}
                        placeholder={t('contact.form.phonePlaceholder')}
                        value={formData.phone}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData({ ...formData, phone: value });

                          const egyptianPhoneRegex = /^(010|011|012|015)[0-9]{8}$/;
                          if (value.trim() && egyptianPhoneRegex.test(value)) {
                            setErrors(prev => ({ ...prev, phone: '' }));
                          }
                        }}
                      />
                      {errors.phone && <p className="text-danger mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="mt-4">
                    <textarea
                      placeholder={t('contact.form.messagePlaceholder')}
                      name="message"
                      id="message"
                      className={`${styles.child} ${styles.myArea} p-3 w-100 border border-0 mb-3 rounded-4`}
                      value={formData.message}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData({ ...formData, message: value });

                        if (value.trim()) {
                          setErrors(prev => ({ ...prev, message: '' }));
                        }
                      }}
                    ></textarea>
                    {errors.message && <p className="text-danger mt-1">{errors.message}</p>}
                  </div>

                  <div className="text-end">
                    <button
                      type="submit"
                      className={`bg-main text-white rounded-5 px-5 dark:tw-bg-indigo-600 py-3 mt-3`}
                    >
                      {t('contact.form.submitButton')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
