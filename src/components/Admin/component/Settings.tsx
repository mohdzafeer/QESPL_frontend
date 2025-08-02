import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setTheme } from "../../../store/Slice/themeSlice";
import type { RootState } from "../../../store/store";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [recycleBinTime, setRecycleBinTime] = useState("30"); //30 Days default Recycle bin time
  // const [theme, setTheme] = useState('light')  //default light theme

  const theme = useSelector((state: any) => state.theme.theme);
  const dispatch = useDispatch();

  const handleThemeChange = (e: any) => {
    dispatch(setTheme(e.target.value));
  };
  useEffect(() => {
    console.log(theme);
  }, [theme]);
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center min-w-full gap-3">
      <div className="flex justify-between w-full bg-white  items-center rounded-lg px-3 py-2 dark:bg-zinc-800 dark:text-white">
        <div className="flex flex-col text-start gap-2">
          <span className="text-xl font-semibold">
            Set time for Recycle Bin
          </span>
          <span className="text-sm">
            Records in Recycle bin will automatically delete in the set time
          </span>
        </div>
        <div>
          <select
            className="w-full max-w-xs border border-gray-300 rounded px-4 py-2 text-gray-700 bg-white  dark:bg-zinc-800 dark:text-white"
            defaultValue="30"
            onChange={(e) => setRecycleBinTime(e.target.value)}
          >
            <option value="" disabled>
              Select duration
            </option>
            <option value="30">30 Days</option>
            <option value="60">60 Days</option>
            <option value="90">90 Days</option>
          </select>
        </div>
      </div>
      <div className="flex justify-between w-full bg-white items-center rounded-lg px-3 py-2 dark:bg-zinc-800 dark:text-white">
        <div className="flex flex-col text-start gap-2">
          <span className="text-xl font-semibold">Change theme</span>
          <span className="text-sm">Change theme light or dark</span>
        </div>
        <div>
          <select
            className="w-full max-w-xs border border-gray-300 rounded px-4 py-2 text-gray-700 bg-white dark:bg-zinc-800 dark:text-white "
            defaultValue={theme}
            onChange={handleThemeChange}
          >
            {/* <option value="" selected >
              Select Theme
            </option> */}
            <option value="light" selected>
              Light
            </option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>
      <div className="flex justify-start w-full mt-10 px-3">
        <button className="text-start bg-blue-500 text-white px-2 py-1 rounded-sm font-semibold hover:bg-blue-600 duration-300 active:bg-blue-500 cursor-pointer">
          Save Changes
        </button>
      </div>
      
        <div className="w-full flex justify-start items-center gap-4 mt-10 px-3">
          <span className="font-semibold lg:text-xl xl:text-xl text-sm">For PO Creation Redirect To : </span>
          {/* <button 
          onClick={() => navigate("/subadmin/dashboard")}
          className="text-lg bg-blue-500 text-white px-3 py-2 rounded-sm hover:bg-blue-600 duration-200 cursor-pointer font-semibold">
            Subadmin Pannel
          </button> */}
          <button 
          onClick={() => navigate("/user/dashboard")}
          className="lg:text-lg xl:text-lg text-sm bg-blue-500 text-white px-3 py-2 rounded-sm hover:bg-blue-600 duration-200 cursor-pointer font-semibold">
            User Pannel
          </button>
        </div>
      
    </div>
  );
};

export default Settings;
