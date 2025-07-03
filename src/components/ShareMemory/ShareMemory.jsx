import React, { useState, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import { darkModeContext } from '../../Context/DarkModeContext';
import { useTranslation } from 'react-i18next';

export default function ShareMemory() {
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const { darkMode } = useContext(darkModeContext);
  const { t } = useTranslation('memoryForm');
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

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
    onSubmit: values => {
      const dataToSubmit = {
        title: values.title,
        date: values.date,
        mainImage: values.mainImage,
        galleryImages: values.galleryImages
      };
      console.log('Submitted:', dataToSubmit);
    }
  });

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImagePreview(URL.createObjectURL(file));
      formik.setFieldValue('mainImage', file);
    }
  };

  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      url: URL.createObjectURL(file),
      file
    }));
    setGalleryPreviews([...galleryPreviews, ...previews]);
    formik.setFieldValue('galleryImages', [...formik.values.galleryImages, ...files]);
  };

  const handleRemoveGalleryImage = (id) => {
    const updatedPreviews = galleryPreviews.filter(img => img.id !== id);
    setGalleryPreviews(updatedPreviews);
    
    const updatedFiles = formik.values.galleryImages.filter((_, index) => {
      return galleryPreviews.findIndex(img => img.id === id) !== index;
    });
    formik.setFieldValue('galleryImages', updatedFiles);
  };

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

            <div className={`tw-max-w-4xl tw-mx-auto tw-shadow-md tw-rounded-lg tw-p-8 ${darkMode ? 'tw-bg-gray-900' : 'tw-bg-[#F3F4F6]'}`}>
              <form onSubmit={formik.handleSubmit} className="tw-space-y-6">
                {/* Title */}
                <div>
                  <label className="tw-block tw-text-gray-700 tw-mb-2 dark:tw-text-gray-300">
                    {t('form.titleLabel')}
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="tw-w-full tw-p-3 tw-border tw-border-gray-300 dark:tw-border-gray-700 tw-rounded-lg dark:tw-bg-gray-800 dark:tw-text-white"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.title && formik.errors.title && (
                    <p className="tw-text-red-500 tw-text-sm tw-mt-1">{formik.errors.title}</p>
                  )}
                </div>

                {/* Date */}
                <div>
                  <label className="tw-block tw-text-gray-700 tw-mb-2 dark:tw-text-gray-300">
                    {t('form.dateLabel')}
                  </label>
                  <input
                    type="date"
                    name="date"
                    className="tw-w-full tw-p-3 tw-border tw-border-gray-300 dark:tw-border-gray-700 tw-rounded-lg dark:tw-bg-gray-800 dark:tw-text-white"
                    value={formik.values.date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.date && formik.errors.date && (
                    <p className="tw-text-red-500 tw-text-sm tw-mt-1">{formik.errors.date}</p>
                  )}
                </div>

                {/* Main Image */}
                <div>
                  <label className="tw-block tw-text-gray-700 tw-mb-2 dark:tw-text-gray-300">
                    {t('form.mainImageLabel')}
                  </label>
                  <label className="tw-block tw-cursor-pointer tw-bg-white dark:tw-bg-gray-800 tw-border-2 tw-border-dashed tw-border-gray-300 dark:tw-border-gray-700 tw-rounded-lg tw-text-center tw-py-12 hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700 tw-transition">
                    <input
                      type="file"
                      accept="image/*"
                      className="tw-hidden"
                      onChange={handleMainImageChange}
                    />
                    {mainImagePreview ? (
                      <div className="tw-relative">
                        <img src={mainImagePreview} alt="Preview" className="tw-mx-auto tw-max-h-64 tw-rounded-lg" />
                        <button
                          type="button"
                          onClick={() => {
                            setMainImagePreview(null);
                            formik.setFieldValue('mainImage', null);
                          }}
                          className="tw-absolute tw-top-2 tw-right-2 tw-bg-red-500 tw-text-white tw-rounded-full tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="tw-text-gray-500 dark:tw-text-gray-400">
                        {t('form.selectMainImage')}
                      </div>
                    )}
                  </label>
                  {formik.touched.mainImage && formik.errors.mainImage && (
                    <p className="tw-text-red-500 tw-text-sm tw-mt-1">{formik.errors.mainImage}</p>
                  )}
                </div>

                {/* Gallery Images */}
                <div>
                  <label className="tw-block tw-text-gray-700 tw-mb-2 dark:tw-text-gray-300">
                    {t('form.galleryImagesLabel')}
                  </label>
                  <label className="tw-block tw-cursor-pointer tw-bg-white dark:tw-bg-gray-800 tw-border-2 tw-border-dashed tw-border-gray-300 dark:tw-border-gray-700 tw-rounded-lg tw-text-center tw-py-12 hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700 tw-transition">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="tw-hidden"
                      onChange={handleGalleryImagesChange}
                    />
                    {galleryPreviews.length > 0 ? (
                      <div className="tw-grid tw-grid-cols-4 tw-gap-4 tw-px-4">
                        {galleryPreviews.map((preview) => (
                          <div key={preview.id} className="tw-aspect-square tw-overflow-hidden tw-rounded-lg tw-shadow-sm tw-relative">
                            <img 
                              src={preview.url} 
                              alt="Preview" 
                              className="tw-object-cover tw-w-full tw-h-full" 
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(preview.id)}
                              className="tw-absolute tw-top-1 tw-right-1 tw-bg-red-500 tw-text-white tw-rounded-full tw-w-6 tw-h-6 tw-flex tw-items-center tw-justify-center tw-text-sm"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="tw-text-gray-500 dark:tw-text-gray-400">
                        {t('form.selectGalleryImages')}
                      </div>
                    )}
                  </label>
                  {formik.touched.galleryImages && formik.errors.galleryImages && (
                    <p className="tw-text-red-500 tw-text-sm tw-mt-1">{formik.errors.galleryImages}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="tw-pt-4">
                  <button
                    type="submit"
                    className="tw-w-full bg-main dark:tw-bg-indigo-600 hover:tw-bg-purple-700 tw-text-white tw-font-bold tw-py-3 tw-px-6 tw-rounded-lg tw-transition"
                  >
                    {t('form.submitButton')}
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