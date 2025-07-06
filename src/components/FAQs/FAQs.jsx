import React, { useContext, useState } from 'react';
import styles from './FAQs.module.css';
import { darkModeContext } from '../../Context/DarkModeContext';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function FAQs() {
  const { darkMode } = useContext(darkModeContext);
  const { t, i18n } = useTranslation('faqs');
  const isRTL = i18n.language === 'ar';

  const faqList = [
    {
      question: t('q1.title'),
      answer: t('q1.answer')
    },
    {
      question: t('q2.title'),
      answer: t('q2.answer')
    },
    {
      question: t('q3.title'),
      answer: t('q3.answer')
    },
    {
      question: t('q4.title'),
      answer: t('q4.answer')
    },
    {
      question: t('q5.title'),
      answer: t('q5.answer')
    },
    {
      question: t('q6.title'),
      answer: t('q6.answer')
    }
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className={`${darkMode ? 'tw-dark' : ''}`}>
      <div className="container-fluid dark:tw-bg-gray-800 py-5" style={{ minHeight: '85vh' }}>
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="container">
            <h1 className="text-center fw-bolder dark:tw-text-indigo-600 mainColor">
              {t('title')}
            </h1>
            <p className="text-center tw-text-gray-600 fs-5 mt-2 dark:tw-text-white">
              {t('subtitle')}
            </p>

            <div className="accordion mt-5" id="faqsAccordion">
              {faqList.map((faq, index) => (
                <motion.div
                  className={`accordion-item mb-4 border border-0 shadow-lg rounded-4 overflow-hidden dark:tw-bg-gray-900 tw-bg-white`}
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button collapsed fw-semibold fs-5 px-4 py-4 tw-text-gray-800 dark:tw-bg-gray-900 dark:tw-text-white tw-bg-white d-flex align-items-center`}
                      type="button"
                      onClick={() => toggleAccordion(index)}
                      aria-expanded={activeIndex === index}
                      aria-controls={`faq-${index}`}
                      style={{ justifyContent: 'space-between', gap: '1rem' }}
                    >
                      <span
                        className="flex-grow-1"
                        style={{ textAlign: isRTL ? 'right' : 'left' }}
                      >
                        {faq.question}
                      </span>
                    </button>
                  </h2>

                  {/* Animated Answer */}
                  <motion.div
                    initial={false}
                    animate={activeIndex === index ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="accordion-body px-4 py-4 fs-6 tw-text-gray-700 dark:tw-text-white dark:tw-bg-gray-800 rounded-bottom">
                      {faq.answer}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
