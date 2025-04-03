import Layout from './components/Layout/Layout'
import Home from './components/Home/Home'
import About from './components/About/About'
import Kahoot from './components/Kahoot/Kahoot'
import Memories from './components/Memories/Memories'
import Events from './components/Events/Events'
import Contact from './components/Contact/Contact'
import ServantInfo from './components/ServantInfo/ServantInfo'
import SignIn from './components/SignIn/SignIn'
import SignUp from './components/SignUp/SignUp'
import NotFound from './components/NotFound/NotFound'
import Settings from './components/Settings/Settings'
import Profile from './components/Profile/Profile'
import AnimatedCircle  from './components/AnimatedCircle/AnimatedCircle'
import ShareEvent  from './components/ShareEvent/ShareEvent'
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Offline } from "react-detect-offline";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import DarkModeProvider from './Context/DarkModeContext'

import { Children } from 'react';
import { text } from 'motion/react-m'
import { color } from 'motion/react'

function App() {

  let router = createBrowserRouter([
    { path: '/', element: <Layout/>, children: [
      {index:true  , element: <Home/>},
      {path:'about'  , element: <About/>},
      {path:'kahoot-game'  , element: <Kahoot/>},
      {path:'Memories'  , element: <Memories/>},
      {path:'events'  , element: <Events/>},
      {path:'contact'  , element: <Contact/>},
      {path:'servantInfo'  , element: <ServantInfo/>},
      {path:'share-Event'  , element: <ShareEvent/>},
      {path:'settings'  , element: <Settings/>},
      {path:'profile'  , element: <Profile/>},
      {path: 'signin', element: <SignIn />},
      {path: 'signup' , element:<SignUp/>},
      { path : "*" , element :<NotFound/>}
    ]}
  ]);
  return <>
  <DarkModeProvider>
  <Offline>
  <div className="offlineDiv">You are offline!</div>
</Offline>
  <RouterProvider router={router}></RouterProvider>
  </DarkModeProvider>
  
  </>
}

export default App;