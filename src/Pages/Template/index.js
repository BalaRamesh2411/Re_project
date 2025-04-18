import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ListExample from "../Navbar/nav";
import {
  setFbCategory,
  setFbType,
  setSelectedCategory,
  setFbGeneratedDatas,
  setSelectTemplate,
  setDatas,
} from "../../Routes/Slices/templateSlice";

import "./index.css";



const Template = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    fbCategory = [],
    fbType = [],
    selectedCategory = [],
    fbGeneratedDatas = [],
    selectTemplate = {},
  } = useSelector((state) => state.template);

  const [selectType, setSelectType] = useState([]);
  const [regen, setRegen] = useState(false);

  const localToken = localStorage.getItem("__token");
  const registerID = localStorage.getItem("__registerID");
  const headers = { Authorization: `Bearer ${localToken}` };

  // Fetch Categories
  const fetchCategory = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/getCategory/${registerID}`,
        { headers }
      );
      dispatch(setFbCategory(res.data));
      console.log("res", res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Fetch Types
  const fetchTypes = async (categoryId,categoryName) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/settingGetType/${categoryId}`,
        { headers }
      );
      dispatch(setFbType(res.data));
      console.log("gettype", res.data);
      const filteredTypes = res.data.map((type) => ({
        ...type,
        categoryName: categoryName,
      }));
      dispatch(setSelectedCategory(filteredTypes));
      setSelectType([]);
    } catch (err) {
      console.error("Error fetching types:", err);
    }
  };


  const fetchTemplate = async (typeID) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/getTemplate/${typeID}`,
        { headers }
      );
      dispatch(setFbGeneratedDatas(res.data));
      console.log("generated data",res.data)
      return res.data; // ✅ return fetched data
     
    } catch (err) {
      console.error("Error fetching templates:", err);
      return [];
    }
  };
  

  useEffect(() => {
    fetchCategory();
    fetchTypes();
    fetchTemplate();
  }, []);

  const handleCategoryClick = (id, name) => {
    fetchTypes(id);
    const filteredTypes = fbType
      .filter((type) => parseInt(type.categoryId) === parseInt(id))
      .map((type) => ({
        ...type,
        categoryName: name,
      }));
    dispatch(setSelectedCategory(filteredTypes));
    setSelectType([]);
  };

 
  const handleTypeClick = async (id) => {
  const templates = await fetchTemplate(id); 
  const selectedTemplates = templates.filter(
    (temp) => parseInt(temp.typeId) === parseInt(id)
  );
  setSelectType(selectedTemplates);
};


const handleTemplateSelected = (template, generatedDataId, data, register_id) => {

  dispatch(setDatas(data)); // Set the data array separately
  setRegen(true);
  dispatch(setSelectTemplate({ template, generatedDataId, data, register_id }));
  // setRegen(true);
  console.log(
    "Selected Template:",
    template,
    "GeneratedDataId:",
    generatedDataId,
    "Extra_Data_Key_Value:",
    data,
    "Register ID:",
    register_id
  );
};


  const handleRegenerateToDashboard = () => navigate("/dashboard");

  const handleSubmit = () => {
    navigate(`/finalPage/${selectTemplate.generatedDataId}/${selectTemplate.register_id}`);
  };

  return (
    <>
    <center>
    <div>
      <header>
        <ListExample />
      </header>
      

      <h5
        style={{ color: "black", fontFamily: "Arial, sans-serif" }}
        className="fs-3 mt-4"
      >
        Select Email Recipient
      </h5>
      <div className="row mt-5">
        {fbCategory.map((cat, i) => (
          <div className="col-xl-2 col-lg-3 col-md-4 mb-4">
            <div className="card">
              <div className="card-body text-center">
                <p className="card-text cat">
                  <i className="fas fa-user me-1"></i>
                  {cat.categoryName}
                </p>
                <button
                  className="btn-class-name"
                  onClick={() =>
                    handleCategoryClick(cat.categoryId, cat.categoryName)
                  }
                  key={i}
                  style={{ width: "50%", cursor: "pointer" }}
                >
                  <span className="back"></span>
                  <span className="front">click</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedCategory && (
        <div
          className="row mt-5"
          style={{
            position: "sticky",
            top: "0",
            background:
              "linear-gradient(89.5deg, rgba(131,204,255,1) 0.4%, rgba(66,144,251,1) 100.3%)",
          }}
        >
          <h5
            style={{ color: "white", fontFamily: "Arial, sans-serif" }}
            className="fs-3"
          >
            Select Email Type
          </h5>
          {selectedCategory.map((typ, i) => (
            <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
              <div className="card">
                <div className="card-body text-center">
                  {" "}
                  <p className="card-text cat">
                    <i className="fas fa-envelope"></i> {typ.typeName}
                  </p>
                  <button
                    className="btn bg-gradient-success mb-0 mx-auto"
                    onClick={() => handleTypeClick(typ.typeId)}
                    key={i}
                    style={{ width: "8rem", cursor: "pointer" }}
                  >
                    Choose
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectType.length > 0 && (
        <div className="row mt-5 justify-content-center">
          <h5
            style={{ color: "black", fontFamily: "Arial, sans-serif" }}
            className="fs-3"
          >
            Select Template
          </h5>
          <div className="col-md-6">
            <div
              id="templateCarousel"
              className="carousel slide"
              data-bs-ride="carousel"
            >
              {selectType.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  data-bs-target="#templateCarousel"
                  data-bs-slide-to={index}
                  className={index === 0 ? "active" : ""}
                  aria-current={index === 0 ? "true" : "false"}
                  aria-label={`Slide ${index + 1}`}
                ></button>
              ))}

              <div className="carousel-inner">
                {selectType.map((temp, index) => (
                  <div
                    className={`carousel-item ${
                      index === 0 ? "active" : ""
                    }`}
                    key={index}
                  >
                    <div className="card">
                      <div
                        className="card-body text-start"
                        style={{
                          padding: "20px",
                          borderRadius: "10px",
                          background:
                            "linear-gradient(89.5deg, rgba(131,204,255,1) 0.4%, rgba(66,144,251,1) 100.3%)",
                        }}
                      >
                        <p className="card-text">{temp.template}</p>
                        <br />
                        <center>
                          <button
                            className="btn bg-gradient-primary mb-0 mx-auto text-center"
                            onClick={() =>
                              handleTemplateSelected(
                                temp.template,
                                temp.generatedDataId,
                                temp.datas,
                                registerID
                              )
                            }
                            
                            
                            style={{ width: "10rem", cursor: "pointer" }}
                          >
                            Choose
                          </button>
                        </center>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#templateCarousel"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#templateCarousel"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal
        show={regen}
        onHide={() => setRegen(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          <Modal.Title>Email Preview! You can edit your email!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            value={selectTemplate.template}
            style={{
              width: "100%",
              height: "60vh",
              border: "none",
              padding: "10px",
              fontFamily: "Arial, sans-serif",
              fontSize: "16px",
              backgroundColor: "#f9f9f9",
              resize: "none",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              boxSizing: "border-box",
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" variant="primary" onClick={handleSubmit}>
            Choose Template
          </Button>

          <Button variant="info" onClick={handleRegenerateToDashboard}>
            Re-Generate
          </Button>
          <Button variant="danger" onClick={() => setRegen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>

    <br />
    <br />
    <br />
  </center>
</>
);
};


export default Template;
