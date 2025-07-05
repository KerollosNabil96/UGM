import React, { useContext, useEffect, useState } from 'react';
import styles from './Settings.module.css';
import { useFormik } from 'formik';
import { darkModeContext } from '../../Context/DarkModeContext';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

export default function Settings() {
  const { darkMode } = useContext(darkModeContext);
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const { t } = useTranslation('settings');


  const daysOfWeek = [
    t('days.saturday'),
    t('days.sunday'),
    t('days.monday'),
    t('days.tuesday'),
    t('days.wednesday'),
    t('days.thursday'),
    t('days.friday')
  ];

  const validate = (values) => {
    let errors = {};
    if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = t('settings.errors.email');
    }

    if (values.mobileNumber1 && !/^01[0125][0-9]{8}$/.test(values.mobileNumber1)) {
      errors.mobileNumber1 = t('settings.errors.mobile');
    }

    if (values.mobileNumber2 && !/^01[0125][0-9]{8}$/.test(values.mobileNumber2)) {
      errors.mobileNumber2 = t('settings.errors.mobile');
    }

    if (values.landline && !/^(02|03)\d{7}$/.test(values.landline)) {
      errors.landline = t('settings.errors.landline');
    }

    return errors;
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
    onSubmit: (values) => {
      console.log('Form submitted with values:', values);
    }
  });

  const validate2 = (values2) => {
    const errors2 = {};
    if (!values2.oldPassword) {
      errors2.oldPassword = t('settings.errors.requiredOldPassword');
    }

    if (!values2.newPassword) {
      errors2.newPassword = t('settings.errors.requiredNewPassword');
    } else if (
      values2.newPassword &&
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(values2.newPassword)
    ) {
      errors2.newPassword = t('settings.errors.passwordPattern');
    }

    if (!values2.rePassword) {
      errors2.rePassword = t('settings.errors.requiredRePassword');
    } else if (values2.newPassword !== values2.rePassword) {
      errors2.rePassword = t('settings.errors.passwordMismatch');
    }

    return errors2;
  };

  const formik2 = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      rePassword: ''
    },
    validate: validate2,
    onSubmit: (values2) => {
      console.log('Password Update Submitted:', values2);
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setShouldRedirect(true);
    }
  }, []);

  if (shouldRedirect) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className={`${darkMode ? 'tw-dark' : ''}`}>
      <div className="container-fluid dark:tw-bg-gray-800">
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="container py-3">
            <h1 className="text-center mainColor dark:tw-text-indigo-600 mt-2 fw-bolder">
              {t('settings.title')}
            </h1>
            <p className="text-center mb-4 fs-4 tw-text-gray-600 dark:tw-text-white text-sm">
              {t('settings.description')}
            </p>

            <div className={`${styles.shad} py-5 row w-100 mx-auto rounded-4 p-3 my-4`}>
              <h2 className="mb-4 mainColor dark:tw-text-indigo-600">{t('settings.profileInfo')}</h2>

              <div className={`profInfo ${styles.shad} dark:tw-bg-gray-900 p-4 mx-auto w-75 tw-bg-gray-300 rounded-2`}>
                <form onSubmit={formik.handleSubmit}>
                  <div className="parent md:tw-flex gap-2">
                    <div className="Emailchild w-100">
                      <input
                        type="text"
                        placeholder={t('settings.updateEmail')}
                        id="email"
                        name="email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        onBlur={formik.handleBlur}
                        className="form-control w-100 mt-3 py-2"
                      />
                      {formik.errors.email && formik.touched.email && (
                        <div className="text-danger w-100" role="alert">
                          {formik.errors.email}
                        </div>
                      )}
                    </div>
                    <div className="Church-child w-100">
                      <input
                        type="text"
                        id="church"
                        name="church"
                        placeholder={t('settings.updateChurch')}
                        className="form-control w-100 mt-3 py-2"
                        onChange={formik.handleChange}
                        value={formik.values.church}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                  </div>

                  <div className="parent md:tw-flex gap-2">
                    <div className="collegechild w-100">
                      <input
                        type="text"
                        placeholder={t('settings.updateCollege')}
                        id="college"
                        name="college"
                        onChange={formik.handleChange}
                        value={formik.values.college}
                        onBlur={formik.handleBlur}
                        className="form-control w-100 mt-3 py-2"
                      />
                    </div>
                    <div className="priestName-child w-100">
                      <input
                        type="text"
                        id="priestName"
                        name="priestName"
                        placeholder={t('settings.updatePriestName')}
                        className="form-control py-2 w-100 mt-3"
                        onChange={formik.handleChange}
                        value={formik.values.priestName}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                  </div>

                  <div className="parent md:tw-flex gap-2">
                    <div className="Addresschild w-100">
                      <input
                        type="text"
                        placeholder={t('settings.updateAddress1')}
                        id="Address"
                        name="Address"
                        onChange={formik.handleChange}
                        value={formik.values.Address}
                        onBlur={formik.handleBlur}
                        className="form-control w-100 mt-3"
                      />
                    </div>
                    <div className="Address2-child w-100">
                      <input
                        type="text"
                        id="Address2"
                        name="Address2"
                        placeholder={t('settings.updateAddress2')}
                        className="form-control w-100 mt-3"
                        onChange={formik.handleChange}
                        value={formik.values.Address2}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                  </div>

                  <div className="parent md:tw-flex gap-2">
                    <div className="mobileNumber1child w-100">
                      <input
                        type="text"
                        placeholder={t('settings.updateMobile1')}
                        id="mobileNumber1"
                        name="mobileNumber1"
                        onChange={formik.handleChange}
                        value={formik.values.mobileNumber1}
                        onBlur={formik.handleBlur}
                        className="form-control w-100 mt-3 py-2"
                      />
                      {formik.errors.mobileNumber1 && formik.touched.mobileNumber1 && (
                        <div className="text-danger w-100" role="alert">
                          {formik.errors.mobileNumber1}
                        </div>
                      )}
                    </div>
                    <div className="mobileNumber2-child w-100">
                      <input
                        type="text"
                        id="mobileNumber2"
                        name="mobileNumber2"
                        placeholder={t('settings.updateMobile2')}
                        className="form-control w-100 mt-3 py-2"
                        onChange={formik.handleChange}
                        value={formik.values.mobileNumber2}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                  </div>

                  <div className="parent md:tw-flex gap-2">
                    <div className="cohort w-100">
                      <select
                        name="cohort"
                        id="cohort"
                        className="py-2 border border-2 rounded-2 mt-3 w-100"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.cohort}
                      >
                        <option value="">{t('settings.selectCohort')}</option>
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
                    </div>
                    <div className="maritalStatus-child w-100">
                      <select
                        name="maritalStatus"
                        id="maritalStatus"
                        className="py-2 border border-2 rounded-2 w-100 mt-3"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.maritalStatus}
                      >
                        <option value="">{t('settings.selectStatus')}</option>
                        <option value="Single">Single</option>
                        <option value="Engaged">Engaged</option>
                        <option value="Married">Married</option>
                      </select>
                    </div>
                  </div>

                  <div className="parent md:tw-flex gap-2">
                    <div className="landline w-100">
                      <input
                        type="text"
                        placeholder={t('settings.updateLandline')}
                        id="landline"
                        name="landline"
                        onChange={formik.handleChange}
                        value={formik.values.landline}
                        onBlur={formik.handleBlur}
                        className="form-control w-100 mt-3 py-2"
                      />
                      {formik.errors.landline && formik.touched.landline && (
                        <div className="text-danger w-100" role="alert">
                          {formik.errors.landline}
                        </div>
                      )}
                    </div>
                    <div className="profession-child w-100">
                      <input
                        type="text"
                        id="profession"
                        name="profession"
                        placeholder={t('settings.updateProfession')}
                        className="form-control w-100 mt-3 py-2"
                        onChange={formik.handleChange}
                        value={formik.values.profession}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                  </div>

                  <div className="parent">
                    {formik.values.profession && (
                      <div className="tw-flex tw-flex-col tw-w-full md:tw-w-[100%] mt-3">
                        <label htmlFor="dayOff" className="tw-mt-3 fw-bold dark:tw-text-white tw-text-responsive2">
                          {t('settings.dayOffLabel')}
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
                  </div>

                  <div className="parent">
                    <div className="my-4">
                      <button
                        type="submit"
                        className="bg-main dark:tw-bg-indigo-600 text-white w-100 py-2 rounded-2"
                        disabled={!formik.dirty}
                      >
                        {formik.isSubmitting ? 'Updating...' : t('settings.update')}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              <h2 className="my-4 mainColor dark:tw-text-indigo-600">{t('settings.updatePassword')}</h2>

              <div className={`profInfo ${styles.shad} dark:tw-bg-gray-900 mx-auto p-4 w-75 tw-bg-gray-300 rounded-2`}>
                <form onSubmit={formik2.handleSubmit}>
                  <div className="parent md:tw-flex gap-2">
                    <div className="oldchild w-100">
                      <input
                        type="password"
                        placeholder={t('settings.oldPassword')}
                        id="oldPassword"
                        name="oldPassword"
                        onChange={formik2.handleChange}
                        value={formik2.values.oldPassword}
                        onBlur={formik2.handleBlur}
                        className="form-control w-100 mt-3 py-2"
                      />
                      {formik2.errors.oldPassword && formik2.touched.oldPassword && (
                        <div className="text-danger w-100" role="alert">
                          {formik2.errors.oldPassword}
                        </div>
                      )}
                    </div>
                    <div className="New-password w-100">
                      <input
                        type="password"
                        placeholder={t('settings.newPassword')}
                        id="newPassword"
                        name="newPassword"
                        onChange={formik2.handleChange}
                        value={formik2.values.newPassword}
                        onBlur={formik2.handleBlur}
                        className="form-control w-100 mt-3 py-2"
                      />
                      {formik2.errors.newPassword && formik2.touched.newPassword && (
                        <div className="text-danger w-100" role="alert">
                          {formik2.errors.newPassword}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="parent md:tw-flex gap-2">
                    <div className="rePassword w-100">
                      <input
                        type="password"
                        placeholder={t('settings.rePassword')}
                        id="rePassword"
                        name="rePassword"
                        onChange={formik2.handleChange}
                        value={formik2.values.rePassword}
                        onBlur={formik2.handleBlur}
                        className="form-control w-100 mt-3 py-2"
                      />
                      {formik2.errors.rePassword && formik2.touched.rePassword && (
                        <div className="text-danger w-100" role="alert">
                          {formik2.errors.rePassword}
                        </div>
                      )}
                      <button
                        type="submit"
                        disabled={!(formik2.dirty && formik2.isValid)}
                        className="bg-main dark:tw-bg-indigo-600 text-white w-100 py-2 rounded-2 mt-4"
                      >
                        {t('settings.submitPassword')}
                      </button>
                    </div>
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
