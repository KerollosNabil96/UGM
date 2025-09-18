import React, { useContext } from 'react';
import { darkModeContext } from '../../Context/DarkModeContext';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';

const Meetings = () => {
  const { darkMode } = useContext(darkModeContext);

  const validationSchema = Yup.object({
    title: Yup.string()
      .min(3, 'Meeting title is too short (min 3 characters)')
      .max(100, 'Meeting title is too long (max 100 characters)')
      .required('Meeting title is required'),
    date: Yup.date()
      .min(new Date(), 'You cannot choose a past date')
      .required('Meeting date is required'),
  });

  const formik = useFormik({
    initialValues: { title: '', date: '' },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          'https://ugmproject.vercel.app/api/v1/attendanceMeeting/createMeeting',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          }
        );

        if (response.ok) {
          toast.success('Meeting created successfully!');
          resetForm();
          setTimeout(() => window.location.reload(), 1500);
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || 'Failed to create meeting');
        }
      } catch (error) {
        console.error('Error creating meeting:', error);
        toast.error('Network error, please try again');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div
      className={`tw-min-h-[80vh] tw-py-8 tw-px-4 ${
        darkMode
          ? 'tw-bg-gradient-to-br tw-from-gray-900 tw-to-gray-800 tw-text-white'
          : 'tw-bg-gradient-to-br tw-from-blue-50 tw-to-gray-100 tw-text-gray-900'
      }`}
    >
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: darkMode ? '#374151' : '#fff',
            color: darkMode ? '#fff' : '#374151',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
          success: { iconTheme: { primary: '#10B981', secondary: 'white' } },
          error: { iconTheme: { primary: '#EF4444', secondary: 'white' } },
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="tw-max-w-md tw-mx-auto"
      >
        <div
          className={`tw-rounded-2xl tw-shadow-xl tw-p-6 ${
            darkMode
              ? 'tw-bg-gray-800 tw-border tw-border-gray-700'
              : 'tw-bg-white tw-border tw-border-gray-100'
          }`}
        >
          <div className="tw-text-center tw-mb-6">
            <div className={`tw-inline-flex tw-items-center tw-justify-center tw-w-14 tw-h-14 tw-rounded-full tw-mb-3 ${
              darkMode 
                ? 'tw-bg-indigo-900 tw-text-indigo-200' 
                : 'bg-main tw-text-white'
            }`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="tw-h-7 tw-w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2
              className={`tw-text-2xl tw-font-bold ${
                darkMode ? 'tw-text-white' : 'tw-text-gray-800'
              }`}
            >
              Create New Meeting
            </h2>
            <p
              className={`tw-mt-1 tw-text-sm ${
                darkMode ? 'tw-text-gray-400' : 'tw-text-gray-600'
              }`}
            >
              Fill in the details below to create a new meeting
            </p>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="tw-mb-5">
              <label
                htmlFor="title"
                className={`tw-block tw-mb-2 tw-font-medium ${
                  darkMode ? 'tw-text-gray-300' : 'tw-text-gray-700'
                }`}
              >
                Meeting Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`tw-w-full tw-px-4 tw-py-3 tw-rounded-lg tw-focus:ring-2 tw-focus:border-transparent tw-transition-all ${
                  darkMode
                    ? 'tw-bg-gray-700 tw-border-gray-600 tw-text-white tw-placeholder-gray-400 focus:tw-ring-indigo-500'
                    : 'tw-bg-gray-50 tw-border-gray-200 tw-text-gray-900 tw-placeholder-gray-500 focus:tw-ring-main'
                } ${
                  formik.touched.title && formik.errors.title
                    ? 'tw-border-red-500'
                    : 'tw-border'
                }`}
                placeholder="Enter meeting title"
              />
              {formik.touched.title && formik.errors.title && (
                <div className="tw-mt-1 tw-text-sm tw-text-red-600 tw-flex tw-items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="tw-h-4 tw-w-4 tw-mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {formik.errors.title}
                </div>
              )}
            </div>

            <div className="tw-mb-6">
              <label
                htmlFor="date"
                className={`tw-block tw-mb-2 tw-font-medium ${
                  darkMode ? 'tw-text-gray-300' : 'tw-text-gray-700'
                }`}
              >
                Meeting Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formik.values.date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`tw-w-full tw-px-4 tw-py-3 tw-rounded-lg tw-focus:ring-2 tw-focus:border-transparent tw-transition-all ${
                  darkMode
                    ? 'tw-bg-gray-700 tw-border-gray-600 tw-text-white focus:tw-ring-indigo-500'
                    : 'tw-bg-gray-50 tw-border-gray-200 tw-text-gray-900 focus:tw-ring-main'
                } ${
                  formik.touched.date && formik.errors.date
                    ? 'tw-border-red-500'
                    : 'tw-border'
                }`}
              />
              {formik.touched.date && formik.errors.date && (
                <div className="tw-mt-1 tw-text-sm tw-text-red-600 tw-flex tw-items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="tw-h-4 tw-w-4 tw-mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {formik.errors.date}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className={`tw-w-full tw-py-3 tw-px-4 tw-rounded-lg tw-font-medium tw-transition-all tw-flex tw-items-center tw-justify-center ${
                formik.isSubmitting
                  ? 'tw-bg-gray-400 tw-cursor-not-allowed'
                  : darkMode 
                    ? 'tw-bg-indigo-600 hover:tw-bg-indigo-700 tw-text-white tw-shadow-md hover:tw-shadow-lg'
                    : 'bg-main hover:tw-bg-main-dark tw-text-white tw-shadow-md hover:tw-shadow-lg'
              }`}
            >
              {formik.isSubmitting ? (
                <>
                  <svg
                    className="tw-animate-spin tw-h-5 tw-w-5 tw-mr-2 tw-text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="tw-opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="tw-opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="tw-h-5 tw-w-5 tw-ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Create Meeting
                </>
              )}
            </button>
          </form>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`tw-mt-8 tw-rounded-2xl tw-shadow-xl tw-p-6 ${
            darkMode
              ? 'tw-bg-gray-800 tw-border tw-border-gray-700'
              : 'tw-bg-white tw-border tw-border-gray-100'
          }`}
        >
          <h3
            className={`tw-text-xl tw-font-bold tw-mb-4 tw-flex tw-items-center ${
              darkMode ? 'tw-text-white' : 'tw-text-gray-800'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`tw-h-5 tw-w-5 tw-ml-2 ${
                darkMode ? 'tw-text-indigo-400' : 'mainColor'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Instructions
          </h3>
          <ul
            className={`tw-space-y-3 ${
              darkMode ? 'tw-text-gray-300' : 'tw-text-gray-700'
            }`}
          >
            <li className="tw-flex tw-items-start">
              <span
                className={`tw-flex-shrink-0 tw-w-6 tw-h-6 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mr-2 tw-mt-0.5 ${
                  darkMode
                    ? 'tw-bg-indigo-900 tw-text-indigo-200'
                    : 'bg-main tw-text-white'
                }`}
              >
                1
              </span>
              Enter a clear and descriptive meeting title.
            </li>
            <li className="tw-flex tw-items-start">
              <span
                className={`tw-flex-shrink-0 tw-w-6 tw-h-6 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mr-2 tw-mt-0.5 ${
                  darkMode
                    ? 'tw-bg-indigo-900 tw-text-indigo-200'
                    : 'bg-main tw-text-white'
                }`}
              >
                2
              </span>
              Choose a future date for the meeting.
            </li>
            <li className="tw-flex tw-items-start">
              <span
                className={`tw-flex-shrink-0 tw-w-6 tw-h-6 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mr-2 tw-mt-0.5 ${
                  darkMode
                    ? 'tw-bg-indigo-900 tw-text-indigo-200'
                    : 'bg-main tw-text-white'
                }`}
              >
                3
              </span>
              Click “Create Meeting” to save the details.
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Meetings;