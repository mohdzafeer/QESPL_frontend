import { useState } from "react";
import DashboardCards from "./UserDashboardComponents/DashboardCards";
import DashboardGraphs from "./UserDashboardComponents/DashboardGraphs";
import DashboardPOs from "./UserDashboardComponents/DashboardPOs";
import UserCreatePOForm from "./UserDashboardComponents/UserCreatePOForm";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useLocation } from "react-router-dom";

const UserDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [ordersUpdated, setOrdersUpdated] = useState(false); // 👈 for triggering refresh

  const triggerOrderRefresh = () => {
    setOrdersUpdated((prev) => !prev); // Flip to trigger useEffect in child
  };
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation()



  return (
    <div>
      <div>
        <div className="flex justify-end w-full">
          {location.pathname==="/user/dashboard" && (
            <>
              <button
                className="text-white bg-[var(--theme-color)] px-3 py-2 rounded-lg mb-10 font-semibold cursor-pointer lg:inline-block xl:inline-block hidden"
                onClick={() => setShowForm(true)}
              >
                Create PO
              </button>
              <button
                className=" bg-white text-[var(--theme-color)] px-3 py-2 rounded-lg mb-10 font-semibold cursor-pointer lg:hidden xl:hidden inline-flex  items-center justify-between min-w-full text-xl"
                onClick={() => setShowForm(true)}
              >
                <span>Create Purcahse Order</span> <span className="bg-[var(--theme-color)] text-white px-2 text-2xl rounded ml-2 flex justify-center items-center pb-1">+</span>
              </button>
            </>
          )}
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
