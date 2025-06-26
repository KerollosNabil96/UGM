
import React, { useContext, useState } from 'react';
import styles from './ServantInfo.module.css';
import { darkModeContext } from '../../Context/DarkModeContext';
import { useFormik } from 'formik';
import { motion } from "motion/react"
import axios, { Axios } from 'axios';
import { div } from 'motion/react-client';
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';



export default function ServantInfo() {
  let { darkMode } = useContext(darkModeContext);
  const [isSubmitted, setisSubmitted] = useState(false)
    const { t } = useTranslation('servantInfo'); 
      const { i18n } = useTranslation();
      const isRTL = i18n.language === 'ar';
    
  

  const daysOfWeek = [
    (t('servantInfo.weekDays.1')),
    (t('servantInfo.weekDays.2')),
    (t('servantInfo.weekDays.3')),
    (t('servantInfo.weekDays.4')),
    (t('servantInfo.weekDays.5')),
    (t('servantInfo.weekDays.6')),
    (t('servantInfo.weekDays.7'))
  ];

  const validate = (values) => {
    let errors = {};
    
    if (!values.firstName) {
      errors.firstName = (t('servantInfo.validation.firstNamerequired'));
    } else if (values.firstName.length < 3 || values.firstName.length > 15) {
      errors.firstName = (t('servantInfo.validation.firstNameLength'));
    }

    if (!values.secName) {
      errors.secName = (t('servantInfo.validation.secNamerequired'));
    } else if (values.secName.length < 3 || values.secName.length > 15) {
      errors.secName = (t('servantInfo.validation.secNameLength'));
    }

    if (!values.familyName) {
      errors.familyName = (t('servantInfo.validation.familyNamerequired'));
    } else if (values.familyName.length < 3 || values.familyName.length > 15) {
      errors.familyName = (t('servantInfo.validation.familyNameLength'));
    }

    if (!values.email) {
      errors.email = (t('servantInfo.validation.emailRequired'));
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = (t('servantInfo.validation.invalidEmail'));
    }

    if (!values.Address) {
      errors.Address = (t('servantInfo.validation.addressRequierd'));
    }

    if (!values.mobileNumber1) {
      errors.mobileNumber1 = (t('servantInfo.validation.mobileRequierd'));
    } else if (!/^01[0125][0-9]{8}$/.test(values.mobileNumber1)) {
      errors.mobileNumber1 = (t('servantInfo.validation.invalidPhone'));
    }

    if (values.mobileNumber2 && !/^01[0125][0-9]{8}$/.test(values.mobileNumber2)) {
      errors.mobileNumber2 = (t('servantInfo.validation.invalidPhone'));
    }

    if (values.landline && !/^(02|03)\d{7}$/.test(values.landline)) {
      errors.landline = (t('servantInfo.validation.invalidLandline'));
    }

    if (!values.church) {
      errors.church = (t('servantInfo.validation.ChurchRequierd'));
    }

    if (!values.college) {
      errors.college = (t('servantInfo.validation.collegeٌRequierd'));
    }

    if (!values.governorateOfBirth) {
      errors.governorateOfBirth = (t('servantInfo.validation.governorateOfBirth'));
    }

    if (!values.maritalStatus) {
      errors.maritalStatus = (t('servantInfo.validation.maritalRequierd'));
    }

    if (!values.cohort) {
      errors.cohort = (t('servantInfo.validation.CohortRequierd'));
    }

    if (!values.priestName) {
      errors.priestName = (t('servantInfo.validation.priestNameRequierd'));
    }

    if (!values.birthYear) {
      errors.birthYear = 'Birth year is required';
    }

    return errors;
  };

const onSubmit = async (values, { setSubmitting }) => {
  try {
    const token = localStorage.getItem('token'); 

    if (!token) {
      throw new Error("User is not authenticated");
    }


    const response = await axios.post(
  'https://ugmproject.vercel.app/api/v1/served/addServed',
  values,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
);

    if (response.status === 201) {
      setisSubmitted(true);
      toast.success('Data submitted successfully!', {
        duration: 4000,
        position: 'top-center',
      });
      formik.resetForm();
    }
  } catch (error) {
    console.error('Submission error:', error);
    toast.error('An error occurred while submitting. Please try again.', {
      duration: 4000,
      position: 'top-center',
    });
  } finally {
    setSubmitting(false);
          console.log(values)

  }
};


  const formik = useFormik({
    initialValues: {
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
    onSubmit
  });

  return (
    <div className={`${darkMode ? 'tw-dark' : ''}`}>
      <div className="container-fluid dark:tw-bg-gray-800 py-4">
        <div className="container my-5">
        <Toaster
      toastOptions={{
        className: '',
        style: {
          border: '1px solid #713200',
          padding: '16px',
          color: '#713200',
        },
      }}
    />
          <motion.div
                initial={{ opacity: 0, x: isRTL ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}     
                transition={{ duration: 1 }}  
              >
        <h1 className="text-center  mainColor dark:tw-text-indigo-600 mt-2 fw-bolder">{t('servantInfo.title')}</h1>
<p className="text-center mb-4  fs-4 tw-text-gray-600 dark:tw-text-white text-sm">
  {t('servantInfo.description1')}<br />  {t('servantInfo.description2')}
</p>
          <div className="row w-75 mx-auto">
            <div className={`${styles.shad} col-12 tw-bg-gray-100 dark:tw-bg-gray-900 px-4 rounded-4`}>
              <form onSubmit={formik.handleSubmit} noValidate>
                {/* Names Section */}
                <div className="names tw-flex tw-flex-col md:tw-flex-row tw-gap-3">
                  <div className="tw-flex tw-flex-col tw-w-full md:tw-w-[33%]">
                    <label htmlFor="firstName" className="tw-mt-3 fw-bold dark:tw-text-white tw-text-responsive2">
                    {t('servantInfo.labels.firstName')}
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      placeholder={t('servantInfo.placeholders.firstName')}
                      className={`tw-form-control tw-mt-1 py-2 border border-2 rounded-2 ${
                        formik.errors.firstName && formik.touched.firstName ? 'is-invalid' : ''
                      }`}
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
                    <label htmlFor="secName" className="tw-mt-3 fw-bold dark:tw-text-white tw-text-responsive2">
                    {t('servantInfo.labels.secName')}
                    </label>
                    <input
                      type="text"
                      name="secName"
                      id="secName"
                      placeholder={t('servantInfo.placeholders.secName')}
                      className={`tw-form-control tw-mt-1 py-2 border border-2 rounded-2 ${
                        formik.errors.secName && formik.touched.secName ? 'is-invalid' : ''
                      }`}
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
                    <label htmlFor="familyName" className="tw-mt-3 fw-bold dark:tw-text-white tw-text-responsive2">
                    {t('servantInfo.labels.familyName')}
                    </label>
                    <input
                      type="text"
                      name="familyName"
                      id="familyName"
                      placeholder={t('servantInfo.placeholders.familyName')}
                      className={`tw-form-control tw-mt-1 py-2 border border-2 rounded-2 ${
                        formik.errors.familyName && formik.touched.familyName ? 'is-invalid' : ''
                      }`}
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
                <p className='fw-bold mt-3 tw-text-responsive2 dark:tw-text-white'>{t('servantInfo.labels.birthdate')}</p>
                <div className='dateOfBirth w-100 mt-3 tw-flex tw-flex-col md:tw-flex-row'>
                  <div className="tw-w-full md:tw-w-[30%]">
                    <label htmlFor="birthDay" className="tw-text-responsive2 dark:tw-text-white"> {t('servantInfo.labels.day')}</label>
                    <select 
                      name="birthDay" 
                      id="birthDay" 
                      className='tw-px-2 ms-2'
                      onChange={formik.handleChange}
                      value={formik.values.birthDay}
                    >
                      {[...Array(31)].map((_, index) => (
                        <option key={index} value={index + 1}>{index + 1}</option>
                      ))}
                    </select>
                  </div>
                  <div className="tw-w-full md:tw-mt-0 tw-mt-3 md:tw-w-[30%]">
                    <label htmlFor="birthMonth" className="tw-text-responsive2 dark:tw-text-white">{t('servantInfo.labels.month')}</label>
                    <select 
                      name="birthMonth" 
                      id="birthMonth" 
                      className='tw-px-2 ms-2'
                      onChange={formik.handleChange}
                      value={formik.values.birthMonth}
                    >
                      {[...Array(12)].map((_, index) => (
                        <option key={index} value={index + 1}>{index + 1}</option>
                      ))}
                    </select>
                  </div>
                  <div className="tw-w-full md:tw-mt-0 tw-mt-3 md:tw-w-[30%]">
                    <label htmlFor="birthYear" className="tw-text-responsive2 dark:tw-text-white">{t('servantInfo.labels.year')}</label>
                    <select 
                      name="birthYear" 
                      id="birthYear" 
                      className='tw-px-2 ms-2'
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

                {/* Email Section */}
                <div className="email my-3 w-100">
                  <label htmlFor="email" className='fw-bold tw-text-responsive2 dark:tw-text-white'>{t('servantInfo.labels.email')} :</label>
                  <input 
                    type="text"  
                    className='w-100 py-2 mt-2 border border-2 rounded-2' 
                    name='email' 
                    id='email' 
                    onChange={formik.handleChange} 
                    value={formik.values.email}  
                    onBlur={formik.handleBlur} 
                  />
                  {formik.errors.email && formik.touched.email && (
                    <div className="text-danger w-100" role="alert">
                      {formik.errors.email}
                    </div>
                  )}
                </div>

                {/* Address Section */}
                <div className="Address tw-text-responsive2 my-3 w-100">
                  <label htmlFor="Address" className='fw-bold dark:tw-text-white'>{t('servantInfo.labels.address')} :</label>
                  <input 
                    type="text"  
                    className='w-100 py-2 mt-2 border border-2 rounded-2' 
                    name='Address' 
                    id='Address' 
                    onChange={formik.handleChange} 
                    value={formik.values.Address}  
                    onBlur={formik.handleBlur} 
                  />
                  {formik.errors.Address && formik.touched.Address && (
                    <div className="text-danger w-100" role="alert">
                      {formik.errors.Address}
                    </div>
                  )}
                </div>

                <div className="Address2 tw-text-responsive2 my-3 w-100">
                  <label htmlFor="Address2" className='fw-bold dark:tw-text-white'>{t('servantInfo.labels.address2')} :</label>
                  <input 
                    type="text"  
                    className='w-100 py-2 mt-2 border border-2 rounded-2' 
                    name='Address2' 
                    id='Address2' 
                    onChange={formik.handleChange} 
                    value={formik.values.Address2}  
                    onBlur={formik.handleBlur} 
                  />
                </div>

                {/* Expatriate Checkbox */}
                <div className="tw-flex tw-flex-col tw-w-full md:tw-w-[100%]">
                  <div className="tw-flex tw-items-center tw-mt-4">
                    <label htmlFor="isExpatriate" className="tw-ml-2 dark:tw-text-white fw-bold me-2 tw-block tw-text-responsive2">
                    {t('servantInfo.labels.isExpatriate')}
                    </label>
                    <input
                      type="checkbox"
                      name="isExpatriate"
                      id="isExpatriate"
                      className="tw-h-4 tw-w-4 tw-text-blue-600 tw-rounded tw-border-gray-300 focus:tw-ring-blue-500"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      checked={formik.values.isExpatriate}
                    />
                  </div>
                </div>

                {/* Contact Numbers Section */}
                <div className="mobiles tw-flex tw-flex-col md:tw-flex-row tw-gap-3 mt-3">
                  <div className="tw-flex tw-flex-col tw-w-full md:tw-w-[33%]">
                    <label htmlFor="mobileNumber1" className="tw-mt-3 fw-bold dark:tw-text-white tw-text-responsive2">
                    {t('servantInfo.labels.mobile1')}
                    </label>
                    <input
                      type="text"
                      name="mobileNumber1"
                      id="mobileNumber1"
                      placeholder={t('servantInfo.placeholders.mobile1')}
                      className={`tw-form-control tw-mt-1 py-2 border border-2 rounded-2 ${
                        formik.errors.mobileNumber1 && formik.touched.mobileNumber1 ? 'is-invalid' : ''
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
                    <label htmlFor="mobileNumber2" className="tw-mt-3 fw-bold dark:tw-text-white tw-text-responsive2">
                    {t('servantInfo.labels.mobile2')}
                    </label>
                    <input
                      type="text"
                      name="mobileNumber2"
                      id="mobileNumber2"
                      placeholder={t('servantInfo.placeholders.mobile2')}
                      className={`tw-form-control tw-mt-1 py-2 border border-2 rounded-2 ${
                        formik.errors.mobileNumber2 && formik.touched.mobileNumber2 ? 'is-invalid' : ''
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
                    <label htmlFor="landline" className="tw-mt-3 fw-bold dark:tw-text-white tw-text-responsive2">
                    {t('servantInfo.labels.landline')}
                    </label>
                    <input
                      type="text"
                      name="landline"
                      id="landline"
                      placeholder={t('servantInfo.placeholders.landline')}
                      className={`tw-form-control tw-mt-1 py-2 border border-2 rounded-2 ${
                        formik.errors.landline && formik.touched.landline ? 'is-invalid' : ''
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
                <div className="church tw-text-responsive2 my-3 w-100">
                  <label htmlFor="church" className='fw-bold dark:tw-text-white'>{t('servantInfo.labels.church')}</label>
                  <input 
                    type="text"  
                    className='w-100 py-2 mt-2 border border-2 rounded-2' 
                    name='church' 
                    id='church' 
                    onChange={formik.handleChange} 
                    value={formik.values.church}  
                    onBlur={formik.handleBlur} 
                  />
                  {formik.errors.church && formik.touched.church && (
                    <div className="text-danger w-100" role="alert">
                      {formik.errors.church}
                    </div>
                  )}
                </div>

                {/* Priest Name */}
                <div className="priestName tw-text-responsive2 my-3 w-100">
                  <label htmlFor="priestName" className='fw-bold dark:tw-text-white'>{t('servantInfo.labels.priestName')}</label>
                  <input 
                    type="text"  
                    className='w-100 py-2 mt-2 border border-2 rounded-2' 
                    name='priestName' 
                    id='priestName' 
                    onChange={formik.handleChange} 
                    value={formik.values.priestName}  
                    onBlur={formik.handleBlur} 
                  />
                  {formik.errors.priestName && formik.touched.priestName && (
                    <div className="text-danger w-100" role="alert">
                      {formik.errors.priestName}
                    </div>
                  )}
                </div>

                {/* College and Governorate Section */}
                <div className="tw-flex tw-flex-col md:tw-flex-row tw-gap-3">
                  <div className="tw-flex tw-flex-col tw-w-full md:tw-w-[50%]">
                    <label htmlFor="college" className="tw-mt-3 fw-bold dark:tw-text-white tw-text-responsive2">
                    {t('servantInfo.labels.college')} :
                    </label>
                    <input
                      type="text"
                      name="college"
                      id="college"
                      placeholder={t('servantInfo.placeholders.college')}
                      className={`tw-form-control tw-mt-1 py-2 border border-2 rounded-2 ${
                        formik.errors.college && formik.touched.college ? 'is-invalid' : ''
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
                    <label htmlFor="governorateOfBirth" className="tw-mt-3 fw-bold dark:tw-text-white tw-text-responsive2">
                    {t('servantInfo.labels.governorateOfBirth')}
                    </label>
                    <input
                      type="text"
                      name="governorateOfBirth"
                      id="governorateOfBirth"
                      placeholder={t('servantInfo.placeholders.governorate')}
                      className={`tw-form-control tw-mt-1 py-2 border border-2 rounded-2 ${
                        formik.errors.governorateOfBirth && formik.touched.governorateOfBirth ? 'is-invalid' : ''
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
                <div className="tw-flex tw-flex-col md:tw-flex-row tw-gap-3 mt-3">
                  <div className="tw-flex tw-flex-col tw-w-full md:tw-w-[50%]">
                    <label htmlFor="maritalStatus" className="tw-mt-3 fw-bold dark:tw-text-white tw-text-responsive2">
                    {t('servantInfo.labels.maritalStatus')}:
                    </label>
                    <select
                      name="maritalStatus"
                      id="maritalStatus"
                      className={`py-2 border border-2 rounded-2 ${
                        formik.errors.maritalStatus && formik.touched.maritalStatus ? 'is-invalid' : ''
                      }`}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.maritalStatus}
                    >
                <option value="">{t('servantInfo.options.selectStatus')}</option>
                <option value="Single">{t('servantInfo.options.status.single')}</option>
                <option value="Engaged">{t('servantInfo.options.status.engaged')}</option>
                <option value="Married">{t('servantInfo.options.status.married')}</option>
                    </select>
                    {formik.errors.maritalStatus && formik.touched.maritalStatus && (
                      <div className="tw-text-red-500 tw-text-sm tw-mt-1" role="alert">
                        {formik.errors.maritalStatus}
                      </div>
                    )}
                  </div>

                  <div className="tw-flex tw-flex-col tw-w-full md:tw-w-[50%]">
                    <label htmlFor="cohort" className="tw-mt-3 fw-bold dark:tw-text-white tw-text-responsive2">
                    {t('servantInfo.labels.cohort')}
                    </label>
                    <select
                      name="cohort"
                      id="cohort"
                      className={`py-2 border border-2 rounded-2 ${
                      formik.errors.cohort && formik.touched.cohort ? 'is-invalid' : ''
                      }`}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.cohort}
                    >
                      <option value="">{t('servantInfo.options.selectCohort')} </option>
                      <option value="1st_University">{t('servantInfo.options.cohorts.1')}</option>
                      <option value="2nd_University">{t('servantInfo.options.cohorts.2')}</option>
                      <option value="3rd_University">{t('servantInfo.options.cohorts.3')}</option>
                      <option value="4th_University">{t('servantInfo.options.cohorts.4')}</option>
                      <option value="1_Graduate">{t('servantInfo.options.cohorts.g1')}</option>
                      <option value="2_Graduate">{t('servantInfo.options.cohorts.g2')}</option>
                      <option value="3_Graduate">{t('servantInfo.options.cohorts.g3')}</option>
                      <option value="4_Graduate">{t('servantInfo.options.cohorts.g4')}</option>
                      <option value="5_Graduate">{t('servantInfo.options.cohorts.g5')}</option>
                    </select>
                    {formik.errors.cohort && formik.touched.cohort && (
                      <div className="tw-text-red-500 tw-text-sm tw-mt-1" role="alert">
                        {formik.errors.cohort}
                      </div>
                    )}
                  </div>
                </div>

                {/* Profession Section */}
                <div className="tw-flex tw-flex-col md:tw-flex-row tw-gap-3 mt-3">
                  <div className="tw-flex tw-flex-col tw-w-full md:tw-w-[50%]">
                    <label htmlFor="profession" className="tw-mt-3 fw-bold dark:tw-text-white tw-text-responsive2">
                    {t('servantInfo.labels.profession')}
                    </label>
                    <input
                      type="text"
                      name="profession"
                      id="profession"
                      placeholder={t('servantInfo.placeholders.profession')}
                      className="tw-form-control tw-mt-1 py-2 border border-2 rounded-2"
                      onChange={formik.handleChange}
                      value={formik.values.profession}
                    />
                  </div>
                </div>

                {formik.values.profession && (
                  <div className="tw-flex tw-flex-col tw-w-full md:tw-w-[50%] mt-3">
                    <label htmlFor="dayOff" className="tw-mt-3 fw-bold dark:tw-text-white tw-text-responsive2">
                    {t('servantInfo.labels.dayOff')}
                    </label>
                    <select
                      name="dayOff"
                      id="dayOff"
                      multiple
                      size={5}
                      className="tw-form-control tw-mt-1 py-2 border border-2 rounded-2"
                      onChange={(e) => {
                        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
                        formik.setFieldValue('dayOff', selectedOptions);
                      }}
                      value={formik.values.dayOff || []}
                    >
                      {daysOfWeek.map((day, index) => (
                        <option key={index} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Submit Button */}
                <div className="my-4">
                  <button
                    type="submit"
                    className="bg-main dark:tw-bg-indigo-600 text-white w-100 py-2 rounded-2"
                    disabled={!(formik.dirty && formik.isValid) || formik.isSubmitting}
                  >
                    {formik.isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}