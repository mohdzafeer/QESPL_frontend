import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../store/Slice/authSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setTheme } from "../../../store/Slice/themeSlice";

const UserSettings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };



  const theme = useSelector((state:any) => state.theme.theme);
  

  const handleThemeChange = (e:any) => {
    dispatch(setTheme(e.target.value));
  };
  useEffect(()=>{
    console.log(theme)
  },[theme])
  return (
    <div className="flex flex-col items-start gap-8">
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
            <option value="light" selected>
              Light
            </option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>
      <button onClick={handleLogout} className="px-3 py-2 bg-red-500 text-white font-semibold rounded text-start hover:bg-red-700 active:bg-red-500 duration-300 cursor-pointer">
        Sign Out
      </button>
    </div>
  );
};

export default UserSettings;
