import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FiArrowLeft } from 'react-icons/fi';
import { FaCalendarAlt, FaPhone, FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from 'react-hot-toast';

// Custom Marker Icon
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [imageLoading, setImageLoading] = useState(Array(4).fill(true));
  const [position, setPosition] = useState([31.2001, 29.9187]); // Default Alexandria coordinates
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const openImage = (index) => setCurrentIndex(index);
  const closeImage = () => setCurrentIndex(null);
  const showPrev = () => setCurrentIndex((prev) => (prev === 0 ? event.images.length - 1 : prev - 1));
  const showNext = () => setCurrentIndex((prev) => (prev === event.images.length - 1 ? 0 : prev + 1));

  const getCloudinaryUrl = (image) => {
    if (!image) return '';
    
    if (image.includes('cloudinary.com')) {
      return image;
    }
    
    if (image.startsWith('UgmMemoryUploads/')) {
      return `https://res.cloudinary.com/djmr1aded/image/upload/${image}`;
    }
    
    if (image.startsWith('data:image')) {
      return '/default-event-image.jpg';
    }
    
    return '/default-event-image.jpg';
  };

  const updateMap = (newPosition) => {
    setPosition(newPosition);
    
    if (mapRef.current) {
      mapRef.current.setView(newPosition, 15);
      
      if (markerRef.current) {
        mapRef.current.removeLayer(markerRef.current);
      }
      
      markerRef.current = L.marker(newPosition, { icon: customIcon })
        .bindPopup(`<b>${event?.eventName || 'Event Location'}</b><br>${event?.address || ''}`)
        .addTo(mapRef.current);
      
      markerRef.current.openPopup();
    }
  };

  const geocodeAddress = async (address) => {
    try {
      // First try with the exact address
      let response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&q=${encodeURIComponent(address)}`
      );
      let data = await response.json();

      // If no results, try with Egypt appended
      if (data.length === 0) {
        response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&q=${encodeURIComponent(address + ', Egypt')}`
        );
        data = await response.json();
      }

      if (data.length > 0) {
        const bestResult = data[0];
        const newPosition = [parseFloat(bestResult.lat), parseFloat(bestResult.lon)];
        
        console.log('Found location:', bestResult.display_name);
        updateMap(newPosition);
        return true;
      }

      console.log('No results found for address:', address);
      toast.error('Could not find location on map. Showing default location.');
      return false;
    } catch (error) {
      console.error('Geocoding error:', error);
      toast.error('Error while trying to locate address on map');
      return false;
    }
  };

  const showMapError = () => {
    toast.error('Could not determine event location. Showing default location.');
    updateMap(position);
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://ugmproject.vercel.app/api/v1/event/getEventById/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEvent(res.data.event);
        
        if (res.data.event.address && res.data.event.address.trim() !== '') {
          const success = await geocodeAddress(res.data.event.address.trim());
          if (!success) {
            showMapError();
          }
        } else {
          showMapError();
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        toast.error('Failed to load event details');
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
      <div className="tw-text-center tw-mt-20 tw-text-red-600 tw-font-bold tw-text-xl">
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
      {/* Back Button */}
      <div className="tw-mb-6">
        <button
          onClick={() => navigate('/events')}
          className="tw-flex tw-items-center tw-gap-2 tw-text-blue-600 hover:tw-text-blue-800 dark:tw-text-blue-400 dark:hover:tw-text-blue-200 tw-font-medium tw-bg-blue-50 dark:tw-bg-gray-800 tw-px-4 tw-py-2 tw-rounded-xl tw-shadow-sm hover:tw-shadow-md tw-transition-all"
        >
          <FiArrowLeft className="tw-text-lg" /> Back to Events
        </button>
      </div>

      {/* Image Viewer */}
      {currentIndex !== null && (
        <div
          className="tw-fixed tw-inset-0 tw-bg-black/90 tw-flex tw-items-center tw-justify-center tw-z-50 tw-p-4"
          onClick={closeImage}
        >
          <div className="tw-relative tw-max-w-[90vw] tw-max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <img
              src={getCloudinaryUrl(event.images[currentIndex])}
              alt={`Event Image ${currentIndex + 1}`}
              className="tw-rounded-xl tw-shadow-2xl tw-object-contain tw-max-w-full tw-max-h-[80vh]"
              onLoad={() => setImageLoading(prev => {
                const newLoading = [...prev];
                newLoading[currentIndex] = false;
                return newLoading;
              })}
            />
            
            {imageLoading[currentIndex] && (
              <div className="tw-absolute tw-inset-0 tw-flex tw-items-center tw-justify-center">
                <div className="tw-w-12 tw-h-12 tw-border-4 tw-border-blue-500 tw-border-t-transparent tw-rounded-full tw-animate-spin"></div>
              </div>
            )}
            
            <button
              onClick={closeImage}
              className="tw-absolute tw-top-2 tw-right-2 tw-bg-white/80 tw-rounded-full tw-px-3 tw-py-1 tw-text-black hover:tw-bg-white tw-text-xl tw-font-bold"
            >
              ×
            </button>
            <button
              onClick={showPrev}
              className="tw-absolute tw-top-1/2 tw-left-2 md:tw-left-4 tw-bg-white/80 tw-rounded-full tw-px-3 tw-py-1 hover:tw-bg-white tw-text-2xl -tw-translate-y-1/2"
            >
              ‹
            </button>
            <button
              onClick={showNext}
              className="tw-absolute tw-top-1/2 tw-right-2 md:tw-right-4 tw-bg-white/80 tw-rounded-full tw-px-3 tw-py-1 hover:tw-bg-white tw-text-2xl -tw-translate-y-1/2"
            >
              ›
            </button>
          </div>
        </div>
      )}

      {/* Title */}
      <div className="tw-text-center tw-mb-8">
        <h1 className="tw-text-3xl md:tw-text-4xl tw-font-extrabold tw-text-blue-700 dark:tw-text-blue-400 tw-mb-3">
          {event.eventName}
        </h1>
        <div className="tw-flex tw-justify-center tw-gap-2 tw-mt-3">
          <span className="tw-bg-green-100 tw-text-green-600 tw-text-sm tw-px-3 tw-py-1 tw-rounded-full">
            {event.category}
          </span>
        </div>
      </div>

      {/* Images */}
      <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4 tw-mb-12">
        {/* Main Image */}
        <div className="tw-relative tw-col-span-1 md:tw-col-span-2">
          <img
            src={getCloudinaryUrl(event.images[0])}
            alt="Main Event"
            onClick={() => openImage(0)}
            className="tw-rounded-2xl tw-object-cover tw-h-[300px] md:tw-h-[400px] tw-w-full tw-transition-transform hover:tw-scale-105 tw-shadow-lg tw-cursor-pointer"
            onLoad={() => setImageLoading(prev => {
              const newLoading = [...prev];
              newLoading[0] = false;
              return newLoading;
            })}
          />
          {imageLoading[0] && (
            <div className="tw-absolute tw-inset-0 tw-flex tw-items-center tw-justify-center tw-bg-gray-100 dark:tw-bg-gray-800 tw-rounded-2xl">
              <div className="tw-w-12 tw-h-12 tw-border-4 tw-border-blue-500 tw-border-t-transparent tw-rounded-full tw-animate-spin"></div>
            </div>
          )}
        </div>

        {/* Secondary Images */}
        <div className="tw-flex tw-flex-col tw-gap-4">
          {event.images.slice(1, 4).map((img, i) => (
            <div key={i} className="tw-relative">
              <img
                src={getCloudinaryUrl(img)}
                alt={`Event ${i + 2}`}
                onClick={() => openImage(i + 1)}
                className="tw-rounded-2xl tw-object-cover tw-h-[130px] md:tw-h-[190px] tw-w-full tw-transition-transform hover:tw-scale-105 tw-shadow-md tw-cursor-pointer"
                onLoad={() => setImageLoading(prev => {
                  const newLoading = [...prev];
                  newLoading[i + 1] = false;
                  return newLoading;
                })}
              />
              {imageLoading[i + 1] && (
                <div className="tw-absolute tw-inset-0 tw-flex tw-items-center tw-justify-center tw-bg-gray-100 dark:tw-bg-gray-800 tw-rounded-2xl">
                  <div className="tw-w-8 tw-h-8 tw-border-4 tw-border-blue-500 tw-border-t-transparent tw-rounded-full tw-animate-spin"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="tw-grid md:tw-grid-cols-2 tw-gap-8">
        <div className="tw-space-y-6">
          {/* Short Description */}
          <section className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow-md tw-p-6 hover:tw-shadow-lg tw-transition-shadow">
            <h2 className="tw-text-xl tw-font-semibold tw-text-blue-600 dark:tw-text-blue-300 tw-mb-3">
              Short Description
            </h2>
            <p className="tw-text-gray-700 dark:tw-text-gray-200 tw-leading-relaxed">
              {event.shortDescription}
            </p>
          </section>

          {/* Full Description */}
          <section className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow-md tw-p-6 hover:tw-shadow-lg tw-transition-shadow">
            <h2 className="tw-text-xl tw-font-semibold tw-text-blue-600 dark:tw-text-blue-300 tw-mb-3">
              Full Description
            </h2>
            <p className="tw-text-gray-700 dark:tw-text-gray-200 tw-leading-relaxed">
              {event.fullDescription}
            </p>
          </section>

          {/* Responsible Person */}
          <section className="tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow-md tw-p-6 hover:tw-shadow-lg tw-transition-shadow">
            <h2 className="tw-text-xl tw-font-semibold tw-text-blue-600 dark:tw-text-blue-300 tw-mb-3 tw-flex tw-items-center tw-gap-2">
              <FaUser /> Responsible Servant
            </h2>
            <p className="tw-text-gray-700 dark:tw-text-gray-200">
              {event.responsiblePerson}
            </p>
          </section>

          {/* Contact Only */}
          <div className="tw-bg-white dark:tw-bg-gray-800 tw-shadow-md tw-rounded-2xl tw-p-6">
            <h2 className="tw-text-xl tw-font-semibold tw-text-blue-600 dark:tw-text-blue-300 tw-mb-3 tw-flex tw-items-center tw-gap-2">
              <FaPhone /> Contact
            </h2>
            <p className="tw-text-gray-700 dark:tw-text-gray-200">
              {event.phone}
            </p>
          </div>

          {/* Address Only */}
          <div className="tw-bg-white dark:tw-bg-gray-800 tw-shadow-md tw-rounded-2xl tw-p-6">
            <h2 className="tw-text-xl tw-font-semibold tw-text-blue-600 dark:tw-text-blue-300 tw-mb-3 tw-flex tw-items-center tw-gap-2">
              <FaMapMarkerAlt /> Address
            </h2>
            <p className="tw-text-gray-700 dark:tw-text-gray-200">
              {event.address}
            </p>
          </div>
        </div>

        <div className="tw-space-y-6">
          {/* Booking Card */}
          <div className="tw-bg-white dark:tw-bg-gray-800 tw-shadow-xl tw-rounded-2xl tw-p-6 tw-h-fit  tw-top-4">
            <h2 className="tw-text-2xl tw-font-bold tw-text-blue-700 dark:tw-text-blue-300 tw-mb-4">
              Start Booking
            </h2>
            <p className="tw-text-green-600 dark:tw-text-green-400 tw-text-4xl tw-font-extrabold tw-mb-6">
              {event.price} EGP
            </p>
            {/* <button className="tw-w-full tw-bg-blue-600 hover:tw-bg-blue-700 tw-text-white tw-font-bold tw-py-3 tw-px-4 tw-rounded-lg tw-transition-colors">
              Book Now
            </button> */}
          </div>

          {/* Date */}
          <div className="tw-bg-white dark:tw-bg-gray-800 tw-shadow-md tw-rounded-2xl tw-p-6">
            <h2 className="tw-text-xl tw-font-semibold tw-text-blue-600 dark:tw-text-blue-300 tw-mb-3 tw-flex tw-items-center tw-gap-2">
              <FaCalendarAlt /> Event Date
            </h2>
            <p className="tw-text-gray-700 dark:tw-text-gray-200">
              {formattedDate}
            </p>
          </div>

          {/* Map Section */}
          <div className="tw-bg-white dark:tw-bg-gray-800 tw-shadow-md tw-rounded-2xl tw-overflow-hidden">
            <div className="tw-p-4 tw-border-b">
              <h2 className="tw-text-xl tw-font-semibold tw-text-blue-600 dark:tw-text-blue-300 tw-flex tw-items-center tw-gap-2">
                <FaMapMarkerAlt /> Event Location
              </h2>
            </div>
            
            <div className="tw-h-64 tw-w-full tw-relative">
              <MapContainer 
                center={position} 
                zoom={15} 
                style={{ height: '100%', width: '100%' }}
                whenCreated={(mapInstance) => {
                  mapRef.current = mapInstance;
                  markerRef.current = L.marker(position, { icon: customIcon })
                    .bindPopup(`
                      <b>${event?.eventName || 'Event Location'}</b><br>
                      ${event?.address || 'Address not precisely determined'}
                    `)
                    .addTo(mapInstance);
                }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </MapContainer>
              
              {!event.address && (
                <div className="tw-absolute tw-bottom-2 tw-left-2 tw-bg-yellow-100 tw-text-yellow-800 tw-p-2 tw-rounded tw-text-sm">
                  No precise location determined for this event
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}