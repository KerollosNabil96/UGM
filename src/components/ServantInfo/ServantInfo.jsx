
import React, { useContext } from 'react';
import styles from './ServantInfo.module.css';
import { darkModeContext } from '../../Context/DarkModeContext';
import { useFormik } from 'formik';
import { motion } from "motion/react"


export default function ServantInfo() {
  let { darkMode } = useContext(darkModeContext);

  const daysOfWeek = [
    'Saturday',
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday'
  ];

  const validate = (values) => {
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
  };

  const onSubmit = (values, { setSubmitting }) => {
    console.log('Form submitted with values:', values);
    setSubmitting(false);
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
          <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}     
                transition={{ duration: 1 }}  
              >
        <h1 className="text-center  mainColor dark:tw-text-indigo-600 mt-2 fw-bolder">Servant Information Form</h1>
<p className="text-center mb-4  fs-4 tw-text-gray-600 dark:tw-text-white text-sm">
  Register your information for church service
  This form collects servant data<br /> to help organize ministry activities
</p>
          <div className="row w-75 mx-auto">
            <div className={`${styles.shad} col-12 tw-bg-gray-100 dark:tw-bg-gray-900 px-4 rounded-4`}>
              <form onSubmit={formik.handleSubmit} noValidate>
                {/* Names Section */}
                <div className="names tw-flex tw-flex-col md:tw-flex-row tw-gap-3">
                  <div className="tw-flex tw-flex-col tw-w-full md:tw-w-[33%]">
                    <label htmlFor="firstName" className="tw-mt-3 fw-bold dark:tw-text-white tw-text-responsive2">
                      First Name:
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      placeholder="Enter first name"
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
                      Second Name:
                    </label>
                    <input
                      type="text"
                      name="secName"
                      id="secName"
                      placeholder="Enter second name"
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
                      Family Name:
                    </label>
                    <input
                      type="text"
                      name="familyName"
                      id="familyName"
                      placeholder="Enter family name"
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
                <p className='fw-bold mt-3 tw-text-responsive2 dark:tw-text-white'>Birthdate:</p>
                <div className='dateOfBirth w-100 mt-3 tw-flex tw-flex-col md:tw-flex-row'>
                  <div className="tw-w-full md:tw-w-[30%]">
                    <label htmlFor="birthDay" className="tw-text-responsive2 dark:tw-text-white">Select Day:</label>
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
                    <label htmlFor="birthMonth" className="tw-text-responsive2 dark:tw-text-white">Select Month:</label>
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
                    <label htmlFor="birthYear" className="tw-text-responsive2 dark:tw-text-white">Select Year:</label>
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
                  <label htmlFor="email" className='fw-bold tw-text-responsive2 dark:tw-text-white'>Email:</label>
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
                  <label htmlFor="Address" className='fw-bold dark:tw-text-white'>Address:</label>
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
                  <label htmlFor="Address2" className='fw-bold dark:tw-text-white'>Address 2 (if available):</label>
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
                      Is expatriate?
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
                      Mobile number 1:
                    </label>
                    <input
                      type="text"
                      name="mobileNumber1"
                      id="mobileNumber1"
                      placeholder="Enter mobile number (1)"
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
                      Mobile number 2 (if available):
                    </label>
                    <input
                      type="text"
                      name="mobileNumber2"
                      id="mobileNumber2"
                      placeholder="Enter mobile number (2)"
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
                      Landline (if available):
                    </label>
                    <input
                      type="text"
                      name="landline"
                      id="landline"
                      placeholder="Enter landline number"
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
                  <label htmlFor="church" className='fw-bold dark:tw-text-white'>Church:</label>
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
                  <label htmlFor="priestName" className='fw-bold dark:tw-text-white'>Priest Name:</label>
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
                      College or Institute:
                    </label>
                    <input
                      type="text"
                      name="college"
                      id="college"
                      placeholder="Enter the college"
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
                      Governorate of birth:
                    </label>
                    <input
                      type="text"
                      name="governorateOfBirth"
                      id="governorateOfBirth"
                      placeholder="Enter governorate of birth"
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
                      Marital status:
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
                      <option value="">Select status</option>
                      <option value="Single">Single</option>
                      <option value="Engaged">Engaged</option>
                      <option value="Married">Married</option>
                    </select>
                    {formik.errors.maritalStatus && formik.touched.maritalStatus && (
                      <div className="tw-text-red-500 tw-text-sm tw-mt-1" role="alert">
                        {formik.errors.maritalStatus}
                      </div>
                    )}
                  </div>

                  <div className="tw-flex tw-flex-col tw-w-full md:tw-w-[50%]">
                    <label htmlFor="cohort" className="tw-mt-3 fw-bold dark:tw-text-white tw-text-responsive2">
                      Cohort:
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
                      <option value="">Select cohort</option>
                      <option value="1st_University">1st Year University</option>
                      <option value="2nd_University">2nd Year University</option>
                      <option value="3rd_University">3rd Year University</option>
                      <option value="4th_University">4th Year University</option>
                      <option value="Graduate_1">1st Year Graduate</option>
                      <option value="Graduate_2">2nd Year Graduate</option>
                      <option value="Graduate_3">3rd Year Graduate</option>
                      <option value="Graduate_4">4th Year Graduate</option>
                      <option value="Graduate_5">5th Year Graduate</option>
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
                      Profession (if available):
                    </label>
                    <input
                      type="text"
                      name="profession"
                      id="profession"
                      placeholder="Enter profession"
                      className="tw-form-control tw-mt-1 py-2 border border-2 rounded-2"
                      onChange={formik.handleChange}
                      value={formik.values.profession}
                    />
                  </div>
                </div>

                {/* Day Off Section (Conditional) */}
                {formik.values.profession && (
                  <div className="tw-flex tw-flex-col tw-w-full md:tw-w-[50%] mt-3">
                    <label htmlFor="dayOff" className="tw-mt-3 fw-bold dark:tw-text-white tw-text-responsive2">
                      Day off (Press Ctrl and select):
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
                    {formik.isSubmitting ? 'Submitting...' : 'Register'}
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