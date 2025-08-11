import React from 'react'
import UserProfile from '../../Admin/component/UserProfile'

const UserProfileSection = () => {
  return (
    <div className='flex flex-col justify-start items-center'>
      <h1 className='text-2xl font-bold text-center'>Profile</h1>
      <div className='py-5'>
        <UserProfile/>
      </div>
    </div>
  )
}

export default UserProfileSection