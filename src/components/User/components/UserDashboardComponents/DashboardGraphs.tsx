// import React from "react";
import { BarGraph } from "./GrpahComponents/Bargraph";
import DonutChart from "./GrpahComponents/DonutChart";
import { motion } from "motion/react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";

const DashboardGraphs = () => {
  const statusFilter = useSelector(
    (state: RootState) => state.filter.statusFilter
  );

    return (
      <>
        {statusFilter === "all" && (
          <div className="flex justify-between  lg:flex-row flex-col min-w-full max-w-full gap-2">
            <div
              
              className="xl:w-1/2 lg:w-1/2 w-full  gap-3 border-2 border-gray-300 rounded-lg p-5 max-w-screen"
            >
              <div className="flex gap-4 justify-between">
                <div>
                  <span className="font-semibold">Month Wise PO Status</span>
                </div>
                {/* <div className="flex gap-2">
                  <button className="bg-[var(--theme-color)] py-2 px-3 rounded-lg hover:bg-gray-300 duration-300 text-white hover:text-[var(--theme-color)] font-semibold text-sm  ">
                    Weekly
                  </button>
                  <button className="bg-[var(--theme-color)] py-2 px-3 rounded-lg hover:bg-gray-300 duration-300 text-white hover:text-[var(--theme-color)] font-semibold text-sm  ">
                    Monthly
                  </button>
                  <button className="bg-[var(--theme-color)] py-2 px-3 rounded-lg hover:bg-gray-300 duration-300 text-white hover:text-[var(--theme-color)] font-semibold text-sm  ">
                    Yearly
                  </button>
                </div> */}
              </div>
              <BarGraph className="w-full h-64 mt-5" type="bar" />
            </div>

            {/* Chart */}
            <div
              
              className="xl:w-1/2 lg:w-1/2 w-full  border-2 border-gray-300 rounded-lg p-5 max-w-screen"
            >
              {/* <POStatusDistribution/> */}
              <DonutChart />
            </div>
          </div>
        )}
      </>
    );
};

export default DashboardGraphs;
