import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSuperAdminLogged } from "../../Routes/Slices/adminLogin";

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("owner@gmail.com");
  const [password, setPassword] = useState("owner123");

  const [regLogin, setRegLogin] = useState({});
  // console.log("regLogin", regLogin);

  const checkAdmin = async () => {
    if (email === regLogin.ownerEmail && password === regLogin.ownerPassword) {
      dispatch(setSuperAdminLogged(true));
      navigate("/admin");
    } else if (email === " " || password === " ") {
      alert("Please fill all the data");
    } else {
      alert("unAuthorized Login");
    }
  };

  return (
    <center>
      <div class="d-flex justify-content-center align-items-center vh-100">
        <div className="container my-auto ">
          <div className="row">
            <div className="col-lg-4 col-md-8 col-12 mx-auto">
              <div className="card z-index-0 fadeIn3 fadeInBottom">
                <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                  <div className="bg-gradient-primary shadow-primary border-radius-lg py-3 pe-1">
                    <h4 className="text-white font-weight-bolder text-center mt-2 mb-0">
                      Owner Sign in
                    </h4>
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
                      <input
                        type="email"
                        placeholder="Email"
                        className="form-control"
                        onKeyUp={(e) =>
                          setRegLogin({
                            ...regLogin,
                            ownerEmail: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="input-group input-group-outline mb-3">
                      <input
                        type="password"
                        placeholder="Password"
                        className="form-control"
                        onKeyUp={(e) =>
                          setRegLogin({
                            ...regLogin,
                            ownerPassword: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="text-center">
                      <button
                        type="button"
                        className="btn bg-gradient-primary w-100 my-4 mb-2"
                        onClick={() => checkAdmin()}
                      >
                        Sign in
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </center>
  );
};

export default AdminLogin;
