import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBirthdayCake, FaUser, FaPhone, FaCalendarAlt, FaExclamationCircle, FaSync, FaChevronLeft, FaChevronRight, FaWhatsapp } from 'react-icons/fa';
import { darkModeContext } from '../../Context/DarkModeContext';
import axios from 'axios';
import Spinner from '../Spinner/Spinner';

export default function BirthdayList() {
  const { darkMode } = useContext(darkModeContext);
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6); // 6 items per page for 2x3 grid

  useEffect(() => {
    fetchBirthdays();
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchBirthdays = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please login again.');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        'https://ugmproject.vercel.app/api/v1/user/gitAllUsers',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data || !response.data.users) {
        setError('No users data found in response');
        setBirthdays([]);
        return;
      }

      const todayBirthdays = filterTodayBirthdays(response.data.users);
      setBirthdays(todayBirthdays);
      setCurrentPage(1); // Reset to first page when data changes
      
    } catch (err) {
      setError('Failed to fetch birthdays. Please try again.');
      console.error('Error fetching birthdays:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterTodayBirthdays = (users) => {
    const today = currentDate;
    const todayMonth = today.getMonth() + 1;
    const todayDate = today.getDate();

    return users.filter(user => {
      if (!user.birthDate) return false;
      
      try {
        const birthDate = new Date(user.birthDate);
        const birthMonth = birthDate.getMonth() + 1;
        const birthDay = birthDate.getDate();
        
        return birthMonth === todayMonth && birthDay === todayDate;
      } catch (err) {
        return false;
      }
    });
  };

  const getUserFullName = (user) => {
    const nameParts = [];
    if (user.firstName) nameParts.push(user.firstName);
    if (user.secName) nameParts.push(user.secName);
    if (user.familyName) nameParts.push(user.familyName);
    
    return nameParts.length > 0 ? nameParts.join(' ') : 'Unknown User';
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (err) {
      return 'Invalid Date';
    }
  };

  const getAge = (birthDate) => {
    try {
      const birth = new Date(birthDate);
      const today = currentDate;
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      return age;
    } catch (err) {
      return '?';
    }
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return 'No phone number';
    
    // تنظيف الرقم
    const cleanPhone = phone.replace(/\D/g, '');
    
    // تنسيق الرقم للعرض مع كود مصر
    if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
      return `+20 ${cleanPhone.substring(1, 4)} ${cleanPhone.substring(4, 7)} ${cleanPhone.substring(7)}`;
    } else if (cleanPhone.startsWith('20') && cleanPhone.length === 12) {
      return `+${cleanPhone.substring(0, 2)} ${cleanPhone.substring(2, 5)} ${cleanPhone.substring(5, 8)} ${cleanPhone.substring(8)}`;
    } else if (cleanPhone.length === 10) {
      return `+20 ${cleanPhone.substring(0, 3)} ${cleanPhone.substring(3, 6)} ${cleanPhone.substring(6)}`;
    }
    
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  };

  // دالة فتح محادثة واتساب - معدلة ومحسنة
  const openWhatsApp = (phoneNumber, userName) => {
    if (!phoneNumber) {
      alert('No phone number available for this user');
      return;
    }

    // تنظيف رقم الهاتف من أي رموز غير رقمية
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // إضافة كود مصر (+20) إذا كان الرقم يبدأ بـ 0 أو 1 ولم يكن به كود دولة
    let formattedPhone = cleanPhone;
    
    if (cleanPhone.startsWith('0')) {
      // إذا بدأ بـ 0، نزيل الـ 0 ونضيف 20
      formattedPhone = '20' + cleanPhone.substring(1);
    } else if (cleanPhone.startsWith('1') && cleanPhone.length === 11) {
      // إذا بدأ بـ 1 وطوله 11 رقم (مثل 01211772068) نضيف 20
      formattedPhone = '20' + cleanPhone;
    } else if (!cleanPhone.startsWith('20') && cleanPhone.length === 10) {
      // إذا كان طوله 10 أرقام بدون كود دولة
      formattedPhone = '20' + cleanPhone;
    }
    
    // التأكد من أن الرقم يبدأ بـ 20 (كود مصر) وليس به رموز غير رقمية
    if (!formattedPhone.startsWith('20')) {
      formattedPhone = '20' + formattedPhone;
    }
    
    // تنظيف نهائي من أي رموز غير رقمية
    formattedPhone = formattedPhone.replace(/\D/g, '');

    // التأكد من أن الرقم يبدأ بـ 20 وليس له أصفار زائدة
    if (formattedPhone.startsWith('200')) {
      formattedPhone = '20' + formattedPhone.substring(3);
    }

    // رسالة تهنئة مخصصة
const message = `🎉 كل سنة وانت طيب يا حبيبي ${userName}! 💖
ربنا يفرّح قلبك وعقبال 100 سنة 🥳🎂🎁`;
    
    // إنشاء رابط واتساب
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    
    console.log('Original phone:', phoneNumber);
    console.log('Cleaned phone:', cleanPhone);
    console.log('Formatted phone:', formattedPhone);
    console.log('WhatsApp URL:', whatsappUrl);
    
    // فتح الرابط في نافذة جديدة
    window.open(whatsappUrl, '_blank');
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBirthdays = birthdays.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(birthdays.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div className={`tw-flex tw-items-center tw-justify-center tw-p-4 ${darkMode ? 'tw-bg-gray-900' : 'tw-bg-gradient-to-br tw-from-purple-50 tw-to-blue-50'}`} style={{ height: '80vh' }}>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen tw-flex tw-items-center tw-justify-center tw-p-4 ${darkMode ? 'tw-bg-gray-900' : 'tw-bg-gradient-to-br tw-from-purple-50 tw-to-blue-50'}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="tw-bg-white tw-dark:tw-bg-gray-800 tw-rounded-2xl tw-shadow-lg tw-p-8 tw-max-w-md tw-w-full tw-text-center"
        >
          <FaExclamationCircle className="tw-text-red-500 tw-text-5xl tw-mx-auto tw-mb-4" />
          <h2 className={`tw-text-xl tw-font-semibold tw-mb-2 ${darkMode ? 'tw-text-white' : 'tw-text-gray-800'}`}>Error Loading Birthdays</h2>
          <p className={`tw-mb-6 ${darkMode ? 'tw-text-gray-300' : 'tw-text-gray-600'}`}>{error}</p>
          <button
            onClick={fetchBirthdays}
            className="tw-bg-purple-600 tw-text-white tw-px-6 tw-py-3 tw-rounded-lg hover:tw-bg-purple-700 tw-transition-colors tw-flex tw-items-center tw-justify-center tw-mx-auto"
          >
            <FaSync className="tw-mr-2" />
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`tw-p-4 md:tw-p-8 ${darkMode ? 'tw-bg-gray-900' : 'tw-bg-gradient-to-br tw-from-purple-50 tw-to-blue-50'}`} style={{ height: '80vh', maxHeight: '80vh', overflow: 'hidden' }}>
      <div className="tw-max-w-6xl tw-mx-auto tw-h-full tw-flex tw-flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="tw-text-center tw-mb-6 tw-flex-shrink-0"
        >
          <div className="tw-flex tw-items-center tw-justify-center tw-mb-4">
            <motion.div
              animate={{ rotate: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FaBirthdayCake className={`tw-text-4xl md:tw-text-5xl tw-mr-3 ${darkMode ? 'tw-text-purple-400' : 'tw-text-purple-600'}`} />
            </motion.div>
            <div>
              <h1 className={`tw-text-3xl md:tw-text-4xl tw-font-bold ${darkMode ? 'tw-text-white' : 'tw-text-gray-800'}`}>
                Today's Birthdays
              </h1>
              <p className={`tw-mt-2 ${darkMode ? 'tw-text-gray-300' : 'tw-text-gray-600'}`}>
                {currentDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
          
          <div className={`tw-rounded-full tw-px-6 tw-py-2 tw-inline-block tw-shadow-sm ${darkMode ? 'tw-bg-gray-800' : 'tw-bg-white'}`}>
            <span className={`tw-font-semibold ${darkMode ? 'tw-text-purple-400' : 'tw-text-purple-600'}`}>
              {birthdays.length} {birthdays.length === 1 ? 'birthday' : 'birthdays'} today
              {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
            </span>
          </div>
        </motion.div>

        {/* Content Area with Fixed Height */}
        <div className="tw-flex-1 tw-overflow-hidden">
          <AnimatePresence mode="wait">
            {birthdays.length === 0 ? (
              <motion.div
                key="no-birthdays"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="tw-text-center tw-bg-white tw-dark:tw-bg-gray-800 tw-rounded-2xl tw-shadow-lg tw-p-8 tw-h-full tw-flex tw-flex-col tw-items-center tw-justify-center"
              >
                <div className={`tw-w-24 tw-h-24 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mx-auto tw-mb-4 ${darkMode ? 'tw-bg-gray-700' : 'tw-bg-gray-100'}`}>
                  <FaBirthdayCake className={`tw-text-3xl ${darkMode ? 'tw-text-gray-400' : 'tw-text-gray-400'}`} />
                </div>
                <h3 className={`tw-text-xl tw-font-semibold tw-mb-2 ${darkMode ? 'tw-text-gray-300' : 'tw-text-gray-600'}`}>
                  No Birthdays Today
                </h3>
                <p className={`tw-mb-4 ${darkMode ? 'tw-text-gray-400' : 'tw-text-gray-500'}`}>
                  There are no birthdays to celebrate today. Check back tomorrow!
                </p>
                <button
                  onClick={fetchBirthdays}
                  className={`tw-font-medium ${darkMode ? 'tw-text-purple-400 hover:tw-text-purple-300' : 'tw-text-purple-600 hover:tw-text-purple-700'}`}
                >
                  Refresh List
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="birthdays-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="tw-h-full tw-flex tw-flex-col"
              >
                {/* Birthday Cards Grid */}
                <div className="tw-grid tw-gap-4 md:tw-gap-6 md:tw-grid-cols-2 lg:tw-grid-cols-3  tw-overflow-y-auto tw-pb-4">
                  {currentBirthdays.map((user, index) => (
                    <motion.div
                      key={user._id || user.id || index}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      transition={{ delay: (index % itemsPerPage) * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className={`tw-rounded-xl tw-shadow-lg tw-overflow-hidden tw-border-2 tw-transition-all tw-duration-300 ${
                        darkMode 
                          ? 'tw-bg-gray-800 tw-border-purple-900 hover:tw-border-purple-700' 
                          : 'tw-bg-white tw-border-purple-100 hover:tw-border-purple-300'
                      }`}
                    >
                      {/* Decorative Header */}
                      <div className="tw-bg-gradient-to-r tw-from-purple-600 tw-to-blue-600 tw-p-3 tw-text-white tw-relative">
                        <div className="tw-flex tw-items-center tw-justify-between">
                          <motion.div
                            animate={{ rotate: [0, 10, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            <FaBirthdayCake className="tw-text-xl" />
                          </motion.div>
                          <span className="tw-bg-white tw-text-purple-600 tw-px-2 tw-py-1 tw-rounded-full tw-text-xs tw-font-bold">
                            {getAge(user.birthDate)} years
                          </span>
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="tw-p-3">
                        <div className="tw-flex tw-items-center tw-mb-2">
                          <div className={`tw-p-2 tw-rounded-full tw-mr-2 ${
                            darkMode ? 'tw-bg-purple-900' : 'tw-bg-gradient-to-br tw-from-purple-100 tw-to-blue-100'
                          }`}>
                            <FaUser className={`tw-text-base ${darkMode ? 'tw-text-purple-400' : 'tw-text-purple-600'}`} />
                          </div>
                          <div className="tw-min-w-0 tw-flex-1">
                            <h3 className={`tw-font-bold tw-text-sm tw-truncate ${
                              darkMode ? 'tw-text-white' : 'tw-text-gray-800'
                            }`}>
                              {getUserFullName(user)}
                            </h3>
                            <p className={`tw-text-xs tw-truncate ${
                              darkMode ? 'tw-text-gray-400' : 'tw-text-gray-500'
                            }`}>Birthday Celebrant</p>
                          </div>
                        </div>

                        <div className="tw-space-y-1">
                          {/* Phone Number */}
                          <div className="tw-flex tw-items-center">
                            <div className={`tw-p-1 tw-rounded-full tw-mr-2 ${
                              darkMode ? 'tw-bg-green-900' : 'tw-bg-green-100'
                            }`}>
                              <FaPhone className={`tw-text-xs ${darkMode ? 'tw-text-green-400' : 'tw-text-green-600'}`} />
                            </div>
                            <span className={`tw-text-sm tw-font-medium tw-truncate ${
                              darkMode ? 'tw-text-gray-300' : 'tw-text-gray-700'
                            }`}>{formatPhoneNumber(user.phone)}</span>
                          </div>

                          {/* Birth Date */}
                          <div className="tw-flex tw-items-center">
                            <div className={`tw-p-1 tw-rounded-full tw-mr-2 ${
                              darkMode ? 'tw-bg-blue-900' : 'tw-bg-blue-100'
                            }`}>
                              <FaCalendarAlt className={`tw-text-xs ${darkMode ? 'tw-text-blue-400' : 'tw-text-blue-600'}`} />
                            </div>
                            <div>
                              <span className={`tw-text-sm tw-font-medium tw-block ${
                                darkMode ? 'tw-text-gray-300' : 'tw-text-gray-700'
                              }`}>{formatDate(user.birthDate)}</span>
                            </div>
                          </div>
                        </div>

                        {/* WhatsApp Button */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openWhatsApp(user.phone, getUserFullName(user))}
                          disabled={!user.phone}
                          className={`tw-w-full tw-mt-3 tw-py-2 tw-px-4 tw-rounded-lg tw-flex tw-items-center tw-justify-center tw-gap-2 tw-transition-all tw-duration-200 ${
                            user.phone
                              ? darkMode
                                ? 'tw-bg-green-700 hover:tw-bg-green-600 tw-text-white'
                                : 'tw-bg-green-500 hover:tw-bg-green-600 tw-text-white'
                              : darkMode
                                ? 'tw-bg-gray-700 tw-text-gray-400 tw-cursor-not-allowed'
                                : 'tw-bg-gray-300 tw-text-gray-500 tw-cursor-not-allowed'
                          }`}
                        >
                          <FaWhatsapp className="tw-text-lg" />
                          <span className="tw-font-medium">Send WhatsApp</span>
                        </motion.button>

                        {/* Celebration Badge */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: (index % itemsPerPage) * 0.1 + 0.3 }}
                          className="tw-mt-2 tw-pt-2 tw-border-t tw-border-gray-200 dark:tw-border-gray-700 tw-text-center"
                        >
                          <span className={`tw-inline-block tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-bold ${
                            darkMode 
                              ? 'tw-bg-gradient-to-r tw-from-green-900 tw-to-blue-900 tw-text-green-300' 
                              : 'tw-bg-gradient-to-r tw-from-green-100 tw-to-blue-100 tw-text-green-800'
                          }`}>
                            🎉 Happy Birthday! 🎂
                          </span>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="tw-flex tw-flex-shrink-0 tw-items-center tw-justify-center tw-mt-4 tw-pt-4 tw-border-t tw-border-gray-200 dark:tw-border-gray-700"
                  >
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className={`tw-p-2 tw-rounded-lg tw-mx-1 tw-transition-colors ${
                        currentPage === 1
                          ? 'tw-text-gray-400 tw-cursor-not-allowed'
                          : 'tw-text-purple-600 hover:tw-bg-purple-100 dark:hover:tw-bg-gray-700 dark:tw-text-gray-300'
                      }`}
                    >
                      <FaChevronLeft />
                    </button>

                    {/* Page Numbers */}
                    <div className="tw-flex tw-space-x-1 tw-mx-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`tw-px-3 tw-py-1 tw-rounded-lg tw-transition-colors ${
                            currentPage === page
                              ? 'tw-bg-purple-600 tw-text-white'
                              : `hover:tw-bg-purple-100 dark:hover:tw-bg-gray-700 ${
                                  darkMode ? 'tw-text-gray-300' : 'tw-text-gray-700'
                                }`
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className={`tw-p-2 tw-rounded-lg tw-mx-1 tw-transition-colors ${
                        currentPage === totalPages
                          ? 'tw-text-gray-400 tw-cursor-not-allowed'
                          : 'tw-text-purple-600 hover:tw-bg-purple-100 dark:hover:tw-bg-gray-700 dark:tw-text-gray-300'
                      }`}
                    >
                      <FaChevronRight />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}