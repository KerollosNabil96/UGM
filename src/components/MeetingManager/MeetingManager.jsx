// import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
// import { motion } from 'framer-motion';
// import { FaEye, FaQrcode, FaUsers, FaCalendarAlt, FaArrowLeft, FaCheckCircle, FaTimesCircle, FaSearch, FaSortAmountDown, FaSortAmountUpAlt } from 'react-icons/fa';
// import { Html5QrcodeScanner } from 'html5-qrcode';
// import Spinner from '../Spinner/Spinner'; // استيراد مكون Spinner المخصص

// // Mock context to make the code self-contained.
// const darkModeContext = createContext({
//   darkMode: false,
// });

// // A spinner for loading the entire page/view
// const FullPageSpinner = () => (
//   <div className="tw-flex tw-justify-center tw-items-center tw-min-h-[80vh]">
//     <Spinner /> {/* استخدام Spinner المخصص */}
//   </div>
// );

// const MeetingsManager = () => {
//   const { darkMode } = useContext(darkModeContext);
//   const [meetings, setMeetings] = useState([]);
//   const [selectedMeeting, setSelectedMeeting] = useState(null);
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [filteredAttendance, setFilteredAttendance] = useState([]);
//   const [showScanner, setShowScanner] = useState(false);

//   // 1. State for the initial page load
//   const [loading, setLoading] = useState(true);
  
//   // 2. State for the "View" button spinner (stores the loading meeting's ID)
//   const [viewLoading, setViewLoading] = useState(null);
  
//   // State for the attendance list view loading
//   const [attendanceLoading, setAttendanceLoading] = useState(false);

//   const [scanResult, setScanResult] = useState('');
//   const [scanError, setScanError] = useState('');
//   const [scanSuccessData, setScanSuccessData] = useState(null);
//   const scannerRef = useRef(null);
  
//   // Search and filter states for meetings list
//   const [meetingSearchTerm, setMeetingSearchTerm] = useState('');
//   const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'
  
//   // Search and filter states for attendance
//   const [searchTerm, setSearchTerm] = useState('');
//   const [massFilter, setMassFilter] = useState('all');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [confessedFilter, setConfessedFilter] = useState('all');
  
//   // Pagination states for Attendance
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
  
//   // --- NEW: Pagination states for Meetings List ---
//   const [meetingsCurrentPage, setMeetingsCurrentPage] = useState(1);
//   const [meetingsPerPage] = useState(6); // Set to 6 meetings per page

//   // --- NEW: Reset meetings page when search/sort changes ---
//   useEffect(() => {
//     setMeetingsCurrentPage(1); // Reset to the first page
//   }, [meetingSearchTerm, sortOrder]);


//   // Helper function to get the token and add the header
//   const getAuthHeaders = () => {
//     const token = localStorage.getItem('token');
//     return {
//       'Content-Type': 'application/json',
//       ...(token && { 'Authorization': `Bearer ${token}` })
//     };
//   };

//   // Fetch all meetings from API on component mount
//   useEffect(() => {
//     fetchMeetings();
//   }, []);

//   // Clean up scanner when component unmounts or scanner closes
//   useEffect(() => {
//     return () => {
//       if (scannerRef.current) {
//         try {
//             scannerRef.current.clear();
//             scannerRef.current = null;
//         } catch(error) {
//             console.error("Failed to clear scanner on cleanup.", error);
//         }
//       }
//     };
//   }, []);

//   // Apply filters and search for attendance
//   useEffect(() => {
//     if (attendanceData.length > 0) {
//       let filtered = [...attendanceData];
      
//       if (searchTerm) {
//         filtered = filtered.filter(item =>
//           item.userName.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//       }
      
//       if (massFilter !== 'all') {
//         filtered = filtered.filter(item =>
//           item.attendedMass === (massFilter === 'true')
//         );
//       }
      
//       if (statusFilter !== 'all') {
//         // --- FIX: Make status comparison case-insensitive and trim whitespace ---
//         filtered = filtered.filter(item =>
//           item.status && item.status.trim().toLowerCase() === statusFilter
//         );
//       }
      
//       if (confessedFilter !== 'all') {
//         filtered = filtered.filter(item =>
//           item.confessed === (confessedFilter === 'true')
//         );
//       }
      
//       setFilteredAttendance(filtered);
//       setCurrentPage(1); // Reset to first page when filters change
//     }
//   }, [attendanceData, searchTerm, massFilter, statusFilter, confessedFilter]);

//   const fetchMeetings = async () => {
//     try {
//       const response = await fetch('https://ugmproject.vercel.app/api/v1/attendanceMeeting/getAllMeetings', {
//         headers: getAuthHeaders()
//       });
//       const data = await response.json();
//       if (data.message === 'done') {
//         setMeetings(data.meetings);
//       }
//     } catch (error) {
//       console.error('Error fetching meetings:', error);
//     } finally {
//       // Stop the initial loading spinner
//       setLoading(false);
//     }
//   };

//   const filteredAndSortedMeetings = meetings
//     .filter(meeting =>
//       meeting.title.toLowerCase().includes(meetingSearchTerm.toLowerCase())
//     )
//     .sort((a, b) => {
//       const dateA = new Date(a.date);
//       const dateB = new Date(b.date);
//       return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
//     });

//   // --- NEW: Pagination logic for meetings list ---
//   const indexOfLastMeeting = meetingsCurrentPage * meetingsPerPage;
//   const indexOfFirstMeeting = indexOfLastMeeting - meetingsPerPage;
//   const currentMeetings = filteredAndSortedMeetings.slice(indexOfFirstMeeting, indexOfLastMeeting);
//   const totalMeetingPages = Math.ceil(filteredAndSortedMeetings.length / meetingsPerPage);

//   const paginateMeetings = (pageNumber) => setMeetingsCurrentPage(pageNumber);
  
//   const processScannedData = async (data) => {
//     try {
//       const userInfo = JSON.parse(data);
      
//       setScanSuccessData({
//         userName: userInfo.userName,
//         userId: userInfo.userId,
//         attendedMass: true,
//         confessed: false
//       });
      
//       setScanResult(`Scanned: ${userInfo.userName}`);
//       setScanError('');
      
//     } catch (error) {
//       console.error('Error processing scan:', error);
//       setScanError('Invalid QR code. Please try again.');
//     }
//   };

//   const confirmAttendance = async (attendedMass, confessed) => {
//     try {
//       const response = await fetch(`https://ugmproject.vercel.app/api/v1/attendanceMeeting/markAttendance/${showScanner}`, {
//         method: 'PATCH',
//         headers: getAuthHeaders(),
//         body: JSON.stringify({
//           userId: scanSuccessData.userId,
//           attendedMass: attendedMass.toString(),
//           confessed: confessed.toString(),
//           status: "present"
//         })
//       });

//       if (response.ok) {
//         setScanSuccessData(null);
//         setScanResult('');
//         setTimeout(() => {
//           setShowScanner(false);
//           if (scannerRef.current) {
//             scannerRef.current.clear();
//             scannerRef.current = null;
//           }
//         }, 1000);
//       } else {
//         setScanError('Failed to mark attendance. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error confirming attendance:', error);
//       setScanError('Error confirming attendance. Please try again.');
//     }
//   };

//   const viewAttendance = async (meetingId) => {
//     setViewLoading(meetingId); // Start loading spinner in the button
//     setAttendanceLoading(true); // Start loading spinner for the attendance view
//     setSelectedMeeting(meetingId);
    
//     try {
//       const response = await fetch(`https://ugmproject.vercel.app/api/v1/attendanceMeeting/getMeetingById/${meetingId}`, {
//         headers: getAuthHeaders()
//       });
//       const data = await response.json();
      
//       if (data.meeting && data.meeting.records) {
//         const formattedAttendance = data.meeting.records.map(record => ({
//           _id: record._id,
//           userId: typeof record.user === 'object' ? record.user._id : record.user,
//           userName: typeof record.user === 'object' ? record.user.userName : (record.userName || 'N/A'),
//           attendedMass: record.attendedMass,
//           confessed: record.confessed,
//           status: record.status,
//           time: record.time ? new Date(record.time) : null
//         }));
        
