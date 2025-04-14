import React, { useState } from 'react'
import styles from './Users.module.css';
export default function Users() {
  const [isActive, setisActive] = useState(false)
  return <>
  {isActive ? <div onClick={() => setisActive(false)}  className="layer position-relative  position-fixed top-0 start-0 d-flex justify-content-center align-items-center" style={{ height: '100vh', width: '100vw', zIndex: 9999 , backgroundColor:'rgba(0, 0, 0, 0.5)'}}>
    <div  onClick={(e) => e.stopPropagation()}   className={`popUp bg-white position-absolute p-4 rounded-4 ${styles.popupWidth}`}
    >
      <h3 className='pt-4'><i class="fa-solid fa-user-shield mainColor"></i> Change User Role</h3>
      <p className='text-muted'>Are you sure you want to change kerollosNabil's role from Admin to User?</p>
      <div className="btns mb-4   d-flex justify-content-end">
      <button onClick={()=>setisActive(false)} className='btn btn-outline-dark'>Cancle</button>
      <button className=' border-0 rounded-2 p-3 bg-main text-white mx-2 '>Confirm change</button>
      </div>
    </div>
  </div> : ''}
    <div className="container-fluid">
      
      <div className="row d-flex justify-content-center">
        <div className={`col-12 ${styles.shad} mt-4 rounded-2 p-3 position-relative`}>
          <h3>Users Management</h3>
          <table className="table table-striped " >
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Role:</th>
                  <th scope="col">Update</th>
                  <th scope="col">Delete</th>
                </tr>
              </thead>
              <tbody>
                  <tr >
                    <th scope="row">1</th>
                    <td>Kerollos Nabil</td>
                    <td><span className='badge bg-success py-1'>Admin</span></td>
                    <td onClick={()=>setisActive(true)}><i className="fa-solid fa-pen-to-square text-success ms-3 crsr"></i></td>
                    <td ><i className="fa-solid fa-trash text-danger ms-3 crsr"></i></td>
                  </tr>
              </tbody>
            </table>

            
        </div>
      </div>
    </div>
    </>
}
