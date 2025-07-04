import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../Spinner/Spinner';
import { FiArrowLeft } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { darkModeContext } from '../../Context/DarkModeContext';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function MemoryDetails() {
  const { id } = useParams();
  const { darkMode } = useContext(darkModeContext);
  const [memory, setMemory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`https://ugmproject.vercel.app/api/v1/memory/getMemoryById/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setMemory(res.data.memory))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className={darkMode ? 'tw-dark' : ''}>
        <div
          className={`tw-fixed tw-inset-0 ${darkMode ? 'tw-bg-gray-800' : 'tw-bg-white'} tw-flex tw-items-center tw-justify-center`}
          style={{ minHeight: '100vh' }}
        >
          <Spinner />
        </div>
      </div>
    );
  }

  if (!memory) return <div className="text-center text-danger mt-5">Memory not found.</div>;

  // حذف تكرار mainImage من galleryImages
  const allImages = [
    memory.mainImage,
    ...(memory.galleryImages || []).filter(img => img !== memory.mainImage)
  ];

  const openLightbox = idx => {
    setPhotoIndex(idx);
    setIsOpen(true);
  };

  const closeLightbox = () => setIsOpen(false);

  const showPrev = () => setPhotoIndex((photoIndex + allImages.length - 1) % allImages.length);

  const showNext = () => setPhotoIndex((photoIndex + 1) % allImages.length);

  return (
    <div className={darkMode ? 'tw-dark' : ''}>
      <div className={`tw-min-h-[80vh] ${darkMode ? 'tw-bg-gray-800' : 'tw-bg-white'}`}>
        <div className="container-fluid">
          <div className="container py-5">
            <div className="tw-mb-6">
              <button
                onClick={() => navigate('/memories')}
                className="tw-flex tw-items-center tw-gap-2 tw-text-blue-600 hover:tw-text-blue-800 dark:tw-text-blue-400 dark:hover:tw-text-blue-200 tw-font-medium tw-bg-blue-50 dark:tw-bg-gray-800 tw-px-4 tw-py-2 tw-rounded-xl tw-shadow-sm hover:tw-shadow-md tw-transition-all"
              >
                <FiArrowLeft className="tw-text-lg" /> Back to memories
              </button>
            </div>

            {/* العنوان */}
            <h2 className="tw-text-4xl tw-font-bold mb-2 mainColor text-center tw-drop-shadow-md dark:tw-text-indigo-600">
              {memory.memoryTitle}
            </h2>

            {/* التاريخ */}
            <p className="tw-text-center tw-mb-6 tw-flex tw-items-center tw-justify-center tw-gap-2 tw-text-gray-500 dark:tw-text-white">
              <span className="tw-text-xl">📅</span>
              {new Date(memory.date).toLocaleDateString('en-GB', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>

            <motion.div
              className={`tw-shadow-xl tw-rounded-2xl tw-p-5 ${darkMode ? 'tw-bg-gray-900' : 'tw-bg-white'}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 md:tw-grid-cols-3 lg:tw-grid-cols-4 tw-gap-5">
                {allImages.map((img, i) => (
                  <motion.div
                    key={i}
                    className="tw-rounded-xl tw-overflow-hidden tw-shadow-md hover:tw-shadow-xl tw-transition-all tw-duration-300 tw-cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    onClick={() => openLightbox(i)}
                  >
                    <img src={img} alt={`memory-${i}`} className="tw-w-full tw-h-60 tw-object-cover" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Lightbox Overlay */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="tw-fixed tw-inset-0 tw-bg-gray-900 tw-bg-opacity-70 tw-flex tw-items-center tw-justify-center tw-z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeLightbox}
              >
                <div className="tw-relative tw-max-w-full tw-max-h-full" onClick={e => e.stopPropagation()}>
                  <X
                    className="tw-absolute -tw-top-8 tw-right-4 tw-text-red-500 hover:tw-text-red-700 tw-cursor-pointer tw-transition-all tw-duration-300"
                    size={36}
                    onClick={closeLightbox}
                  />
                  <ChevronLeft
                    className="tw-absolute tw-left-4 tw-top-1/2 tw-transform tw--translate-y-1/2 tw-cursor-pointer hover:tw-scale-125 tw-transition-transform tw-duration-300 mainColor dark:tw-text-indigo-500"
                    size={48}
                    onClick={showPrev}
                  />
                  <motion.img
                    key={allImages[photoIndex]}
                    src={allImages[photoIndex]}
                    alt={`lightbox-${photoIndex}`}
                    className="tw-max-w-[90vw] tw-max-h-[80vh] tw-object-contain tw-rounded"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  />
                  <ChevronRight
                    className="tw-absolute tw-right-4 tw-top-1/2 tw-transform tw--translate-y-1/2 tw-cursor-pointer hover:tw-scale-125 tw-transition-transform tw-duration-300 mainColor dark:tw-text-indigo-500"
                    size={48}
                    onClick={showNext}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