//         setAttendanceData(formattedAttendance);
//       } else {
//         setAttendanceData([]);
//       }

//     } catch (error) {
//       console.error('Error fetching attendance:', error);
//       setAttendanceData([]);
//     } finally {
//       setViewLoading(null); // Stop loading spinner in the button
//       setAttendanceLoading(false); // Stop loading spinner for the attendance view
//     }
//   };

//   // Pagination logic for Attendance
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredAttendance.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredAttendance.length / itemsPerPage);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
//   // This is the main check for the initial component load.
//   if (loading) {
//     return <FullPageSpinner />;
//   }

//   return (
//     <div className={`tw-container tw-mx-auto tw-p-4 tw-max-w-7xl tw-min-h-[80vh] tw-bg-gray-50 dark:tw-bg-gray-900 tw-text-gray-900 dark:tw-text-white`}>
//       {!selectedMeeting && !showScanner && (
//         <motion.h1
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="tw-text-3xl tw-font-bold tw-mb-8 tw-flex tw-items-center tw-text-gray-800 dark:tw-text-gray-100">
//           <FaCalendarAlt className="tw-mr-3 tw-text-blue-500 dark:tw-text-indigo-400" /> Meeting Attendance
//         </motion.h1>
//       )}

//       {selectedMeeting ? (
//         attendanceLoading ? (
//             <FullPageSpinner />
//         ) : (
//             <AttendanceView
//               meetingId={selectedMeeting}
//               attendanceData={currentItems}
//               meetings={meetings}
//               onBack={() => { setSelectedMeeting(null); setAttendanceData([]); }}
//               searchTerm={searchTerm}
//               setSearchTerm={setSearchTerm}
//               massFilter={massFilter}
//               setMassFilter={setMassFilter}
//               statusFilter={statusFilter}
//               setStatusFilter={setStatusFilter}
//               confessedFilter={confessedFilter}
//               setConfessedFilter={setConfessedFilter}
//               currentPage={currentPage}
//               totalPages={totalPages}
//               paginate={paginate}
//               totalItems={filteredAttendance.length}
//               itemsPerPage={itemsPerPage}
//               indexOfFirstItem={indexOfFirstItem}
//               indexOfLastItem={indexOfLastItem}
//             />
//         )
//       ) : showScanner ? (
//         <QRScanner
//           onScan={processScannedData}
//           onClose={() => {
//             setShowScanner(false);
//             setScanResult('');
//             setScanError('');
//             setScanSuccessData(null);
//             if (scannerRef.current) {
//               scannerRef.current.clear();
//               scannerRef.current = null;
//             }
//           }}
//           scanResult={scanResult}
//           scanError={scanError}
//           scannerRef={scannerRef}
//           scanSuccessData={scanSuccessData}
//           onConfirm={confirmAttendance}
//           setScanSuccessData={setScanSuccessData}
//         />
//       ) : (
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//           <div className="tw-flex tw-flex-col sm:tw-flex-row tw-items-center tw-justify-between tw-gap-4 tw-mb-8 tw-p-4 tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow-sm">
//             <div className="tw-relative tw-w-full sm:tw-w-auto sm:tw-flex-grow">
//               <div className="tw-absolute tw-inset-y-0 tw-left-0 tw-pl-3 tw-flex tw-items-center tw-pointer-events-none">
//                 <FaSearch className="tw-text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search by meeting name..."
//                 value={meetingSearchTerm}
//                 onChange={(e) => setMeetingSearchTerm(e.target.value)}
//                 className="tw-pl-10 tw-w-full tw-p-2.5 tw-border tw-rounded-lg focus:tw-ring-2 tw-border-transparent tw-bg-gray-100 dark:tw-bg-gray-700 tw-border-gray-200 dark:tw-border-gray-600 tw-text-gray-900 dark:tw-text-white tw-placeholder-gray-500 dark:tw-placeholder-gray-400 focus:tw-ring-main dark:focus:tw-ring-indigo-500"
//               />
//             </div>
            
//             <button
//               onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
//               className="tw-w-full sm:tw-w-auto tw-p-2.5 tw-border tw-rounded-lg tw-flex tw-items-center tw-justify-center tw-gap-2 focus:tw-ring-2 focus:tw-border-transparent tw-bg-gray-100 dark:tw-bg-gray-700 tw-border-gray-200 dark:tw-border-gray-600 tw-text-gray-900 dark:tw-text-white focus:tw-ring-main dark:focus:tw-ring-indigo-500 tw-transition-colors hover:tw-bg-gray-200 dark:hover:tw-bg-gray-600"
//             >
//               {sortOrder === 'newest' ? <FaSortAmountDown /> : <FaSortAmountUpAlt />}
//               <span>{sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
//             </button>
//           </div>
          
//           <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6">
//             {/* --- MODIFIED: Map over currentMeetings --- */}
//             {currentMeetings.map(meeting => (
//               <MeetingCard
//                 key={meeting._id}
//                 meeting={meeting}
//                 onScan={() => setShowScanner(meeting._id)}
//                 onViewAttendance={() => viewAttendance(meeting._id)}
//                 // Pass the loading state for this specific card
//                 isLoading={viewLoading === meeting._id}
//               />
//             ))}
//           </div>
          
//           {/* --- MODIFIED: Use filteredAndSortedMeetings to check if there are any results at all --- */}
//           {filteredAndSortedMeetings.length === 0 && (
//             <div className="tw-text-center tw-py-16 tw-rounded-lg tw-bg-white dark:tw-bg-gray-800 tw-mt-6">
//               <FaCalendarAlt className="tw-mx-auto tw-text-5xl tw-mb-4 tw-text-gray-400 dark:tw-text-gray-500" />
//               <p className="tw-text-lg tw-text-gray-500 dark:tw-text-gray-400">
//                 {meetingSearchTerm ? 'No meetings found matching your search.' : 'No meetings available.'}
//               </p>
//             </div>
//           )}

//           {/* --- NEW: Pagination controls for meetings list --- */}
//           {totalMeetingPages > 1 && (
//             <div className="tw-flex tw-justify-center tw-items-center tw-mt-8 tw-pt-4">
//               <div className="tw-flex tw-space-x-2">
//                 <button
//                   onClick={() => paginateMeetings(meetingsCurrentPage - 1)}
//                   disabled={meetingsCurrentPage === 1}
//                   className={`tw-px-4 tw-py-2 tw-rounded-md tw-font-semibold tw-transition-colors ${meetingsCurrentPage === 1 ? 'tw-bg-gray-200 tw-text-gray-500 dark:tw-bg-gray-700 dark:tw-text-gray-500' : 'bg-main tw-text-white hover:tw-bg-main-dark dark:tw-bg-indigo-600 dark:hover:tw-bg-indigo-700'}`}
//                 >
//                   Previous
//                 </button>
//                 {Array.from({ length: totalMeetingPages }, (_, i) => i + 1).map(page => (
//                   <button
//                     key={page}
//                     onClick={() => paginateMeetings(page)}
//                     className={`tw-px-4 tw-py-2 tw-rounded-md tw-font-semibold tw-transition-colors ${meetingsCurrentPage === page ? 'bg-main tw-text-white dark:tw-bg-indigo-600' : 'tw-bg-gray-200 tw-text-gray-700 hover:tw-bg-gray-300 dark:tw-bg-gray-700 dark:tw-text-gray-300 dark:hover:tw-bg-gray-600'}`}
//                   >
//                     {page}
//                   </button>
//                 ))}
//                 <button
//                   onClick={() => paginateMeetings(meetingsCurrentPage + 1)}
//                   disabled={meetingsCurrentPage === totalMeetingPages}
//                   className={`tw-px-4 tw-py-2 tw-rounded-md tw-font-semibold tw-transition-colors ${meetingsCurrentPage === totalMeetingPages ? 'tw-bg-gray-200 tw-text-gray-500 dark:tw-bg-gray-700 dark:tw-text-gray-500' : 'bg-main tw-text-white hover:tw-bg-main-dark dark:tw-bg-indigo-600 dark:hover:tw-bg-indigo-700'}`}
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}

//         </motion.div>
//       )}
//     </div>
//   );
// };

