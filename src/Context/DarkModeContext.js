import { createContext, useState } from "react";

export  let darkModeContext = createContext() 
export default function DarkModeProvider(props){
      const [darkMode, setdarkMode] = useState(false)
      const toggleDarkMode =()=>{
        setdarkMode(!darkMode)
      }
      return <darkModeContext.Provider value={{toggleDarkMode , darkMode}}>
        {props.children}
      </darkModeContext.Provider>
    
}