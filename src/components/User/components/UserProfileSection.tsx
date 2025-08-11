import React from 'react'
import UserProfile from '../../Admin/component/UserProfile'
import { useSelector } from 'react-redux';
// import type { RootState } from '../../../store/store';
import { useNavigate } from 'react-router-dom';


const UserProfileSection = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate()
  return (
    <div className='flex flex-col justify-start items-center'>
      <h1 className='text-2xl font-bold text-center'>Profile</h1>
      <div className='py-5'>
        <UserProfile />
      </div>

      {user.userType === "admin" && (
        <>
          <div className='flex items-center gap-3'>
            <span className='font-semibold'>Redirect to : </span>
            <button onClick={() => navigate('/admin/dashboard')} className='bg-blue-500 cursor-pointer px-2 py-1 rounded text-white font-semibold'>Admin Panel</button>
            <button onClick={() => navigate('/subadmin/dashboard')} className='bg-blue-500 cursor-pointer px-2 py-1 rounded text-white font-semibold'>Subadmin Panel</button>
          </div>
        </>
      )}
      {user.userType === "subadmin" && (
        <>
          <div className='flex items-center gap-3'>
            <span className='font-semibold'>Redirect to : </span>
            <button onClick={() => navigate('/subadmin/dashboard')} className='bg-blue-500 cursor-pointer px-2 py-1 rounded text-white font-semibold'>Subadmin Panel</button>
          </div>
        </>
      )}
    </div>

  
  )
}

export default UserProfileSection