// // Meeting Card Component (No Changes)
// const MeetingCard = ({ meeting, onScan, onViewAttendance, isLoading }) => {
//   const formattedDate = new Date(meeting.date).toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric'
//   });

//   return (
//     <motion.div
//       className="tw-rounded-xl tw-shadow-md tw-p-6 tw-border tw-transition-all tw-duration-300 hover:tw-shadow-xl hover:tw-border-blue-500 dark:hover:tw-border-indigo-500 tw-bg-white dark:tw-bg-gray-800 tw-border-gray-200 dark:tw-border-gray-700"
//       whileHover={{ y: -5 }}
//       transition={{ duration: 0.2 }}
//     >
//       <h2 className="tw-text-xl tw-font-bold tw-mb-3 tw-text-gray-800 dark:tw-text-white truncate">{meeting.title}</h2>
//       <p className="tw-mb-6 tw-flex tw-items-center tw-text-gray-500 dark:tw-text-gray-400">
//         <FaCalendarAlt className="tw-mr-2 tw-text-blue-500 dark:tw-text-indigo-400" />
//         {formattedDate}
//       </p>
      
//       <div className="tw-flex tw-justify-between tw-gap-3">
//         <motion.button
//           whileTap={{ scale: 0.95 }}
//           onClick={onScan}
//           className="tw-text-white tw-px-4 tw-py-2.5 tw-rounded-lg tw-flex-1 tw-flex tw-items-center tw-justify-center tw-gap-2 tw-transition-colors bg-main hover:tw-bg-main-dark dark:tw-bg-indigo-600 dark:hover:tw-bg-indigo-700 font-semibold"
//         >
//           <FaQrcode /> Scan QR
//         </motion.button>
        
//         <motion.button
//           whileTap={{ scale: 0.95 }}
//           onClick={onViewAttendance}
//           disabled={isLoading}
//           className="tw-text-gray-800 dark:tw-text-white tw-bg-gray-200 dark:tw-bg-gray-700 hover:tw-bg-gray-300 dark:hover:tw-bg-gray-600 tw-px-4 tw-py-2.5 tw-rounded-lg tw-flex-1 tw-flex tw-items-center tw-justify-center tw-gap-2 tw-transition-colors font-semibold disabled:tw-opacity-50"
//         >
//           {/* استخدام Spinner المخصص بدلاً من Spinner البسيط */}
//           {isLoading ? <Spinner /> : <FaEye />}
//           {isLoading ? 'Loading...' : 'View'}
//         </motion.button>
//       </div>
//     </motion.div>
//   );
// };

// // Attendance View Component (No Changes)
// const AttendanceView = ({
//     meetingId, attendanceData, meetings, onBack, searchTerm, setSearchTerm, massFilter, setMassFilter, statusFilter, setStatusFilter, confessedFilter, setConfessedFilter, currentPage, totalPages, paginate, totalItems, itemsPerPage, indexOfFirstItem, indexOfLastItem
//   }) => {
//     const meeting = meetings.find(m => m._id === meetingId) || {};
//     const formattedDate = new Date(meeting.date).toLocaleDateString('en-US', {
//       year: 'numeric', month: 'long', day: 'numeric'
//     });
  
//     const formatTime = (time, status) => {
//       if (!time) return status === 'present' ? 'N/A' : 'Absent';
//       return new Date(time).toLocaleTimeString('en-US', {
//         hour: '2-digit', minute: '2-digit', hour12: true
//       });
//     };
  
//     return (
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="tw-rounded-xl tw-shadow-lg tw-p-6 tw-bg-white dark:tw-bg-gray-800 tw-border tw-border-gray-200 dark:tw-border-gray-700"
//         style={{ height: '80vh', display: 'flex', flexDirection: 'column' }}
//       >
//         <div className="tw-flex tw-items-center tw-justify-between tw-mb-6 tw-flex-shrink-0">
//           <div>
//             <h2 className="tw-text-2xl tw-font-bold tw-text-gray-800 dark:tw-text-white">{meeting.title}</h2>
//             <p className="tw-mt-1 tw-text-gray-600 dark:tw-text-gray-400">{formattedDate}</p>
//           </div>
//           <button
//             onClick={onBack}
//             className="tw-px-4 tw-py-2 tw-rounded-lg tw-flex tw-items-center tw-gap-2 tw-transition-colors tw-bg-gray-100 hover:tw-bg-gray-200 tw-text-gray-700 dark:tw-bg-gray-700 dark:hover:tw-bg-gray-600 dark:tw-text-white"
//           >
//             <FaArrowLeft /> Back
//           </button>
//         </div>
        
//         <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-4 tw-mb-6 tw-flex-shrink-0">
//           <div className="tw-relative">
//             <div className="tw-absolute tw-inset-y-0 tw-left-0 tw-pl-3 tw-flex tw-items-center tw-pointer-events-none">
//               <FaSearch className="tw-text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search by name..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="tw-pl-10 tw-w-full tw-p-2.5 tw-border tw-rounded-lg focus:tw-ring-2 focus:tw-border-transparent tw-bg-gray-50 tw-border-gray-200 tw-text-gray-900 tw-placeholder-gray-500 focus:tw-ring-main dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-text-white dark:tw-placeholder-gray-400 dark:focus:tw-ring-indigo-500"
//             />
//           </div>
          
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="tw-p-2.5 tw-border tw-rounded-lg focus:tw-ring-2 focus:tw-border-transparent tw-bg-gray-50 tw-border-gray-200 tw-text-gray-900 focus:tw-ring-main dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-text-white dark:focus:tw-ring-indigo-500"
//           >
//             <option value="all">All Status</option>
//             <option value="present">Present</option>
//             <option value="absent">Absent</option>
//           </select>
          
//           <select
//             value={massFilter}
//             onChange={(e) => setMassFilter(e.target.value)}
//             className="tw-p-2.5 tw-border tw-rounded-lg focus:tw-ring-2 focus:tw-border-transparent tw-bg-gray-50 tw-border-gray-200 tw-text-gray-900 focus:tw-ring-main dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-text-white dark:focus:tw-ring-indigo-500"
//           >
//             <option value="all">All Mass Attendance</option>
//             <option value="true">Attended Mass</option>
//             <option value="false">Didn't Attend Mass</option>
//           </select>
          
//           <select
//             value={confessedFilter}
//             onChange={(e) => setConfessedFilter(e.target.value)}
//             className="tw-p-2.5 tw-border tw-rounded-lg focus:tw-ring-2 focus:tw-border-transparent tw-bg-gray-50 tw-border-gray-200 tw-text-gray-900 focus:tw-ring-main dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-text-white dark:focus:tw-ring-indigo-500"
//           >
//             <option value="all">All Confession Status</option>
//             <option value="true">Confessed</option>
//             <option value="false">Didn't Confess</option>
//           </select>
//         </div>
        
