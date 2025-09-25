import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout/Layout';
import Home from './components/Home/Home';
import About from './components/About/About';
import Kahoot from './components/Kahoot/Kahoot';
import Memories from './components/Memories/Memories';
import Events from './components/Events/Events';
import Dashboard from './components/Dashboard/Dashboard';
import Users from './components/Users/Users';
import UpdateReq from './components/UpdateReq/UpdateReq';
import Contact from './components/Contact/Contact';
import ServantInfo from './components/ServantInfo/ServantInfo';
import ServantList from './components/ServantList/ServantList';
import ServantDetails from './components/ServantDetails/ServantDetails';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import NotFound from './components/NotFound/NotFound';
import Settings from './components/Settings/Settings';
import Profile from './components/Profile/Profile';
import AnimatedCircle from './components/AnimatedCircle/AnimatedCircle';
import ShareEvent from './components/ShareEvent/ShareEvent';
import ShareMemory from './components/ShareMemory/ShareMemory';
import EventDetails from './components/EventDetails/EventDetails';
import MemoryDetails from './components/MemoryDetails/MemoryDetails';
import VerifyEmail from './components/VerifyEmail/VerifyEmail';
import WalletManagement from './components/WalletManagement/WalletManagement';
import TripsList from './components/TripsList/TripsList';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Offline } from 'react-detect-offline';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import DarkModeProvider from './Context/DarkModeContext';
import './i18n';
import i18n from './i18n';
import { I18nextProvider } from 'react-i18next';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Messages from './components/messages/messages';
import FAQs from './components/FAQs/FAQs';
import EventBooking from './components/EventBooking/EventBooking';
import RedirectIfAuthenticated from './components/RedirectIfAuthenticated/RedirectIfAuthenticated';
import ResetPassword from './components/ResetPassword/ResetPassword';
import Meetings from './components/Meetings/Meetings';
import MeetingsManager from './components/MeetingManager/MeetingManager';
import BirthdayList from './components/BirthdayList/BirthdayList';

function App() {
  
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        // Public Routes for all users
        { index: true, element: <Home /> },
        { path: 'about', element: <About /> },
        { path: 'events', element: <Events /> },
        { path: 'event/:id', element: <EventDetails /> },
        { path: 'contact', element: <Contact /> },
        { path: 'not-found', element: <NotFound /> },
        { path: 'faqs', element: <FAQs /> },
        { path: 'verifyEmail', element: <VerifyEmail /> },
        {
          path: 'resetPassword/:token',
          element: <ResetPassword />,
        },
        {
          path: 'signin',
          element: (
            <RedirectIfAuthenticated>
              <SignIn />
            </RedirectIfAuthenticated>
          ),
        },
        {
          path: 'signup',
          element: (
            <RedirectIfAuthenticated>
              <SignUp />
            </RedirectIfAuthenticated>
          ),
        },

        // Protected Routes accessible to all authenticated users
        {
          path: 'kahoot-game',
          element: (
            <ProtectedRoute>
              <Kahoot />
            </ProtectedRoute>
          ),
        },
        {
          path: 'Memories',
          element: (
            <ProtectedRoute>
              <Memories />
            </ProtectedRoute>
          ),
        },
        {
          path: 'settings',
          element: (
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          ),
        },
        {
          path: 'profile',
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: 'memory/:id',
          element: (
            <ProtectedRoute>
              <MemoryDetails />
            </ProtectedRoute>
          ),
        },
        {
          path: 'book/:id',
          element: (
            <ProtectedRoute>
              <EventBooking />
            </ProtectedRoute>
          ),
        },

        // Admin-only routes (Admin or SuperAdmin)
        {
          path: 'dashboard',
          element: (
            <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
              <Dashboard />
            </ProtectedRoute>
          ),
          children: [
            { index: true, element: <Users /> },
            { path: 'update-request', element: <UpdateReq /> },
         {
  path: 'messages',
  element: (
    <ProtectedRoute allowedRoles={['SuperAdmin']}>
      <Messages />
    </ProtectedRoute>
  ),
},
            { path: 'wallet-managment', element: <WalletManagement /> },
            { path: 'trip-list', element: <TripsList /> },
            { path: 'meetings', element: <Meetings /> },
            { path: 'meetings-manager', element: <MeetingsManager /> },
            { path: 'birthday-list', element: <BirthdayList /> },
          ],
        },
        {
          path: 'servantInfo',
          element: (
            <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
              <ServantInfo />
            </ProtectedRoute>
          ),
        },
        {
          path: 'ServantList',
          element: (
            <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
              <ServantList />
            </ProtectedRoute>
          ),
        },
        {
          path: 'ServantList/ServantDetails/:id',
          element: (
            <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
              <ServantDetails />
            </ProtectedRoute>
          ),
        },
        {
          path: 'share-Event',
          element: (
            <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
              <ShareEvent />
            </ProtectedRoute>
          ),
        },
        {
          path: 'share-Memory',
          element: (
            <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
              <ShareMemory />
            </ProtectedRoute>
          ),
        },

        // 404 Page
        { path: '*', element: <NotFound /> },
      ],
    },
  ]);

  return (
    <>
      <DarkModeProvider>
        <Offline>
          <div className="fixed-bottom offlineDiv">Your internet connection is unstable !</div>
        </Offline>

        <I18nextProvider i18n={i18n}>
          <RouterProvider router={router} />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              },
              success: {
                style: {
                  background: '#28a745',
                },
              },
              error: {
                style: {
                  background: '#dc3545',
                },
              },
            }}
          />
        </I18nextProvider>
      </DarkModeProvider>
    </>
  );
}

export default App;