
import { CiCalendarDate } from "react-icons/ci";
import { MdAccessTime } from "react-icons/md";

const TaskCard = () => {
    return (
        <div className="flex flex-col pb-26 gap-6">
            <div className={`bg-orange-50 dark:bg-zinc-900 dark:text-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500`} >
                {/* Header Section */}
                <div className="flex lg:flex-row xl:flex-row flex-col xl:justify-between lg:justify-between xl:items-center lg:items-center items-start xl:gap-0 lg:gap-0 gap-4 mb-2">
                    <div className="flex items-center space-x-3">
                        <h3 className="lg:text-lg xl:text-lg text-sm font-semibold text-gray-800 dark:text-white text-start">Review Purchase Documentation</h3>
                        <span className="text-xs font-medium px-2 py-1 rounded-lg text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800">Review Documents</span>
                        <span className="text-xs font-medium px-2 py-1 rounded-full text-red-800 bg-red-100">URGENT</span>
                        {/* <span className="text-xs font-medium px-2 py-1 rounded-full text-blue-800 bg-blue-100">DEMO</span> */}
                    </div>

                    <div className="flex lg:items-end xl:items-end items-start space-x-4 flex-col gap-2">
                        <div className="flex items-center lg:text-sm xl:text-sm text-xs font-medium text-yellow-500 bg-yellow-100 py-1 px-2 rounded-full gap-2">
                            <span className='text-yellow-500 text-lg'><MdAccessTime /></span>
                            <span>Pending</span>
                        </div>
                        <span className="flex items-center mr-4 gap-2 px-2">
                            <span className='text-gray-600 dark:text-gray-300 lg:text-lg xl:text-lg text-sm'><CiCalendarDate /></span>
                            <span className='lg:text-sm xl:text-sm text-xs text-gray-600 dark:text-gray-300 text-start'>Due: 10/02/2025</span>
                        </span>

                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-start">Verify all documentation and compliance requirements for office equipment order</p>

                {/* Order Details Card */}
                <div className="bg-white p-3 rounded-lg border border-gray-300 mb-4">
                    <div className="flex items-center text-sm text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm12 12H4V6h12v10zm-6-4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">PO-001</span>
                        <span className="mx-2">•</span>
                        <span className="text-gray-500">ABC Supplies</span>
                        <span className="mx-2">•</span>
                        <span className="font-semibold">$12,500</span>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="flex items-center text-xs text-gray-500">

                    {/* <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    0 comments
                </span> */}
                    <button className="bg-white rounded-lg px-2 py-1 text-lg font-semibold hover:bg-blue-500 active:bg-blue-600 active:text-white hover:text-white duration-300 cursor-pointer">
                        Update
                    </button>
                </div>
            </div>
            <div className={`bg-yellow-50 dark:bg-zinc-900 dark:text-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500`} >
                {/* Header Section */}
                <div className="flex lg:flex-row xl:flex-row flex-col xl:justify-between lg:justify-between xl:items-center lg:items-center items-start xl:gap-0 lg:gap-0 gap-4 mb-2">
                    <div className="flex items-center space-x-3">
                        <h3 className="lg:text-lg xl:text-lg text-sm font-semibold text-gray-800 dark:text-white text-start">Review Purchase Documentation</h3>
                        <span className="text-xs font-medium px-2 py-1 rounded-lg text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800">Review Documents</span>
                        {/* <span className="text-xs font-medium px-2 py-1 rounded-full text-red-800 bg-red-100">HIGH</span> */}
                        {/* <span className="text-xs font-medium px-2 py-1 rounded-full text-blue-800 bg-blue-100">DEMO</span> */}
                    </div>

                    <div className="flex lg:items-end xl:items-end items-start space-x-4 flex-col gap-2">
                        <div className="flex items-center lg:text-sm xl:text-sm text-xs font-medium text-yellow-500 bg-yellow-100 py-1 px-2 rounded-full gap-2">
                            <span className='text-yellow-500 text-lg'><MdAccessTime /></span>
                            <span>Pending</span>
                        </div>
                        <span className="flex items-center mr-4 gap-2 px-2">
                            <span className='text-gray-600 dark:text-gray-300 lg:text-lg xl:text-lg text-sm'><CiCalendarDate /></span>
                            <span className='lg:text-sm xl:text-sm text-xs text-gray-600 dark:text-gray-300 text-start'>Due: 10/02/2025</span>
                        </span>

                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-start">Verify all documentation and compliance requirements for office equipment order</p>

                {/* Order Details Card */}
                <div className="bg-white p-3 rounded-lg border border-gray-300 mb-4">
                    <div className="flex items-center text-sm text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm12 12H4V6h12v10zm-6-4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">PO-001</span>
                        <span className="mx-2">•</span>
                        <span className="text-gray-500">ABC Supplies</span>
                        <span className="mx-2">•</span>
                        <span className="font-semibold">$12,500</span>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="flex items-center text-xs text-gray-500">

                    {/* <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    0 comments
                </span> */}
                    <button className="bg-white rounded-lg px-2 py-1 text-lg font-semibold hover:bg-blue-500 active:bg-blue-600 active:text-white hover:text-white duration-300 cursor-pointer">
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;