//         <div className="tw-overflow-y-auto tw-flex-grow">
//           {attendanceData.length > 0 ? (
//             <table className="tw-min-w-full tw-divide-y tw-divide-gray-200 dark:tw-divide-gray-700">
//               <thead className="tw-bg-gray-50 dark:tw-bg-gray-700 tw-sticky tw-top-0">
//                 <tr>
//                   <th className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-uppercase tw-tracking-wider tw-text-gray-500 dark:tw-text-gray-300">User Name</th>
//                   <th className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-uppercase tw-tracking-wider tw-text-gray-500 dark:tw-text-gray-300">Status</th>
//                   <th className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-uppercase tw-tracking-wider tw-text-gray-500 dark:tw-text-gray-300">Attended Mass</th>
//                   <th className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-uppercase tw-tracking-wider tw-text-gray-500 dark:tw-text-gray-300">Confessed</th>
//                   <th className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-uppercase tw-tracking-wider tw-text-gray-500 dark:tw-text-gray-300">Time</th>
//                 </tr>
//               </thead>
//               <tbody className="tw-bg-white tw-divide-y tw-divide-gray-200 dark:tw-bg-gray-800 dark:tw-divide-gray-700">
//                 {attendanceData.map((attendee, index) => (
//                   <tr key={index} className="hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700">
//                     <td className="tw-px-4 tw-py-4 tw-whitespace-nowrap tw-text-gray-900 dark:tw-text-white">{attendee.userName}</td>
//                     <td className="tw-px-4 tw-py-4 tw-whitespace-nowrap">
//                      <span className={`tw-inline-flex tw-items-center tw-px-2.5 tw-py-0.5 tw-rounded-full tw-text-xs tw-font-medium ${attendee.status && attendee.status.trim().toLowerCase() === 'present' ? 'tw-bg-green-100 tw-text-green-800 dark:tw-bg-green-900 dark:tw-text-green-300' : 'tw-bg-red-100 tw-text-red-800 dark:tw-bg-red-900 dark:tw-text-red-300'}`}>
//                         {attendee.status && attendee.status.trim().toLowerCase() === 'present' ? <FaCheckCircle className="tw-mr-1" /> : <FaTimesCircle className="tw-mr-1" />}
//                         {attendee.status || 'N/A'}
//                       </span>
//                     </td>
//                     <td className="tw-px-4 tw-py-4 tw-whitespace-nowrap">
//                       {attendee.attendedMass ? (
//                         <span className="tw-inline-flex tw-items-center tw-px-2.5 tw-py-0.5 tw-rounded-full tw-text-xs tw-font-medium tw-bg-green-100 tw-text-green-800 dark:tw-bg-green-900 dark:tw-text-green-300"><FaCheckCircle className="tw-mr-1" /> Yes</span>
//                       ) : (
//                         <span className="tw-inline-flex tw-items-center tw-px-2.5 tw-py-0.5 tw-rounded-full tw-text-xs tw-font-medium tw-bg-red-100 tw-text-red-800 dark:tw-bg-red-900 dark:tw-text-red-300"><FaTimesCircle className="tw-mr-1" /> No</span>
//                       )}
//                     </td>
//                     <td className="tw-px-4 tw-py-4 tw-whitespace-nowrap">
//                       {attendee.confessed ? (
//                         <span className="tw-inline-flex tw-items-center tw-px-2.5 tw-py-0.5 tw-rounded-full tw-text-xs tw-font-medium tw-bg-green-100 tw-text-green-800 dark:tw-bg-green-900 dark:tw-text-green-300"><FaCheckCircle className="tw-mr-1" /> Yes</span>
//                       ) : (
//                         <span className="tw-inline-flex tw-items-center tw-px-2.5 tw-py-0.5 tw-rounded-full tw-text-xs tw-font-medium tw-bg-red-100 tw-text-red-800 dark:tw-bg-red-900 dark:tw-text-red-300"><FaTimesCircle className="tw-mr-1" /> No</span>
//                       )}
//                     </td>
//                     <td className="tw-px-4 tw-py-4 tw-whitespace-nowrap tw-text-gray-500 dark:tw-text-gray-300">{formatTime(attendee.time, attendee.status)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <div className="tw-text-center tw-py-12 tw-rounded-lg tw-bg-gray-50 dark:tw-bg-gray-700">
//               <FaUsers className="tw-mx-auto tw-text-4xl tw-mb-4 tw-text-gray-400 dark:tw-text-gray-500" />
//               <p className="tw-text-gray-500 dark:tw-text-gray-400">No attendance data available for this meeting.</p>
//             </div>
//           )}
//         </div>
        
//         {totalPages > 1 && (
//           <div className="tw-flex tw-justify-between tw-items-center tw-mt-4 tw-pt-4 tw-border-t tw-border-gray-200 dark:tw-border-gray-700 tw-flex-shrink-0">
//             <div className="tw-text-sm tw-text-gray-700 dark:tw-text-gray-400">
//               Showing <span className="tw-font-medium">{indexOfFirstItem + 1}</span> to <span className="tw-font-medium">{indexOfLastItem > totalItems ? totalItems : indexOfLastItem}</span> of <span className="tw-font-medium">{totalItems}</span> results
//             </div>
//             <div className="tw-flex tw-space-x-2">
//               <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className={`tw-px-3 tw-py-1 tw-rounded-md ${currentPage === 1 ? 'tw-bg-gray-200 tw-text-gray-500 dark:tw-bg-gray-700 dark:tw-text-gray-500' : 'bg-main tw-text-white hover:tw-bg-main-dark dark:tw-bg-indigo-600 dark:hover:tw-bg-indigo-700'}`}>Previous</button>
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (<button key={page} onClick={() => paginate(page)} className={`tw-px-3 tw-py-1 tw-rounded-md ${currentPage === page ? 'bg-main tw-text-white dark:tw-bg-indigo-600' : 'tw-bg-gray-200 tw-text-gray-700 hover:tw-bg-gray-300 dark:tw-bg-gray-700 dark:tw-text-gray-300 dark:hover:tw-bg-gray-600'}`}>{page}</button>))}
//               <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className={`tw-px-3 tw-py-1 tw-rounded-md ${currentPage === totalPages ? 'tw-bg-gray-200 tw-text-gray-500 dark:tw-bg-gray-700 dark:tw-text-gray-500' : 'bg-main tw-text-white hover:tw-bg-main-dark dark:tw-bg-indigo-600 dark:hover:tw-bg-indigo-700'}`}>Next</button>
//             </div>
//           </div>
//         )}
//       </motion.div>
//     );
//   };
  
//   // QRScanner Component (No Changes)
//   const QRScanner = ({ onScan, onClose, scanResult, scanError, scannerRef, scanSuccessData, onConfirm, setScanSuccessData }) => {
//     useEffect(() => {
//       if (!scanSuccessData) {
//         if (scannerRef.current && scannerRef.current.isScanning) { return; }
//         const scanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: { width: 250, height: 250 }, supportedScanTypes: [] }, false);
//         scanner.render((decodedText) => { scanner.pause(); onScan(decodedText); }, (error) => {});
//         scannerRef.current = scanner;
//       }
//       return () => {
//         if (scannerRef.current) {
//           scannerRef.current.clear().catch(error => { console.error("Failed to clear html5-qrcode-scanner.", error); });
//         }
//       };
//     }, [onScan, scanSuccessData]);
  
//     const handleCancel = () => {
//       setScanSuccessData(null);
//       if(scannerRef.current) { scannerRef.current.resume(); }
//     }
  
//     return (
//       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-70 tw-flex tw-justify-center tw-items-center tw-z-50 tw-p-4">
//         <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="tw-p-6 tw-rounded-xl tw-w-full tw-max-w-md tw-bg-white dark:tw-bg-gray-800">
//           <h2 className="tw-text-xl tw-font-semibold tw-mb-4 tw-text-gray-800 dark:tw-text-white">Scan QR Code</h2>
//           {!scanSuccessData ? (
//             <>
//               <div id="qr-reader" className="tw-mb-4 tw-rounded-lg tw-overflow-hidden tw-border-2 tw-border-gray-300 dark:tw-border-gray-600"></div>
//               {scanResult && <div className="tw-p-3 tw-mb-4 tw-bg-green-100 tw-text-green-700 tw-rounded-lg tw-flex tw-items-center"><FaCheckCircle className="tw-mr-2" /> {scanResult}</div>}
//               {scanError && <div className="tw-p-3 tw-mb-4 tw-bg-red-100 tw-text-red-700 tw-rounded-lg">{scanError}</div>}
//               <p className="tw-text-sm tw-mb-4 tw-text-gray-600 dark:tw-text-gray-400">Position the QR code within the frame to scan.</p>
//             </>
//           ) : (
//             <div className="tw-mb-4">
//               <div className="tw-p-3 tw-mb-4 tw-bg-green-100 tw-text-green-700 tw-rounded-lg tw-flex tw-items-center"><FaCheckCircle className="tw-mr-2" /> Scanned: {scanSuccessData.userName}</div>
//               <div className="tw-mb-4">
//                 <h3 className="tw-text-lg tw-font-medium tw-mb-2 tw-text-gray-800 dark:tw-text-white">Attendance Details</h3>
//                 <div className="tw-mb-3">
//                   <label className="tw-flex tw-items-center tw-text-gray-700 dark:tw-text-gray-300"><input type="checkbox" checked={scanSuccessData.attendedMass} onChange={(e) => setScanSuccessData({ ...scanSuccessData, attendedMass: e.target.checked })} className="tw-mr-2 tw-h-4 tw-w-4 tw-rounded tw-border-gray-300 tw-text-indigo-600 focus:tw-ring-indigo-500" />Attended Mass</label>
//                 </div>
//                 <div className="tw-mb-3">
//                   <label className="tw-flex tw-items-center tw-text-gray-700 dark:tw-text-gray-300"><input type="checkbox" checked={scanSuccessData.confessed} onChange={(e) => setScanSuccessData({ ...scanSuccessData, confessed: e.target.checked })} className="tw-mr-2 tw-h-4 tw-w-4 tw-rounded tw-border-gray-300 tw-text-indigo-600 focus:tw-ring-indigo-500" />Confessed</label>
//                 </div>
//               </div>
//               <div className="tw-flex tw-gap-2">
//                 <button onClick={() => onConfirm(scanSuccessData.attendedMass, scanSuccessData.confessed)} className="tw-flex-1 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-transition-colors bg-main hover:tw-bg-main-dark dark:tw-bg-indigo-600 dark:hover:tw-bg-indigo-700">Confirm Attendance</button>
//                 <button onClick={handleCancel} className="tw-flex-1 tw-text-gray-800 dark:tw-text-white tw-bg-gray-200 hover:tw-bg-gray-300 dark:tw-bg-gray-600 dark:hover:tw-bg-gray-700 tw-px-4 tw-py-2 tw-rounded-lg tw-transition-colors">Scan Again</button>
//               </div>
//             </div>
//           )}
//           <button onClick={onClose} className="tw-w-full tw-text-white tw-px-4 tw-py-2.5 tw-rounded-lg tw-transition-colors tw-bg-red-500 hover:tw-bg-red-600 dark:tw-bg-red-600 dark:hover:tw-bg-red-700 mt-4">Close Scanner</button>
//         </motion.div>
//       </motion.div>
//     );
//   };

