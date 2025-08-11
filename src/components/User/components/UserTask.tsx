import React from 'react'
import UserTaskCards from './UserTaskComponents/UserTaskCards'
import TaskCard from './UserTaskComponents/TaskCard'

const UserTask = () => {
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col items-start gap-2 px-5'>
        <h1 className='text-xl font-semibold'>Task Dashboard</h1>
        <span className='text-sm'>View and manage assign tasks abd purchase orders</span>
      </div>
      <UserTaskCards />
      <TaskCard/>
    </div>
  )
}

export default UserTask