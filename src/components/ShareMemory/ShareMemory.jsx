import React, { useState, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { darkModeContext } from '../../Context/DarkModeContext';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import axios from 'axios';
import imageCompression from 'browser-image-compression';

export default function ShareMemory() {
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { darkMode } = useContext(darkModeContext);
  const { t } = useTranslation('memoryForm');
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      maxIteration: 10,
      initialQuality: 0.1,
      fileType: file.type.match('png') ? 'image/png' : 'image/jpeg',
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error('Error compressing image:', error);
      toast.error(t('imageCompressionError') || 'Failed to compress image.');
      return file;
    }
  };

  const handleMainImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // تحقق إذا كانت الصورة موجودة بالفعل في المعرض
    const isImageInGallery = galleryPreviews.some(
      img => img.file.name === file.name
    );

    if (isImageInGallery) {
      toast.error(t('imageAlreadyInGallery') || 'This image is already in the gallery');
      return;
    }

    try {
      const compressedFile = await compressImage(file);
      setMainImagePreview(URL.createObjectURL(compressedFile));
      formik.setFieldValue('mainImage', compressedFile);
      console.log("🌟 Main Image Set:", compressedFile.name, "Size:", compressedFile.size);
    } catch (error) {
      console.error("Error processing main image:", error);
      toast.error(t('imageProcessingError') || 'Failed to process image.');
    }
  };

  const handleRemoveMainImage = () => {
    setMainImagePreview(null);
    formik.setFieldValue('mainImage', null);
  };

  const handleGalleryImagesChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // تصفية الملفات المكررة والمشابهة للصورة الرئيسية
    const filteredFiles = files.filter(file => {
      // استبعاد إذا كانت الصورة الرئيسية موجودة وتطابق اسم الملف
      if (formik.values.mainImage && file.name === formik.values.mainImage.name) {
        toast.error(t('imageIsMainImage') || 'This image is already set as main image');
        return false;
      }
      
      // استبعاد الملفات المكررة في المعرض
      if (galleryPreviews.some(img => img.file.name === file.name)) {
        toast.error(t('imageAlreadyInGallery') || 'This image is already in the gallery');
        return false;
      }
      
      return true;
    });

    if (filteredFiles.length === 0) return;

    const compressedFiles = [];
    for (const file of filteredFiles) {
      try {
        const compressed = await compressImage(file);
        compressedFiles.push(compressed);
        console.log("✅ Compressed Gallery Image:", compressed.name, "Size:", compressed.size);
      } catch (error) {
        console.error("Error compressing gallery image:", error);
        toast.error(t('imageCompressionError') || 'Failed to compress image.');
      }
    }

    const previews = compressedFiles.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      url: URL.createObjectURL(file),
      file,
      name: file.name
    }));

    setGalleryPreviews(prev => [...prev, ...previews]);
    formik.setFieldValue('galleryImages', [...formik.values.galleryImages, ...compressedFiles]);
  };

  const handleRemoveGalleryImage = (id) => {
    const updatedPreviews = galleryPreviews.filter(img => img.id !== id);
    setGalleryPreviews(updatedPreviews);

    const updatedFiles = formik.values.galleryImages.filter(
      (_, index) => galleryPreviews[index].id !== id
    );
    formik.setFieldValue('galleryImages', updatedFiles);
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      date: '',
      mainImage: null,
      galleryImages: []
    },
    validationSchema: Yup.object({
      title: Yup.string().required(t('validation.titleRequired')),
      date: Yup.date().required(t('validation.dateRequired')),
      mainImage: Yup.mixed().required(t('validation.mainImageRequired')),
      galleryImages: Yup.array().min(1, t('validation.galleryImagesRequired'))
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!values.mainImage) {
        toast.error(t('validation.mainImageRequired'));
        return;
      }

      if (values.galleryImages.length === 0) {
        toast.error(t('validation.galleryImagesRequired'));
        return;
      }

      console.log("🚀 Submitting Form Data:");
      console.log("Title:", values.title);
      console.log("Date:", values.date);
      console.log("Main Image:", values.mainImage?.name);
      console.log("Gallery Images:", values.galleryImages.map(f => f.name));

      const formData = new FormData();
      formData.append("memoryTitle", values.title);
      formData.append("date", values.date);
      formData.append("mainImage", values.mainImage);
      
      values.galleryImages.forEach((file, index) => {
        formData.append(`galleryImages`, file);
      });

      try {
        setIsSubmitting(true);
        const token = localStorage.getItem("token");
        
        const response = await axios.post(
          "https://ugmproject.vercel.app/api/v1/memory/createMemory",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data"
            }
          }
        );

