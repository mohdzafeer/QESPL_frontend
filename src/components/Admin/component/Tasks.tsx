// import  { useState } from 'react'
// import Navbar from './Navbar';
// import Sidebar from './sidebar';


// const Tasks = () => {
//   return (
//     <div>Tasks</div>
//   )
// }






// const App = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   return (
//     <>
//       <div className="flex flex-col h-screen">
//         <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
//         <div className="flex flex-1 overflow-hidden">
//           <Sidebar isOpen={isSidebarOpen} />
//           <div className="flex-1 overflow-auto">
//             <Tasks/>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default App;

import React from 'react'

const Tasks = () => {
  return (
    <div className='flex flex-col items-center'>
        <h1 className='text-4xl font-bold'>Tasks</h1>
        <p>This section is under development</p>
    </div>
  )
}

export default Tasks