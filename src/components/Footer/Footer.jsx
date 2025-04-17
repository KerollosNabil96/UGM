import React, { useContext } from 'react'
import styles from './Footer.module.css';
import { Link } from 'react-router-dom';
import { darkModeContext } from '../../Context/DarkModeContext';
import { useTranslation } from 'react-i18next';
export default function Footer() {
  const { darkMode } = useContext(darkModeContext);
  const { t } = useTranslation('footer');
  
  return (
    <div className={`${darkMode ? 'tw-dark' : ''}`}>
      <div className="container-fluid myFooter px-4 py-3 bg-main dark:tw-bg-gray-900 w-100">
        <div className="row">
          <div className="col-lg-3 col-md-6 my-lg-0 my-sm-3">
            <h2 className='text-white pb-4'>{t('footer.about.title')}</h2>
            <p className='text-white'>
                {t('footer.about.description.part1')}<br/>
                {t('footer.about.description.part2')}<br/>
                {t('footer.about.description.part3')}<br/>
                {t('footer.about.description.part4')}<br/>
                {t('footer.about.description.part5')}
              </p>
          </div>
          
          <div className="col-lg-3 col-md-6 my-lg-0 my-sm-3">
            <h4 className='text-white pb-4'>{t('footer.quickLinks.title')}</h4>
            {Object.entries(t('footer.quickLinks.links', { returnObjects: true })).map(([key, value]) => (
              <div className='pb-1' key={key}>
                <Link className='text-white tw-no-underline' to={key === 'home' ? '/' : key}>
                  {value}
                </Link>
              </div>
            ))}
          </div>
          
          {/* Services Section */}
          <div className="col-lg-3 col-md-6 my-lg-0 my-sm-3">
            <h4 className='text-white pb-4'>{t('footer.services.title')}</h4>
            {t('footer.services.items', { returnObjects: true }).map((service, index) => (
              <p className='text-white pb-1' key={index}>{service}</p>
            ))}
          </div>
          
          {/* Contact Section */}
          <div className="col-lg-3 col-md-6 my-lg-0 my-sm-3">
            <h4 className='text-white pb-4'>{t('footer.contact.title')}</h4>
            <p className='text-white pb-1'>
              <i className="fa-solid fa-envelope text-white"></i> {t('footer.contact.items.email')}
            </p>
            <p className='text-white pb-1'>
              <i className="fa-solid fa-phone text-white"></i> {t('footer.contact.items.phone')}
            </p>
            <p className='text-white pb-1'>
              <i className="fa-solid fa-location-dot text-white"></i> {t('footer.contact.items.address')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}