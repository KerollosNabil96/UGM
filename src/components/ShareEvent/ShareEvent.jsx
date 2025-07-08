import { useState, useRef, useEffect } from "react";
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";
import styles from "./ShareEvent.module.css";
import { darkModeContext } from '../../Context/DarkModeContext';
import axios from "axios";
import toast from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import imageCompression from 'browser-image-compression';

export default function VenueForm() {
  const { t } = useTranslation('shareEvent');
  let { darkMode } = useContext(darkModeContext);
  const [locationModal, setLocationModal] = useState(false);
  const [position, setPosition] = useState([31.223, 29.944]);
  const [images, setImages] = useState(Array(3).fill(null));
  const [imageFiles, setImageFiles] = useState(Array(3).fill(null));
  const [addressSource, setAddressSource] = useState('manual');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsBus, setNeedsBus] = useState(false);
  const phoneRegExp = /^01[0125][0-9]{8}$/;
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const mapRef = useRef(null);
  const mapModalRef = useRef(null);

  // Handle clicks outside the map modal to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mapModalRef.current && !mapModalRef.current.contains(event.target)) {
        setLocationModal(false);
      }
    };

    if (locationModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [locationModal]);

  const fileInputsRef = [
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const formik = useFormik({
    initialValues: {
      eventName: "",
      category: "",
      address: "",
      price: "0",
      phone: "",
      responsiblePerson: "",
      date: "",
      shortDescription: "",
      fullDescription: "",
      needsBus: false,
      busCapacity: "",
      reservedUsers: []
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
        .typeError(t('shareEvent.validation.required', { field: t('shareEvent.form.price') }))
        .required(t('shareEvent.validation.required', { field: t('shareEvent.form.price') }))
        .min(0, t('shareEvent.validation.negativePrice')),
      phone: Yup.string()
        .matches(phoneRegExp, t('shareEvent.validation.invalidPhone'))
        .required(t('shareEvent.validation.required', { field: t('shareEvent.form.phone') })),
      responsiblePerson: Yup.string()
        .required(t('shareEvent.validation.required', { field: t('shareEvent.form.responsiblePerson') })),
      date: Yup.date()
        .typeError(t('shareEvent.validation.required', { field: t('shareEvent.form.date') }))
        .required(t('shareEvent.validation.required', { field: t('shareEvent.form.date') })),
      shortDescription: Yup.string()
        .required(t('shareEvent.validation.required', { field: t('shareEvent.form.shortDescription') }))
        .max(100, t('shareEvent.validation.maxChars', { field: t('shareEvent.form.shortDescription'), max: 100 })),
      fullDescription: Yup.string()
        .required(t('shareEvent.validation.required', { field: t('shareEvent.form.fullDescription') })),
busCapacity: Yup.number().when('needsBus', (needsBus, schema) => {
  return needsBus
    ? schema.required(t('shareEvent.validation.required', { field: t('shareEvent.form.busCapacity') }))
        .min(1, t('shareEvent.validation.minCapacity', { min: 1 }))
        .max(400, t('shareEvent.validation.maxCapacity', { max: 400 }))
    : schema.notRequired();
})
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setIsSubmitting(true);
        const token = localStorage.getItem('token');
         console.log("🔍 Submitted Values:", values)
        if (!token) {
          toast.error(t('shareEvent.authError'));
          setIsSubmitting(false);
          return;
        }

        // Prepare the data to be sent
        const formData = new FormData();
        
        Object.keys(values).forEach(key => {
          if (key !== 'reservedUsers') {
            formData.append(key, values[key]);
          }
        });
        
        // Add images
        imageFiles.forEach((file, index) => {
          if (file) {
            formData.append('images', file);
          }
        });

        // Add empty reservedUsers array
        formData.append('reservedUsers', JSON.stringify([]));

        const res = await axios.post(
          'https://ugmproject.vercel.app/api/v1/event/addEvent',
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            }
          }
        );
        toast.success(t('shareEvent.successMessage'));
        resetForm();
        setImages(Array(3).fill(null));
        setImageFiles(Array(3).fill(null));
        setNeedsBus(false);

        fileInputsRef.forEach(ref => {
          if (ref.current) {
            ref.current.value = null;
          }
        });
      } catch (error) {
        console.error("Submission Error:", error);
        toast.error(error.response?.data?.message || t('shareEvent.errorOccurred'));
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  const checkFormCompletion = () => {
    const errors = {};
    const requiredFields = [
      'eventName', 'category', 'address', 'price', 
      'phone', 'responsiblePerson', 'date', 
      'shortDescription', 'fullDescription'
    ];

    requiredFields.forEach(field => {
      if (formik.values[field] === null || formik.values[field] === undefined || formik.values[field] === '') {
        errors[field] = true;
      }
    });

    // Check bus capacity if bus is needed
    if (formik.values.needsBus && (!formik.values.busCapacity || formik.values.busCapacity < 1)) {
      errors.busCapacity = true;
    }
    
    if (imageFiles.filter(Boolean).length < 3) {
      errors.images = true;
    }
    
    return {
      isComplete: Object.keys(errors).length === 0,
      missingFields: errors
    };
  };

  const { isComplete, missingFields } = checkFormCompletion();

  const getTooltipContent = () => {
    if (isComplete) return '';
    
    const missingFieldsList = [];
    
    if (missingFields.eventName) missingFieldsList.push(t('shareEvent.form.eventName'));
    if (missingFields.category) missingFieldsList.push(t('shareEvent.form.category.label'));
    if (missingFields.address) missingFieldsList.push(t('shareEvent.form.address'));
    if (missingFields.price) missingFieldsList.push(t('shareEvent.form.price'));
    if (missingFields.phone) missingFieldsList.push(t('shareEvent.form.phone'));
    if (missingFields.responsiblePerson) missingFieldsList.push(t('shareEvent.form.responsiblePerson'));
    if (missingFields.date) missingFieldsList.push(t('shareEvent.form.date'));
    if (missingFields.shortDescription) missingFieldsList.push(t('shareEvent.form.shortDescription'));
    if (missingFields.fullDescription) missingFieldsList.push(t('shareEvent.form.fullDescription'));
    if (missingFields.busCapacity) missingFieldsList.push(t('shareEvent.form.busCapacity'));
    if (missingFields.images) missingFieldsList.push(t('shareEvent.form.images.label'));
    
    return (
      <div className="tw-text-sm">
        <p className="tw-font-bold tw-mb-1">{t('shareEvent.validation.missingFields')}</p>
        <ul className="tw-list-disc tw-pl-4">
          {missingFieldsList.map((field, index) => (
            <li key={index}>{field}</li>
          ))}
        </ul>
      </div>
    );
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const errors = await formik.validateForm();
    const imageErrors = imageFiles.filter(Boolean).length < 3 ? { images: true } : {};

    if (Object.keys(errors).length > 0 || Object.keys(imageErrors).length > 0) {
      formik.setTouched({
        eventName: true,
        category: true,
        address: true,
        price: true,
        phone: true,
        responsiblePerson: true,
        date: true,
        shortDescription: true,
        fullDescription: true,
        busCapacity: true
      });

      toast.error(t('shareEvent.validation.requiredFields'));
      return;
    }

    formik.handleSubmit();
  };

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

  const handleSearchLocation = async () => {
    const searchInput = document.getElementById('search-location').value;
    if (!searchInput.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchInput)}`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setPosition([parseFloat(lat), parseFloat(lon)]);
        formik.setFieldValue("address", display_name);
        setAddressSource('map');

        if (mapRef.current) {
          mapRef.current.flyTo([lat, lon], 15);
        }
      } else {
        toast.error(t('shareEvent.locationNotFound'));
      }
    } catch (error) {
      toast.error(t('shareEvent.failedFetchAddress'));
    }
  };

  function getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          fetchAddress(latitude, longitude);
          
          if (mapRef.current) {
            mapRef.current.flyTo([latitude, longitude], 15);
          }
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

  async function handleImageUpload(index, event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      alert(t('shareEvent.imageTypeError'));
      return;
    }

    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: file.type.match('image/png') ? 'image/png' : 'image/jpeg',
      quality: 0.8
    };

    try {
      const compressedFile = await imageCompression(file, options);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImages = [...images];
        newImages[index] = e.target.result;
        setImages(newImages);
        
        const newImageFiles = [...imageFiles];
        newImageFiles[index] = compressedFile;
        setImageFiles(newImageFiles);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Error compressing image:', error);
      alert(t('shareEvent.imageCompressionError'));
    }
  }

  function handleAddressChange(e) {
    formik.handleChange(e);
    setAddressSource('manual');
  }

  function clearMapSelection() {
    formik.setFieldValue("address", "");
    setAddressSource('manual');
  }

  const handleBusToggle = (e) => {
    const needsBus = e.target.checked;
    setNeedsBus(needsBus);
    formik.setFieldValue("needsBus", needsBus);
    
    if (!needsBus) {
      formik.setFieldValue("busCapacity", "");
    }
  };

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
            <form onSubmit={handleFormSubmit} className="tw-space-y-4">
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
                    placeholder={`${t('shareEvent.form.address')}`}
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
                  maxLength={100}
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
                    {formik.values.shortDescription.length}/100
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

              {/* Bus Requirements */}
              <div className="tw-space-y-2">
                <div className="tw-flex tw-items-center">
                  <input
                    type="checkbox"
                    id="needsBus"
                    name="needsBus"
                    checked={needsBus}
                    onChange={handleBusToggle}
                    className="tw-mr-2 tw-h-4 tw-w-4 tw-text-indigo-600 tw-rounded"
                  />
                  <label htmlFor="needsBus" className="tw-text-gray-700 dark:tw-text-gray-300">
                    {t('shareEvent.form.needsBus')}
                  </label>
                </div>

                {needsBus && (
                  <div>
                    <input
                      type="number"
                      name="busCapacity"
                      placeholder={t('shareEvent.form.busCapacity')}
                      className={`tw-w-full tw-p-3 dark:tw-text-white rounded-3 tw-bg-white dark:tw-bg-gray-800 tw-border ${formik.touched.busCapacity && formik.errors.busCapacity ? "tw-border-red-500" : "tw-border-gray-300 dark:tw-border-gray-600"}`}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.busCapacity}
                      min="1"
                      max="100"
                    />
                    {formik.touched.busCapacity && formik.errors.busCapacity && (
                      <div className="tw-text-red-500 tw-text-sm tw-mt-1">{formik.errors.busCapacity}</div>
                    )}
                    <p className="tw-text-xs tw-text-gray-500 dark:tw-text-gray-300 tw-mt-1">
                      {t('shareEvent.form.busCapacityHint')}
                    </p>
                  </div>
                )}
              </div>

              {/* Event Images */}
              <div className="tw-space-y-3 tw-pt-2">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="tw-relative tw-border tw-rounded tw-p-2 tw-bg-white dark:tw-bg-gray-800">
                    <input
                      type="file"
                      ref={fileInputsRef[index]}
                      accept="image/*"
                      onChange={(e) => handleImageUpload(index, e)}
                      hidden
                      id={`image-input-${index}`}
                    />
                    <label
                      htmlFor={`image-input-${index}`}
                      className="tw-block tw-text-center tw-py-3 tw-cursor-pointer tw-text-indigo-600 dark:tw-text-indigo-400 tw-border tw-border-indigo-600 dark:tw-border-indigo-400 tw-rounded hover:tw-bg-indigo-100 dark:hover:tw-bg-indigo-900"
                    >
                      {images[index] ? (
                        <img
                          src={images[index]}
                          alt={`event-img-${index}`}
                          className="tw-w-full tw-h-40 tw-object-cover tw-rounded"
                        />
                      ) : (
                        t('shareEvent.form.images.selectImage') 
                      )}
                    </label>
                  </div>
                ))}
                {imageFiles.filter(Boolean).length < 3 && (
                  <div className="tw-text-red-500 tw-text-sm tw-mt-1">
                    {t('shareEvent.validation.minImages')}
                  </div>
                )}
              </div>

              <div className="tw-flex tw-justify-center tw-mt-4">
                <button
                  type="submit"
                  disabled={!isComplete || isSubmitting}
                  className={`tw-bg-[#4B0082] w-100 tw-text-white tw-py-3 tw-px-6 tw-rounded tw-border-none tw-font-medium ${!isComplete || isSubmitting ? "tw-cursor-not-allowed tw-opacity-60" : "tw-cursor-pointer hover:tw-bg-[#3a0063]"}`}
                  data-tooltip-id="submit-tooltip"
                  data-tooltip-place="top"
                  data-tooltip-variant={darkMode ? "dark" : "light"}
                >
                  {isSubmitting ? t('shareEvent.loading') : t('shareEvent.submit')}
                </button>

                <Tooltip id="submit-tooltip" className="tw-max-w-xs">
                  {getTooltipContent()}
                </Tooltip>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Location Modal */}
        {locationModal && (
          <div className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-flex tw-items-center tw-justify-center tw-z-50">
            <div 
              className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-lg tw-p-4 tw-w-96"
              ref={mapModalRef}
            >
              <button
                onClick={() => setLocationModal(false)}
                className="tw-text-red-600 tw-font-bold tw-text-xl tw-absolute tw-top-2 tw-right-4"
              >
                &times;
              </button>

              {/* Search Field */}
              <div className="tw-flex tw-mb-3">
                <input
                  type="text"
                  id="search-location"
                  placeholder={t('shareEvent.form.locationModal.searchPlace')}
                  className="tw-flex-1 tw-p-2 tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-rounded-l"
                />
                <button
                  onClick={handleSearchLocation}
                  className="tw-bg-indigo-600 tw-text-white tw-px-4 tw-rounded-r"
                >
                  {t('shareEvent.form.locationModal.search')}
                </button>
              </div>

              <MapContainer 
                center={position} 
                zoom={13} 
                style={{ height: "300px", width: "100%" }}
                ref={mapRef}
              >
                <TileLayer
                  attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker />
              </MapContainer>
              <button
                onClick={getUserLocation}
                className="btn btn-secondary tw-mt-3 w-full"
              >
                {t('shareEvent.form.locationModal.getMyLocation')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}