toast.success(t('messages.memoryAddedSuccess'));
        resetForm();
        setMainImagePreview(null);
        setGalleryPreviews([]);
      } catch (error) {
        console.error("❌ Upload error:", error);
        toast.error(t('uploadError') || "Failed to upload memory.");
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  return (
    <div className={`${darkMode ? 'tw-dark' : ''}`}>
      <div className="container-fluid dark:tw-bg-gray-800">
        <motion.div
          initial={{ opacity: 0, x: isRTL ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="tw-min-h-screen tw-py-8 tw-px-4">
            <div className="tw-max-w-4xl tw-mx-auto tw-text-center tw-mb-8">
              <h1 className="tw-text-3xl tw-font-bold mainColor tw-mb-3 dark:tw-text-indigo-600">
                {t('shareMemory.title')}
              </h1>
              <p className="tw-text-gray-600 fs-4 tw-text-lg dark:tw-text-gray-300">
                {t('shareMemory.description')}
              </p>
            </div>

            <div className={`tw-max-w-4xl tw-mx-auto tw-shadow-md tw-rounded-lg tw-p-8 ${
              darkMode ? 'tw-bg-gray-900' : 'tw-bg-[#F3F4F6]'
            }`}>
              <form onSubmit={formik.handleSubmit} className="tw-space-y-6">
                {/* Title Field */}
                <div>
                  <label className="tw-block tw-text-gray-700 tw-mb-2 dark:tw-text-gray-300">
                    {t('form.titleLabel')}
                  </label>
                  <input
                    type="text"
                    name="title"
                    className={`tw-w-full tw-p-3 tw-border ${
                      formik.touched.title && formik.errors.title
                        ? 'tw-border-red-500'
                        : 'tw-border-gray-300 dark:tw-border-gray-700'
                    } tw-rounded-lg dark:tw-bg-gray-800 dark:tw-text-white`}
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isSubmitting}
                  />
                  {formik.touched.title && formik.errors.title && (
                    <p className="tw-text-red-500 tw-text-sm tw-mt-1">
                      {formik.errors.title}
                    </p>
                  )}
                </div>

                {/* Date Field */}
                <div>
                  <label className="tw-block tw-text-gray-700 tw-mb-2 dark:tw-text-gray-300">
                    {t('form.dateLabel')}
                  </label>
                  <input
                    type="date"
                    name="date"
                    className={`tw-w-full tw-p-3 tw-border ${
                      formik.touched.date && formik.errors.date
                        ? 'tw-border-red-500'
                        : 'tw-border-gray-300 dark:tw-border-gray-700'
                    } tw-rounded-lg dark:tw-bg-gray-800 dark:tw-text-white`}
                    value={formik.values.date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={isSubmitting}
                  />
                  {formik.touched.date && formik.errors.date && (
                    <p className="tw-text-red-500 tw-text-sm tw-mt-1">
                      {formik.errors.date}
                    </p>
                  )}
                </div>

                {/* Main Image Upload */}
                <div>
                  <label className="tw-block tw-text-gray-700 tw-mb-2 dark:tw-text-gray-300">
                    {t('form.mainImageLabel')}
                    <span className="tw-text-red-500">*</span>
                  </label>
                  <label
                    className={`tw-block tw-cursor-pointer tw-bg-white dark:tw-bg-gray-800 tw-border-2 ${
                      formik.touched.mainImage && formik.errors.mainImage
                        ? 'tw-border-red-500'
                        : 'tw-border-dashed tw-border-gray-300 dark:tw-border-gray-700'
                    } tw-rounded-lg tw-text-center tw-py-12 hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700 tw-transition`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="tw-hidden"
                      onChange={handleMainImageChange}
                      disabled={isSubmitting}
                    />
                    {mainImagePreview ? (
                      <div className="tw-relative tw-px-4">
                        <div className="tw-flex tw-flex-col tw-items-center">
                          <img
                            src={mainImagePreview}
                            alt="Main Preview"
                            className="tw-max-h-64 tw-rounded-lg tw-mb-2"
                          />
                          <p className="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400 tw-truncate tw-max-w-xs">
                            {formik.values.mainImage?.name}
                          </p>
                        </div>
                        {!isSubmitting && (
                          <button
                            type="button"
                            onClick={handleRemoveMainImage}
                            className="tw-absolute tw-top-2 tw-right-6 tw-bg-red-500 tw-text-white tw-rounded-full tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center"
                            title={t('form.removeImage') || 'Remove image'}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="tw-text-gray-500 dark:tw-text-gray-400">
                        <div className="tw-flex tw-flex-col tw-items-center">
                          <svg
                            className="tw-w-12 tw-h-12 tw-mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            ></path>
                          </svg>
                          <p>{t('form.selectMainImage')}</p>
                        </div>
                      </div>
                    )}
                  </label>
                  {formik.touched.mainImage && formik.errors.mainImage && (
                    <p className="tw-text-red-500 tw-text-sm tw-mt-1">
                      {formik.errors.mainImage}
                    </p>
                  )}
                </div>

                {/* Gallery Images Upload */}
                <div>
                  <label className="tw-block tw-text-gray-700 tw-mb-2 dark:tw-text-gray-300">
                    {t('form.galleryImagesLabel')}
                    <span className="tw-text-red-500">*</span>
                  </label>
                  <label
                    className={`tw-block tw-cursor-pointer tw-bg-white dark:tw-bg-gray-800 tw-border-2 ${
                      formik.touched.galleryImages && formik.errors.galleryImages
                        ? 'tw-border-red-500'
                        : 'tw-border-dashed tw-border-gray-300 dark:tw-border-gray-700'
                    } tw-rounded-lg tw-text-center tw-py-12 hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700 tw-transition`}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="tw-hidden"
                      onChange={handleGalleryImagesChange}
                      disabled={isSubmitting}
                    />
                    {galleryPreviews.length > 0 ? (
                      <div className="tw-px-4">
                        <div className="tw-grid tw-grid-cols-2 sm:tw-grid-cols-3 md:tw-grid-cols-4 tw-gap-4">
                          {galleryPreviews.map((preview) => (
                            <div
                              key={preview.id}
                              className="tw-aspect-square tw-overflow-hidden tw-rounded-lg tw-shadow-sm tw-relative tw-group"
                            >
                              <img
                                src={preview.url}
                                alt="Gallery Preview"
                                className="tw-object-cover tw-w-full tw-h-full"
                              />
                              <div className="tw-absolute tw-inset-0 tw-bg-black tw-bg-opacity-0 group-hover:tw-bg-opacity-30 tw-transition tw-flex tw-items-center tw-justify-center">
                                {!isSubmitting && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveGalleryImage(preview.id)}
                                    className="tw-opacity-0 group-hover:tw-opacity-100 tw-bg-red-500 tw-text-white tw-rounded-full tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-transition"
                                    title={t('form.removeImage') || 'Remove image'}
                                  >
                                    ×
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="tw-mt-4 tw-text-sm tw-text-gray-500 dark:tw-text-gray-400">
                          {t('form.addMoreImages') || 'Click to add more images'}
                        </p>
                      </div>
                    ) : (
                      <div className="tw-text-gray-500 dark:tw-text-gray-400">
                        <div className="tw-flex tw-flex-col tw-items-center">
                          <svg
                            className="tw-w-12 tw-h-12 tw-mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 4v16m8-8H4"
                            ></path>
                          </svg>
                          <p>{t('form.selectGalleryImages')}</p>
                        </div>
                      </div>
                    )}
                  </label>
                  {formik.touched.galleryImages && formik.errors.galleryImages && (
                    <p className="tw-text-red-500 tw-text-sm tw-mt-1">
                      {formik.errors.galleryImages}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="tw-pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`tw-w-full ${
                      isSubmitting
                        ? 'tw-bg-gray-400 dark:tw-bg-gray-600'
                        : 'bg-main dark:tw-bg-indigo-600 hover:tw-bg-purple-700'
                    } tw-text-white tw-font-bold tw-py-3 tw-px-6 tw-rounded-lg tw-transition tw-flex tw-items-center tw-justify-center`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="tw-animate-spin tw-h-5 tw-w-5 tw-mr-2 tw-text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          />
                        </svg>
                        {t('form.uploadingButton') || 'Uploading...'}
                      </>
                    ) : (
                      t('form.submitButton') || 'Share Memory'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}