import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enAbout from './assets/locales/en/about.json';
import arAbout from './assets/locales/ar/about.json';
import enServantList from './assets/locales/en/servantList.json';
import arServantList from './assets/locales/ar/servantList.json';
import enFooter from './assets/locales/en/footer.json';
import arFooter from './assets/locales/ar/footer.json';
import enHome from './assets/locales/en/home.json';
import arHome from './assets/locales/ar/home.json';
import enEvents from './assets/locales/en/events.json';
import arEvents from './assets/locales/ar/events.json';
import enNavbar from './assets/locales/en/navbar.json';
import arNavbar from './assets/locales/ar/navbar.json';
import enKahoot from './assets/locales/en/kahoot.json';
import arKahoot from './assets/locales/ar/kahoot.json';
import enContact from './assets/locales/en/contact.json';
import arContact from './assets/locales/ar/contact.json';
import enMemory from './assets/locales/en/memory.json';
import arMemory from './assets/locales/ar/memory.json';
import enShareEvent from './assets/locales/en/shareEvent.json';
import arShareEvent from './assets/locales/ar/shareEvent.json';
import enServantInfo from './assets/locales/en/servantInfo.json';
import arServantInfo from './assets/locales/ar/servantInfo.json';
import enSignin from './assets/locales/en/signin.json';
import arSignin from './assets/locales/ar/signin.json';
import enSignup from './assets/locales/en/signup.json';
import arSignup from './assets/locales/ar/signup.json';
import enDashboard from './assets/locales/en/dashboard.json';
import arDashboard from './assets/locales/ar/dashboard.json';
import enUpdatedReq from './assets/locales/en/updateReq.json';
import arUpdatedReq from './assets/locales/ar/updateReq.json';
import arMemoryForm from './assets/locales/ar/memoryForm.json';
import enMemoryForm from './assets/locales/en/memoryForm.json';
import enProfile from './assets/locales/en/profile.json'
import arProfile from './assets/locales/ar/profile.json'
import arSettings from './assets/locales/ar/settings.json'
import enSettings from './assets/locales/en/settings.json'
import enEventDetails from './assets/locales/en/eventDetails.json'
import arEventDetails from './assets/locales/ar/eventDetails.json'
import arMemoryDetails from './assets/locales/ar/memoryDetails.json'
import enMemoryDetails from './assets/locales/en/memoryDetails.json'
import enFaqs from './assets/locales/en/faqs.json'
import arFaqs from './assets/locales/ar/faqs.json'
import arVerify from './assets/locales/ar/verify.json'
import enVerify from './assets/locales/en/verify.json'
import enWalletManagement from './assets/locales/en/walletManagement.json'
import arWalletManagement from './assets/locales/ar/walletManagement.json'
import arEventBooking from './assets/locales/ar/eventBooking.json'
import enEventBooking from './assets/locales/en/eventBooking.json'
import entripsManagement from './assets/locales/en/tripsManagement.json'
import artripsManagement from './assets/locales/ar/tripsManagement.json'
i18n
  .use(LanguageDetector) 
  .use(initReactI18next) 
  .init({
    resources: {
      en: { 
        about: enAbout,
        servantList : enServantList,
        footer : enFooter,
        home : enHome,
        events : enEvents,
        navbar : enNavbar,
        kahoot : enKahoot,
        contact: enContact,
        memory : enMemory,
        shareEvent : enShareEvent,
        servantInfo : enServantInfo,
        signIn : enSignin,
        signUp : enSignup,
        dashboard : enDashboard,
        updatedReq : enUpdatedReq,
        memoryForm:enMemoryForm,
        profile : enProfile,
         settings : enSettings,
         eventDetails :enEventDetails,
         memoryDetails : enMemoryDetails,
         faqs : enFaqs , 
         verify : enVerify, 
         walletManagement: enWalletManagement,
         eventBooking : enEventBooking , 
         tripsManagement : entripsManagement
        


       },
      ar: { 
        about: arAbout,
        servantList : arServantList,
        footer : arFooter,
        home : arHome,
        events :arEvents,
        navbar : arNavbar,
        kahoot : arKahoot,
        contact: arContact,
        memory: arMemory,
        shareEvent : arShareEvent,
        servantInfo : arServantInfo,
        signIn : arSignin,
        signUp : arSignup,
        dashboard : arDashboard,
        updatedReq : arUpdatedReq,
        memoryForm : arMemoryForm , 
        profile : arProfile,
        settings : arSettings,
        eventDetails :arEventDetails,
        memoryDetails : arMemoryDetails , 
        faqs : arFaqs,
        verify : arVerify,
        walletManagement: arWalletManagement,
        eventBooking : arEventBooking , 
        tripsManagement : artripsManagement

       },
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: false }, 
  });

export default i18n;
