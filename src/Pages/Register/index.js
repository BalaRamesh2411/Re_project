import axios from "axios";
import React from "react";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [registerData, setRegisterData] = useState({
    userName:"",
    email: " ",
    password: " ",
    userStatus: "Requested",
  });
  // console.log('rD',registerData)

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);

    if (
      !registerData.userName ||
      !registerData.email ||
      !registerData.password
    ) {
      alert("please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("userName", registerData.userName);
    formData.append("email", registerData.email);
    formData.append("password", registerData.password);
    formData.append("status", registerData.userStatus);
    await axios
      .post("http://127.0.0.1:5000/createUser", formData)
      .then((res) => {
        console.log("respnce",res.data)
        if (res.data.status === "Requested") {
          const emaildata = {
            from_name: registerData.userName,
            from_email: registerData.email,
            message:
              "Access to this AI-Content-engine is crucial for our company. Ensuring timely access will allow me to access our web application.",
            subject: "Request for Login Approval to AI-Content-Engine",
          };
          emailjs
            .send(
              "service_spx9ylj",
              "template_i7virk7",
              emaildata,
              "pVORWS1vmcvLsdZvs"
            )
            .then(
              (result) => {
                console.log("SUCCESS!", result.text);
                alert("Email send successfully,to approve your registration");
                navigate("/register");
              },
              (error) => {
                console.log("FAILED...", error.text);
                console.log("error", error);
                alert("Email send failed❌");
              }
            );
          setRegisterData({ userName: "", email: "", password: "" });
        }
      });
  };
  return (
    <>
      <main className="main-content main-content-bg mt-0 vh-100 d-flex align-items-center">
        <div className="container">
          <div className="row justify-content-between align-items-center">
            <div className="col-lg-6 col-md-6 d-none d-md-flex align-items-center justify-content-center">
              <img
                src="Header-image-1-Content-writing.png"
                className="img-fluid w-70"
                alt="Description of the image"
              />
            </div>

            <div className="col-lg-5 col-md-6 mt-4 mt-md-0">
              <div className="card mt-8">
                <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                  <div className="bg-gradient-primary shadow-primary border-radius-lg py-3 pe-1 text-center py-4">
                    <h4 className="font-weight-bolder text-white mt-1">
                      Join us today
                    </h4>
                    <p className="mb-1 text-white text-sm">
                      Enter your email and password to register
                    </p>
                  </div>
                </div>
                <div className="card-body pb-3">
                  <form role="form">
                    <div className="input-group input-group-outline mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter user name"
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            userName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="input-group input-group-outline mb-3">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter email"
                        required
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="input-group input-group-outline mb-3">
                      <input
                        type="password"
                        className="form-control"
                        required
                        placeholder="Enter password"
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            password: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="text-center">
                      <button
                        type="button"
                        className="btn bg-gradient-primary w-100 mt-4 mb-0"
                        onClick={handleSubmit}
                      >
                        Sign up
                      </button>
                    </div>
                  </form>
                </div>
                <div className="card-footer text-center pt-0 px-sm-4 px-1">
                  <p className="mb-4 mx-auto">
                    Already have an account?
                    <Link
                      to="/"
                      className="text-primary text-gradient font-weight-bold"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Register;
