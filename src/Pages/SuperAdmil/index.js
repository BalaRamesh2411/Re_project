import axios from "axios";
import React, { useEffect, useState } from "react";

const SuperAdmin = () => {
  const [registerData, setRegisterData] = useState([]);
  const [isDisabled,setIsDisabled] = useState(false)

  const fetchRegistData = async () => {
    const getData = await axios.get(
      "http://127.0.0.1:5000/getRegisterData"
    );
    setRegisterData(getData.data);
  };
  console.log("registerData", registerData);

  useEffect(() => {
    fetchRegistData();
  }, []);

  const changeStatus = async (changeId) => {
    const formData = new FormData();
    // const newchange = "Approved";
    formData.append("status", "Approved");
    const changeStat = await axios
      .put(
        `http://127.0.0.1:5000/changeStatus/${changeId}`,
        formData
      )
      .then((res) => {
        console.log("res", res.data);
      })
      .catch((error) => {
        console.log("err", error);
      });
    fetchRegistData();
  };



  return (
    <div>
      <center>
        <h2 style={{ color: "white" }}>Super Admin</h2>
      </center>

      <div className="row">
        <div className="col-lg-12 position-relative z-index-2">
          <div className="card mb-4 ">
            <div className="d-flex">
              <div className="icon icon-shape icon-lg bg-gradient-success shadow text-center border-radius-xl mt-n3 ms-4">
                <i className="material-icons opacity-10" aria-hidden="true">
                  language
                </i>
              </div>
              <h6 className="mt-3 mb-2 ms-3 ">Register List</h6>
            </div>
            <div className="card-body p-3">
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="table-responsive">
                    <table className="table align-items-center mb-0">
                      <thead>
                        <tr>
                          <th className="text-uppercase text-xxs font-weight-bolder opacity-7 ps-2 fs-6 ">
                            Id
                          </th>
                          <th className="text-uppercase text-xxs font-weight-bolder opacity-7 ps-2 fs-6">
                            Name
                          </th>
                          <th className="text-uppercase text-xxs font-weight-bolder opacity-7 ps-2 fs-6">
                            Email
                          </th>
                          {/* <th className="text-uppercase text-xxs font-weight-bolder opacity-7 ps-2 fs-6">
                            Password
                          </th> */}
                          <th className="text-uppercase text-xxs font-weight-bolder opacity-7 ps-2 fs-6">
                            Approval
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {registerData.map((user, i) => (
                          <tr key={user.RegisterId}>
                            <td className="text-sm">
                              <p className="mb-0 font-weight-normal text-sm">
                                {user.RegisterId}
                              </p>
                            </td>
                            <td className="text-sm">
                              <p className="mb-0 font-weight-normal text-sm">
                                {user.Name}
                              </p>
                            </td>
                            <td className="text-sm">
                              <p className="mb-0 font-weight-normal text-sm">
                                {user.email}
                              </p>
                            </td>
                            {/* <td className="text-sm">
                              <p className="mb-0 font-weight-normal text-sm">
                                {user.password}
                              </p>
                            </td> */}
                            <td className="text-sm">
                              <button
                                className={
                                  user.status == "Requested"
                                    ? "btn btn-danger"
                                    : "btn btn-success btn btn-secondary btn-sm fs-6"
                                }
                                variant="info"
                                onClick={() => changeStatus(user.RegisterId)}
                                disabled={user.status === "Approved"}
                              >
                                {user.status}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdmin;
