import { configureStore } from "@reduxjs/toolkit";
import AdminLogin from "./Slices/adminLogin";
import SettingSlice from "./Slices/settingsLogin";
import templateSlice from "./Slices/templateSlice";
import  DashBoardSlice  from "./Slices/dashBoardSlice";


export default configureStore({
  reducer: {
    adminLogin: AdminLogin,
    settings:SettingSlice,
    template: templateSlice,
    dashboardslice:DashBoardSlice
  },
});
