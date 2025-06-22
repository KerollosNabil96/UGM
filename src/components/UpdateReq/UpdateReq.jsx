import React, { useState } from 'react'
import styles from './UpdateReq.module.css';
import { useTranslation } from 'react-i18next';
export default function UpdateReq() {
  const [isActive, setisActive] = useState(false)
  const [isApproved, setisApproved] = useState(false)
  const [isIgnored, setisIgnored] = useState(false)
  const [seeDetails, setSeeDetails] = useState(false)
  const { t, i18n } = useTranslation("updatedReq");
  return <>
      {isActive ? <div onClick={() => setisActive(false)}  className="layer position-relative  position-fixed top-0 start-0 d-flex justify-content-center align-items-center" style={{ height: '100vh', width: '100vw', zIndex: 9999 , backgroundColor:'rgba(0, 0, 0, 0.5)'}}>
      {isApproved ? <div  onClick={(e) => e.stopPropagation()}   className={`popUp bg-white position-absolute p-4 rounded-4 ${styles.popupWidth}`}
    >
      <h3 className='pt-4'><i class="fa-solid fa-circle-check text-success"></i> {t('updateRequest.popups.approve.title')}</h3>
      <p className='text-muted'>{t('updateRequest.popups.approve.message')}
      </p>
      <div className="btns mb-4   d-flex justify-content-end">
      <button onClick={()=>setisActive(false)} className='btn btn-outline-dark'>{t('updateRequest.buttons.cancel')}</button>
      <button className=' border-0 rounded-2 p-3 bg-main text-white mx-2 '>{t('updateRequest.buttons.confirm')}</button>
      </div>
    </div> :''}



    {isIgnored ? <div  onClick={(e) => e.stopPropagation()}   className={`popUp bg-white position-absolute p-4 rounded-4 ${styles.popupWidth}`}
    >
      <h3 className='pt-4'><i class="fa-solid fa-rectangle-xmark text-danger"></i> {t('updateRequest.popups.reject.title')}</h3>
      <p className='text-muted'>{t('updateRequest.popups.reject.message')}
      </p>
      <div className="btns mb-4   d-flex justify-content-end">
      <button onClick={()=>setisActive(false)} className='btn btn-outline-dark'> {t('updateRequest.buttons.cancel')}</button>
      <button className=' border-0 rounded-2 p-3 bg-main text-white mx-2 '>{t('updateRequest.buttons.confirmRejection')}</button>
      </div>
    </div> :''}

    {seeDetails ? <div  onClick={(e) => e.stopPropagation()}   className={`popUp bg-white position-absolute p-4 rounded-4 ${styles.popupWidth}`}
    >
      <h3 className='pt-4'><i class="fa-solid fa-note-sticky mainColor"></i> {t('updateRequest.popups.details.title')}</h3>
      <p className='text-muted'>Kerollos want to change his number from <span className='fw-bold'>01229271686</span> to <span className='fw-bold'>01201047167</span></p>
      <div className="btns mb-4   d-flex justify-content-end">
      <button onClick={()=>setisActive(false)} className='btn btn-outline-dark'> {t('updateRequest.buttons.cancel')}</button>
      <button className=' border-0 rounded-2 p-3 bg-main text-white mx-2 '>{t('updateRequest.buttons.confirm')}</button>
      </div>
      
    </div> :''}
  </div> : ''}
    <div className="container-fluid">
      
      <div className="row d-flex justify-content-center">
        <div className={`col-12 ${styles.shad} mt-4 rounded-2 p-3 position-relative`}>
          <h3>{t('updateRequest.requestDetails')}</h3>
          <table className="table table-striped " >
              <thead>
                <tr>
                  <th scope="col">{t('updateRequest.tableHeaders.id')}</th>
                  <th scope="col">{t('updateRequest.tableHeaders.name')} :</th>
                  <th scope="col">{t('updateRequest.tableHeaders.cohort')} :</th>
                  <th scope="col">{t('updateRequest.tableHeaders.request')} :</th>
                  <th scope="col">{t('updateRequest.tableHeaders.action')} :</th>
                </tr>
              </thead>
              <tbody>
                  <tr >
                    <th scope="row">1</th>
                    <td>Kerollos Nabil</td>
                    <td><span className='badge bg-success p-3 py-1'>Graduate-3</span></td>
                    <td className='text-primary link-underline crsr ' onClick={()=>{setSeeDetails(true) ;setisActive(true);}}>{t('updateRequest.requestDetails')}</td>
                    <td onClick={()=>setisActive(true)}><i  onClick={() => {setisActive(true);setisApproved(true);setisIgnored(false);setSeeDetails(false);}} class="fa-solid fa-check text-success fs-4 me-2 crsr"></i> <i  onClick={() => {setisActive(true);setisIgnored(true);setisApproved(false);setSeeDetails(false);}} class="fa-solid crsr fa-xmark text-danger fs-4"></i> </td>
                  </tr>
              </tbody>
            </table>

            
        </div>
      </div>
    </div>

    </>
}
