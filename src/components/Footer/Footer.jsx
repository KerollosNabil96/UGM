import React, { useContext } from 'react'
import styles from './Footer.module.css';
import { Link } from 'react-router-dom';
import { darkModeContext } from '../../Context/DarkModeContext';
export default function Footer() {
  const { darkMode } = useContext(darkModeContext);
  return <>
    <div className={`${darkMode? 'tw-dark' : ''}` }>
    <div className="container-fluid myFooter    px-4 py-3 bg-main dark:tw-bg-gray-900 w-100">
      <div className="row">
        <div className="col-lg-3 col-md-6 my-lg-0 my-sm-3" >
          <h2 className='text-white pb-4'>About UGM</h2>
          <p className='text-white'>UGM (Undergraduate and Graduate Meeting)<br/> is a youth ministry at St. Mary & St. George Church,<br/> Gabriel, Alexandria. We gather for spiritual growth,<br/> fellowship, and enriching activities. Join us to connect, grow,<br/> and share in faith! ✨🙏</p>
        </div>
        <div className="col-lg-3 col-md-6 my-lg-0 my-sm-3" >
        <h4 className='text-white pb-4'>Quick Links</h4>
        <div className='pb-1'><Link className='text-white tw-no-underline ' to={'/'}>Home</Link></div>
        <div className='pb-1'><Link className='text-white tw-no-underline ' to={'about'}>About</Link></div>
        <div className='pb-1'><Link className='text-white tw-no-underline ' to={'events'}>Events</Link></div>
        <div className='pb-1'><Link className='text-white tw-no-underline ' to={'kahoot-game'}>Kahoot</Link></div>
        <div className='pb-1'><Link className='text-white tw-no-underline ' to={'memories'}>Memories</Link></div>
        <Link className='text-white tw-no-underline  pb-1' to={'contact'}>Contact</Link>
        </div>
        <div className="col-lg-3 col-md-6 my-lg-0 my-sm-3" >
          <h4 className='text-white pb-4' >Our Services</h4>
          <p className='text-white pb-1'>Spiritual Meetings</p>
          <p className='text-white pb-1'>Trips & Activities</p>
          <p className='text-white pb-1'>Community Service</p>
        </div>
        <div className="col-lg-3 col-md-6 my-lg-0 my-sm-3" >
        <h4 className='text-white pb-4'>Contact Us</h4>
          <p className='text-white pb-1 text-white' ><i class="fa-solid fa-envelope text-white"></i> ugm@gmail.com</p>
          <p className='text-white pb-1 text-white'><i class="fa-solid fa-phone text-white"></i> (+2)01229271686</p>
          <p className='text-white pb-1'><i class="fa-solid fa-location-dot text-white "></i> Gabriel , Alexandria</p>
        </div>
      </div>
    </div>
  </div>
    </>
}
