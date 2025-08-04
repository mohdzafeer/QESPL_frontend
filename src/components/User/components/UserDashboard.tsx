import { useState } from "react";
import DashboardCards from "./UserDashboardComponents/DashboardCards";
import DashboardGraphs from "./UserDashboardComponents/DashboardGraphs";
import DashboardPOs from "./UserDashboardComponents/DashboardPOs";
import UserCreatePOForm from "./UserDashboardComponents/UserCreatePOForm";


const UserDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [ordersUpdated, setOrdersUpdated] = useState(false); // 👈 for triggering refresh


  const triggerOrderRefresh = () => {
    setOrdersUpdated((prev) => !prev); // Flip to trigger useEffect in child
  };
  return (
    <div>
      <div>
        <div className="flex justify-end w-full">
          <button
            className="text-white bg-[var(--theme-color)] px-3 py-2 rounded-lg mb-10 font-semibold cursor-pointer"
            onClick={() => setShowForm(true)}
          >
            Create PO
          </button>
        </div>
        <DashboardCards />
        <DashboardGraphs />
        <DashboardPOs refreshTrigger={ordersUpdated} />
      </div>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm w-full">
          <div className="relative w-full">
            <UserCreatePOForm
              setShowForm={setShowForm}
              onOrderCreated={triggerOrderRefresh} // ✅ must pass this
            />
          </div>
        </div>
      )}
    </div>
  );
};


export default UserDashboard;




