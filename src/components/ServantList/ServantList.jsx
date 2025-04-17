import React, { useContext, useEffect, useState } from 'react'
import styles from './ServantList.module.css';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from "motion/react"
import { darkModeContext } from '../../Context/DarkModeContext';
import { useTranslation } from 'react-i18next';


export default function ServantList() {
  const { t } = useTranslation('servantList'); 
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCohort, setSelectedCohort] = useState('')
    let { darkMode } = useContext(darkModeContext);

  let getData = async () => {
    let { data } = await axios.get('http://localhost:3001/servants')
    setData(data)
    setFilteredData(data)
  }
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    let result = data;
  
    if (!searchTerm && !selectedCohort) {
      setFilteredData(data);
      return;
    }
  
    if (selectedCohort) {
      result = result.filter(servant => servant.cohort === selectedCohort);
    }
  
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(servant =>
        servant.firstName.toLowerCase().includes(term) ||
        servant.secName.toLowerCase().includes(term) ||
        servant.familyName.toLowerCase().includes(term)
      );
    }
  
    setFilteredData(result);
  }, [searchTerm, selectedCohort, data]);
  
  
  let handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/servants/${id}`)
      toast.success(t('deleteSuccess'), {
        duration: 4000,
        position: 'top-center',
      });
      await getData()
    } catch (error) {
      toast.error(t('deleteError'), {
        duration: 4000,
        position: 'top-center',
      });
    }
  }



   let navigate  = useNavigate()
  
  let handleEdit =  (id , person) => {
   navigate(`ServantDetails/${id}` , {state:{person}})
  }

  

  return (
    <>
        <div className={`${darkMode ? 'tw-dark' : ''}`}>
          <div className="container-fluid dark:tw-bg-gray-800 py-4">
    
      <div className="container" style={{ minHeight: '80vh' }}>
        <div className="row">
          <Toaster
            toastOptions={{
              className: '',
              style: {
                border: '1px solid #713200',
                padding: '16px',
                color: '#713200',
              },
            }}
          />
           <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}     
                transition={{ duration: 1 }}  
              >

          <h1 className='text-center  mainColor dark:tw-text-indigo-600 mt-5 fw-bolder'>{t('title')}</h1>
          <p className="text-center mb-4 fs-4 tw-text-gray-600 dark:tw-text-white text-sm">
            {t('description.part1')}<br />
            {t('description.part2')}
          </p>          
          <div className="col">
            <div className={`${styles.searching} , mb-5 px-2 d-Myflex align-items-center  rounded-4 py-4 dark:tw-bg-gray-900`}>
              <input 
                type="text" 
                placeholder={t('searchPlaceholder')}
                className='w-input border border-0 pyt-3 me-2 rounded-2'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              <select 
                id="options" 
                className='pyt-3 w-Drop me-3 my-2 border border-0 rounded-2' 
                name="options"
                value={selectedCohort}
                onChange={(e) => setSelectedCohort(e.target.value)}
              >
                <option value="">{t('allCohorts')}</option>
                <option value="1st_University">{t('cohortOptions.1st_University')}</option>
                <option value="2nd_University">{t('cohortOptions.2nd_University')}</option>
                <option value="3rd_University">{t('cohortOptions.3rd_University')}</option>
                <option value="4th_University">{t('cohortOptions.4th_University')}</option>
                <option value="1_Graduate">{t('cohortOptions.1_Graduate')}</option>
                <option value="2_Graduate">{t('cohortOptions.2_Graduate')}</option>
                <option value="3_Graduate">{t('cohortOptions.3_Graduate')}</option>
                <option value="4_Graduate">{t('cohortOptions.4_Graduate')}</option>
                <option value="5_Graduate">{t('cohortOptions.5_Graduate')}</option>
              </select>
              
              <button 
                className={` ${styles.myButton} , bg-main dark:tw-bg-indigo-600 btn text-white w-myBtn py-3`}
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCohort('')
                }}
              >
                {t('resetFilters')}
              </button>
            </div>
            
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">{t('tableHeaders.name')}</th>
                  <th scope="col">{t('tableHeaders.cohort')}</th>
                  <th scope="col">{t('tableHeaders.details')}</th>
                  <th scope="col">{t('tableHeaders.delete')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((person, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{person.firstName} {person.secName} {person.familyName}</td>
                    <td>{person.cohort}</td>
                    <td onClick={() => handleEdit(person.id , person)}><i className="fa-solid fa-pen-to-square text-success ms-3 crsr"></i></td>
                    <td onClick={() => handleDelete(person.id)}><i className="fa-solid fa-trash text-danger ms-3 crsr"></i></td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredData.length === 0 && (
              <div className="text-center py-5">
                <p className="text-muted">{t('noResults')}</p>
              </div>
            )}
          </div>
          </motion.div>
        </div>
      </div>
      </div>
      </div>
    </>
  )
}