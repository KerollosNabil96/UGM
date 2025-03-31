import { useState } from "react";
import React, { useContext } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useFormik } from "formik";
import * as Yup from "yup";
import "leaflet/dist/leaflet.css";
import styles from "./ShareEvent.module.css";
import { darkModeContext } from '../../Context/DarkModeContext';

export default function VenueForm() {
  let { darkMode } = useContext(darkModeContext);
  const [locationModal, setLocationModal] = useState(false);
  const [position, setPosition] = useState([31.223, 29.944]);
  const [images, setImages] = useState(Array(3).fill(null));
  const [imageFiles, setImageFiles] = useState(Array(3).fill(null));
  const [addressSource, setAddressSource] = useState('manual');

  const phoneRegExp = /^01[0125][0-9]{8}$/;

  const formik = useFormik({
    initialValues: {
      eventName: "",
      address: "",
      price: "",
      phone: "",
      responsiblePerson: "",
      date: "",
      shortDescription: "",
      fullDescription: "",
    },
    validationSchema: Yup.object({
      eventName: Yup.string().required("Event name is required"),
      address: Yup.string().required("Address is required"),
      price: Yup.number()
        .required("Price is required")
        .min(0, "Price can't be negative"),
      phone: Yup.string()
        .matches(phoneRegExp, "Phone number is not valid")
        .required("Phone number is required"),
      responsiblePerson: Yup.string().required("Responsible person name is required"),
      date: Yup.date().required("Date is required"),
      shortDescription: Yup.string()
        .required("Short description is required")
        .max(50, "Short description must be at most 50 characters"),
      fullDescription: Yup.string()
        .required("Full description is required"),
      images: Yup.array()
        .of(Yup.mixed().required("Image is required"))
        .min(3, "You must upload all 3 images")
        .max(3, "You can't upload more than 3 images")
    }),
    onSubmit: (values) => {
      const formData = {
        ...values,
        images: imageFiles.filter(img => img !== null),
      };
      console.log(formData);
    },
  });

  async function fetchAddress(lat, lng) {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      formik.setFieldValue("address", data.display_name || "Location not found");
      setAddressSource('map');
    } catch (error) {
      formik.setFieldValue("address", "Failed to fetch address");
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
          alert("Unable to retrieve your location");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
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
    
    // Validate image type
    if (!file.type.match('image.*')) {
      alert('Please upload an image file only');
      return;
    }

    // Validate image size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
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

  // Check if all images are uploaded
  const allImagesUploaded = imageFiles.every(img => img !== null);

  return (
    <div className={`${darkMode ? 'tw-dark' : ''}`}>
      <div className="container-fluid dark:tw-bg-gray-800 py-4">
        <h1 className="text-center mainColor dark:tw-text-indigo-600 mt-2 fw-bolder">
          Share your event
        </h1>
        <p className="text-center mb-4 fs-4 tw-text-gray-600 dark:tw-text-gray-300 text-sm">
          Please provide all the necessary details about the event, including key information and the organizer's contact details,<br/> to ensure it reaches interested participants easily.
        </p>

        <div className={`tw-bg-gray-100 dark:tw-bg-gray-900 tw-text-gray-900 dark:tw-text-gray-100 tw-p-8 w-75 tw-mx-auto tw-rounded-lg ${styles.shad}`}>
          
          <form onSubmit={formik.handleSubmit} className="tw-space-y-4">
            {/* Event Name */}
            <div>
              <input
                type="text"
                name="eventName"
                placeholder="Event name"
                className={`tw-w-full tw-p-3 tw-rounded tw-bg-white dark:tw-text-white dark:tw-bg-gray-800 tw-border ${formik.touched.eventName && formik.errors.eventName ? "tw-border-red-500" : "tw-border-gray-300 dark:tw-border-gray-600"}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.eventName}
              />
              {formik.touched.eventName && formik.errors.eventName && (
                <div className="tw-text-red-500 tw-text-sm tw-mt-1">{formik.errors.eventName}</div>
              )}
            </div>

            {/* Address */}
            <div>
              <div className="tw-flex tw-items-center tw-bg-white dark:tw-bg-gray-800 tw-rounded tw-border tw-border-gray-300 dark:tw-border-gray-600">
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  className="tw-flex-1 tw-p-3 dark:tw-text-white  tw-bg-transparent"
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
                      className="tw-px-3  tw-text-gray-500 hover:tw-text-gray-700 dark:hover:tw-text-gray-300"
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
                  Address selected from map. Click the X to clear or map icon to change.
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
                placeholder="Short description (will appear in the card) - Max 50 characters"
                className={`tw-w-full tw-p-3 dark:tw-text-white tw-rounded tw-bg-white dark:tw-bg-gray-800 tw-border ${formik.touched.shortDescription && formik.errors.shortDescription ? "tw-border-red-500" : "tw-border-gray-300 dark:tw-border-gray-600"} tw-resize-none`}
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
                    "This will appear in event cards (max 50 characters)"
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
                placeholder="Full description - Write as much as you want"
                className={`tw-w-full tw-p-3 dark:tw-text-white tw-rounded tw-bg-white dark:tw-bg-gray-800 tw-border ${formik.touched.fullDescription && formik.errors.fullDescription ? "tw-border-red-500" : "tw-border-gray-300 dark:tw-border-gray-600"} tw-resize-none`}
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
                    "Detailed description of your event"
                  )}
                </div>
                <div>
                  {formik.values.fullDescription.length} characters
                </div>
              </div>
            </div>

            {/* Price */}
            <div>
              <input
                type="number"
                name="price"
                placeholder="Price (EGP)"
                className={`tw-w-full tw-p-3 dark:tw-text-white tw-rounded tw-bg-white dark:tw-bg-gray-800 tw-border ${formik.touched.price && formik.errors.price ? "tw-border-red-500" : "tw-border-gray-300 dark:tw-border-gray-600"}`}
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
                placeholder="Phone number (01XXXXXXXXX)"
                className={`tw-w-full tw-p-3 dark:tw-text-white tw-rounded tw-bg-white dark:tw-bg-gray-800 tw-border ${formik.touched.phone && formik.errors.phone ? "tw-border-red-500" : "tw-border-gray-300 dark:tw-border-gray-600"}`}
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
                placeholder="Responsible person name"
                className={`tw-w-full tw-p-3 dark:tw-text-white tw-rounded tw-bg-white dark:tw-bg-gray-800 tw-border ${formik.touched.responsiblePerson && formik.errors.responsiblePerson ? "tw-border-red-500" : "tw-border-gray-300 dark:tw-border-gray-600"}`}
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
                className={`tw-w-full dark:tw-text-white tw-p-3 tw-rounded tw-bg-white dark:tw-bg-gray-800 tw-border ${formik.touched.date && formik.errors.date ? "tw-border-red-500" : "tw-border-gray-300 dark:tw-border-gray-600"}`}
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
                <div key={index} className="tw-bg-white dark:tw-bg-gray-800 tw-rounded tw-p-4 tw-text-center tw-border tw-border-gray-300 dark:tw-border-gray-600">
                  {images[index] ? (
                    <>
                      <img 
                        src={images[index]} 
                        alt={`Event ${index + 1}`} 
                        className="tw-w-full tw-h-24 tw-object-cover tw-rounded tw-mb-2" 
                      />
                      {formik.touched.images?.[index] && formik.errors.images?.[index] && (
                        <div className="tw-text-red-500 tw-text-sm">{formik.errors.images[index]}</div>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="tw-mb-2 tw-text-gray-500 dark:tw-text-gray-300">
                        {index === 0 ? "Upload first event image" : 
                         index === 1 ? "Upload second event image" : 
                         "Upload third event image"}
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
                    className={`tw-inline-block dark:tw-bg-indigo-600 tw-px-4 tw-py-2 bg-main tw-rounded tw-cursor-pointer ${images[index] ? "tw-bg-gray-200 hover:tw-bg-gray-300" : "tw-bg-blue-500 hover:tw-bg-blue-600"} tw-transition tw-text-white`}
                  >
                    {images[index] ? "Change Image" : "Select Image"}
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
              className={`tw-w-full tw-mt-6 tw-p-3 bg-main dark:tw-bg-indigo-600 tw-rounded tw-font-bold tw-transition tw-text-white ${!allImagesUploaded ? 'tw-opacity-50 tw-cursor-not-allowed' : ''}`}
              disabled={!allImagesUploaded || formik.isSubmitting}
            >
              {formik.isSubmitting ? "Submitting..." : "Submit"}
              {!allImagesUploaded && (
                <div className="tw-text-xs tw-mt-1">
                  Please upload all 3 images to submit
                </div>
              )}
            </button>
          </form>

          {/* Location Modal */}
          {locationModal && (
            <div className="tw-fixed tw-inset-0 tw-bg-black/50 tw-flex tw-items-center tw-justify-center tw-z-50 tw-p-4">
              <div className="tw-bg-white dark:tw-bg-gray-800 tw-p-6 tw-rounded-lg tw-w-full tw-max-w-md shad">
                <div className="tw-flex tw-justify-between tw-items-center tw-mb-4">
                  <h3 className="tw-text-lg tw-font-bold dark:tw-text-white">Select Your Location</h3>
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
                    📍 Use My Location
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocationModal(false)}
                    className="tw-w-full  tw-p-2 tw-bg-green-500 hover:tw-bg-green-600 tw-rounded tw-transition tw-text-white"
                  >
                    ✔ Confirm Selected Location
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}