import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  setAdminLoginData,
  setAdminLogged,
  setIsAdmin,
} from "../../Routes/Slices/adminLogin";
import { useDispatch } from "react-redux";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [regLogin, setRegLogin] = useState({
    email: "anish@gmail.com",
    password: "123456",
  });

  const checkAdmin = async ()=> {
    const data = new FormData();
 
    data.append("emaildata",regLogin.email)
    data.append("passworddata",regLogin.password)
    await axios.post('http://127.0.0.1:5000/log',data).then((res)=>{
      console.log("res",res)
      if(res.data.status === 'Approved'){
        dispatch(setAdminLoginData(res.data));
        console.log('res',res.data.status)
        dispatch(setAdminLogged(true));
        dispatch(setIsAdmin(true)); 
        alert("Admin login successfull!");
        localStorage.setItem('__token',res.data.token)
        localStorage.setItem('__registerID',res.data.registerID)
        navigate("/dashboard");
      }
      else{
        alert('Enter valid email or password')
      }

    }).catch((err)=>{
      console.log('error',err)
      alert(err)
      
    })

  }

  return (
    <>
      <div className="row">
          <div className="col-lg-4 col-md-8 col-12 mx-auto">
            <div className="card z-index-0 fadeIn3 fadeInBottom">
              <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                <div className="bg-gradient-primary shadow-primary border-radius-lg py-3 pe-1">
                  <h4 className="text-white font-weight-bolder text-center mt-2 mb-0">Sign in</h4>
                  <div className="row mt-3">
                    <div className="col-2 text-center ms-auto">
                      <a className="btn btn-link px-3" href="javascript:;">
                        <i className="fa fa-facebook text-white text-lg"></i>
                      </a>
                    </div>
                    <div className="col-2 text-center px-1">
                      <a className="btn btn-link px-3" href="javascript:;">
                        <i className="fa fa-github text-white text-lg"></i>
                      </a>
                    </div>
                    <div className="col-2 text-center me-auto">
                      <a className="btn btn-link px-3" href="javascript:;">
                        <i className="fa fa-google text-white text-lg"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <form role="form" className="text-start">
                  <div className="input-group input-group-outline my-3">
                    <label className="form-label">Email</label>
                    <input className="form-control" type="email"
                        onKeyUp={(e) =>setRegLogin({ ...regLogin, email: e.target.value })}/>
                  </div>
                  <div className="input-group input-group-outline mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" 
                      onKeyUp={(e) =>setRegLogin({ ...regLogin, password: e.target.value })}/>
                  </div>
                  {/* <div className="form-check form-switch d-flex align-items-center mb-3">
                    <input className="form-check-input" type="checkbox" id="rememberMe" checked />
                    <label className="form-check-label mb-0 ms-3" for="rememberMe">Remember me</label>
                  </div> */}
                  <div className="text-center">
                    <button type="button" className="btn bg-gradient-primary w-100 my-4 mb-2"
                      onClick={()=>checkAdmin()} >Sign in</button>
                  </div>
                  <p className="mt-4 text-sm text-center">
                    Don't have an account?
                    <Link to={'/register'} className="text-primary text-gradient font-weight-bold">Sign up</Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
    </>
  );
};

export default Login;
