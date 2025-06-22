import { useState } from "react";
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "motion/react"
import "leaflet/dist/leaflet.css";
import styles from "./ShareEvent.module.css";
import { darkModeContext } from '../../Context/DarkModeContext';
import axios from "axios";

export default function VenueForm() {
  const { t } = useTranslation('shareEvent');
  let { darkMode } = useContext(darkModeContext);
  const [locationModal, setLocationModal] = useState(false);
  const [position, setPosition] = useState([31.223, 29.944]);
  const [images, setImages] = useState(Array(3).fill(null));
  const [imageFiles, setImageFiles] = useState(Array(3).fill(null));
  const [addressSource, setAddressSource] = useState('manual');
  const phoneRegExp = /^01[0125][0-9]{8}$/;
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';


  const formik = useFormik({
    initialValues: {
      eventName: "",
      category: "",
      address: "",
      price: "",
      phone: "",
      responsiblePerson: "",
      date: "",
      shortDescription: "",
      fullDescription: "",
    },
    validationSchema: Yup.object({
      category: Yup.string()
        .required(t('shareEvent.validation.required', { field: t('shareEvent.form.category.label') }))
        .oneOf(["event", "trip"], t('shareEvent.validation.invalidCategory')),
      eventName: Yup.string()
        .required(t('shareEvent.validation.required', { field: t('shareEvent.form.eventName') })),
      address: Yup.string()
        .required(t('shareEvent.validation.required', { field: t('shareEvent.form.address') })),
      price: Yup.number()
        .required(t('shareEvent.validation.required', { field: t('shareEvent.form.price') }))
        .min(0, t('shareEvent.validation.negativePrice')),
      phone: Yup.string()
        .matches(phoneRegExp, t('shareEvent.validation.invalidPhone'))
        .required(t('shareEvent.validation.required', { field: t('shareEvent.form.phone') })),
      responsiblePerson: Yup.string()
        .required(t('shareEvent.validation.required', { field: t('shareEvent.form.responsiblePerson') })),
      date: Yup.date()
        .required(t('shareEvent.validation.required', { field: t('shareEvent.form.date') })),
      shortDescription: Yup.string()
        .required(t('shareEvent.validation.required', { field: t('shareEvent.form.shortDescription') }))
        .max(50, t('shareEvent.validation.maxChars', { field: t('shareEvent.form.shortDescription'), max: 50 })),
      fullDescription: Yup.string()
        .required(t('shareEvent.validation.required', { field: t('shareEvent.form.fullDescription') })),
      images: Yup.array()
        .of(Yup.mixed().required(t('shareEvent.validation.required', { field: t('shareEvent.form.images.label') })))
        .min(3, t('shareEvent.validation.minImages'))
        .max(3, t('shareEvent.validation.maxImages'))
    }),
    onSubmit: async (values) => {
      const formData = {
        ...values,
        images: imageFiles.filter(img => img !== null),
      };
      console.log(formData);
      let res = await axios.post(`http://localhost:3001/events`, values)
    },
  });

  async function fetchAddress(lat, lng) {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      formik.setFieldValue("address", data.display_name || t('shareEvent.locationNotFound'));
      setAddressSource('map');
    } catch (error) {
      formik.setFieldValue("address", t('shareEvent.failedFetchAddress'));
    }
  }

  function getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          fetchAddress(latitude, longitude);
        },
        () => {
          alert(t('shareEvent.locationRetrieveError'));
        }
      );
    } else {
      alert(t('shareEvent.geolocationNotSupported'));
    }
  }

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        fetchAddress(lat, lng);
      },
    });
    return <Marker position={position} />;
  }

  function handleImageUpload(index, event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.match('image.*')) {
      alert(t('shareEvent.imageTypeError'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(t('shareEvent.imageSizeError'));
      return;
    }

    const newImages = [...images];
    const newImageFiles = [...imageFiles];
    
    newImages[index] = URL.createObjectURL(file);
    newImageFiles[index] = file;
    
    setImages(newImages);
    setImageFiles(newImageFiles);
    
    formik.setFieldTouched(`images[${index}]`, true);
    formik.setFieldValue("images", newImageFiles);
  }

  function handleAddressChange(e) {
    formik.handleChange(e);
    setAddressSource('manual');
  }

  function clearMapSelection() {
    formik.setFieldValue("address", "");
    setAddressSource('manual');
  }

  const allImagesUploaded = imageFiles.every(img => img !== null);

  return (
    <div className={`${darkMode ? 'tw-dark' : ''}`}>
      <div className="container-fluid dark:tw-bg-gray-800 py-4">
        <motion.div
            initial={{ opacity: 0, x: isRTL ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}     
          transition={{ duration: 1 }}  
        >
          <h1 className="text-center mainColor dark:tw-text-indigo-600 mt-2 fw-bolder">
            {t('shareEvent.title')}
          </h1>
          <p className="text-center mb-4 fs-4 tw-text-gray-600 dark:tw-text-gray-300 text-sm">
            {t('shareEvent.description')}
          </p>

          <div className={`tw-bg-gray-100 dark:tw-bg-gray-900 tw-text-gray-900 dark:tw-text-gray-100 tw-p-8 w-75 tw-mx-auto tw-rounded-lg ${styles.shad}`}>
            <form onSubmit={formik.handleSubmit} className="tw-space-y-4">
              {/* Event Name */}
              <div>
                <input
                  type="text"
                  name="eventName"
                  placeholder={t('shareEvent.form.eventName')}
                  className={`tw-w-full tw-p-3 rounded-3 tw-bg-white dark:tw-text-white dark:tw-bg-gray-800 tw-border ${formik.touched.eventName && formik.errors.eventName ? "tw-border-red-500" : "tw-border-gray-300 dark:tw-border-gray-600"}`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.eventName}
                />
                {formik.touched.eventName && formik.errors.eventName && (
                  <div className="tw-text-red-500 tw-text-sm tw-mt-1">{formik.errors.eventName}</div>
                )}
              </div>

              {/* Category */}
              <div>
                <select
                  name="category"
                  className={`tw-w-full tw-p-3 rounded-3 tw-text-gray-600 tw-bg-white dark:tw-text-white dark:tw-bg-gray-800 tw-border ${formik.touched.category && formik.errors.category ? "tw-border-red-500" : "tw-border-gray-300 dark:tw-border-gray-600"}`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.category}
                >
                  <option value="">{t('shareEvent.form.category.options.select')}</option>
                  <option value="event">{t('shareEvent.form.category.options.event')}</option>
                  <option value="trip">{t('shareEvent.form.category.options.trip')}</option>
                </select>
                {formik.touched.category && formik.errors.category && (
                  <div className="tw-text-red-500 tw-text-sm tw-mt-1">{formik.errors.category}</div>
                )}
              </div>

              {/* Address */}
              <div>
                <div className="tw-flex tw-items-center tw-bg-white dark:tw-bg-gray-800 rounded-3 tw-border tw-border-gray-300 dark:tw-border-gray-600">
                  <input
                    type="text"
                    name="address"
                    placeholder={t('shareEvent.form.address')}
                    className="tw-flex-1 tw-p-3 dark:tw-text-white rounded-3 tw-bg-transparent"
                    onChange={handleAddressChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.address}
                    readOnly={addressSource === 'map'}
                  />
                  <div className="tw-flex">
                    {addressSource === 'map' && (
                      <button
                        type="button"
                        onClick={clearMapSelection}
                        className="tw-px-3 tw-text-gray-500 hover:tw-text-gray-700 dark:hover:tw-text-gray-300"
                      >
                        ✕
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setLocationModal(true)}
                      className="tw-p-3 dark:tw-bg-indigo-600 tw-rounded-r bg-main tw-transition tw-text-white"
                    >
                      {addressSource === 'map' ? '📍' : '🗺️'}
                    </button>
                  </div>
                </div>
                {addressSource === 'map' && (
                  <div className="tw-text-xs tw-text-gray-500 dark:tw-text-gray-300 tw-mt-1">
                    {t('shareEvent.form.locationModal.mapInstructions')}
                  </div>
                )}
                {formik.touched.address && formik.errors.address && (
                  <div className="tw-text-red-500 tw-text-sm tw-mt-1">{formik.errors.address}</div>
                )}
              </div>

              {/* Short Description */}
              <div>
                <textarea
                  name="shortDescription"
                  placeholder={t('shareEvent.form.shortDescription')}
                  className={`tw-w-full tw-p-3 dark:tw-text-white rounded-3 tw-bg-white dark:tw-bg-gray-800 tw-border ${formik.touched.shortDescription && formik.errors.shortDescription ? "tw-border-red-500" : "tw-border-gray-300 dark:tw-border-gray-600"} tw-resize-none`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.shortDescription}
                  rows={3}
                  maxLength={50}
                />
                <div className="tw-flex tw-justify-between tw-text-xs tw-text-gray-500 dark:tw-text-gray-300 tw-mt-1">
                  <div>
                    {formik.touched.shortDescription && formik.errors.shortDescription ? (
                      <span className="tw-text-red-500">{formik.errors.shortDescription}</span>
                    ) : (
                      t('shareEvent.shortDescriptionHint')
                    )}
                  </div>
                  <div>
                    {formik.values.shortDescription.length}/50
                  </div>
                </div>
              </div>

              {/* Full Description */}
              <div>
                <textarea
                  name="fullDescription"
                  placeholder={t('shareEvent.form.fullDescription')}
                  className={`tw-w-full tw-p-3 dark:tw-text-white rounded-3 tw-bg-white dark:tw-bg-gray-800 tw-border ${formik.touched.fullDescription && formik.errors.fullDescription ? "tw-border-red-500" : "tw-border-gray-300 dark:tw-border-gray-600"} tw-resize-none`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.fullDescription}
                  rows={5}
                />
                <div className="tw-flex tw-justify-between tw-text-xs tw-text-gray-500 dark:tw-text-gray-300 tw-mt-1">
                  <div>
                    {formik.touched.fullDescription && formik.errors.fullDescription ? (
                      <span className="tw-text-red-500">{formik.errors.fullDescription}</span>
                    ) : (
                      t('shareEvent.fullDescriptionHint')
                    )}
                  </div>
                  <div>
                    {formik.values.fullDescription.length} {t('shareEvent.characters')}
                  </div>
                </div>
              </div>

              {/* Price */}
              <div>
                <input
                  type="number"
                  name="price"
                  placeholder={t('shareEvent.form.price')}
                  className={`tw-w-full tw-p-3 dark:tw-text-white rounded-3 tw-bg-white dark:tw-bg-gray-800 tw-border ${formik.touched.price && formik.errors.price ? "tw-border-red-500" : "tw-border-gray-300 dark:tw-border-gray-600"}`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.price}
                  min="0"
                />
                {formik.touched.price && formik.errors.price && (
                  <div className="tw-text-red-500 tw-text-sm tw-mt-1">{formik.errors.price}</div>
                )}
              </div>

              {/* Phone */}
              <div>
                <input
                  type="text"
                  name="phone"
                  placeholder={t('shareEvent.form.phone')}
                  className={`tw-w-full tw-p-3 dark:tw-text-white rounded-3 tw-bg-white dark:tw-bg-gray-800 tw-border ${formik.touched.phone && formik.errors.phone ? "tw-border-red-500" : "tw-border-gray-300 dark:tw-border-gray-600"}`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <div className="tw-text-red-500 tw-text-sm tw-mt-1">{formik.errors.phone}</div>
                )}
              </div>

              {/* Responsible Person */}
              <div>
                <input
                  type="text"
                  name="responsiblePerson"
                  placeholder={t('shareEvent.form.responsiblePerson')}
                  className={`tw-w-full tw-p-3 dark:tw-text-white rounded-3 tw-bg-white dark:tw-bg-gray-800 tw-border ${formik.touched.responsiblePerson && formik.errors.responsiblePerson ? "tw-border-red-500" : "tw-border-gray-300 dark:tw-border-gray-600"}`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.responsiblePerson}
                />
                {formik.touched.responsiblePerson && formik.errors.responsiblePerson && (
                  <div className="tw-text-red-500 tw-text-sm tw-mt-1">{formik.errors.responsiblePerson}</div>
                )}
              </div>

              {/* Date */}
              <div>
                <input
                  type="date"
                  name="date"
                  className={`tw-w-full dark:tw-text-white tw-p-3 rounded-3 tw-bg-white dark:tw-bg-gray-800 tw-border ${formik.touched.date && formik.errors.date ? "tw-border-red-500" : "tw-border-gray-300 dark:tw-border-gray-600"}`}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.date}
                />
                {formik.touched.date && formik.errors.date && (
                  <div className="tw-text-red-500 tw-text-sm tw-mt-1">{formik.errors.date}</div>
                )}
              </div>

              {/* Event Images */}
              <div className="tw-space-y-3 tw-pt-2">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="tw-bg-white dark:tw-bg-gray-800 rounded-3 tw-p-4 tw-text-center tw-border tw-border-gray-300 dark:tw-border-gray-600">
                    {images[index] ? (
                      <>
                        <img 
                          src={images[index]} 
                          alt={`${t('shareEvent.event')} ${index + 1}`} 
                          className="tw-w-full tw-h-24 tw-object-cover rounded-3 tw-mb-2" 
                        />
                        {formik.touched.images?.[index] && formik.errors.images?.[index] && (
                          <div className="tw-text-red-500 tw-text-sm">{formik.errors.images[index]}</div>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="tw-mb-2 tw-text-gray-500 dark:tw-text-gray-300">
                          {index === 0 ? t('shareEvent.form.images.first') : 
                           index === 1 ? t('shareEvent.form.images.second') : 
                           t('shareEvent.form.images.third')}
                        </p>
                        {formik.touched.images?.[index] && formik.errors.images?.[index] && (
                          <div className="tw-text-red-500 tw-text-sm">{formik.errors.images[index]}</div>
                        )}
                      </>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleImageUpload(index, e)} 
                      className="tw-hidden" 
                      id={`eventImage${index}`} 
                    />
                    <label 
                      htmlFor={`eventImage${index}`} 
                      className={`tw-inline-block dark:tw-bg-indigo-600 tw-px-4 tw-py-2 bg-main rounded-3 tw-cursor-pointer ${images[index] ? "tw-bg-gray-200 hover:tw-bg-gray-300" : "tw-bg-blue-500 hover:tw-bg-blue-600"} tw-transition tw-text-white`}
                    >
                      {images[index] ? t('shareEvent.form.images.change') : t('shareEvent.form.images.select')}
                    </label>
                  </div>
                ))}
                {formik.touched.images && typeof formik.errors.images === 'string' && (
                  <div className="tw-text-red-500 tw-text-sm">{formik.errors.images}</div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`tw-w-full tw-mt-6 tw-p-3 bg-main dark:tw-bg-indigo-600 rounded-3 tw-font-bold tw-transition tw-text-white ${!allImagesUploaded ? 'tw-opacity-50 tw-cursor-not-allowed' : ''}`}
                disabled={!allImagesUploaded || formik.isSubmitting}
              >
                {formik.isSubmitting ? t('shareEvent.form.submitting') : t('shareEvent.form.submit')}
                {!allImagesUploaded && (
                  <div className="tw-text-xs tw-mt-1">
                    {t('shareEvent.form.uploadAll')}
                  </div>
                )}
              </button>
            </form>

            {/* Location Modal */}
            {locationModal && (
              <div className="tw-fixed tw-inset-0 tw-bg-black/50 tw-flex tw-items-center tw-justify-center tw-z-50 tw-p-4">
                <div className="tw-bg-white dark:tw-bg-gray-800 tw-p-6 tw-rounded-lg tw-w-full tw-max-w-md shad">
                  <div className="tw-flex tw-justify-between tw-items-center tw-mb-4">
                    <h3 className="tw-text-lg tw-font-bold dark:tw-text-white">
                      {t('shareEvent.form.locationModal.title')}
                    </h3>
                    <button 
                      onClick={() => setLocationModal(false)}
                      className="tw-text-gray-500 dark:tw-bg-indigo-600 dark:tw-text-white hover:tw-text-gray-700 dark:hover:tw-text-gray-300 tw-text-xl"
                    >
                      ✕
                    </button>
                  </div>
                  <MapContainer 
                    center={position} 
                    zoom={13} 
                    className="tw-h-64 tw-w-full tw-mb-4 tw-rounded tw-border tw-border-gray-300 dark:tw-border-gray-600"
                    scrollWheelZoom={false}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker />
                  </MapContainer>
                  <div className="tw-space-y-2">
                    <button
                      type="button"
                      onClick={getUserLocation}
                      className="tw-w-full tw-p-2 dark:tw-bg-indigo-600 bg-main tw-rounded tw-transition tw-text-white"
                    >
                      {t('shareEvent.form.locationModal.useMyLocation')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocationModal(false)}
                      className="tw-w-full tw-p-2 tw-bg-green-500 hover:tw-bg-green-600 tw-rounded tw-transition tw-text-white"
                    >
                      {t('shareEvent.form.locationModal.confirmLocation')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}