import styles from './ServantDetails.module.css';
import { useFormik } from 'formik';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import React, { useContext, useEffect, useState } from 'react';
import { darkModeContext } from '../../Context/DarkModeContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from 'react-i18next';

export default function ServantDetails() {
  let location = useLocation();
  let navigate = useNavigate();
  let { darkMode } = useContext(darkModeContext);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [update, setUpdate] = useState(false);
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const daysOfWeek = [
    'Saturday',
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday'
  ];

  const formik = useFormik({
    initialValues: initialData || {
      firstName: '',
      secName: '',
      familyName: '',
      email: '',
      Address: '',
      Address2: '',
      mobileNumber1: '',
      mobileNumber2: '',
      landline: '',
      church: '',
      college: '',
      governorateOfBirth: '',
      maritalStatus: '',
      cohort: '',
      priestName: '',
      birthDay: '',
      birthMonth: '',
      birthYear: '',
      profession: '',
      dayOff: [],
      isExpatriate: false
    },
    validate,
    onSubmit: handleSubmit,
    enableReinitialize: true 
  });

  useEffect(() => {
    if (location.state?.person) {
      console.log("Initial data received:", location.state.person);
      setInitialData(location.state.person);
    }
  }, [location.state]);

  function validate(values) {
    let errors = {};
    if (!values.firstName) {
      errors.firstName = 'First name is required';
    } else if (values.firstName.length < 3 || values.firstName.length > 15) {
      errors.firstName = 'First name must be between 3 and 15 characters';
    }

    if (!values.secName) {
      errors.secName = 'Second name is required';
    } else if (values.secName.length < 3 || values.secName.length > 15) {
      errors.secName = 'Second name must be between 3 and 15 characters';
    }

    if (!values.familyName) {
      errors.familyName = 'Family name is required';
    } else if (values.familyName.length < 3 || values.familyName.length > 15) {
      errors.familyName = 'Family name must be between 3 and 15 characters';
    }

    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }

    if (!values.Address) {
      errors.Address = 'Address is required';
    }

    if (!values.mobileNumber1) {
      errors.mobileNumber1 = 'Mobile number is required';
    } else if (!/^01[0125][0-9]{8}$/.test(values.mobileNumber1)) {
      errors.mobileNumber1 = 'Invalid mobile number';
    }

    if (values.mobileNumber2 && !/^01[0125][0-9]{8}$/.test(values.mobileNumber2)) {
      errors.mobileNumber2 = 'Invalid mobile number';
    }

    if (values.landline && !/^(02|03)\d{7}$/.test(values.landline)) {
      errors.landline = 'Invalid landline number';
    }

    if (!values.church) {
      errors.church = 'Church is required';
    }

    if (!values.college) {
      errors.college = 'College or Institute is required';
    }

    if (!values.governorateOfBirth) {
      errors.governorateOfBirth = 'Governorate of birth is required';
    }

    if (!values.maritalStatus) {
      errors.maritalStatus = 'Marital status is required';
    }

    if (!values.cohort) {
      errors.cohort = 'Cohort is required';
    }

    if (!values.priestName) {
      errors.priestName = 'Priest name is required';
    }

    if (!values.birthYear) {
      errors.birthYear = 'Birth year is required';
    }

    return errors;
  }

 async function handleSubmit(values, { setSubmitting }) {
  console.log('Form submission started with values:', values);
  
  const token = localStorage.getItem('token');
  if (!token) {
    toast.error('Authentication token missing. Please login again.');
    setSubmitting(false);
    navigate('/login');
    return;
  }

  if (!initialData?._id) {
    toast.error('User ID not available');
    setSubmitting(false);
    return;
  }

  try {
    const submissionData = { ...values };
    
    ['_id', 'creatorId', 'createdAt', 'updatedAt', '__v'].forEach(field => {
      delete submissionData[field];
    });

    if (!Array.isArray(submissionData.dayOff)) {
      submissionData.dayOff = [];
    }

    console.log('Processed submission data:', submissionData);

    console.log('Sending PUT request to server...');
    const response = await axios.put(
      `https://ugmproject.vercel.app/api/v1/served/updateServed/${initialData._id}`,
      submissionData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000 
      }
    );

    console.log('Full server response:', response);

    if (response.status >= 200 && response.status < 300) {
      const successMessage = response.data?.message || 'Data updated successfully!';
      
      toast.success(successMessage, {
        duration: 4000,
        position: 'top-center',
      });

      // Update local state
      setInitialData(values);
      
      // Close edit mode and go back after delay
      setTimeout(() => {
        setUpdate(false);
        navigate(-1);
      }, 1500);
      
      return; // Exit early on success
    }

    // Handle non-success status codes
    throw new Error(response.data?.message || `Server returned status ${response.status}`);

  } catch (error) {
    console.error('Full error details:', error);
    
    // 4. Special case: Handle "Updated Successfully" message
    if (error.message.includes('Updated Successfully')) {
      // Silent treatment - it actually succeeded
      toast.success('Data updated successfully!', {
        duration: 4000,
        position: 'top-center',
      });
      setInitialData(values);
      setTimeout(() => setUpdate(false), 1000);
      return;
    }

    // 5. Normal error handling
    let errorMessage = 'Error updating data. Please try again.';
    
    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = 'Session expired. Please login again.';
        setTimeout(() => navigate('/login'), 2000);
      } else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      }
    } else if (error.request) {
      errorMessage = 'No response from server. Check your connection.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    if (!errorMessage.includes('Success')) {
      toast.error(errorMessage);
    }
    
  } finally {
    setSubmitting(false);
  }
}
  if (!initialData) {
    return <div className="tw-text-center tw-py-10">Loading servant data...</div>;
  }

  const goBack = () => {
    navigate(-1);
  }

  const InfoItem = ({ label, value }) => (
    <div className="col-12 col-md-6">
      <div className="tw-bg-gray-100 dark:tw-bg-gray-700 tw-rounded-md tw-p-3 tw-shadow-sm">
        <span className="tw-font-semibold">{label}:</span>
        <span className="tw-ml-2">{value || 'N/A'}</span>
      </div>
    </div>
  );

  return (
    <>
      <Toaster />
      <div className={`${darkMode ? 'tw-dark' : ''}`}>
        <div className="container-fluid dark:tw-bg-gray-800 py-4">
          <div className="container">
            <div className="row">
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}     
                transition={{ duration: 1 }}  
              >
                <h1 className='text-center mainColor dark:tw-text-indigo-600 mt-5 fw-bolder'>Servant Details</h1>

                <div className="container my-4">
                  <AnimatePresence mode="wait">
                    {!update ? (
                      <motion.div
                        key="details"
                        initial={{ opacity: 0, y: isRTL ? 10 : -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: isRTL ? 10 : -10 }}
                        transition={{ duration: 0.3 }}
                        className={`${styles.shad} tw-bg-white dark:tw-bg-gray-800 tw-shadow-md tw-rounded-xl tw-p-6 tw-text-gray-800 dark:tw-text-white tw-space-y-6`}
                      >
                        <button className='tw-my-1' onClick={goBack}>
                          <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <h2 className="tw-text-3xl tw-font-bold tw-text-center tw-text-indigo-600 dark:tw-text-indigo-400">
                          {initialData.firstName} {initialData.secName} {initialData.familyName}
                        </h2>

                        <div className="row g-4">
                          <InfoItem label="Email" value={initialData.email} />
                          <InfoItem
                            label="Birthdate"
                            value={`${initialData.birthDay}/${initialData.birthMonth}/${initialData.birthYear}`}
                          />
                          <InfoItem label="Address 1" value={initialData.Address} />
                          {initialData.Address2 && <InfoItem label="Address 2" value={initialData.Address2} />}
                          <InfoItem label="Is expatriate?" value={initialData.isExpatriate ? 'Yes' : 'No'} />
                          <InfoItem label="Mobile 1" value={initialData.mobileNumber1} />
                          {initialData.mobileNumber2 && <InfoItem label="Mobile 2" value={initialData.mobileNumber2} />}
                          {initialData.landline && <InfoItem label="Landline" value={initialData.landline} />}
                          <InfoItem label="Church" value={initialData.church} />
                          <InfoItem label="Priest Name" value={initialData.priestName} />
                          <InfoItem label="College / Institute" value={initialData.college} />
                          <InfoItem label="Governorate of birth" value={initialData.governorateOfBirth} />
                          <InfoItem label="Marital Status" value={initialData.maritalStatus} />
                          <InfoItem label="Cohort" value={initialData.cohort} />
                          {initialData.profession && <InfoItem label="Profession" value={initialData.profession} />}
                          {initialData.dayOff?.length > 0 && (
                            <InfoItem label="Days off" value={initialData.dayOff.join(' - ')} />
                          )}

                          <button
                            type="button"
                            className="bg-main mb-3 dark:tw-bg-indigo-600 text-white w-100 py-2 rounded-2"
                            onClick={() => setUpdate(true)}
                          >
                            Update
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="form"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className={`${styles.shad} tw-bg-gray-100 dark:tw-bg-gray-900 tw-px-4 tw-rounded-xl tw-shadow-md`}
                      >
                        <button className='tw-my-3' onClick={() => setUpdate(false)}>
                          <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        
                        <form onSubmit={formik.handleSubmit}>
                                         {/* Names Section */}
               <div className="tw-flex tw-flex-col md:tw-flex-row tw-gap-4">
          <div className="tw-flex tw-flex-col tw-w-full md:tw-w-[33%]">
            <label htmlFor="firstName" className="tw-mt-3 tw-font-bold dark:tw-text-white tw-text-lg">
              First Name:
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="Enter first name"
              className={`tw-form-control dark:tw-text-white  tw-mt-1 tw-py-2 tw-border tw-border-2 tw-rounded-lg ${
                formik.errors.firstName && formik.touched.firstName ? 'tw-border-red-500' : 'tw-border-gray-300'
              } tw-px-3 tw-bg-white dark:tw-bg-gray-800`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.firstName}
            />
            {formik.errors.firstName && formik.touched.firstName && (
              <div className="tw-text-red-500 tw-text-sm tw-mt-1" role="alert">
                {formik.errors.firstName}
              </div>
            )}
          </div>

          <div className="tw-flex tw-flex-col tw-w-full md:tw-w-[33%]">
            <label htmlFor="secName" className="tw-mt-3 tw-font-bold dark:tw-text-white tw-text-lg">
              Second Name:
            </label>
            <input
              type="text"
              name="secName"
              id="secName"
              placeholder="Enter second name"
              className={`tw-form-control dark:tw-text-white  tw-mt-1 tw-py-2 tw-border tw-border-2 tw-rounded-lg ${
                formik.errors.secName && formik.touched.secName ? 'tw-border-red-500' : 'tw-border-gray-300'
              } tw-px-3 tw-bg-white dark:tw-bg-gray-800`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.secName}
            />
            {formik.errors.secName && formik.touched.secName && (
              <div className="tw-text-red-500 tw-text-sm tw-mt-1" role="alert">
                {formik.errors.secName}
              </div>
            )}
          </div>

          <div className="tw-flex tw-flex-col tw-w-full md:tw-w-[34%]">
            <label htmlFor="familyName" className="tw-mt-3 tw-font-bold dark:tw-text-white tw-text-lg">
              Family Name:
            </label>
            <input
              type="text"
              name="familyName"
              id="familyName"
              placeholder="Enter family name"
              className={`tw-form-control dark:tw-text-white  tw-mt-1 tw-py-2 tw-border tw-border-2 tw-rounded-lg ${
                formik.errors.familyName && formik.touched.familyName ? 'tw-border-red-500' : 'tw-border-gray-300'
              } tw-px-3 tw-bg-white dark:tw-bg-gray-800`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.familyName}
            />
            {formik.errors.familyName && formik.touched.familyName && (
              <div className="tw-text-red-500 tw-text-sm tw-mt-1" role="alert">
                {formik.errors.familyName}
              </div>
            )}
          </div>
        </div>

        {/* Birthdate Section */}
        <div className="tw-w-full">
          <p className='tw-font-bold tw-mt-3 tw-text-lg dark:tw-text-white'>Birthdate:</p>
          <div className='tw-w-full tw-mt-3 tw-flex tw-flex-col md:tw-flex-row tw-gap-4'>
            <div className="tw-w-full md:tw-w-[30%]">
              <label htmlFor="birthDay" className="tw-text-lg dark:tw-text-white">Day:</label>
              <select 
                name="birthDay" 
                id="birthDay" 
                className='tw-px-3 tw-py-2 tw-border dark:tw-text-white  tw-border-2 tw-rounded-lg tw-bg-white dark:tw-bg-gray-800 tw-w-full'
                onChange={formik.handleChange}
                value={formik.values.birthDay}
              >
                {[...Array(31)].map((_, index) => (
                  <option key={index} value={index + 1}>{index + 1}</option>
                ))}
              </select>
            </div>
            <div className="tw-w-full md:tw-w-[30%]">
              <label htmlFor="birthMonth" className="tw-text-lg dark:tw-text-white">Month:</label>
              <select 
                name="birthMonth" 
                id="birthMonth" 
                className='tw-px-3 tw-py-2 dark:tw-text-white  tw-border tw-border-2 tw-rounded-lg tw-bg-white dark:tw-bg-gray-800 tw-w-full'
                onChange={formik.handleChange}
                value={formik.values.birthMonth}
              >
                {[...Array(12)].map((_, index) => (
                  <option key={index} value={index + 1}>{index + 1}</option>
                ))}
              </select>
            </div>
            <div className="tw-w-full md:tw-w-[30%]">
              <label htmlFor="birthYear" className="tw-text-lg dark:tw-text-white">Year:</label>
              <select 
                name="birthYear" 
                id="birthYear" 
                className='tw-px-3 tw-py-2 dark:tw-text-white  tw-border tw-border-2 tw-rounded-lg tw-bg-white dark:tw-bg-gray-800 tw-w-full'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.birthYear}
              >
                {[...Array(60)].map((_, index) => {
                  const year = new Date().getFullYear() - index;
                  return <option key={index} value={year}>{year}</option>;
                })}
              </select>
              {formik.errors.birthYear && formik.touched.birthYear && (
                <div className="tw-text-red-500 tw-text-sm tw-mt-1" role="alert">
                  {formik.errors.birthYear}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Email Section */}
        <div className="tw-w-full">
          <label htmlFor="email" className='tw-font-bold tw-text-lg dark:tw-text-white'>Email:</label>
          <input 
            type="text"  
            className={`tw-w-full dark:tw-text-white  tw-py-2 tw-mt-2 tw-border tw-border-2 tw-rounded-lg tw-px-3 tw-bg-white dark:tw-bg-gray-800 ${
              formik.errors.email && formik.touched.email ? 'tw-border-red-500' : 'tw-border-gray-300'
            }`}
            name='email' 
            id='email' 
            onChange={formik.handleChange} 
            value={formik.values.email}  
            onBlur={formik.handleBlur} 
          />
          {formik.errors.email && formik.touched.email && (
            <div className="tw-text-red-500 tw-text-sm tw-mt-1" role="alert">
              {formik.errors.email}
            </div>
          )}
        </div>

        {/* Address Section */}
        <div className="tw-w-full">
          <label htmlFor="Address" className='tw-font-bold tw-text-lg dark:tw-text-white'>Address:</label>
          <input 
            type="text"  
            className={`tw-w-full dark:tw-text-white  tw-py-2 tw-mt-2 tw-border tw-border-2 tw-rounded-lg tw-px-3 tw-bg-white dark:tw-bg-gray-800 ${
              formik.errors.Address && formik.touched.Address ? 'tw-border-red-500' : 'tw-border-gray-300'
            }`}
            name='Address' 
            id='Address' 
            onChange={formik.handleChange} 
            value={formik.values.Address}  
            onBlur={formik.handleBlur} 
          />
          {formik.errors.Address && formik.touched.Address && (
            <div className="tw-text-red-500 tw-text-sm tw-mt-1" role="alert">
              {formik.errors.Address}
            </div>
          )}
        </div>

        <div className="tw-w-full">
          <label htmlFor="Address2" className='tw-font-bold tw-text-lg dark:tw-text-white'>Address 2 (if available):</label>
          <input 
            type="text"  
            className='tw-w-full dark:tw-text-white  tw-py-2 tw-mt-2 tw-border tw-border-2 tw-rounded-lg tw-px-3 tw-bg-white dark:tw-bg-gray-800 tw-border-gray-300'
            name='Address2' 
            id='Address2' 
            onChange={formik.handleChange} 
            value={formik.values.Address2}  
            onBlur={formik.handleBlur} 
          />
        </div>

        {/* Expatriate Checkbox */}
        <div className="tw-flex tw-items-center tw-mt-4">
          <label htmlFor="isExpatriate" className="tw-ml-2 dark:tw-text-white tw-font-bold tw-me-2 tw-text-lg">
            Is expatriate?
          </label>
          <input
            type="checkbox"
            name="isExpatriate"
            id="isExpatriate"
            className="tw-h-5 tw-w-5 tw-text-indigo-600 tw-rounded tw-border-gray-300 focus:tw-ring-indigo-500"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            checked={formik.values.isExpatriate}
          />
        </div>

        {/* Contact Numbers Section */}
        <div className="tw-flex tw-flex-col md:tw-flex-row tw-gap-4">
          <div className="tw-flex tw-flex-col tw-w-full md:tw-w-[33%]">
            <label htmlFor="mobileNumber1" className="tw-mt-3 tw-font-bold dark:tw-text-white tw-text-lg">
              Mobile number 1:
            </label>
            <input
              type="text"
              name="mobileNumber1"
              id="mobileNumber1"
              placeholder="Enter mobile number (1)"
              className={`tw-form-control dark:tw-text-white  tw-mt-1 tw-py-2 tw-border tw-border-2 tw-rounded-lg tw-px-3 tw-bg-white dark:tw-bg-gray-800 ${
                formik.errors.mobileNumber1 && formik.touched.mobileNumber1 ? 'tw-border-red-500' : 'tw-border-gray-300'
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.mobileNumber1}
            />
            {formik.errors.mobileNumber1 && formik.touched.mobileNumber1 && (
              <div className="tw-text-red-500 tw-text-sm tw-mt-1" role="alert">
                {formik.errors.mobileNumber1}
              </div>
            )}
          </div>

          <div className="tw-flex tw-flex-col tw-w-full md:tw-w-[33%]">
            <label htmlFor="mobileNumber2" className="tw-mt-3 tw-font-bold dark:tw-text-white tw-text-lg">
              Mobile number 2 (if available):
            </label>
            <input
              type="text"
              name="mobileNumber2"
              id="mobileNumber2"
              placeholder="Enter mobile number (2)"
              className={`tw-form-control dark:tw-text-white  tw-mt-1 tw-py-2 tw-border tw-border-2 tw-rounded-lg tw-px-3 tw-bg-white dark:tw-bg-gray-800 ${
                formik.errors.mobileNumber2 && formik.touched.mobileNumber2 ? 'tw-border-red-500' : 'tw-border-gray-300'
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.mobileNumber2}
            />
            {formik.errors.mobileNumber2 && formik.touched.mobileNumber2 && (
              <div className="tw-text-red-500 tw-text-sm tw-mt-1" role="alert">
                {formik.errors.mobileNumber2}
              </div>
            )}
          </div>

          <div className="tw-flex tw-flex-col tw-w-full md:tw-w-[34%]">
            <label htmlFor="landline" className="tw-mt-3 tw-font-bold dark:tw-text-white tw-text-lg">
              Landline (if available):
            </label>
            <input
              type="text"
              name="landline"
              id="landline"
              placeholder="Enter landline number"
              className={`tw-form-control dark:tw-text-white  tw-mt-1 tw-py-2 tw-border tw-border-2 tw-rounded-lg tw-px-3 tw-bg-white dark:tw-bg-gray-800 ${
                formik.errors.landline && formik.touched.landline ? 'tw-border-red-500' : 'tw-border-gray-300'
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.landline}
            />
            {formik.errors.landline && formik.touched.landline && (
              <div className="tw-text-red-500 tw-text-sm tw-mt-1" role="alert">
                {formik.errors.landline}
              </div>
            )}
          </div>
        </div>

        {/* Church Section */}
        <div className="tw-w-full">
          <label htmlFor="church" className='tw-font-bold tw-text-lg dark:tw-text-white'>Church:</label>
          <input 
            type="text"  
            className={`tw-w-full dark:tw-text-white  tw-py-2 tw-mt-2 tw-border tw-border-2 tw-rounded-lg tw-px-3 tw-bg-white dark:tw-bg-gray-800 ${
              formik.errors.church && formik.touched.church ? 'tw-border-red-500' : 'tw-border-gray-300'
            }`}
            name='church' 
            id='church' 
            onChange={formik.handleChange} 
            value={formik.values.church}  
            onBlur={formik.handleBlur} 
          />
          {formik.errors.church && formik.touched.church && (
            <div className="tw-text-red-500 tw-text-sm tw-mt-1" role="alert">
              {formik.errors.church}
            </div>
          )}
        </div>

        {/* Priest Name */}
        <div className="tw-w-full">
          <label htmlFor="priestName" className='tw-font-bold tw-text-lg dark:tw-text-white'>Priest Name:</label>
          <input 
            type="text"  
            className={`tw-w-full tw-py-2 dark:tw-text-white  tw-mt-2 tw-border tw-border-2 tw-rounded-lg tw-px-3 tw-bg-white dark:tw-bg-gray-800 ${
              formik.errors.priestName && formik.touched.priestName ? 'tw-border-red-500' : 'tw-border-gray-300'
            }`}
            name='priestName' 
            id='priestName' 
            onChange={formik.handleChange} 
            value={formik.values.priestName}  
            onBlur={formik.handleBlur} 
          />
          {formik.errors.priestName && formik.touched.priestName && (
            <div className="tw-text-red-500 tw-text-sm tw-mt-1" role="alert">
              {formik.errors.priestName}
            </div>
          )}
        </div>

        {/* College and Governorate Section */}
        <div className="tw-flex tw-flex-col md:tw-flex-row tw-gap-4">
          <div className="tw-flex tw-flex-col tw-w-full md:tw-w-[50%]">
            <label htmlFor="college" className="tw-mt-3 tw-font-bold dark:tw-text-white tw-text-lg">
              College or Institute:
            </label>
            <input
              type="text"
              name="college"
              id="college"
              placeholder="Enter the college"
              className={`tw-form-control tw-mt-1 dark:tw-text-white  tw-py-2 tw-border tw-border-2 tw-rounded-lg tw-px-3 tw-bg-white dark:tw-bg-gray-800 ${
                formik.errors.college && formik.touched.college ? 'tw-border-red-500' : 'tw-border-gray-300'
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.college}
            />
            {formik.errors.college && formik.touched.college && (
              <div className="tw-text-red-500 tw-text-sm tw-mt-1" role="alert">
                {formik.errors.college}
              </div>
            )}
          </div>

          <div className="tw-flex tw-flex-col tw-w-full md:tw-w-[50%]">
            <label htmlFor="governorateOfBirth" className="tw-mt-3 tw-font-bold dark:tw-text-white tw-text-lg">
              Governorate of birth:
            </label>
            <input
              type="text"
              name="governorateOfBirth"
              id="governorateOfBirth"
              placeholder="Enter governorate of birth"
              className={`tw-form-control dark:tw-text-white  tw-mt-1 tw-py-2 tw-border tw-border-2 tw-rounded-lg tw-px-3 tw-bg-white dark:tw-bg-gray-800 ${
                formik.errors.governorateOfBirth && formik.touched.governorateOfBirth ? 'tw-border-red-500' : 'tw-border-gray-300'
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.governorateOfBirth}
            />
            {formik.errors.governorateOfBirth && formik.touched.governorateOfBirth && (
              <div className="tw-text-red-500 tw-text-sm tw-mt-1" role="alert">
                {formik.errors.governorateOfBirth}
              </div>
            )}
          </div>
        </div>

        {/* Marital Status and Cohort Section */}
        <div className="tw-flex tw-flex-col md:tw-flex-row tw-gap-4">
          <div className="tw-flex tw-flex-col tw-w-full md:tw-w-[50%]">
            <label htmlFor="maritalStatus" className="tw-mt-3 tw-font-bold dark:tw-text-white tw-text-lg">
              Marital status:
            </label>
            <select
              name="maritalStatus"
              id="maritalStatus"
              className={`tw-py-2 tw-mt-1 tw-border dark:tw-text-white   tw-border-2 tw-rounded-lg tw-px-3 tw-bg-white dark:tw-bg-gray-800 ${
                formik.errors.maritalStatus && formik.touched.maritalStatus ? 'tw-border-red-500' : 'tw-border-gray-300'
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.maritalStatus}
            >
              <option value="">Select status</option>
              <option value="Single">Single</option>
              <option value="Engaged">Engaged</option>
              <option value="Married">Married</option>
            </select>
            {formik.errors.maritalStatus && formik.touched.maritalStatus && (
              <div className="tw-text-red-500  tw-text-sm tw-mt-1" role="alert">
                {formik.errors.maritalStatus}
              </div>
            )}
          </div>

          <div className="tw-flex tw-flex-col tw-w-full md:tw-w-[50%]">
            <label htmlFor="cohort" className="tw-mt-3 tw-font-bold dark:tw-text-white tw-text-lg">
              Cohort:
            </label>
            <select
              name="cohort"
              id="cohort"
              className={`tw-py-2 dark:tw-text-white tw-mt-1 tw-border tw-border-2 tw-rounded-lg tw-px-3 tw-bg-white dark:tw-bg-gray-800 ${
                formik.errors.cohort && formik.touched.cohort ? 'tw-border-red-500' : 'tw-border-gray-300'
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.cohort}
            >
              <option value="">Select cohort</option>
              <option value="1st_University">1st Year University</option>
              <option value="2nd_University">2nd Year University</option>
              <option value="3rd_University">3rd Year University</option>
              <option value="4th_University">4th Year University</option>
              <option value="1_Graduate">1st Year Graduate</option>
              <option value="2_Graduate">2nd Year Graduate</option>
              <option value="3_Graduate">3rd Year Graduate</option>
              <option value="4_Graduate">4th Year Graduate</option>
              <option value="5_Graduate">5th Year Graduate</option>
            </select>
            {formik.errors.cohort && formik.touched.cohort && (
              <div className="tw-text-red-500 tw-text-sm tw-mt-1" role="alert">
                {formik.errors.cohort}
              </div>
            )}
          </div>
        </div>

        {/* Profession Section */}
        <div className="tw-flex tw-flex-col md:tw-flex-row tw-gap-4">
          <div className="tw-flex tw-flex-col tw-w-full md:tw-w-[50%]">
            <label htmlFor="profession" className="tw-mt-3 tw-font-bold dark:tw-text-white tw-text-lg">
              Profession (if available):
            </label>
            <input
              type="text"
              name="profession"
              id="profession"
              placeholder="Enter profession"
              className="tw-form-control dark:tw-text-white  tw-mt-1 tw-py-2 tw-border tw-border-2 tw-rounded-lg tw-px-3 tw-bg-white dark:tw-bg-gray-800 tw-border-gray-300"
              onChange={formik.handleChange}
              value={formik.values.profession}
            />
          </div>
        </div>

        {/* Day Off Section (Conditional) */}
        {formik.values.profession && (
          <div className="tw-flex tw-flex-col tw-w-full md:tw-w-[50%]">
            <label htmlFor="dayOff" className="tw-mt-3 tw-font-bold dark:tw-text-white tw-text-lg">
              Day off (Press Ctrl and select):
            </label>
            <select
              name="dayOff"
              id="dayOff"
              multiple
              size={5}
              className="tw-form-control dark:tw-text-white  tw-mt-1 tw-py-2 tw-border tw-border-2 tw-rounded-lg tw-px-3 tw-bg-white dark:tw-bg-gray-800 tw-border-gray-300"
              onChange={(e) => {
                const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
                formik.setFieldValue('dayOff', selectedOptions);
              }}
              value={formik.values.dayOff}
            >
              {daysOfWeek.map((day, index) => (
                <option 
                  key={index} 
                  value={day}
                  selected={formik.values.dayOff?.includes(day)}
                >
                  {day}
                </option>
              ))}
            </select>
          </div>
        )}

                          <button
                            type="submit"
                            className="tw-bg-indigo-600 my-3 dark:tw-bg-indigo-700 bg-main tw-text-white tw-w-full tw-py-3 tw-rounded-xl tw-font-bold hover:tw-bg-indigo-700 dark:hover:tw-bg-indigo-800 tw-transition-colors"
                            disabled={formik.isSubmitting}
                          >
                            {formik.isSubmitting ? (
                              <>
                                <span className="tw-inline-block tw-animate-spin tw-mr-2">
                                  <i className="fas fa-spinner"></i>
                                </span>
                                Updating...
                              </>
                            ) : 'Submit'}
                          </button>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
