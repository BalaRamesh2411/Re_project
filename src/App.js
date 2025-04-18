import { BrowserRouter, Routes, Route } from "react-router-dom";
import { setAdminLoginData, setAdminLogged } from "./Routes/Slices/adminLogin";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Generate";
import Categories from './Pages/Settings/index'
import Template from "./Pages/Template/index";
import FinalPage from "./Pages/FormPage";
import Register from "./Pages/Register";
import SuperAdmin from "./Pages/SuperAdmil";
import AdminLogin from "./Pages/AdminLogin";



function App() {
  const dispatch = useDispatch();
  // const navigate = useNavigate()
  const {adminLogged,superAdminLogged } = useSelector(
    (state) => state.adminLogin
  );

  useEffect(() => {
    if (!adminLogged) {
      if (localStorage.getItem("__token")) {
        // checkLoginAuth();
        dispatch(setAdminLogged(true))

      }
    }
  }, []);

  // const checkLoginAuth = async () => {
  //   await onAuthStateChanged(auth, (user) => {
  //     // console.log('User',user)
  //     localStorage.setItem("token", user.accessToken);
  //     dispatch(setAdminLoginData(user));
  //     dispatch(setAdminLogged(true));
  //   });
  // };

  return (
<BrowserRouter>
      <Routes>

        <Route path="/" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/adminLogin" element={<AdminLogin/>} />
       
       
        {
          superAdminLogged &&  <Route path="/admin" element ={<SuperAdmin/>}/>
        }
        
        {adminLogged && (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user/setting" element ={<Categories/>}/>
            <Route path="/template" element={<Template />} />
            <Route path="/finalPage/:id/:currentLoginUserId" element={<FinalPage />} />
        
          </>
        )}

      </Routes>
    </BrowserRouter>
  );
}

export default App;
