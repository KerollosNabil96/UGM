import React, { useContext } from 'react'
import styles from './Home.module.css';
import firstImg from '../../assets/1.jpg'
import secImage  from '../../assets/2.jpg'
import thirdImage from '../../assets/3.jpg'
import Events from '../Events/Events'
import { darkModeContext } from '../../Context/DarkModeContext';


export default function Home() {
  const { darkMode } = useContext(darkModeContext);

  return <>
      <div className={`${darkMode? 'tw-dark' : ''}` }>
      <div className="container-fluid dark:tw-bg-gray-800" >
      <div className="container">
    <div className="row"> 
      <h1 className='fs-1 mainColor mt-5 fw-bolder'>Welcome to the UGM<br/> family</h1>
      <p className='paragraph  dark:tw-text-white'>Grow together in love and faith – Join our spiritual and church activities <br/> and be part of the service family!</p>
      <div className="silder  my-4 rounded-5" style={{ width: "100%", height: "300px" }}>


      <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel" data-bs-interval="2000" style={{ height: "100%" }}>
  
  <div className="carousel-indicators">
    <button type="button"   data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active indi" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"className='indi' aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" className='indi' aria-label="Slide 3"></button>
  </div>

  <div className="carousel-inner rounded-5" style={{ height: "100%" }}>
    <div className="carousel-item active rounded-5" style={{ height: "100%" }}>
      <img src={firstImg} className="d-block w-100" alt="" style={{ height: "100%", objectFit: "cover" }} />
    </div>
    <div className="carousel-item rounded-5" style={{ height: "100%" }}>
      <img src={secImage} className="d-block w-100" alt="" style={{ height: "100%", objectFit: "cover" }} />
    </div>
    <div className="carousel-item rounded-5" style={{ height: "100%" }}>
      <img src={thirdImage} className="d-block w-100 rounded-5" alt="" style={{ height: "100%", objectFit: "cover" }} />
    </div>
  </div>

  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Next</span>
  </button>
</div>
</div>
<Events/>
    </div>
  </div>
        </div>
</div>



  
    </>
}
