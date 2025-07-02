import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(null);

  const openImage = (index) => setCurrentIndex(index);
  const closeImage = () => setCurrentIndex(null);
  const showPrev = () => setCurrentIndex((prev) => (prev === 0 ? event.images.length - 1 : prev - 1));
  const showNext = () => setCurrentIndex((prev) => (prev === event.images.length - 1 ? 0 : prev + 1));

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`https://ugmproject.vercel.app/api/v1/event/getEventById/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // وهمي علشان تظهر اللودينج لمدة قصيرة لو الـ API سريع
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setEvent(res.data.event);
      } catch (err) {
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, token]);

  if (loading) {
    return (
      <div className="tw-flex tw-items-center tw-justify-center tw-h-screen">
        <div className="tw-w-12 tw-h-12 tw-border-4 tw-border-blue-500 tw-border-t-transparent tw-rounded-full tw-animate-spin"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="tw-text-center tw-mt-20 tw-text-red-600 tw-font-bold text-xl">
        Event not found.
      </div>
    );
  }

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="tw-container tw-mx-auto tw-px-4 tw-py-10 tw-bg-gradient-to-b tw-from-white tw-to-gray-50 dark:tw-from-gray-900 dark:tw-to-gray-950"
    >
      {/* زر الرجوع */}
      <div className="tw-mb-4">
        <button
          onClick={() => navigate('/events')}
          className="tw-flex tw-items-center tw-gap-2 tw-text-blue-600 hover:tw-text-blue-800 dark:tw-text-blue-400 dark:hover:tw-text-blue-200 tw-font-medium tw-bg-blue-50 dark:tw-bg-gray-800 tw-px-4 tw-py-2 tw-rounded-xl tw-shadow-sm hover:tw-shadow-md tw-transition-all"
        >
          <span className="tw-text-lg">⬅️</span> Back to Events
        </button>
      </div>

      {/* Image Viewer */}
      {currentIndex !== null && (
        <div
          className="tw-fixed tw-inset-0 tw-bg-black/80 tw-flex tw-items-center tw-justify-center tw-z-50 tw-p-4"
          onClick={closeImage}
        >
          <div className="tw-relative tw-max-w-[90%] tw-max-h-[90%]" onClick={(e) => e.stopPropagation()}>
            <img
              src={
                event.images[currentIndex]?.startsWith('data:image')
                  ? event.images[currentIndex]
                  : `data:image/jpeg;base64,${event.images[currentIndex]}`
              }
              alt={`Event Image ${currentIndex + 1}`}
              className="tw-rounded-xl tw-shadow-2xl tw-object-contain tw-max-w-full tw-max-h-full"
            />
            <button
              onClick={closeImage}
              className="tw-absolute tw-top-2 tw-right-2 tw-bg-white/80 tw-rounded-full tw-px-3 tw-py-1 tw-text-black hover:tw-bg-white tw-text-xl tw-font-bold"
            >
              ×
            </button>
            <button
              onClick={showPrev}
              className="tw-absolute tw-top-1/2 tw-left-[-40px] md:tw-left-[-60px] tw-bg-white/80 tw-rounded-full tw-px-3 tw-py-1 hover:tw-bg-white tw-text-2xl -tw-translate-y-1/2"
            >
              ‹
            </button>
            <button
              onClick={showNext}
              className="tw-absolute tw-top-1/2 tw-right-[-40px] md:tw-right-[-60px] tw-bg-white/80 tw-rounded-full tw-px-3 tw-py-1 hover:tw-bg-white tw-text-2xl -tw-translate-y-1/2"
            >
              ›
            </button>
          </div>
        </div>
      )}

      {/* Title */}
      <div className="tw-text-center tw-mb-6">
        <h1 className="tw-text-2xl md:tw-text-4xl tw-font-extrabold tw-text-blue-700 dark:tw-text-blue-400 tw-mb-2">{event.eventName}</h1>
        <p className="tw-text-gray-500 dark:tw-text-gray-300">📍 {event.address}</p>
        <div className="tw-flex tw-justify-center tw-gap-2 tw-mt-2">
          <span className="tw-bg-green-100 tw-text-green-600 tw-text-xs tw-px-3 tw-py-1 tw-rounded-full">{event.category}</span>
        </div>
      </div>

      {/* Images */}
      <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4 tw-mb-12">
        <img
          src={event.images[0]?.startsWith('data:image') ? event.images[0] : `data:image/jpeg;base64,${event.images[0]}`}
          alt="Main Event"
          onClick={() => openImage(0)}
          className="tw-rounded-2xl tw-object-cover tw-h-[300px] md:tw-h-[400px] tw-w-full tw-col-span-1 md:tw-col-span-2 tw-transition-transform hover:tw-scale-105 tw-shadow-md tw-cursor-pointer"
        />
        <div className="tw-flex tw-flex-col tw-gap-4">
          {event.images.slice(1).map((img, i) => (
            <img
              key={i}
              src={img.startsWith('data:image') ? img : `data:image/jpeg;base64,${img}`}
              alt={`Event ${i + 2}`}
              onClick={() => openImage(i + 1)}
              className="tw-rounded-2xl tw-object-cover tw-h-[130px] md:tw-h-[190px] tw-w-full tw-transition-transform hover:tw-scale-105 tw-shadow-md tw-cursor-pointer"
            />
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="tw-grid md:tw-grid-cols-2 tw-gap-8">
        <div className="tw-space-y-6">
          <section className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow-md tw-p-4 hover:tw-shadow-lg tw-transition-shadow">
            <h2 className="tw-text-lg tw-font-semibold tw-text-blue-600 dark:tw-text-blue-300 tw-mb-2">Short Description</h2>
            <p className="tw-text-gray-700 dark:tw-text-gray-200">{event.shortDescription}</p>
          </section>
          <section className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow-md tw-p-4 hover:tw-shadow-lg tw-transition-shadow">
            <h2 className="tw-text-lg tw-font-semibold tw-text-blue-600 dark:tw-text-blue-300 tw-mb-2">Full Description</h2>
            <p className="tw-text-gray-700 dark:tw-text-gray-200">{event.fullDescription}</p>
          </section>
          <section className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow-md tw-p-4 hover:tw-shadow-lg tw-transition-shadow">
            <h2 className="tw-text-lg tw-font-semibold tw-text-blue-600 dark:tw-text-blue-300 tw-mb-2">Responsible Servant</h2>
            <p className="tw-text-gray-700 dark:tw-text-gray-200">👤 {event.responsiblePerson}</p>
          </section>
          <section className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow-md tw-p-4 hover:tw-shadow-lg tw-transition-shadow">
            <h2 className="tw-text-lg tw-font-semibold tw-text-blue-600 dark:tw-text-blue-300 tw-mb-2">Contact</h2>
            <p className="tw-text-gray-700 dark:tw-text-gray-200">📞 {event.phone}</p>
          </section>
        </div>

        <div className="tw-space-y-4">
          <div className="tw-bg-white dark:tw-bg-gray-800 tw-shadow-xl tw-rounded-2xl tw-p-6 tw-h-fit">
            <h2 className="tw-text-2xl tw-font-bold tw-text-blue-700 dark:tw-text-blue-300 tw-mb-4">Start Booking</h2>
            <p className="tw-text-green-600 dark:tw-text-green-400 tw-text-4xl tw-font-extrabold tw-mb-1">{event.price} EGP</p>
          </div>
          <div className="tw-bg-white dark:tw-bg-gray-800 tw-shadow-md tw-rounded-2xl tw-p-4">
            <h2 className="tw-text-lg tw-font-semibold tw-text-blue-600 dark:tw-text-blue-300 tw-mb-2">Date</h2>
            <p className="tw-text-gray-700 dark:tw-text-gray-200 tw-flex tw-items-center tw-gap-2">
              🗓️ <span>{formattedDate}</span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