// export default MeetingsManager;





import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { motion } from 'framer-motion';
// --- NEW: Import the Excel icon and the library ---
import { FaEye, FaQrcode, FaUsers, FaCalendarAlt, FaArrowLeft, FaCheckCircle, FaTimesCircle, FaSearch, FaSortAmountDown, FaSortAmountUpAlt, FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx'; // Import the xlsx library
import { Html5QrcodeScanner } from 'html5-qrcode';
import Spinner from '../Spinner/Spinner';

// Mock context to make the code self-contained.
const darkModeContext = createContext({
  darkMode: false,
});

// A spinner for loading the entire page/view
const FullPageSpinner = () => (
  <div className="tw-flex tw-justify-center tw-items-center tw-min-h-[80vh]">
    <Spinner />
  </div>
);

const MeetingsManager = () => {
  const { darkMode } = useContext(darkModeContext);
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewLoading, setViewLoading] = useState(null);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [scanResult, setScanResult] = useState('');
  const [scanError, setScanError] = useState('');
  const [scanSuccessData, setScanSuccessData] = useState(null);
  const scannerRef = useRef(null);
  const [meetingSearchTerm, setMeetingSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [massFilter, setMassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [confessedFilter, setConfessedFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [meetingsCurrentPage, setMeetingsCurrentPage] = useState(1);
  const [meetingsPerPage] = useState(6);

  useEffect(() => {
    setMeetingsCurrentPage(1);
  }, [meetingSearchTerm, sortOrder]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
          scannerRef.current = null;
        } catch(error) {
          console.error("Failed to clear scanner on cleanup.", error);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (attendanceData.length > 0) {
      let filtered = [...attendanceData];
      
      if (searchTerm) {
        filtered = filtered.filter(item =>
          item.userName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (massFilter !== 'all') {
        filtered = filtered.filter(item =>
          item.attendedMass === (massFilter === 'true')
        );
      }
      
      if (statusFilter !== 'all') {
        filtered = filtered.filter(item =>
          item.status && item.status.trim().toLowerCase() === statusFilter
        );
      }
      
      if (confessedFilter !== 'all') {
        filtered = filtered.filter(item =>
          item.confessed === (confessedFilter === 'true')
        );
      }
      
      setFilteredAttendance(filtered);
      setCurrentPage(1);
    }
  }, [attendanceData, searchTerm, massFilter, statusFilter, confessedFilter]);

  const fetchMeetings = async () => {
    try {
      const response = await fetch('https://ugmproject.vercel.app/api/v1/attendanceMeeting/getAllMeetings', {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.message === 'done') {
        setMeetings(data.meetings);
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedMeetings = meetings
    .filter(meeting =>
      meeting.title.toLowerCase().includes(meetingSearchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const indexOfLastMeeting = meetingsCurrentPage * meetingsPerPage;
  const indexOfFirstMeeting = indexOfLastMeeting - meetingsPerPage;
  const currentMeetings = filteredAndSortedMeetings.slice(indexOfFirstMeeting, indexOfLastMeeting);
  const totalMeetingPages = Math.ceil(filteredAndSortedMeetings.length / meetingsPerPage);

  const paginateMeetings = (pageNumber) => setMeetingsCurrentPage(pageNumber);
  
  const processScannedData = async (data) => {
    try {
      const userInfo = JSON.parse(data);
      setScanSuccessData({
        userName: userInfo.userName,
        userId: userInfo.userId,
        attendedMass: true,
        confessed: false
      });
      setScanResult(`Scanned: ${userInfo.userName}`);
      setScanError('');
    } catch (error) {
      console.error('Error processing scan:', error);
      setScanError('Invalid QR code. Please try again.');
    }
  };

  const confirmAttendance = async (attendedMass, confessed) => {
    try {
      const response = await fetch(`https://ugmproject.vercel.app/api/v1/attendanceMeeting/markAttendance/${showScanner}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          userId: scanSuccessData.userId,
          attendedMass: attendedMass.toString(),
          confessed: confessed.toString(),
          status: "present"
        })
      });

      if (response.ok) {
        setScanSuccessData(null);
        setScanResult('');
        setTimeout(() => {
          setShowScanner(false);
          if (scannerRef.current) {
            scannerRef.current.clear();
            scannerRef.current = null;
          }
        }, 1000);
      } else {
        setScanError('Failed to mark attendance. Please try again.');
      }
    } catch (error) {
      console.error('Error confirming attendance:', error);
      setScanError('Error confirming attendance. Please try again.');
    }
  };

  const viewAttendance = async (meetingId) => {
    setViewLoading(meetingId);
    setAttendanceLoading(true);
    setSelectedMeeting(meetingId);
    
    try {
      const response = await fetch(`https://ugmproject.vercel.app/api/v1/attendanceMeeting/getMeetingById/${meetingId}`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      
      if (data.meeting && data.meeting.records) {
        const formattedAttendance = data.meeting.records.map(record => ({
          _id: record._id,
          userId: typeof record.user === 'object' ? record.user._id : record.user,
          userName: typeof record.user === 'object' ? record.user.userName : (record.userName || 'N/A'),
          attendedMass: record.attendedMass,
          confessed: record.confessed,
          status: record.status,
          time: record.time ? new Date(record.time) : null
        }));
        setAttendanceData(formattedAttendance);
      } else {
        setAttendanceData([]);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setAttendanceData([]);
    } finally {
      setViewLoading(null);
      setAttendanceLoading(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAttendance.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAttendance.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  if (loading) {
    return <FullPageSpinner />;
  }

  return (
    <div className={`tw-container tw-mx-auto tw-p-4 tw-max-w-7xl tw-min-h-[80vh] tw-bg-gray-50 dark:tw-bg-gray-900 tw-text-gray-900 dark:tw-text-white`}>
      {!selectedMeeting && !showScanner && (
        <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="tw-text-3xl tw-font-bold tw-mb-8 tw-flex tw-items-center tw-text-gray-800 dark:tw-text-gray-100">
          <FaCalendarAlt className="tw-mr-3 tw-text-blue-500 dark:tw-text-indigo-400" /> Meeting Attendance
        </motion.h1>
      )}

      {selectedMeeting ? (
        attendanceLoading ? (
            <FullPageSpinner />
        ) : (
            <AttendanceView
              meetingId={selectedMeeting}
              attendanceData={currentItems}
              // --- MODIFIED: Pass the full filtered list for export ---
              fullAttendanceData={filteredAttendance}
              meetings={meetings}
              onBack={() => { setSelectedMeeting(null); setAttendanceData([]); }}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              massFilter={massFilter}
              setMassFilter={setMassFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              confessedFilter={confessedFilter}
              setConfessedFilter={setConfessedFilter}
              currentPage={currentPage}
              totalPages={totalPages}
              paginate={paginate}
              totalItems={filteredAttendance.length}
              itemsPerPage={itemsPerPage}
              indexOfFirstItem={indexOfFirstItem}
              indexOfLastItem={indexOfLastItem}
            />
        )
      ) : showScanner ? (
        <QRScanner
          onScan={processScannedData}
          onClose={() => {
            setShowScanner(false);
            setScanResult('');
            setScanError('');
            setScanSuccessData(null);
            if (scannerRef.current) {
              scannerRef.current.clear();
              scannerRef.current = null;
            }
          }}
          scanResult={scanResult}
          scanError={scanError}
          scannerRef={scannerRef}
          scanSuccessData={scanSuccessData}
          onConfirm={confirmAttendance}
          setScanSuccessData={setScanSuccessData}
        />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="tw-flex tw-flex-col sm:tw-flex-row tw-items-center tw-justify-between tw-gap-4 tw-mb-8 tw-p-4 tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow-sm">
            <div className="tw-relative tw-w-full sm:tw-w-auto sm:tw-flex-grow">
              <div className="tw-absolute tw-inset-y-0 tw-left-0 tw-pl-3 tw-flex tw-items-center tw-pointer-events-none">
                <FaSearch className="tw-text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by meeting name..."
                value={meetingSearchTerm}
                onChange={(e) => setMeetingSearchTerm(e.target.value)}
                className="tw-pl-10 tw-w-full tw-p-2.5 tw-border tw-rounded-lg focus:tw-ring-2 tw-border-transparent tw-bg-gray-100 dark:tw-bg-gray-700 tw-border-gray-200 dark:tw-border-gray-600 tw-text-gray-900 dark:tw-text-white tw-placeholder-gray-500 dark:tw-placeholder-gray-400 focus:tw-ring-main dark:focus:tw-ring-indigo-500"
              />
            </div>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
              className="tw-w-full sm:tw-w-auto tw-p-2.5 tw-border tw-rounded-lg tw-flex tw-items-center tw-justify-center tw-gap-2 focus:tw-ring-2 focus:tw-border-transparent tw-bg-gray-100 dark:tw-bg-gray-700 tw-border-gray-200 dark:tw-border-gray-600 tw-text-gray-900 dark:tw-text-white focus:tw-ring-main dark:focus:tw-ring-indigo-500 tw-transition-colors hover:tw-bg-gray-200 dark:hover:tw-bg-gray-600"
            >
              {sortOrder === 'newest' ? <FaSortAmountDown /> : <FaSortAmountUpAlt />}
              <span>{sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
            </button>
          </div>
          
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6">
            {currentMeetings.map(meeting => (
              <MeetingCard
                key={meeting._id}
                meeting={meeting}
                onScan={() => setShowScanner(meeting._id)}
                onViewAttendance={() => viewAttendance(meeting._id)}
                isLoading={viewLoading === meeting._id}
              />
            ))}
          </div>
          
          {filteredAndSortedMeetings.length === 0 && (
            <div className="tw-text-center tw-py-16 tw-rounded-lg tw-bg-white dark:tw-bg-gray-800 tw-mt-6">
              <FaCalendarAlt className="tw-mx-auto tw-text-5xl tw-mb-4 tw-text-gray-400 dark:tw-text-gray-500" />
              <p className="tw-text-lg tw-text-gray-500 dark:tw-text-gray-400">
                {meetingSearchTerm ? 'No meetings found matching your search.' : 'No meetings available.'}
              </p>
            </div>
          )}

          {totalMeetingPages > 1 && (
            <div className="tw-flex tw-justify-center tw-items-center tw-mt-8 tw-pt-4">
              <div className="tw-flex tw-space-x-2">
                <button
                  onClick={() => paginateMeetings(meetingsCurrentPage - 1)}
                  disabled={meetingsCurrentPage === 1}
                  className={`tw-px-4 tw-py-2 tw-rounded-md tw-font-semibold tw-transition-colors ${meetingsCurrentPage === 1 ? 'tw-bg-gray-200 tw-text-gray-500 dark:tw-bg-gray-700 dark:tw-text-gray-500' : 'bg-main tw-text-white hover:tw-bg-main-dark dark:tw-bg-indigo-600 dark:hover:tw-bg-indigo-700'}`}
                >
                  Previous
                </button>
                {Array.from({ length: totalMeetingPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => paginateMeetings(page)}
                    className={`tw-px-4 tw-py-2 tw-rounded-md tw-font-semibold tw-transition-colors ${meetingsCurrentPage === page ? 'bg-main tw-text-white dark:tw-bg-indigo-600' : 'tw-bg-gray-200 tw-text-gray-700 hover:tw-bg-gray-300 dark:tw-bg-gray-700 dark:tw-text-gray-300 dark:hover:tw-bg-gray-600'}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => paginateMeetings(meetingsCurrentPage + 1)}
                  disabled={meetingsCurrentPage === totalMeetingPages}
                  className={`tw-px-4 tw-py-2 tw-rounded-md tw-font-semibold tw-transition-colors ${meetingsCurrentPage === totalMeetingPages ? 'tw-bg-gray-200 tw-text-gray-500 dark:tw-bg-gray-700 dark:tw-text-gray-500' : 'bg-main tw-text-white hover:tw-bg-main-dark dark:tw-bg-indigo-600 dark:hover:tw-bg-indigo-700'}`}
                >
                  Next
                </button>
              </div>
            </div>
          )}

        </motion.div>
      )}
    </div>
  );
};

const MeetingCard = ({ meeting, onScan, onViewAttendance, isLoading }) => {
  const formattedDate = new Date(meeting.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <motion.div
      className="tw-rounded-xl tw-shadow-md tw-p-6 tw-border tw-transition-all tw-duration-300 hover:tw-shadow-xl hover:tw-border-blue-500 dark:hover:tw-border-indigo-500 tw-bg-white dark:tw-bg-gray-800 tw-border-gray-200 dark:tw-border-gray-700"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <h2 className="tw-text-xl tw-font-bold tw-mb-3 tw-text-gray-800 dark:tw-text-white truncate">{meeting.title}</h2>
      <p className="tw-mb-6 tw-flex tw-items-center tw-text-gray-500 dark:tw-text-gray-400">
        <FaCalendarAlt className="tw-mr-2 tw-text-blue-500 dark:tw-text-indigo-400" />
        {formattedDate}
      </p>
      
      <div className="tw-flex tw-justify-between tw-gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onScan}
          className="tw-text-white tw-px-4 tw-py-2.5 tw-rounded-lg tw-flex-1 tw-flex tw-items-center tw-justify-center tw-gap-2 tw-transition-colors bg-main hover:tw-bg-main-dark dark:tw-bg-indigo-600 dark:hover:tw-bg-indigo-700 font-semibold"
        >
          <FaQrcode /> Scan QR
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onViewAttendance}
          disabled={isLoading}
          className="tw-text-gray-800 dark:tw-text-white tw-bg-gray-200 dark:tw-bg-gray-700 hover:tw-bg-gray-300 dark:hover:tw-bg-gray-600 tw-px-4 tw-py-2.5 tw-rounded-lg tw-flex-1 tw-flex tw-items-center tw-justify-center tw-gap-2 tw-transition-colors font-semibold disabled:tw-opacity-50"
        >
          {isLoading ? <Spinner /> : <FaEye />}
          {isLoading ? 'Loading...' : 'View'}
        </motion.button>
      </div>
    </motion.div>
  );
};

// --- MODIFIED: AttendanceView Component ---
const AttendanceView = ({
    // Add `fullAttendanceData` to the props
    meetingId, attendanceData, fullAttendanceData, meetings, onBack, searchTerm, setSearchTerm, massFilter, setMassFilter, statusFilter, setStatusFilter, confessedFilter, setConfessedFilter, currentPage, totalPages, paginate, totalItems, itemsPerPage, indexOfFirstItem, indexOfLastItem
  }) => {
    const meeting = meetings.find(m => m._id === meetingId) || {};
    const formattedDate = new Date(meeting.date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  
    const formatTime = (time, status) => {
      if (!time) return status === 'present' ? 'N/A' : 'Absent';
      return new Date(time).toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', hour12: true
      });
    };

    // --- NEW: Function to handle the export to Excel ---
    const handleExport = () => {
        if (!fullAttendanceData || fullAttendanceData.length === 0) {
            alert("No data to export.");
            return;
        }

        // 1. Format the data to be more human-readable for the Excel file
        const dataToExport = fullAttendanceData.map(attendee => ({
            "Name": attendee.userName,
            "Status": attendee.status,
            "Attended Mass": attendee.attendedMass ? 'Yes' : 'No',
            "Confessed": attendee.confessed ? 'Yes' : 'No',
            "Time": formatTime(attendee.time, attendee.status)
        }));

        // 2. Create a worksheet from the formatted data
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);

        // 3. Create a new workbook
        const workbook = XLSX.utils.book_new();

        // 4. Append the worksheet to the workbook with a name
        XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

        // 5. Create a dynamic file name and trigger the download
        const fileName = `${meeting.title.replace(/[^a-zA-Z0-9]/g, '_')}_Attendance.xlsx`;
        XLSX.writeFile(workbook, fileName);
    };
  
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="tw-rounded-xl tw-shadow-lg tw-p-6 tw-bg-white dark:tw-bg-gray-800 tw-border tw-border-gray-200 dark:tw-border-gray-700"
        style={{ height: '80vh', display: 'flex', flexDirection: 'column' }}
      >
        <div className="tw-flex tw-items-center tw-justify-between tw-mb-6 tw-flex-shrink-0">
          <div>
            <h2 className="tw-text-2xl tw-font-bold tw-text-gray-800 dark:tw-text-white">{meeting.title}</h2>
            <p className="tw-mt-1 tw-text-gray-600 dark:tw-text-gray-400">{formattedDate}</p>
          </div>
          {/* --- MODIFIED: Added a container for buttons --- */}
          <div className="tw-flex tw-gap-3">
             {/* --- NEW: The Export button --- */}
             <button
                onClick={handleExport}
                className="tw-px-4 tw-py-2 tw-rounded-lg tw-flex tw-items-center tw-gap-2 tw-transition-colors tw-bg-green-500 hover:tw-bg-green-600 tw-text-white font-semibold"
                >
                <FaFileExcel /> Export
            </button>
            <button
              onClick={onBack}
              className="tw-px-4 tw-py-2 tw-rounded-lg tw-flex tw-items-center tw-gap-2 tw-transition-colors tw-bg-gray-100 hover:tw-bg-gray-200 tw-text-gray-700 dark:tw-bg-gray-700 dark:hover:tw-bg-gray-600 dark:tw-text-white"
            >
              <FaArrowLeft /> Back
            </button>
          </div>
        </div>
        
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-4 tw-mb-6 tw-flex-shrink-0">
          <div className="tw-relative">
            <div className="tw-absolute tw-inset-y-0 tw-left-0 tw-pl-3 tw-flex tw-items-center tw-pointer-events-none">
              <FaSearch className="tw-text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="tw-pl-10 tw-w-full tw-p-2.5 tw-border tw-rounded-lg focus:tw-ring-2 focus:tw-border-transparent tw-bg-gray-50 tw-border-gray-200 tw-text-gray-900 tw-placeholder-gray-500 focus:tw-ring-main dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-text-white dark:tw-placeholder-gray-400 dark:focus:tw-ring-indigo-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="tw-p-2.5 tw-border tw-rounded-lg focus:tw-ring-2 focus:tw-border-transparent tw-bg-gray-50 tw-border-gray-200 tw-text-gray-900 focus:tw-ring-main dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-text-white dark:focus:tw-ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
          </select>
          
          <select
            value={massFilter}
            onChange={(e) => setMassFilter(e.target.value)}
            className="tw-p-2.5 tw-border tw-rounded-lg focus:tw-ring-2 focus:tw-border-transparent tw-bg-gray-50 tw-border-gray-200 tw-text-gray-900 focus:tw-ring-main dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-text-white dark:focus:tw-ring-indigo-500"
          >
            <option value="all">All Mass Attendance</option>
            <option value="true">Attended Mass</option>
            <option value="false">Didn't Attend Mass</option>
          </select>
          
          <select
            value={confessedFilter}
            onChange={(e) => setConfessedFilter(e.target.value)}
            className="tw-p-2.5 tw-border tw-rounded-lg focus:tw-ring-2 focus:tw-border-transparent tw-bg-gray-50 tw-border-gray-200 tw-text-gray-900 focus:tw-ring-main dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-text-white dark:focus:tw-ring-indigo-500"
          >
            <option value="all">All Confession Status</option>
            <option value="true">Confessed</option>
            <option value="false">Didn't Confess</option>
          </select>
        </div>
        
        <div className="tw-overflow-y-auto tw-flex-grow">
          {attendanceData.length > 0 ? (
            <table className="tw-min-w-full tw-divide-y tw-divide-gray-200 dark:tw-divide-gray-700">
              <thead className="tw-bg-gray-50 dark:tw-bg-gray-700 tw-sticky tw-top-0">
                <tr>
                  <th className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-uppercase tw-tracking-wider tw-text-gray-500 dark:tw-text-gray-300">User Name</th>
                  <th className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-uppercase tw-tracking-wider tw-text-gray-500 dark:tw-text-gray-300">Status</th>
                  <th className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-uppercase tw-tracking-wider tw-text-gray-500 dark:tw-text-gray-300">Attended Mass</th>
                  <th className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-uppercase tw-tracking-wider tw-text-gray-500 dark:tw-text-gray-300">Confessed</th>
                  <th className="tw-px-4 tw-py-3 tw-text-left tw-text-xs tw-font-medium tw-uppercase tw-tracking-wider tw-text-gray-500 dark:tw-text-gray-300">Time</th>
                </tr>
              </thead>
              <tbody className="tw-bg-white tw-divide-y tw-divide-gray-200 dark:tw-bg-gray-800 dark:tw-divide-gray-700">
                {attendanceData.map((attendee, index) => (
                  <tr key={index} className="hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700">
                    <td className="tw-px-4 tw-py-4 tw-whitespace-nowrap tw-text-gray-900 dark:tw-text-white">{attendee.userName}</td>
                    <td className="tw-px-4 tw-py-4 tw-whitespace-nowrap">
                     <span className={`tw-inline-flex tw-items-center tw-px-2.5 tw-py-0.5 tw-rounded-full tw-text-xs tw-font-medium ${attendee.status && attendee.status.trim().toLowerCase() === 'present' ? 'tw-bg-green-100 tw-text-green-800 dark:tw-bg-green-900 dark:tw-text-green-300' : 'tw-bg-red-100 tw-text-red-800 dark:tw-bg-red-900 dark:tw-text-red-300'}`}>
                        {attendee.status && attendee.status.trim().toLowerCase() === 'present' ? <FaCheckCircle className="tw-mr-1" /> : <FaTimesCircle className="tw-mr-1" />}
                        {attendee.status || 'N/A'}
                      </span>
                    </td>
                    <td className="tw-px-4 tw-py-4 tw-whitespace-nowrap">
                      {attendee.attendedMass ? (
                        <span className="tw-inline-flex tw-items-center tw-px-2.5 tw-py-0.5 tw-rounded-full tw-text-xs tw-font-medium tw-bg-green-100 tw-text-green-800 dark:tw-bg-green-900 dark:tw-text-green-300"><FaCheckCircle className="tw-mr-1" /> Yes</span>
                      ) : (
                        <span className="tw-inline-flex tw-items-center tw-px-2.5 tw-py-0.5 tw-rounded-full tw-text-xs tw-font-medium tw-bg-red-100 tw-text-red-800 dark:tw-bg-red-900 dark:tw-text-red-300"><FaTimesCircle className="tw-mr-1" /> No</span>
                      )}
                    </td>
                    <td className="tw-px-4 tw-py-4 tw-whitespace-nowrap">
                      {attendee.confessed ? (
                        <span className="tw-inline-flex tw-items-center tw-px-2.5 tw-py-0.5 tw-rounded-full tw-text-xs tw-font-medium tw-bg-green-100 tw-text-green-800 dark:tw-bg-green-900 dark:tw-text-green-300"><FaCheckCircle className="tw-mr-1" /> Yes</span>
                      ) : (
                        <span className="tw-inline-flex tw-items-center tw-px-2.5 tw-py-0.5 tw-rounded-full tw-text-xs tw-font-medium tw-bg-red-100 tw-text-red-800 dark:tw-bg-red-900 dark:tw-text-red-300"><FaTimesCircle className="tw-mr-1" /> No</span>
                      )}
                    </td>
                    <td className="tw-px-4 tw-py-4 tw-whitespace-nowrap tw-text-gray-500 dark:tw-text-gray-300">{formatTime(attendee.time, attendee.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="tw-text-center tw-py-12 tw-rounded-lg tw-bg-gray-50 dark:tw-bg-gray-700">
              <FaUsers className="tw-mx-auto tw-text-4xl tw-mb-4 tw-text-gray-400 dark:tw-text-gray-500" />
              <p className="tw-text-gray-500 dark:tw-text-gray-400">No attendance data available for this meeting.</p>
            </div>
          )}
        </div>
        
        {totalPages > 1 && (
          <div className="tw-flex tw-justify-between tw-items-center tw-mt-4 tw-pt-4 tw-border-t tw-border-gray-200 dark:tw-border-gray-700 tw-flex-shrink-0">
            <div className="tw-text-sm tw-text-gray-700 dark:tw-text-gray-400">
              Showing <span className="tw-font-medium">{indexOfFirstItem + 1}</span> to <span className="tw-font-medium">{indexOfLastItem > totalItems ? totalItems : indexOfLastItem}</span> of <span className="tw-font-medium">{totalItems}</span> results
            </div>
            <div className="tw-flex tw-space-x-2">
              <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className={`tw-px-3 tw-py-1 tw-rounded-md ${currentPage === 1 ? 'tw-bg-gray-200 tw-text-gray-500 dark:tw-bg-gray-700 dark:tw-text-gray-500' : 'bg-main tw-text-white hover:tw-bg-main-dark dark:tw-bg-indigo-600 dark:hover:tw-bg-indigo-700'}`}>Previous</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (<button key={page} onClick={() => paginate(page)} className={`tw-px-3 tw-py-1 tw-rounded-md ${currentPage === page ? 'bg-main tw-text-white dark:tw-bg-indigo-600' : 'tw-bg-gray-200 tw-text-gray-700 hover:tw-bg-gray-300 dark:tw-bg-gray-700 dark:tw-text-gray-300 dark:hover:tw-bg-gray-600'}`}>{page}</button>))}
              <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className={`tw-px-3 tw-py-1 tw-rounded-md ${currentPage === totalPages ? 'tw-bg-gray-200 tw-text-gray-500 dark:tw-bg-gray-700 dark:tw-text-gray-500' : 'bg-main tw-text-white hover:tw-bg-main-dark dark:tw-bg-indigo-600 dark:hover:tw-bg-indigo-700'}`}>Next</button>
            </div>
          </div>
        )}
      </motion.div>
    );
  };
  
  // QRScanner Component (No Changes)
  const QRScanner = ({ onScan, onClose, scanResult, scanError, scannerRef, scanSuccessData, onConfirm, setScanSuccessData }) => {
    useEffect(() => {
      if (!scanSuccessData) {
        if (scannerRef.current && scannerRef.current.isScanning) { return; }
        const scanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: { width: 250, height: 250 }, supportedScanTypes: [] }, false);
        scanner.render((decodedText) => { scanner.pause(); onScan(decodedText); }, (error) => {});
        scannerRef.current = scanner;
      }
      return () => {
        if (scannerRef.current) {
          scannerRef.current.clear().catch(error => { console.error("Failed to clear html5-qrcode-scanner.", error); });
        }
      };
    }, [onScan, scanSuccessData]);
  
    const handleCancel = () => {
      setScanSuccessData(null);
      if(scannerRef.current) { scannerRef.current.resume(); }
    }
  
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-70 tw-flex tw-justify-center tw-items-center tw-z-50 tw-p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="tw-p-6 tw-rounded-xl tw-w-full tw-max-w-md tw-bg-white dark:tw-bg-gray-800">
          <h2 className="tw-text-xl tw-font-semibold tw-mb-4 tw-text-gray-800 dark:tw-text-white">Scan QR Code</h2>
          {!scanSuccessData ? (
            <>
              <div id="qr-reader" className="tw-mb-4 tw-rounded-lg tw-overflow-hidden tw-border-2 tw-border-gray-300 dark:tw-border-gray-600"></div>
              {scanResult && <div className="tw-p-3 tw-mb-4 tw-bg-green-100 tw-text-green-700 tw-rounded-lg tw-flex tw-items-center"><FaCheckCircle className="tw-mr-2" /> {scanResult}</div>}
              {scanError && <div className="tw-p-3 tw-mb-4 tw-bg-red-100 tw-text-red-700 tw-rounded-lg">{scanError}</div>}
              <p className="tw-text-sm tw-mb-4 tw-text-gray-600 dark:tw-text-gray-400">Position the QR code within the frame to scan.</p>
            </>
          ) : (
            <div className="tw-mb-4">
              <div className="tw-p-3 tw-mb-4 tw-bg-green-100 tw-text-green-700 tw-rounded-lg tw-flex tw-items-center"><FaCheckCircle className="tw-mr-2" /> Scanned: {scanSuccessData.userName}</div>
              <div className="tw-mb-4">
                <h3 className="tw-text-lg tw-font-medium tw-mb-2 tw-text-gray-800 dark:tw-text-white">Attendance Details</h3>
                <div className="tw-mb-3">
                  <label className="tw-flex tw-items-center tw-text-gray-700 dark:tw-text-gray-300"><input type="checkbox" checked={scanSuccessData.attendedMass} onChange={(e) => setScanSuccessData({ ...scanSuccessData, attendedMass: e.target.checked })} className="tw-mr-2 tw-h-4 tw-w-4 tw-rounded tw-border-gray-300 tw-text-indigo-600 focus:tw-ring-indigo-500" />Attended Mass</label>
                </div>
                <div className="tw-mb-3">
                  <label className="tw-flex tw-items-center tw-text-gray-700 dark:tw-text-gray-300"><input type="checkbox" checked={scanSuccessData.confessed} onChange={(e) => setScanSuccessData({ ...scanSuccessData, confessed: e.target.checked })} className="tw-mr-2 tw-h-4 tw-w-4 tw-rounded tw-border-gray-300 tw-text-indigo-600 focus:tw-ring-indigo-500" />Confessed</label>
                </div>
              </div>
              <div className="tw-flex tw-gap-2">
                <button onClick={() => onConfirm(scanSuccessData.attendedMass, scanSuccessData.confessed)} className="tw-flex-1 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-transition-colors bg-main hover:tw-bg-main-dark dark:tw-bg-indigo-600 dark:hover:tw-bg-indigo-700">Confirm Attendance</button>
                <button onClick={handleCancel} className="tw-flex-1 tw-text-gray-800 dark:tw-text-white tw-bg-gray-200 hover:tw-bg-gray-300 dark:tw-bg-gray-600 dark:hover:tw-bg-gray-700 tw-px-4 tw-py-2 tw-rounded-lg tw-transition-colors">Scan Again</button>
              </div>
            </div>
          )}
          <button onClick={onClose} className="tw-w-full tw-text-white tw-px-4 tw-py-2.5 tw-rounded-lg tw-transition-colors tw-bg-red-500 hover:tw-bg-red-600 dark:tw-bg-red-600 dark:hover:tw-bg-red-700 mt-4">Close Scanner</button>
        </motion.div>
      </motion.div>
    );
  };

export default MeetingsManager;