import { IoEyeOutline } from "react-icons/io5";
import { IoMdTime } from "react-icons/io";

const Activity = () => {
  return (
    <div className='flex flex-col items-start gap-4'>

      {/* Heading */}
      <h1 className="font-semibold text-xl text-start">User Activity Reports</h1>
      <span className="text-gray-600  text-start">Monitor user actions and permissions across the system</span>

      {/* Search Box */}
      <div className="flex lg:flex-row xl:flex-row flex-col gap-2 xl:items-center lg:items-center items-start">
        <input type="text" placeholder="Search users..." className="bg-white rounded-lg px-2 py-1 " />
        <select className="bg-white border px-2 py-1 rounded-lg ">
          <option>All Department</option>
          <option>Sales</option>
          <option>Production</option>
          <option>Accounts</option>
          <option>Research and Development</option>
        </select>
      </div>

      {/* Report Cards */}
      <div className="w-full grid xl:grid-cols-3 lg:grid-cols-3 grid-cols-1 gap-4">
        {/* Report Card */}
        <div className="bg-white px-3 py-2 border-2 rounded-lg w-full">
          <div className="flex justify-between gap-4 mb-5 items-center">
            <div className="flex flex-row items-center gap-1">
              <img src="/images/user-pic.png" height={40} width={40} />
              <div className="flex flex-col items-start">
                <span className="font-semibold">John Smith</span>
                <span className="text-sm">EMP001</span>
              </div>
            </div>
            <div className="text-xl">
              <IoEyeOutline className="cursor-pointer " />
            </div>
          </div>
          <div className="mb-2">
            <div className="flex justify-between">
              <span className="text-gray-600 ">Role</span>
              <span className="font-semibold">Product Manager</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 ">Department</span>
              <span className="font-semibold">Sales</span>
            </div>
          </div>
          {/* <div className="flex justify-start">
            <span>+2 -1</span>
          </div> */}
          <hr className="my-2" />
          <div className="flex justify-start text-sm text-gray-600">
            <span className="flex gap-1 items-center"><IoMdTime/> Last Login : 14/01/25 15:00</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-semibold text-sm px-2 border-2 rounded-sm">4 permissions</span>
            <span className="font-semibold text-sm px-2 border-2 rounded-sm text-blue-500 bg-blue-100 border-blue-300">5 Activities</span>
          </div>
        </div>
        
      </div>
    </div>
  )
}
export default Activity;



