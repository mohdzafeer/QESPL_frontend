import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slice/authSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import adminUserReducer from "./Slice/adminSlice"
import orderReducer from '../store/Slice/orderSlice';
import orderSearchReducer from './Slice/orderSearchSlice';
import userReducer from "../store/Slice/subadminSlice";
import filterReducer from "./Slice/filterSlice"
import themeReducer  from "./Slice/themeSlice"
// import recycleBinReducer from './Slice/recycleBinSlice';
// import notificationReducer from '../store/Slice/notificationSlice';
import notificationReducer from './Slice/NotificationSlice';




const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth","notifications"],
};


const rootReducer = combineReducers({
  auth: authReducer,
  adminUser: adminUserReducer,
  orders: orderReducer,
  orderSearch: orderSearchReducer,
  user: userReducer,
  filter:filterReducer,
  theme:themeReducer,
  // recycleBin: recycleBinReducer, // Add recycleBin reducer
  notifications: notificationReducer,
});


const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});


export const persistor = persistStore(store);


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


// Add default export
export default store;

